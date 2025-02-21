import { supabase } from "@/lib/supabase"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer"

export const getUserData = async (userId: string) => {
    try {
        const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single()
        if(error){
            console.log("Error in getting userData")
            return {success: false, message: error.message || "Error in getting userData" }
        }
        return { success: true, data }
    } catch (error) {
        console.log("Error in getting userData")
        return {success: false, message: error instanceof Error ? error.message : "Error in getting userData" }
    }
} 


export const updateUserData = async (userId: string, name: string, phoneNumber: string, address: string, bio: string, image?: string) => {
    try {
        const { data, error } = await supabase
        .from("users")
        .update({name, address, phoneNumber, bio, image})
        .eq("id", userId)
        .select()
        if(error){
            console.log("Error in updating userData: ", error.message)
            return {success: false, message: error.message || "Error in updating userData" }
        }
        console.log("UPDATED USER DATA: ", data[0])
        return {success: true, data: data[0]}
    } catch (error) {
        console.log("Error in updating userData")
        return {success: false, message: error instanceof Error ? error.message : "Error in updating userData" }
    }
}

export const getFilePath = (folderName: string, isImage: boolean ) => {
    return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`
}

export const uploadFile = async (folderName: string, fileURI: string, isImage: boolean = true) => {
    try {
        let fileName = getFilePath(folderName, isImage)
        // FIRSTLY CONVERT IMAGE TO BASE64 USING FileSystem from expo-file-system
        let fileBase64 = await FileSystem.readAsStringAsync(fileURI, {
            encoding: FileSystem.EncodingType.Base64
        });
        // THEN DECODE TO ARRAY BUFFER USING base64-arraybuffer
        let imageData = decode(fileBase64)

        const { data, error } = await supabase
        .storage
        .from("uploads")
        .upload(fileName, imageData, { 
            cacheControl: '3600',
            upsert: false,
            contentType: isImage ? "image/*" : "video/*"
        })

        if(error){
            console.log("Error in uploading file: ", error.message)
            return {success: false, message: error.message || "Error in uploading file" }
        }
        console.log("FILE UPLOADED DATA: ", data)
        return {success: true, data}
    } catch (error) {
        console.log("Error in uploading file")
        return {success: false, message: error instanceof Error ? error.message : "Error in uploading file" }
    }
}


export const getUserAvatar = (image?: string | null, name?: string) => {
    if(image){
        return {uri: getSupaBaseFileURL(image)}
    }else{
        return {uri: `https://avatar.iran.liara.run/public/boy?username=${name}`}
    }
}

export const getSupaBaseFileURL = (image: string) => {
    if(image) return `https://rpeojlbsxrgjrxbcxhhf.supabase.co/storage/v1/object/public/uploads/${image}`
}