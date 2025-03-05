import { Gender, Position } from "../types/types";

export interface RegisterForm {
    name: string,
    surname: string,
    patronymic: string,
    email: string,
    password: string,
    phone: string,
    dateOfBirthday: Date | '',
    confirmPassword: string,
    position: Position;
    gender: Gender;
}
