export interface IUser {
    _id: string;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    position: string; // fix
    status?: 'Online' | 'Offline';
    notifications?: string[];
    isVerified?: boolean;
    avatar: string | "default.jpg";
    last_seen: number,
}