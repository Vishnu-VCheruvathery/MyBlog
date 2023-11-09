import express from 'express'
import multer from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';
import { BlogModel } from '../models/BlogModel.js'
import { UserModel } from '../models/UserModel.js'
import { verifyToken } from './Users.js';

const Router = express.Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, '../../client/src/images');
        cb(null, destinationPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})
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

Router.post("/", verifyToken, upload.single('image') , async(req, res) => {
   try{
    const {title, content, Author} = req.body;
    const imageFilename = req.file ? req.file.filename : null;
    const blog = new BlogModel({
        title,
        content,
        image: imageFilename,
        Author: Author
    });

    await blog.save();
    res.status(201).json({ message: 'Blog post created successfully' });
   } catch (err){
    console.error(err);
   }

})

Router.put("/edit/:id", verifyToken, upload.single('image'), async(req, res) => {
    const id = req.params.id
    const {title, content} = req.body
    const imageFilename = req.file ? req.file.filename : null;
    try{
        const response = await BlogModel.findByIdAndUpdate(id, {
            title,
            content,
            image: imageFilename
        }, { new: true });
        res.json(response);
    } catch (err){
        res.json(err)
    }
})

Router.delete("/delete/:id", verifyToken,  async(req,res) => {
    const id = req.params.id;
    try{
        const response = await BlogModel.findByIdAndDelete(id);
        res.json(response);
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