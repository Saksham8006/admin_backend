const mongoose = require('mongoose')

const FormData = new mongoose.Schema(
   {
      educationRating: {
         type: String,

      },
      infrastructureRating: {
         type: Object,
      },
      facultyRating: {
         type: String,

      },
      locationRating: {
         type: String,

      },
      classYear: {

         type: String,

      },
      email: {
         type: String,
      },

      rooms: {

         type: Object,

      },
      instiName: {
         type: String,
      },
      paragraph: {
         type: String,

      },
      createdOn: {
         type: Date
      },
      average: {
         type: Number
      },
      status: {
         type: String,
      },


   },
   { collection: 'rmi-form' }
)

const model = mongoose.model('FormData', FormData)

module.exports = model