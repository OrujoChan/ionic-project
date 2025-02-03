import { User } from "./user";
import { MyEvent } from "./my-event";

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface EventsResponse {
    events: MyEvent[];
}

export interface SingleEventResponse {
    event: MyEvent;
}