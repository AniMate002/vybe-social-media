import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { getPosts } from '@/services/postService'
import { getUserData } from '@/services/userService'
import { IPost, IUser } from '@/types/types'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Redirect, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, SafeAreaView, Button, TouchableOpacity, Pressable, FlatList, ActivityIndicator } from 'react-native'

const Home = () => {
    const { setAuth, user } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>
    const handleLogout = async () => {
        setAuth?.(null)
        const { error } = await supabase.auth.signOut()
        if(error){
            Alert.alert("Error in logg out: " + error.code, error.message)
        }
    }

    const [posts, setPosts] = useState<Array<IPost>>([])
    const [limit, setLimit] = useState<number>(10)
    const [reachedEnd, setReachedEnd] = useState<boolean>(false)

    const handlePostChannel = async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
        console.log("CHANNEL POST: ", payload)
        if(payload.errors){
            console.log("CHANNEL POST EROR: ", payload.errors)
            Alert.alert("Error fetching posts", JSON.stringify(payload.errors))
            return
        }else{
            if(payload.eventType === "INSERT"){
                const res = await getUserData(payload.new.userId)
                if(!res.success){
                    Alert.alert("Error getting user data", res.message)
                    return
                }
                const newPost = {...payload.new, user: res.data, likes: [], comments: [{count: 0}]} as unknown as IPost
                console.log("NEW POST AFTER INSERTING USER: ", newPost)
                setPosts([newPost, ...posts])
            }
        }
    }

    const fetchPosts = () => {
        // FETCHING POSTS
        getPosts(limit).then(({success, data, message}) => {
            if(!success){
                Alert.alert("Error fetching posts", message)
            }
            if(data){
                if(posts.length === data.length) setReachedEnd(true)
                setPosts(data)
                setLimit(prev => prev + 10)

            }
        })
    }

    useEffect(() => {
        // SUBSCRIBING TO LISTENING EVENT: MANAGING POSTS IN REAL TIME
        let postChannel = supabase
        .channel("posts")
        .on("postgres_changes", {event: "*", schema: "public", table: "posts"}, payload => handlePostChannel(payload))
        .subscribe()

        // UNSUBSCRIBING TO CHANNEL
        return () => {
            supabase.removeChannel(postChannel)
        }
    }, [])

    return (
        <View className='bg-white w-full h-full'>
            <SafeAreaView />
            {/* HEADER */}
            <View className='flex items-center justify-between px-4 flex-row mt-4'>
                {/* LOGO */}
                <Text className='font-rubik-medium text-3xl text-black-300'>Vybee!</Text>
                {/* ICONS NAVIGATION */}
                <View className='flex flex-row items-center gap-4'>
                    <TouchableOpacity onPress={() => router.navigate("/(main)/notifications")}>
                        <Icon name='heart' size={25} strokeWidth={2} color='#494949'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.navigate("/(main)/newPost")}>
                        <Icon name='plus' size={25} strokeWidth={2} color='#494949'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.navigate("/(main)/profile")}>
                        <Avatar image={user?.image || null} username={user?.name} borderRadius={100} size={40}/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* FETCHED POSTS */}
            <FlatList 
                data={posts}
                contentContainerClassName='px-4 mt-10 flex w-full flex-col gap-4'
                keyExtractor={(item) => item.id}
                onEndReached={() => {
                    fetchPosts()
                }}
                renderItem={({item}) => <PostCard 
                    currentUser={user}
                    post={item}
                />}
                ListFooterComponent={
                    reachedEnd ?
                    <Text className='text-center pt-10 pb-14 font-semibold text-black-100'>You have reached the end</Text>
                    :
                    <ActivityIndicator className='pt-10 pb-14' size={'large'} color={"#41B287"}/>
                }
            />

            
        </View>
    )
}

export default Home
