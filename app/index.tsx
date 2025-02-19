import { router } from 'expo-router'
import React from 'react'
import { View, Text, Button } from 'react-native'

const Index = () => {
    return (
        <View>
            <Text className='text-4xl'>App</Text>
            <Button onPress={() => router.push("/welcome")} title='Go to Welcome Screen'/>
        </View>
    )
}

export default Index
