import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUserSchema extends Document {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    password: string;
    status: 'Online' | 'Offline';
    notifications: string[];
    isVerified: boolean;
    avatar: string | "default.png";
    role: 'user' | 'admin';
    last_seen: Date;
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
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "default.png"
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
    last_seen: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "admin"]
    }
}, {
    timestamps: true,
});


UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}


export default mongoose.model<IUserSchema>("User", UserSchema);