import { supabase } from "@/lib/supabase";
import { uploadFile } from "./userService";
import { IPost } from "@/types/types";

export const createPost = async ({userId, imageURI, text} : {userId: string; text?: string; imageURI?: string}) => {
    try {
        let imagePath;
        if(imageURI){
            const imageRes = await uploadFile("postImages", imageURI, true)
            if(!imageRes.success)
            {
                return {success: false, message: imageRes.message}
            }
            imagePath = imageRes.data?.path;
        }

        const { data, error } = await supabase
        .from("posts")
        .insert({userId, file: imagePath || "", body: text || ""})
        .select()
        if(error){
            console.log("Error in creating post: " + error.message)
            return {success: false, message: error.message}
        }

        console.log("POST CREATED: ", data)
        return {success: true}
    } catch (error) {
        console.log("Error while creating post: ", error instanceof Error ? error.message : "Unknown error")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while creating post"}
    }
}


export const getPosts = async (limit: number = 10) => {
    try {
        console.log("FETCHING POSTS-----------------------------")
        const { data, error } = await supabase
        .from("posts")
        .select("id, created_at, body, file, author:users(id, name, image)")
        .order("created_at", {ascending: false})
        .limit(limit)


        if(error){
            console.log("Error while fetching posts (postService)")
            return {success: false, message: error.message}
        }
        console.log("POSTS FETCHED: ", data)
        return {success: true, data: data as unknown as Array<IPost>}

    } catch (error) {
        console.log("Error while fetching posts (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching posts"}
    }
}