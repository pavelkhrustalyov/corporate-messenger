import { IReplyData } from "../types/types";
import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export type contentType = { filename: string, size: string };

export interface IMessage {
    _id: string;
    roomId: IRoom;
    senderId: IUser;
    messageType: 'text' | 'file' | 'image' | "voice";
    isRead: boolean;
    createdAt: Date;
    repliedMessage: IReplyData,
    updatedAt?: Date;
    text?: string;
    content?: contentType;
    my: boolean;
}