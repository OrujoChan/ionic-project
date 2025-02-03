import { User } from "./user";

export interface EventComment {
    comment: string;
    date: Date;
    id?: number;
    user: User;
}