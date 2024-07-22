import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [1, "min length is 1"],
            maxlength: [255, "max length is 255"],
            required: true,
        },
        description: {
            type: String,
            minlength: [1, "min length is 1"],
            maxlength: [2000, "max length is 2000"],
        },
    },
    { timestamps: true }
)

const Category = mongoose.model("Category", categorySchema)

export default Category
