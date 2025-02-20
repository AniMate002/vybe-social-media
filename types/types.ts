import { User } from "@supabase/supabase-js";

export interface IUser extends User {
    id: string;
    address: string | null;
    bio: string | null;
    image: string | null;
    name: string;
    phoneNumber: string | null;
}