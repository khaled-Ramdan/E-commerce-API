import multer from "multer"
import express from "express"
import Image from "../DataBase/models/ImagesModel.js"

const router = express.Router()

// Set up multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// @route POST /api/upload
// @desc  Uploads file to DB
router.route("/upload").post(upload.single("file"), (req, res) => {
    const newImage = new Image({
        name: req.file.originalname,
        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        },
    })
    newImage
        .save()
        .then(() => res.json({ msg: "File uploaded successfully" }))
        .catch((err) => res.status(400).json({ error: err.message }))
})

router.route("/files").get((req, res) => {
    const { nodata } = req.query
    Image.find({}, { "img.data": nodata ? 0 : 1 })
        .then((images) => res.json(images))
        .catch((err) => res.status(400).json({ error: err.message }))
})

export default router