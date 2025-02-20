import React from 'react'
import { View, Text } from 'react-native'
import GoBackButton from './GoBackButton'

const Header = ({ title, showBackButton=false, containerStyles }: { title: string, showBackButton?: boolean, containerStyles?: string }) => {
    return (
        <View className={'flex flex-row items-center justify-center relative w-full ' + containerStyles}>
            {
                showBackButton
                ?
                <GoBackButton className='absolute left-0'/>
                :
                ""
            }
            <Text className='text-2xl text-black-300 font-rubik-medium'>{title}</Text>
        </View>
    )
}

export default Header
