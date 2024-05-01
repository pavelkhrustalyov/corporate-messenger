export type positionTypes = 'Security Specialist' | 'Systems Analyst' | 'QA Engineer' |
'Product Manager' | 'DevOps Engineer' | 'Backend Developer' | 'Frontend Developer' | 'UX/UI Designer';

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