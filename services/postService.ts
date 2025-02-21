import { supabase } from "@/lib/supabase";
import { uploadFile } from "./userService";

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