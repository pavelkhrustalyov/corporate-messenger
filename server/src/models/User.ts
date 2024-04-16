import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUserSchema extends Document {
    name: string;
    surname: string;
    email: string;
    patronymic: string;
    password: string;
    status: 'Online' | 'Offline';
    notifications: string[];
    isVerified: boolean;
    avatar: string | "default.jpg";
    role: 'user' | 'creator' | 'admin';
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserSchema>({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    patronymic: {
        type: String,
        required: true
    },
    email: {
        type: "String",
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "default.jpg"
    },
    status: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Offline"
    },
    notifications: [{
        type: String,
        required: false
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "creator", "admin"]
    }
}, {
    timestamps: true,
});


UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}


export default mongoose.model<IUserSchema>("User", UserSchema);