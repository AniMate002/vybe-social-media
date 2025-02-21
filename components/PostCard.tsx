import { IPost, IUser } from '@/types/types'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import Avatar from './Avatar';
import Icon from '@/assets/icons';
import RenderHtml from "react-native-render-html"
import { getSupaBaseFileURL } from '@/services/userService';

interface IPostCard {
    currentUser: IUser;
    post: IPost;
}

const tagsStyles = {div: {color: "black", fontSize: "16px"}}

const PostCard:React.FC<IPostCard> = ({ currentUser, post }) => {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const shadowStyles = {
        backgroundColor: "white",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    };

    
    return (
        <View style={shadowStyles} className='border-2 border-slate-100 p-4 rounded-3xl w-full'>
            {/* POST HEADER: USER, TIME AND MENU */}
            <View className='flex flex-row items-center w-full mb-2'>
                {/* AVATAR */}
                <Avatar image={currentUser.image} username={currentUser.name} size={40}/>
                {/* NAME AND TIME */}
                <View className='ml-4'>
                    <Text className='text-lg font-semibold text-black-300'>{currentUser.name}</Text>
                    <Text className='text-sm text-black-100'>{new Date(currentUser.created_at).toLocaleString()}</Text>
                </View>
                {/* MENU BUTTON */}
                <TouchableOpacity className='ml-auto '>
                    <Icon name='threeDotsHorizontal' strokeWidth={3}/>
                </TouchableOpacity>
            </View>

            {/* BODY */}
            <View className='flex w-full'>
                {/* TEXT */}
                {
                    post.body
                    ?
                    <RenderHtml tagsStyles={tagsStyles} contentWidth={useWindowDimensions().width} source={{html: post.body || ""}}/>
                    :
                    ""
                }
                {/* IMAGE */}
                {
                    post.file
                    ?
                    <Image className='w-full h-[300px] mt-2 rounded-2xl'  resizeMode='cover' source={{uri: getSupaBaseFileURL(post.file)}} />
                    :
                    ""
                }
            </View>

            {/* LIKE, COMMENT AND SHARE */}
            <View className='flex flex-row items-center gap-4 mt-4'>
                {/* LIKE */}
                <View className='flex flex-row gap-1 items-center'>
                    <TouchableOpacity>
                        <Icon name='heart' color={isLiked ? '#ef4444' : '#c2c2c2'}/>
                    </TouchableOpacity>
                    <Text className='text-black-100 font-rubik-light text-sm'>0</Text>
                </View>

                {/* COMMENT */}
                <View className='flex flex-row gap-1 items-center'>
                    <TouchableOpacity>
                        <Icon name='comment' color={isLiked ? '#ef4444' : '#c2c2c2'}/>
                    </TouchableOpacity>
                    <Text className='text-black-100 font-rubik-light text-sm'>0</Text>
                </View>

                {/* SHARE */}
                <View className='flex flex-row gap-1 items-center'>
                    <TouchableOpacity>
                        <Icon name='share' color={isLiked ? '#ef4444' : '#c2c2c2'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PostCard
