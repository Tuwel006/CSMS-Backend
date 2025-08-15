import mongoose, {Schema, model} from "mongoose";
import { IUser } from "../../../types/user.types";

const userScema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is reqired'],
            usinque: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be 10 digits'],

        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
        }
    },
    {
        timestamps: true
    }
)

userScema.set('toJSON', {
    transform: (_doc, ret: any) => {
        delete ret.password;
        return ret;
    }
})

export const User = mongoose.model<IUser> ('Users', userScema);