export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    lat: number;
    lng: number;
    me?: boolean;
}

export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}

export interface changePassword {
    password: string;
}

export interface changeProfile {
    name: string;
    email: string;
}

export interface changeAvatar {
    avatar: string;
}

export interface FacebookLogin {
    token?: string;
    lat?: number;
    lng?: number;
}

export interface GoogleUser {
    imageUrl: string | null;
    email: string | null;
    name: string | null;
}