import User from "../models/user.model.js";
import bcryptjs from 'bcrypt';
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken';

export const signUp = async (req,res,next)=>{
 const {username,email,password} = req.body;
 const hashedPassword = bcryptjs.hashSync(password,10);
 const newUser = new User({username,email,password:hashedPassword});
 try {
    await newUser.save();
    res.status(201).json("User created successfully!")
 } catch (error) {
    next(error)
 }

}

export const signIn = async (req,res,next)=>{
   const {email,password} = req.body;
   try {
     const validUser = await User.findOne({email});
     if(!validUser) return next(errorHandler(404,'User not found!'))
     const validPassword = bcryptjs.compareSync(password,validUser.password);
     if(!validPassword) return next(errorHandler(401,'Wrong credentials.'));
     const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
     const {password:pass, ...restInfo} = validUser._doc;
     res.cookie('access_token',token,{httpOnly:true}).status(200).json(restInfo);
   } catch (error) {
      next(error)
   }
  
  }


export const google = async (req,res,next)=>{
  
   try {
     const user = await User.findOne({email: req.body.email});
     if(user){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...restInfo} = user._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(restInfo);
     }
     else{
      const generatedPass = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPass = bcryptjs.hashSync(generatedPass,10)
      const newUser = new User({
         username: req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
         email: req.body.email,
         password: hashedPass,
         avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...restInfo} = user._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(restInfo);
     }
   } catch (error) {
      next(error)
   }
  
  }
  