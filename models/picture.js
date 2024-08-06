const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  })

const pictureSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [commentSchema]
}, {
  timestamps: true
})

const Picture = mongoose.model('Picture', pictureSchema)

module.exports = Picture
