import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import { useAuth } from '@/context/AuthContext'
import { updateUserData, uploadFile } from '@/services/userService'
import { Redirect, router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';


const EditProfile = () => {
    const { user, setAuth } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>

    const [name, setName] = useState<string>(user.name)
    const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || "")
    const [address, setAddress] = useState<string>(user.address || "")
    const [bio, setBio] = useState<string>(user.bio || "")
    const [image, setImage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handlePickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 0.7,
        });
      
        console.log("PICKED IMAGE: ", result);
      
        if (!result.canceled) {
        setImage(result.assets[0].uri);
        }
    }

    const handleUpdateUser = async () => {
        try {
            if(!name.trim() || !phoneNumber.trim() || !address.trim() || !bio.trim()){
                Alert.alert("Warning", "Please fill in all fields")
                // if(res) setAuth(res)
                return
            }
            setIsLoading(true)
            let imageUploadRes;
            if(image){
                imageUploadRes = await uploadFile("avatars", image, true)
                if(!imageUploadRes.success){
                    Alert.alert("Uploading Avatar Error", imageUploadRes.message)
                    return
                }
            }

            const res = await updateUserData(user.id, name.trim(), phoneNumber.trim(), address.trim(), bio.trim(), imageUploadRes?.data?.path || "")
            setIsLoading(false)
            if(!res.success){
                Alert.alert("Update user Error", res.message)
                return
            }        

            
            // UPDATING LOCAL USER STATE
            setAuth?.(res.data)
            router.back()
        } catch (error) {
            Alert.alert("Update user Error", error instanceof Error ? error.message : "Unknown error in update user")
        }
    }
    return (
        <View className='w-full h-full bg-white px-4 items-center'>
            <ScrollView className='w-full pt-14' contentContainerClassName='items-center'>
                {/* HEADER */}
                <Header showBackButton title='Edit Profile' containerStyles='my-4'/>

                {/* AVATAR */}
                <Avatar image={user.image} tempImage={image} size={150} username={user.name} />
                {/* PICK AVATAR BUTTON */}
                <TouchableOpacity onPress={handlePickAvatar} className='flex items-center justify-center bg-white shadow rounded-full size-10 relative bottom-10 left-10'>
                    <Icon name='camera' color='black'/>
                </TouchableOpacity>

                {/* TEXT */}
                <Text className='text-sm font-medium text-black-300 self-start mb-[25px]'>Please, fill your profile details</Text>

                {/* FORM */}
                <View className='gap-[25px] w-full'>
                    {/* NAME */}
                    <Input 
                    containerStyles='w-full' 
                    placeholder='Name' 
                    value={name}
                    onChangeText={text => setName(text)} 
                    icon={<Icon name='user'/>}/>

                    {/* PHONE */}
                    <Input 
                    containerStyles='w-full' 
                    placeholder='Phone number' 
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)} 
                    icon={<Icon name='call'/>}/>

                    {/* ADDRESS */}
                    <Input 
                    containerStyles='w-full' 
                    placeholder='Address' 
                    value={address}
                    onChangeText={text => setAddress(text)} 
                    icon={<Icon name='location'/>}/>

                    {/* BIO */}
                    <Input 
                    containerStyles='w-full h-[100px]'
                    textAlign='left'
                    textAlignVertical='top' 
                    placeholder='Bio...' 
                    value={bio}
                    multiline
                    numberOfLines={5}
                    onChangeText={text => setBio(text)} 
                    />
                    
                </View>
                {/* SUBMIT BUTTON */}
                <Button onPress={handleUpdateUser} title='Update' buttonStyle='w-full mt-[25px]' isLoading={isLoading}/>
            </ScrollView>
        </View>
    )
}

export default EditProfile
