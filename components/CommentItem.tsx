import { IComment } from '@/types/types'
import React from 'react'
import { View, Text } from 'react-native'
import Avatar from './Avatar'

interface ICommentItem {
    comment: IComment
}

const CommentItem:React.FC<ICommentItem> = ({ comment }) => {
    return (
        <View className='flex flex-row items-start w-full gap-2'>
            {/* AVATAR */}
            <Avatar image={comment.user.image} username={comment.user.name} size={50} />
            
            <View className='rounded-2xl bg-slate-100 flex-1 p-4'>
                <View className='flex flex-row justify-between items-center mb-1'>
                    {/* NAME */}
                    <Text className='font-rubik-medium text-black-500'>{comment.user.name}</Text>
                    {/* TIME */}
                    <Text className='text-[12px] font-rubik-light text-black-300'>
                        {new Date(comment.created_at).toLocaleString()}
                    </Text>
                </View>
                {/* BODY */}
                <Text className='text-black-200'>
                    {comment.text}
                </Text>
            </View>
        </View>

    )
}

export default CommentItem
