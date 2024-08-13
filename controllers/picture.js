const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const Picture = require('../models/picture.js')
const router = express.Router()

//public routes
// GET ONE
router.get('/:pictureId', async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.pictureId).populate('author')
    if (!picture) {
      res.status(404)
      throw new Error('Picture not Found!')
    }
    return res.json(picture)
  } catch (error) {
    console.log(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})

//secure routes

router.use(verifyToken)
//CREATE
router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id
    const picture = await Picture.create(req.body)
    picture._doc.author = req.user
    return res.status(201).json(picture)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})
//GET INDEX
router.get('/', async (req, res) => {
  try {
    const picture = await Picture.find().populate('author')
    return res.json(picture)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})
// // GET ONE
// router.get('/:pictureId', async (req, res) => {
//   try {
//     const picture = await Picture.findById(req.params.pictureId).populate('author')
//     if (!picture) {
//       res.status(404)
//       throw new Error('Picture not Found!')
//     }
//     return res.json(picture)
//   } catch (error) {
//     console.log(error)
//     if (res.statusCode === 200) {
//       res.status(500)
//     }
//     return res.json({ error: error.message })
//   }
// })

//UPDATE
router.put('/:pictureId', async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.pictureId)
    if (!picture) {
      res.status(404)
      throw new Error('Picture not Found')
    }
    if (!picture.author.equals(req.user._id)) {
      res.status(403)
      throw new Error('Forbidden')
    }

    const pictureToUpdate = await Picture.findByIdAndUpdate(req.params.pictureId, req.body, { new: true })
    pictureToUpdate._doc.author = req.user
    return res.json(pictureToUpdate)
  }
  catch (error) {
    console.log(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})

//DELETE
router.delete('/:imageId', async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.pictureId)
    if (!picture) {
      res.status(404)
      throw new Error('Picture not Found')
    }
    if (!picture.author.equals(req.user._id)) {
      res.status(403)
      throw new Error('Forbidden')
    }
    const pictureToDelete = await Picture.findByIdAndDelete(req.params.pictureId)
    return res.json(pictureToDelete)
  } catch (error) {
    console.log(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})

//COMMENTS
router.post('/:pictureId/comments', async (req, res) => {
  const { pictureId } = req.params
  try {
    req.body.author = req.user._id
    const picture = await Picture.findById(pictureId)

    if (!picture) {
      res.status(404)
      throw new Error('Picture not Found')
    }

    picture.comments.push(req.body)
    await picture.save()
    const newComment = picture.comments[picture.comments.length - 1]

    newComment._doc.author = req.user

    return res.status(201).json(newComment)
  } catch (error) {
    console.log(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})

//SHOW COMMENT

router.get('/:pictureId', async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.pictureId)
      .populate('author')
      .populate('comments.author')

    if (!picture) {
      res.status(404)
      throw new Error('Picture not Found')
    }
    return res.json(picture)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router