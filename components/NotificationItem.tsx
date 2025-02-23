import { INotification } from '@/types/types'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Avatar from './Avatar'
import { router } from 'expo-router'

interface NotificationItem extends INotification {}

const NotificationItem:React.FC<INotification> = (notification) => {
      
    return (
        <View className={`flex flex-row w-full items-center bg-slate-100 rounded-2xl p-6 ${!notification.checked ? "border border-emerald-200" : ""}`}>
            <Avatar image={notification.sender?.image || ""} username={notification.sender?.name || "undefined"} size={40}/>
            <View className='ml-2'>
                <Text className='font-rubik-medium text-black-300'>{notification.sender?.name}</Text>
                <Text className='text-black-100 max-w-[100px]'>{notification.title}</Text>
            </View>
            {
                !notification.checked
                ?
                <View className='flex items-center justify-center rounded-full size-2 ml-4 bg-emerald-400'/>
                :
                ""
            }

            <TouchableOpacity onPress={() => router.push({pathname: "/(main)/postDetails", params: {postId: notification.data}})} className='ml-auto bg-[#00c26f] p-2 rounded-xl'>
                <Text className='text-white font-rubik-medium'>View post</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NotificationItem
