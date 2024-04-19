import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface IMessage {
    _id: string;
    roomId: IRoom;
    senderId: IUser;
    messageType: 'text' | 'file' | 'image';
    isRead: boolean;
    createdAt: Date;
    updatedAt?: Date;
    text?: string;
    content?: string;
    my: boolean;
}