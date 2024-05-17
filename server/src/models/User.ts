import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

type positionTypes = 'Security Specialist' | 'Systems Analyst' | 'QA Engineer' |
'Product Manager' | 'DevOps Engineer' | 'Backend Developer' | 'Frontend Developer' | 'UX/UI Designer';

export interface IUserSchema extends Document {
    name: string;
    surname: string;
    patronymic: string;
    dateOfBirthday: Date;
    position: positionTypes;
    email: string;
    password: string;
    sex: 'male' | 'female';
    status: 'Online' | 'Offline';
    notifications: string[];
    isVerified: boolean;
    avatar: string | "default.png";
    phone: string;
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
    sex: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dateOfBirthday: {
        type: Date,
        required: true,
    },
    position: {
        type: String,
        enum: [
            "Security Specialist",
            "Product Manager",
            "Systems Analyst",
            "QA Engineer",
            "DevOps Engineer",
            "Backend Developer",
            "Frontend Developer",
            "UX/UI Designer",
        ],
        required: true,
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