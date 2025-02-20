import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { IUser } from '@/types/types'
import { Redirect, router } from 'expo-router'
import React from 'react'
import { Alert, StatusBar, TouchableOpacity } from 'react-native'
import { View, Text, SafeAreaView } from 'react-native'

const Profile = () => {
    const { user, setAuth } = useAuth()

    const handleLogout = () => {
        Alert.alert("Confirm", "Are you sure you want to log out?", [
            {
                text: "Cancel",
                isPreferred: true,
                style: 'cancel',
                onPress: () => console.log("Cancelled")
            },
            {
                text: "Log out",
                style: 'destructive',
                onPress: async () => {
                    try {
                        const { error } = await supabase.auth.signOut()
                        if(error){
                            Alert.alert("Sign out error: " + error.code, error.message)
                        }
                        setAuth?.(null)
            
                    } catch (error) {
                        Alert.alert("Sign out error", error instanceof Error ? error.message : "Unknown error!")
                    }
                }
            }
        ])
    }

    if(!user)
        return <Redirect href={"/welcome"}/>
    return (
        <View className='px-4 bg-white w-full h-full'>
            <SafeAreaView />
            <UserHeader user={user} handleLogout={handleLogout}/>
        </View>
    )
}

const UserHeader = ({ user, handleLogout }: { user: IUser, handleLogout: () => void}) => {
    return (
        <View className='mt-4'>
            {/* HEADER NAVIGATION */}
            <View className='flex flex-row w-full items-center justify-center relative'>
                <Header title="Profile" showBackButton/>
                <TouchableOpacity 
                onPress={handleLogout}
                className='absolute right-0 bg-red-200 p-2 rounded-xl'>
                    <Icon name='logout' color='#dc2626'/>
                </TouchableOpacity>
            </View>

            {/* HEADER USER INFO */}
            <View className='flex flex-col items-center justify-center w-full mt-4'>
                {/* AVATAR */}
                <Avatar image={user.image} size={150} username={user.name}/>
                {/* EDIT BUTTON */}
                <TouchableOpacity onPress={() => router.navigate("/(main)/editProfile")} className='flex items-center justify-center bg-white shadow rounded-full size-10 relative bottom-10 left-10'>
                    <Icon name='edit' color='black'/>
                </TouchableOpacity>
                {/* USERNAME && ADDRESS */}
                <View>
                    <Text className='text-2xl text-black-300 font-medium text-center -mt-4'>{user.name}</Text>
                    <Text className='text-sm text-black-300 text-center'>{user.address}</Text>
                </View>
                {/* EMAIL && PHONE && BIO */}
                <View className='mt-4 gap-1'>
                    {/* EMAIL */}
                    <View className='flex flex-row items-center justify-center gap-2'>
                        <Icon name='mail' size={20} color='#7C7C7C'/>
                        <Text>{user.email}</Text>
                    </View>
                    {/* PHONE */}
                    {
                        user.phoneNumber
                        ?
                        <View className='flex flex-row items-center justify-center gap-2'>
                            <Icon name='call' size={20} color='#7C7C7C'/>
                            <Text>{user.phoneNumber}</Text>
                        </View>
                        :
                        ""
                    }
                    {/* BIO */}
                    {
                        user.bio
                        ?
                        <View className='flex flex-row items-center justify-center gap-2'>
                            <Icon name='user' size={20} color='#7C7C7C'/>
                            <Text>{user.bio}</Text>
                        </View>
                        :
                        ""
                    }
                </View>
            </View>
        </View>
    )
}

export default Profile
