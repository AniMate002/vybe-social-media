import { User } from "@supabase/supabase-js";

export interface IUser extends User {
    id: string;
    address: string | null;
    bio: string | null;
    image: string | null;
    name: string;
    phoneNumber: string | null;
}

export interface IPost {
    id: string;
    created_at: Date;
    body?: string;
    file?: string;
    user: IUser;
    likes: Array<IPostLikes>;
    comments: [{count: number}]
}

export interface IPostLikes {
    id: string;
    userId: string;
    postId: string;
}

export interface IComment {
    id: string;
    created_at: string;
    text: string;
    user: IUser;
    postId: string;
}

export interface INotification {
    id?: string;
    title: "liked your post" | "commented on your post";
    sender?: IUser;
    senderId: string;
    receiverId: string;
    data: string;
    checked?: boolean;
}