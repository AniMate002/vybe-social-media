import Button from '@/components/Button'
import images from '@/constants/images'
import { router } from 'expo-router'
import React from 'react'
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'

const Welcome = () => {
    return (
        <ScrollView contentContainerClassName='w-full h-full' className='w-full h-full'>
            <View className='w-full h-full flex flex-col items-center justify-evenly '>
                {/* WELCOME IMAGE */}
                <Image source={images.Welcome} resizeMode='contain' className='h-[30vh] w-full '/>

                {/* TITLE */}
                <View className='mt-20 px-16'>
                    <Text className='text-center text-black-300 font-rubik-medium text-4xl'>Vybee!</Text>
                    <Text className='text-center mt-6'>Where every though finds a home and every image tells a story.</Text>
                </View>

                <View className='w-full flex flex-col items-center justify-center'>
                    {/* SIGNUP */}
                    <Button
                    title='Getting Started'
                    buttonStyle='w-[90%]'
                    hasShadow
                    onPress={() => router.push("/(auth)/signup")}
                    />

                    {/* LOGIN */}
                    <View className='flex flex-row gap-2 mt-4'>
                        <Text className='text-black-200'>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text className='text-primary font-rubik-medium'>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Welcome
