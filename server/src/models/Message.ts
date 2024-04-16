import mongoose, { Schema, Document } from "mongoose";

export interface IMessageSchema extends Document {
    roomId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    recipientId: Schema.Types.ObjectId | null;
    messageType: 'text' | 'file' | 'image';
    isRead: boolean;
    createdAt: Date;
    content: string;
}

const MessageSchema = new Schema<IMessageSchema>({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    messageType: {
        type: String,
        enum: ["text", "file", "image"],
        default: "text"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model<IMessageSchema>("Message", MessageSchema);
