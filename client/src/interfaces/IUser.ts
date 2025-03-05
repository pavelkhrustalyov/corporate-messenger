import { Gender, Position, Role, Status } from "../types/types";

export interface IUser {
    _id: string;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    position: Position;
    status?: Status;
    notifications?: string[];
    isVerified?: boolean;
    avatar: string | "default.jpg";
    phone: string;
    gender: Gender;
    role: Role;
    dateOfBirthday: Date;
    password: string;
    last_seen: number,
}