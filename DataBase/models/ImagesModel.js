import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [1, "min length is 1"],
        maxlength: [255, "max length is 255"],
    },
    img: {
        data: Buffer,
        contentType: String,
    },
})

const Image = mongoose.model('Image', imageSchema);

export default Image
