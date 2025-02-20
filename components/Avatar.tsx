import React from 'react'
import { View, Text } from 'react-native'
import { Image } from "expo-image"
import { getUserAvatar } from '@/services/userService';

interface IAvatar {
    image: string | null;
    size?: number;
    avatarStyles?: string;
    borderRadius?: number;
    username?: string;
    tempImage?: string | null;
}

const Avatar:React.FC<IAvatar> = ({image, avatarStyles, size=35, borderRadius=100, username, tempImage, ...props}) => {
    return (
        <Image 
        source={tempImage || getUserAvatar(image, username)}
        transition={100}
        style={{height: size, width: size, borderRadius, borderWidth: 1, borderColor: "#E1E1E1"}}
        className={"border-2 border-[#E1E1E1] flex " + avatarStyles}
        />
    )
}

export default Avatar
