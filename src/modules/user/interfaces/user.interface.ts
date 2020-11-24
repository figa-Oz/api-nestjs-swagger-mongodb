import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    avatar: string;
    last_login: Date;
    // type: string;
    role: [string];
    created_at: Date;
    updated_at: Date;
}
