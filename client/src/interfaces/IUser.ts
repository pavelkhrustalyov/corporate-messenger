import { positionTypes } from "../types/types";

export interface IUser {
    _id: string;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    position: positionTypes;
    status?: 'Online' | 'Offline';
    notifications?: string[];
    isVerified?: boolean;
    avatar: string | "default.jpg";
    sex: 'male' | 'female';
    birthday: Date;
    last_seen: number,
}