import Icon from '@/assets/icons'
import CommentItem from '@/components/CommentItem'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/context/AuthContext'
import { createComment, getPostComments } from '@/services/commentService'
import { getPostDetails } from '@/services/postService'
import { IComment, IPost } from '@/types/types'
import { Redirect, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native'

const PostDetails = () => {
    const { user } = useAuth()
    if(!user) return <Redirect href={"/welcome"}/>
    const { postId } = useLocalSearchParams()
    const [post, setPost] = useState<IPost | null>(null)
    const [comments, setComments] = useState<Array<IComment>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)
    const [commentBody, setCommentBody] = useState<string>("")

    const fetchPostDetails = async () => {
        setIsLoading(true)
        const userId = Array.isArray(postId) ? postId[0] : postId
        const res = await getPostDetails(userId)
        if(!res.success){
            Alert.alert("Error while fetching post derails: ", res.message)
            return
        }
        const resComments = await getPostComments(userId)
        if(!resComments.success){
            Alert.alert("Error while fetching post comments: ", resComments.message)
            return
        }
        setPost(res.data as unknown as IPost)
        setComments(resComments.data as unknown as Array<IComment>)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchPostDetails()
    }, [])

    const handleCreateComment = async () => {
        if(post && user && commentBody)
        {
            setIsLoadingComments(true)
            const res = await createComment(post.id, user.id, commentBody)

            if(!res.success){
                Alert.alert("Error while creating comment", res.message)
                return
            }
            setComments([{...res.data, user}, ...comments])
            setCommentBody("")
            setIsLoadingComments(false)
        }
    }

    if(isLoading || !post){
        return (
            <View className='w-full h-full items-center justify-center'>
                <ActivityIndicator size={"large"} color={"#41B287"}/>
            </View>
        )
    }
    return (
        <View className='w-full h-full bg-white '>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* POST CARD */}
                <PostCard 
                    currentUser={user}
                    post={post}
                    showShadow={false}
                    showMenu={false}
                    // numberOfComments={0}
                    numberOfComments={comments.length}
                />

                {/* COMMENT INPUT */}
                <View className='flex flex-row justify-between gap-3 mt-4'>
                    <TextInput 
                        value={commentBody}
                        onChangeText={text => setCommentBody(text)}
                        placeholder='Type comment...'
                        className='flex-1 rounded-2xl border-2 p-6 border-slate-100 text-gray-700 placeholder:text-gray-400'
                    />
                    <TouchableOpacity disabled={isLoadingComments || !commentBody} onPress={handleCreateComment} className='w-16  rounded-2xl bg-emerald-500 items-center justify-center'>
                        {
                            isLoadingComments
                            ?
                            <ActivityIndicator size={'small'} color={"white"}/>
                            :
                            <Icon name='send' color='white' size={24}/>
                        }
                    </TouchableOpacity>
                </View>
                
                {/* ALL COMMENTS LIST */}
                {
                    comments.length === 0
                    ?
                    <Text className='text-center mt-10 font-medium text-black-100'>Be first to leave the comment</Text>
                    :
                    <View className='flex flex-col gap-2 mt-10 w-full'>
                        {
                            comments.map(comment => <CommentItem key={comment.id} comment={comment}/>)
                        }
                    </View>
                }

            </ScrollView>

        </View>
    )
}

export default PostDetails
