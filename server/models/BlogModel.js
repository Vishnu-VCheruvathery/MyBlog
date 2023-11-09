import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: String,
    content: String,
    image: String,
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 

})

export const BlogModel = mongoose.model('Blog', blogSchema);