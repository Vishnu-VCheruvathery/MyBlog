import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: String,
    content: String,
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 

})

export const BlogModel = mongoose.model('Blog', blogSchema);