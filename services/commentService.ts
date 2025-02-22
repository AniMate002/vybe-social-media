import { supabase } from "@/lib/supabase"

export const getPostComments = async (postId: string) => {
    try {
        const { data, error } = await supabase
        .from("comments")
        .select("*, user: users(id, name, image)")
        .eq("postId", postId)
        .order("created_at", {ascending: false})

        if(error){
            console.log("Error while fetching post comments (commentService): ", error.message)
            return {success: false, message: error.message}
        }

        console.log("POST COMMENTS FETCHED: ", data)
        return { success: true, data: data }
    } catch (error) {
        console.log("Error while fetching post comments (commentService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching post comments"}
    }
}


export const createComment = async (postId:string, userId: string, text: string) => {
    try {
        const { data, error } = await supabase
        .from("comments")
        .insert({userId, postId, text})
        .select()
        .single()

        if(error){
            console.log("Error while creating comment (commentService): ", error.message)
            return {success: false, message: error.message}
        }

        console.log("COMMENT CREATED: ", data)
        return { success: true, data: data }
    } catch (error) {
        console.log("Error while creating comment (commentService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while creating comment"}
    }
}