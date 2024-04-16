export interface IUser {
    _id: string;
    name: string;
    surname: string;
    patronymic?: string;
    login: string;
    status?: 'Online' | 'Offline';
    notifications?: string[];
    isVerified?: boolean;
    avatar: string | "default.jpg";
}