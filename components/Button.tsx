import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

interface IButton {
    buttonStyle?: string;
    textStyle?: string;
    title?: string;
    onPress?: () => void;
    isLoading?: boolean;
    hasShadow?: boolean;
}

const Button:React.FC<IButton> = ({hasShadow=false, isLoading=false, onPress, buttonStyle, textStyle, title}) => {
    const shadowStyle = {
        shadowColor: "#3E3E3E",
        shadowOffset: { width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    }
    return (
        <TouchableOpacity 
        disabled={isLoading}
        style={hasShadow && shadowStyle}
        onPress={onPress} className={"mx-3 bg-primary h-16 justify-center flex items-center rounded-3xl " + buttonStyle}>
            <Text 
            disabled={isLoading} 
            className={"text-lg text-white font-rubik-medium " + textStyle}
            >
                {
                    isLoading 
                    ?
                    <ActivityIndicator color={"white"} size={"small"}/>
                    :
                    title
                }
            </Text>
        </TouchableOpacity>
    )
}

export default Button
