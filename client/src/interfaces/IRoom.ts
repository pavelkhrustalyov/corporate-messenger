import { IUser } from "./IUser";

export interface IRoom {
    _id: string;
    avatar?: string;
    imageGroup?: string;
    title?: string;
    creator?: IUser;
    type: 'private' | 'group';
    participants: IUser[];
    lastMessage: string;
    createdAt: string;
    updatedAt: string;
    archived: boolean;
}