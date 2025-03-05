import mongoose, { Schema, Document } from "mongoose";
import { IMessageSchema } from "./Message";

export interface IRoomSchema extends Document {
    creator?: Schema.Types.ObjectId;
    type: 'private' | 'group' | 'video';
    title?: string; 
    participants: Schema.Types.ObjectId[];
    lastMessage: IMessageSchema | null;
    imageGroup?: string;
    messages: IMessageSchema[];
    archivedUsers: Schema.Types.ObjectId[];
    archive: (userId: string) => void;
    unarchive: (userId: string) => void;
}

const RoomSchema = new Schema<IRoomSchema>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ['private', 'group', 'video'],
        required: true
    },
    title: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    imageGroup: {
        type: String,
        default: "default-group.png"
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    archivedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}, {
    timestamps: true,
});

RoomSchema.pre('save', function (next){
    if (this.type === "private") {
        this.title = undefined;
        this.creator = undefined;
        this.imageGroup = undefined;
    }
    next();
})


RoomSchema.methods.archive = async function(userId: string) {
    this.archivedUsers.push(userId);
    await this.save();
}

RoomSchema.methods.unarchive = async function(userId: string) {
    this.archivedUsers = this.archivedUsers.filter((id: string) => id !== userId);
    await this.save();
}

export default mongoose.model<IRoomSchema>("Room", RoomSchema);
