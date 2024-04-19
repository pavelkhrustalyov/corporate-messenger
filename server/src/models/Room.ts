import mongoose, { Schema, Document } from "mongoose";

export interface IRoomSchema extends Document {
    creator?: Schema.Types.ObjectId;
    type: 'private' | 'group';
    title?: string; 
    participants: Schema.Types.ObjectId[];
    lastMessage: string;
    imageGroup?: string;
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


export default mongoose.model<IRoomSchema>("Room", RoomSchema);
