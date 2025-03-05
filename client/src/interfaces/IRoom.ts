import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IRoom {
    _id: string;
    avatar?: string;
    imageGroup?: string;
    title?: string;
    creator?: IUser;
    type: 'private' | 'group' | 'video';
    participants: IUser[];
    lastMessage: IMessage;
    createdAt: string;
    updatedAt: string;
    archivedUsers: string[];
    messages: IMessage[];
}