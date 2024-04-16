import { IUser } from "./IUser";

export interface IRoom {
    _id: string,
    avatar?: string,
    imageGroup?: string
    title?: string,
    creator?: IUser;
    type: 'individual' | 'group';
    participants: IUser[];
    lastMessage: string;
    createdAt: Date;
}