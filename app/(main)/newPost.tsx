import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Header from '@/components/Header'
import RichTextEditor from '@/components/RichTextEditor'
import { useAuth } from '@/context/AuthContext'
import { Redirect, router } from 'expo-router'
import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import * as ImagePicker from "expo-image-picker"
import { createPost } from '@/services/postService'

const NewPost = () => {
    const { user } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>

    const editorRef = useRef<any>()
    const bodyRef = useRef<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: true,
            quality: 0.7,
        });

        console.log("PICKED IMAGE FOR POST: ", result);
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    const handleCreatePost = async () => {
        try {
            if(!image && !bodyRef.current){
                Alert.alert("Warning", "Provide image or text")
                return
            }
            setIsLoading(true)
            console.log("BODY: ", bodyRef.current)
            const res = await createPost({userId: user.id, imageURI: image?.uri, text: bodyRef.current})

            setIsLoading(false)
            if(!res?.success){
                Alert.alert("Error in creating post" , res?.message )
            }

            router.back()
        } catch (error) {
            Alert.alert("Error in creating post", error instanceof Error ? error.message : "Unknown error")
        }
    }

    return (
        <View className='w-full h-full bg-white px-4'>
            <ScrollView className='w-full pt-14' contentContainerClassName=''>
                {/* HEADER */}
                <Header title='Create Post' showBackButton containerStyles='my-4'/>

                {/* USER DATA */}
                <View className='flex flex-row items-center gap-4  mt-4 mb-10'>
                    <Avatar image={user.image} size={60}/>
                    <View>
                        <Text className='text-xl font-rubik-medium text-black-300'>{user.name}</Text>
                        <Text className='text-black-100'>Public</Text>
                    </View>
                </View>

                {/* RICH EDITOR */}
                <RichTextEditor editorRef={editorRef} onChange={(body: any) => bodyRef.current = body}/>

                {/* PICKED IMAGE */}
                {
                    image
                    ?
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setImage(null)} className='w-full max-h-[200px] items-center justify-center'>
                        <Image className='w-full h-[200px] rounded-2xl' source={{uri: image.uri}}/>
                    </TouchableOpacity>
                    :
                    ""
                }

                {/* IMAGE UPLOAD */}
                <View className='flex items-center justify-between flex-row border border-slate-200 mt-4 px-4 py-6 rounded-2xl'>
                    <Text className='font-medium text-black-300 text-lg'>Add to your post</Text>
                    <View className='flex flex-row items-center gap-2'>
                        <TouchableOpacity onPress={handlePickImage}>
                            <Icon name='image' size={27} strokeWidth={1.5}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePickImage}>
                            <Icon name='video' size={30} strokeWidth={1.5}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
            {/* SUBMIT BUTTON */}
            <Button 
            isLoading={isLoading}
            onPress={handleCreatePost}
            title='Create post' 
            buttonStyle='w-full self-start mb-10'/>
        </View>
    )
}

export default NewPost
