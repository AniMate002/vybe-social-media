import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import React from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'

const Index = () => {
    return (
        <View className='flex items-center justify-center w-full h-full'>
            <ActivityIndicator size={'large'} color={"#41B287"}/>
        </View>
    )
}

export default Index
