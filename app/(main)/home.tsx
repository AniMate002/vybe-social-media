import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { getPosts } from '@/services/postService'
import { IPost } from '@/types/types'
import { Redirect, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, SafeAreaView, Button, TouchableOpacity, Pressable, FlatList } from 'react-native'

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

    useEffect(() => {
        getPosts(limit).then(({success, data, message}) => {
            if(!success){
                Alert.alert("Error fetching posts", message)
            }
            if(data){
                setPosts(data)
                setLimit(prev => prev + 10)
            }
        })
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
                renderItem={({item}) => <PostCard 
                    currentUser={user}
                    post={item}
                />}
            />
        </View>
    )
}

export default Home
