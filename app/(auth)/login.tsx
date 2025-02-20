import Icon from '@/assets/icons'
import Button from '@/components/Button'
import GoBackButton from '@/components/GoBackButton'
import Input from '@/components/Input'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'

const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onSubmit = async () => {
        if(email.trim() && password){
            setIsLoading(true)
            const { data: {session, user, weakPassword}, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            })
            setIsLoading(false)
            // console.log(user)
            if(error){
                Alert.alert("Error in login: " + error.code, error.message)
            }
        }else{
            return Alert.alert("Login", "Please fill in all fields.")
        }
    }
    return (
        <SafeAreaView className='flex flex-col'>
            <View className='px-6 mt-4'>
                <GoBackButton className='self-start'/>

                {/* WELCOME TEXT */}
                <View className='mt-10'>
                    <Text className='text-black-300 font-rubik-medium text-5xl'>Hey,</Text>
                    <Text className='text-black-300 font-rubik-medium text-4xl'>Welcome Back</Text>
                </View>

                {/* FORM */}
                <View className='gap-[25px]'>
                    {/* FORM TITLE */}
                    <Text className='text-lg text-black-300'>Please login to continue</Text>

                    {/* EMIAL */}
                    <Input 
                    icon={<Icon name='mail' size={26} strokeWidth={1.6}/>}
                    placeholder='Email'
                    keyboardType='email-address'
                    value={email}
                    autoCapitalize='none'
                    onChangeText={text => setEmail(text)}
                    />

                    {/* PASSWORD */}
                    <Input 
                    icon={<Icon name='lock' size={26} strokeWidth={1.6}/>}
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                    />

                    {/* FORGOT PASSWORD? */}
                    <Text className='self-end text-sm'>Forgot Password?</Text>

                    {/* SUBMIT BUTTON */}
                    <Button
                    title='Login'
                    onPress={onSubmit}
                    isLoading={isLoading}
                    />

                </View>
                {/* DONT HAVE AN ACCOUNT */}
                <View className='flex flex-row gap-2 mt-4 items-center justify-center'>
                    <Text className='text-black-200 '>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                        <Text className='text-primary font-rubik-medium'>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login
