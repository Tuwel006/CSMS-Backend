import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const register = async ({name, email, phone, password}: any) => {
    console.log(name, email, phone, password);

    const existingUser = await User.findOne({email}) || await User.findOne({phone});
    if(existingUser) {
        throw new Error('User ALready Exist'); 
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, phone, password: hashed});
    return user;
}

export const login = async ({email, password}: any) => {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error("User not found");
    }
    const isMAtch = await bcrypt.compare(password, user.password);
    if(!isMAtch) {
        throw new Error("Invalid Credentials");
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    })
    console.log(process.env.JWT_SECRET, token);
    return token;
}