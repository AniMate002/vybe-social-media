import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from "@/assets/icons/index"
import { router } from 'expo-router'

const GoBackButton = ({className}: {className?:string}) => {
    return (
        <TouchableOpacity 
        onPress={() => router.back()}
        className={'bg-[#DCDCDC] rounded-full justify-center items-center size-10 ' + className}>
            <Icon name={"arrowLeft"} strokeWidth={2.5} size={26} color={"#191D31"}/>
        </TouchableOpacity>
    )
}

export default GoBackButton
