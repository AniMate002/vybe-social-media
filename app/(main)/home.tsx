import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import React from 'react'
import { View, Text, Alert, SafeAreaView, Button, TouchableOpacity, Pressable } from 'react-native'

const Home = () => {
    const { setAuth, user } = useAuth()
    const handleLogout = async () => {
        setAuth?.(null)
        const { error } = await supabase.auth.signOut()
        if(error){
            Alert.alert("Error in logg out: " + error.code, error.message)
        }
    }
    return (
        <View className='bg-white w-full h-full'>
            <SafeAreaView />
            {/* HEADEr */}
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
        </View>
    )
}

export default Home
