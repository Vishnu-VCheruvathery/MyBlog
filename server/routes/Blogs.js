import express from 'express'
import { BlogModel } from '../models/BlogModel.js'
import { UserModel } from '../models/UserModel.js'
import { verifyToken } from './Users.js';
import cloudinary from '../cloudinary/cloudinary.js'

const Router = express.Router()


Router.get('/', async (req, res) => {
    try {
      const response = await BlogModel.find({}).populate('Author', 'username');
      res.json(response);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error' }); // Respond with a proper error message and status code
    }
  });

Router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const response = await BlogModel.findById(id);
        res.json(response);
    } catch (err){
        res.json(err);
    }
})

Router.post("/", verifyToken, async(req, res) => {
    const {title, content,userID,image} = req.body;
    try {
         const result = await cloudinary.uploader.upload(image, {
            folder: 'images',
         })
    const blog = new BlogModel({
            title,
            content,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            Author: userID
        });

    await blog.save();
    res.status(201).json({message: 'Post successful'});
    
} catch (error) {
        console.log(error)
    }
 

})

Router.put("/edit/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const { title, content, image } = req.body;

    try {
        const blog = await BlogModel.findById(id);
        const imgId = blog.image.public_id;

        // Flags to track changes
        let titleContentChanged = false;
        let imageChanged = false;

        // Check if the title or content has changed
        if (blog.title !== title || blog.content !== content) {
            await BlogModel.findByIdAndUpdate(id, {
                title,
                content,
            });
            titleContentChanged = true;
        }

        // Check if the image has changed
        if (image && blog.image.url !== image) {
            // Destroy the old image
            await cloudinary.uploader.destroy(imgId);

            // Upload the new image
            const result = await cloudinary.uploader.upload(image, {
                folder: 'images',
            });

            // Update the blog with the new image information
            await BlogModel.findByIdAndUpdate(id, {
                image: {
                    public_id: result.public_id,
                    url: result.secure_url,
                },
            });
            imageChanged = true;
        }

        // Fetch the updated blog after all changes
        const updatedBlog = await BlogModel.findById(id);

        // Respond based on changes
        if (titleContentChanged || imageChanged) {
            // If either title/content or image changed
            res.json(updatedBlog);
        } else {
            // No changes in title, content, or image
            res.json(blog);
        }
    } catch (err) {
        res.json(err);
    }
});

Router.delete("/delete/:id", verifyToken,  async(req,res) => {
    const id = req.params.id;
    try{
        const blog = await BlogModel.findById(id);
        const imgId  = blog.image.public_id
        await cloudinary.uploader.destroy(imgId)
        const rmBlog = await BlogModel.findByIdAndDelete(id)
        res.status(201).json({
            success: true,
            message: "Blog deleted"
        })
    } catch (err){
        res.json(err);
    }
})


Router.put("/savedBlogs/:id/:userID", verifyToken, async (req, res) => {
    const id = req.params.id;
    const user = req.params.userID;
    try {
        // Find the user by userID and push the id of the saved blog to the savedBlogs array
        const response = await UserModel.findByIdAndUpdate(user, {
            $push: { savedBlogs: id }
        });
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

Router.get("/savedBlogs/:userID", verifyToken, async (req, res) => {
    const userId = req.params.userID;

    try {
        // Find the user by their ID and populate the savedBlogs field with the actual blog data
        const user = await UserModel.findById(userId).populate({
            path: 'savedBlogs',
            populate: {
              path: 'Author',
              select: 'username',
            },
          });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Extract the savedBlogs array from the user and send it as JSON
        const savedBlogs = user.savedBlogs;
        res.json(savedBlogs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user's saved blogs." });
    }
});

Router.delete('/savedBlogs/:userID/:blogID', verifyToken, async (req, res) => {
    const { userID, blogID } = req.params;
    try {
      const user = await UserModel.findByIdAndUpdate(userID, { $pull: { savedBlogs: blogID } });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error in deleting the blog" });
    }
  });



export {Router as BlogRouter}