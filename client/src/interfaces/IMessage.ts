import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface IMessage {
    _id: string;
    roomId: IRoom;
    senderId: IUser;
    recipientId: IUser | null;
    messageType: 'text' | 'file' | 'image';
    isRead: boolean;
    createdAt: Date;
    content: string;
    my: boolean;
}