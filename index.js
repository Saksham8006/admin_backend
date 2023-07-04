const express = require('express')
const app = express()
const port = 3003
const cors = require('cors')
const mongoose = require('mongoose')
const User = require("./Models/User");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
app.use(cors())
app.use(express.json())

const Form = require("./models/Form")
const ContactInfo = require("./models/ContactInfo")

mongoose.connect("mongodb+srv://SakshamSharma:sakshamsharma@cluster0.arymklb.mongodb.net/Student?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log("MongoDB connection Successfull")
}).catch((err) => console.log("No connection", err.message))


// app.get("/api/reviews/read/:viewId", async (req, res) => {
// 	try {
// 	  const viewId = req.params.viewId;

// 	  // Assuming you have a "Review" model/schema defined
// 	  const review = await review.findOne({ viewId });

// 	  if (!review) {
// 		// If the review with the provided view ID does not exist
// 		return res.status(404).json({ error: 'Review not found' });
// 	  }

// 	  res.status(200).json(review);
// 	} catch (error) {
// 	  res.status(400).json({ error: 'Failed to fetch review', status: "error" });
// 	}
//   });


app.get('/', (req,res) =>{

		res.send("Api is running fine.");
})



app.get("/api/reviews/read/:id", async (req, res) => {
	console.log("Id: ", req.params.id)
	try {
		const result = await Form.findOne({ _id: req.params.id })
		console.log(result)
		res.status(200).send(result);
	}
	catch (err) {
		console.log(err.message)
		res.status(500).json({ success: false, message: err.message })
	}
})

// for read contact information

app.get("/api/queries/read/:id", async (req, res) => {
	console.log(req.params.id)
	const result = await ContactInfo.findOne({ _id: req.params.id })
	console.log(result)
	res.send(result);

})


app.put("/updateReview/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updateForm = await Form.findByIdAndUpdate(id, req.body, { new: true });
		if (!updateForm) {
			return res.status(404).json({ error: 'Review not found', status: 'error' });
		}
		res.status(200).json({ status: "ok", review: updateForm });
	} catch (error) {
		console.error('Failed to update review:', error);
		res.status(500).json({ error: 'Failed to update review', status: 'error' });
	}
});


app.put("/updateQuery/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const updateContactInfo = await ContactInfo.findByIdAndUpdate(id, req.body, {
			new: true
		});
		res.status(200).json({ status: "ok" });
		res.send(updateContactInfo)
	} catch (error) {
		res.status(400).json({ error: 'Failed to update document', status: "error" });
	}
})


//  Delete Table data
app.delete("/formData/:id", async (req, res) => {
	const result = await Form.deleteOne({ _id: req.params.id })
	res.send(result);
	// res.send(req.params.id);
})



//  for Signup
app.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ status: 'error', error: 'Duplicate email' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(200).json({ status: 'ok' });
	} catch (err) {
		res.status(500).json({ status: 'error', error: 'Internal server error' });
	}
});

// for Login

app.post('/signin', async (req, res) => {

	const { email, password } = req.body

	try {
		const user = await User.findOne({ email: email })
		// console.log(user)

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			console.log(isPasswordValid);

			if (isPasswordValid) {
				const token = jwt.sign(
					{
						name: user.name,
						email: user.email,
					},
					'secret123'
				)

				return res.status(200).json({ status: 'ok', user: token })
			} else {
				return res.status(401).json({ status: 'error', user: false, remarks: "Email or Password is not valid" })
			}
		}
		else {
			return res.status(401).json({ status: 'error', user: false, remarks: "Email or Password is not valid" })

		}

	}
	catch (error) {
		console.log(error.message)
		res.status(500).json({ error: "Server error" })

	}







})



app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
