import React from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

interface IInput extends TextInputProps{
    containerStyles?: string;
    icon?: React.ReactElement;
}

const Input:React.FC<IInput> = ({containerStyles, icon, ...props}) => {
    return (
        <View 
        className={"flex flex-row items-center justify-center rounded-3xl border border-black-100 px-4 " + containerStyles}
        >
            {
                icon ? icon : ""
            }
            <TextInput 
            placeholder='Email'
            className='placeholder:text-black-100 text-black-100 flex-1 p-6' 
            {...props}
             />
        </View>
    )
}

export default Input
