import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel.js'
const router = express.Router()

const {SECRET_KEY} = process.env

router.get("/", async(req,res) => {
    try {
        const response = await UserModel.find({})
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})

router.post("/register", async(req,res) => {
    const {username, password} = req.body
    const user = await UserModel.findOne({username})
    if(user){
        return res.json({message: "user already exists!"});
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const newUser = new UserModel({username, password:hashedPassword})
        const response = newUser.save()
        res.json(response)
    } catch (error) {
        console.log(error)
        
    }
})

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.json({
          error: 'No User found'
        });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        const token = jwt.sign({ id: user._id, username: username }, SECRET_KEY);
  
        console.log(token);
        res.json({ token});
      } else {
        // Passwords don't match, don't generate a token
        res.json({
          error: "Passwords don't match"
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  


export {router as UserRouter}

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    console.log(token)
    if (token) {
        const tokenParts = token.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
          const tokenString = tokenParts[1];
          // Verify the token here
          jwt.verify(tokenString, SECRET_KEY, (err) => {
            if (err) return res.sendStatus(403);
            // Token is valid, proceed to the next middleware
            next();
          });
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
}