import mongoose, { Schema, Document } from "mongoose";

export interface IRoomSchema extends Document {
    creator?: Schema.Types.ObjectId;
    type: 'private' | 'group';
    title?: string; 
    participants: Schema.Types.ObjectId[];
    lastMessage: string;
    imageGroup?: string;
    archived: boolean;
    archive: () => void;
    unarchive: () => void;
}

const RoomSchema = new Schema<IRoomSchema>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },
    title: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: String,
    imageGroup: {
        type: String,
        default: 'default-group.png'
    },
    archived: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

RoomSchema.pre('save', function (next){
    if (this.type === 'private') {
        this.title = undefined;
        this.creator = undefined;
        this.imageGroup = undefined;
    }
    next();
})


RoomSchema.methods.archive = async function() {
    this.archived = true;
    await this.save();
}

RoomSchema.methods.unarchive = async function() {
    this.archived = false;
    await this.save();
}

export default mongoose.model<IRoomSchema>("Room", RoomSchema);
