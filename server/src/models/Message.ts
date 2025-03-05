import mongoose, { Schema, Document } from "mongoose";

export interface IContent {
    filename: string;
    size: string;
}

export interface IMessageSchema extends Document {
    roomId: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    messageType: 'text' | 'file' | 'image' | 'voice';
    replyTo: Schema.Types.ObjectId;
    repliedMessage: mongoose.SchemaDefinitionProperty<string, IMessageSchema>;
    isRead: boolean;
    content?: IContent;
    text?: string;
}

const MessageSchema = new Schema<IMessageSchema>({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    messageType: {
        type: String,
        enum: ["text", "file", "image", "voice"],
        default: "text"
    },
    repliedMessage: {
        type: {
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        },
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    content: {
        type: {
            filename: String,
            size: String
        },
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
