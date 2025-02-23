import { supabase } from "@/lib/supabase"
import { INotification } from "@/types/types"

export const createNotification = async (notification: INotification) => {
    try {
        const { data, error} = await supabase
        .from("notifications")
        .insert(notification)
        .select()
        .single()

        if(error){
            console.log("Error while creating notification: " , error.message)
            return { success: false, message: error.message}
        }

        console.log("NOTIFICATIONS CREATED: ", data)
        return { success: true, data }
    } catch (error) {
        console.log("Error while creating notification (notificationService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while creating notification"}
    }
}

export const getUserNotifications = async (userId: string) => {
    try {
        const { data, error } = await supabase
        .from("notifications")
        .select("*, sender: senderId(id, name, image)")
        .order("created_at", {ascending: false})

        if(error){
            console.log("Error while fetching notification: " , error.message)
            return { success: false, message: error.message}
        }

        const { data: dataUpdate, error: errorUpdate } = await supabase
        .from("notifications")
        .update({checked: true})
        .eq("receiverId", userId)
        .eq("checked", false)
        .select()
        if(errorUpdate){
            console.log("Error while checking notification: " , errorUpdate.message)
            return { success: false, message: errorUpdate.message}
        }else{
            console.log("ALL USER NOTIFICATIONS CHECKED: ", dataUpdate)
        }

        console.log("FETCHED NOTIFICATIONS: ", data)
        return { success: true, data}
    } catch (error) {
        console.log("Error while fetching notification (notificationService)")
        return {success: false, message: error instanceof Error ? error.message : "Unknown error while fetching notification"}
    }
}