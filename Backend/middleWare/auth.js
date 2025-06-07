import userModel from "../Model/userModel.js";
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || "Your secret here";


export default async function authMiddleWare(req,res,next) {
    //GRAB THE AUTHOR TOKE FROM AUTH HEADER
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(400).json({success:false,message:'NOT authorize token missing'})
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token,JWT_SECRET);
        const user = await userModel.findById(payload.id).select('-password');

        if(!user){
            res.status(404).json({success:false,message:'USER NOT FOUND'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({success:false,message:"TOKEN INVALID OR EXPIRE"});
        
    }

}