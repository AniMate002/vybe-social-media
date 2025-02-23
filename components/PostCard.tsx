import { IPost, IPostLikes, IUser } from '@/types/types'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, useWindowDimensions, Alert, Share, ShareContent } from 'react-native'
import Avatar from './Avatar';
import Icon from '@/assets/icons';
import RenderHtml from "react-native-render-html"
import { getSupaBaseFileURL } from '@/services/userService';
import { createPostLike, deletePost, removePostLike } from '@/services/postService';
import { router } from 'expo-router';
import { createNotification } from '@/services/notificationService';

interface IPostCard {
    currentUser: IUser;
    post: IPost;
    showShadow?: boolean
    showMenu?: boolean;
    numberOfComments?: number;
}

const tagsStyles = {div: {color: "black", fontSize: "16px"}}

const PostCard:React.FC<IPostCard> = ({ currentUser, post, showShadow = true, showMenu = true, numberOfComments = 0 }) => {
    const [isLiked, setIsLiked] = useState<boolean>(!!post.likes.filter(likeObj => likeObj.postId === post.id && likeObj.userId === currentUser.id).length)
    const [likes, setLikes] = useState<number>(post.likes.length)
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

    // console.log("HOW DO YOU SEE: ", post)
    const sendNotification = async (title: "liked your post" | "commented on your post") => {
        const res = await createNotification({title, senderId: currentUser.id, receiverId: post.user.id, data: post.id})
        if(!res.success){
            Alert.alert("Error while creating notification", res.message)
            return;
        }
    }

    const handleLikeClick = async () => {
        if(!isLiked){
            setLikes(prev => prev + 1)
            setIsLiked(prev => !prev)
            const res = await createPostLike(post.id, currentUser.id)
            if(!res.success){
                Alert.alert("Error liking post", res.message)
                setLikes(prev => prev - 1)
                setIsLiked(prev => !prev)
                return
            }else{
                sendNotification("liked your post")
            }
        }else{
            setLikes(prev => prev - 1)
            setIsLiked(prev => !prev)        
            const res = await removePostLike(post.id, currentUser.id)
            if(!res.success){
                Alert.alert("Error unliking post", res.message)
                setLikes(prev => prev + 1)
                setIsLiked(prev => !prev) 
                return
            }
        }

        
    }

    const handleShareClick = async () => {
        let content: ShareContent = {message: post.body || "", title: "Vybee! Share this post with your friends", url: getSupaBaseFileURL(post.file || "")}
        Share.share(content)
    }

    const handleOpenPostDetailsModal = () => {
        if(showMenu) router.push({ pathname: "/(main)/postDetails", params: {postId: post.id}})
    }

    const handleDeletePost = () => {
        Alert.alert("Warning", "Are you sure you want to delete this post?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const res = await deletePost(post.id)
                    if(!res.success){
                        Alert.alert("Error while deleting post", res.message)
                    }
                    router.back()
                } 
            }
        ])
    }
    
    return (
        <View style={showShadow ? shadowStyles : {}} className='border-2 border-slate-100 p-4 rounded-3xl w-full'>
            {/* POST HEADER: USER, TIME AND MENU */}
            <View className='flex flex-row items-center w-full mb-2'>
                {/* AVATAR */}
                <Avatar image={post.user?.image} username={post.user.name} size={40}/>
                {/* NAME AND TIME */}
                <View className='ml-4'>
                    <Text className='text-lg font-semibold text-black-300'>{post.user.name}</Text>
                    <Text className='text-sm text-black-100'>{new Date(post.created_at).toLocaleString()}</Text>
                </View>
                {/* MENU BUTTON */}
                {
                    showMenu
                    ?
                    <TouchableOpacity className='ml-auto' onPress={handleOpenPostDetailsModal}>
                        <Icon name='threeDotsHorizontal' strokeWidth={3}/>
                    </TouchableOpacity>
                    :
                    currentUser.id === post.user.id
                    ?
                    <View className='flex items-center justify-end gap-2 flex-row ml-auto'>
                        <TouchableOpacity>
                            <Icon name='edit'/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePost}>
                            <Icon name='delete' color='#ff2e2e'/>
                        </TouchableOpacity>
                    </View>
                    :
                    ""
                }
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
                    <TouchableOpacity onPress={handleLikeClick}>
                        <Icon name='heart' fill={isLiked ? "#ef4444" : "#fff"} color={isLiked ? '#ef4444' : '#c2c2c2'}/>
                    </TouchableOpacity>
                    <Text className={`${isLiked ? "text-[#ef4444] font-rubik-medium" : "text-black-100 font-rubik-light"} text-sm`}>{likes}</Text>
                </View>

                {/* COMMENT */}
                <View className='flex flex-row gap-1 items-center'>
                    <TouchableOpacity onPress={handleOpenPostDetailsModal}>
                        <Icon name='comment' color={'#c2c2c2'}/>
                    </TouchableOpacity>
                    <Text className='text-black-100 font-rubik-light text-sm'>{Math.max(numberOfComments, post.comments[0]?.count)}</Text>
                </View>

                {/* SHARE */}
                <View className='flex flex-row gap-1 items-center'>
                    <TouchableOpacity onPress={handleShareClick}>
                        <Icon name='share' color={'#c2c2c2'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PostCard
