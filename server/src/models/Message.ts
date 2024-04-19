import mongoose, { Schema, Document } from "mongoose";

export interface IMessageSchema extends Document {
    roomId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    messageType: 'text' | 'file' | 'image';
    isRead: boolean;
    content?: string;
    text?: string;
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
    messageType: {
        type: String,
        enum: ["text", "file", "image"],
        default: "text"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        default: null
    },
    text: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

export default mongoose.model<IMessageSchema>("Message", MessageSchema);
