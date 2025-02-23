import Header from '@/components/Header'
import NotificationItem from '@/components/NotificationItem'
import { useAuth } from '@/context/AuthContext'
import { getUserNotifications } from '@/services/notificationService'
import { INotification } from '@/types/types'
import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'

const Notifications = () => {
    const { user } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>
    
    const [notifications, setNotifications] = useState<Array<INotification>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchNotifications = async () => {
        setIsLoading(true)
        const res = await getUserNotifications(user.id)
        if(!res.success){
            Alert.alert("Error while fetching notifications: ", res.message)
            return
        }
        setNotifications(res.data as unknown as Array<INotification>)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchNotifications()
    }, [])
    return (
        <View className='w-full h-full px-4 bg-white'>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id?.toString() || new Date().toLocaleString()}
                contentContainerClassName='flex gap-4'
                ListEmptyComponent={
                    <View className='w-full h-full items-center mt-20'>
                        {
                            isLoading
                            ?
                            <ActivityIndicator size={"large"} color={"#41B287"}/>
                            :
                            <Text className='text-center text-xl font-rubik-medium text-black-100'>No notifications</Text>
                        }
                    </View>
                }
                ListHeaderComponent={
                    (
                        <Header containerStyles='mt-16 mb-14' showBackButton title='Notifications'/>
                    )
                }
                renderItem={({item}) => <NotificationItem {...item}/>}
            />
        </View>
    )
}

export default Notifications
