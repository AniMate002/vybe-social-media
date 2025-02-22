import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { getUserPosts } from '@/services/postService'
import { IPost, IUser } from '@/types/types'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Redirect, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, StatusBar, TouchableOpacity } from 'react-native'
import { View, Text, SafeAreaView } from 'react-native'

const Profile = () => {
    const { user, setAuth } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>


    const [posts, setPosts] = useState<Array<IPost>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

    const fetchUserPosts = async () => {
        setIsLoading(true)
        const res = await getUserPosts(user.id)
        if(!res.success){
            Alert.alert("Error while fetching user posts", res.message)
            return
        }
        setPosts(res.data as unknown as Array<IPost>)
        setIsLoading(false)
    }

    const handlePostChannel = (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
        console.log("CHANNEL POST: ", payload)
        if(payload.errors){
            console.log("CHANNEL POST EROR: ", payload.errors)
            Alert.alert("Error fetching posts", JSON.stringify(payload.errors))
            return
        }else{
            if(payload.eventType === "INSERT"){
                const newPost = {...payload.new, user, likes: [], comments: [{count: 0}]} as unknown as IPost
                console.log("NEW POST AFTER INSERTING USER: ", newPost)
                setPosts([newPost, ...posts])
            }
        }
    }

    useEffect(() => {
        // SUBSCRIBING TO LISTENING EVENT: MANAGING POSTS IN REAL TIME
        let postChannel = supabase
        .channel("posts")
        .on("postgres_changes", {event: "*", schema: "public", table: "posts"}, payload => handlePostChannel(payload))
        .subscribe()

        // FETCHING USER POSTS
        fetchUserPosts()


        // UNSUBSCRIBING TO CHANNEL
        return () => {
            supabase.removeChannel(postChannel)
        }

    }, [])

    return (
        <View className='px-4 bg-white w-full h-full'>
            {/* <SafeAreaView /> */}
            

            {/* USER POSTS */}
            <FlatList 
                data={posts}
                contentContainerClassName='px-4 mt-10 flex w-full flex-col gap-4'
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <PostCard 
                    currentUser={user}
                    post={item}
                />}
                ListHeaderComponentClassName='mt-4'
                ListHeaderComponent={
                    <>
                        {/* HEADER */}
                        <UserHeader user={user} handleLogout={handleLogout}/>
                    </>
                }
                ListFooterComponent={
                    <Text className='text-center pt-10 pb-14 font-semibold text-black-100'>You have reached the end</Text>
                }
            />
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
