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
        .select("id, created_at, body, file, user:users(id, name, image), likes:postLikes(id, userId, postId), comments (count)")
        .order("created_at", {ascending: false})
        .limit(limit)


        if(error){
            console.log("Error while fetching posts (postService): ", error.message)
            return {success: false, message: error.message}
        }
        console.log("POSTS FETCHED: ", data)
        return {success: true, data: data as unknown as Array<IPost>}

    } catch (error) {
        console.log("Error while fetching posts (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching posts"}
    }
}


export const createPostLike = async (postId: string, userId: string) => {
    try {
        const { data, error } = await supabase
        .from("postLikes")
        .insert({postId, userId})
        .select()
        .single()

        if(error){
            console.log("Error while liking post (postService): ", error.message)
            return {success: false, message: error.message}
        }

        console.log("POST LIKED: ", data)
        return { success: true, data}
    } catch (error) {
        console.log("Error while liking post (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while liking post"}
    }
}


export const removePostLike = async (postId: string, userId: string) => {
    try {
        const { error } = await supabase
        .from("postLikes")
        .delete()
        .eq("userId", userId)
        .eq("postId", postId)

        if(error){
            console.log("Error while unliking post (postService): ", error.message)
            return {success: false, message: error.message}
        }

        console.log("POST UNLIKED")
        return { success: true }
    } catch (error) {
        console.log("Error while liking post (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while unliking post"}
    }
}


export const getPostDetails = async (postId: string) => {
    try {
        const { data, error } = await supabase
        .from("posts")
        .select("*, user: users(id, name, image), likes: postLikes(id, userId, postId), comments (count)")
        .eq("id", postId)
        .single()

        if(error){
            console.log("Error while fetching post details (postService): ", error.message)
            return {success: false, message: error.message}
        }

        console.log("POST DETAILES FETCHED: ", data)
        return { success: true, data: data }

    } catch (error) {
        console.log("Error while fetching post details (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching post details"}
    }
}


export const getUserPosts = async (userId: string) => {
    try {
        console.log("FETCHING POSTS-----------------------------")
        const { data, error } = await supabase
        .from("posts")
        .select("id, created_at, body, file, user:users(id, name, image), likes:postLikes(id, userId, postId), comments (count)")
        .order("created_at", {ascending: false})


        if(error){
            console.log("Error while fetching users posts (postService): ", error.message)
            return {success: false, message: error.message}
        }
        console.log("USERS POSTS FETCHED: ", data)
        return {success: true, data: data as unknown as Array<IPost>}

    } catch (error) {
        console.log("Error while fetching users posts (postService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching users posts"}
    }
}