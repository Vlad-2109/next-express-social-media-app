'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { BookmarkIcon, HeartIcon, Loader, MessageCircle, SendIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { setPost } from '@/store/postSlice';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import DotButton from '../Helper/DotButton';
import Comment from '../Helper/Comment';

const Feed = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.auth.user);
    const posts = useAppSelector(state => state.post.posts);

    const [comment, setComment] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    console.log('POSTS', posts);

    useEffect(() => {
        const getAllPosts = async () => {
            const getAllPostsReq = async () => await axios.get(`${BASE_API_URL}/posts/all`);

            const result = await handleRequest(getAllPostsReq, setIsLoading);
            if (result) {
                dispatch(setPost(result.data.data.posts));
            }
        };
        getAllPosts();
    }, [dispatch]);

    const handleLikeDislike = async (id: string) => {};
    const handleSaveUnsave = async (id: string) => {};
    const handleComment = async (id: string) => {};

    // handle Loading state
    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (posts.length < 1) {
        return <div className="text-3xl m-8 text-center capitalize font-bold">No Post To Show</div>;
    }

    return (
        <div className="mt-10 mb-10 w-[70%] mx-auto">
            {/* Main Post */}
            {posts.map(post => (
                <div key={post._id} className="mt-8">
                    <div className="flex items-center justify-between">
                        {/* User Info */}
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-9 h-9">
                                <AvatarImage
                                    src={post.user?.profilePicture}
                                    className="h-full w-full"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>{post.user?.username}</h1>
                        </div>
                        <DotButton post={post} user={user} />
                    </div>
                    {/* Image */}
                    <div className="mt-2">
                        <Image
                            src={`${post.image?.url}`}
                            alt="Post"
                            width={400}
                            height={400}
                            className="w-full"
                        />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <HeartIcon className="cursor-pointer" />
                            <MessageCircle className="cursor-pointer" />
                            <SendIcon className="cursor-pointer" />
                        </div>
                        <BookmarkIcon className="cursor-pointer" />
                    </div>
                    <h1 className="mt-2 text-sm font-semibold">{post.likes.length} likes</h1>
                    <p className="mt-2 font-medium">{post.caption}</p>
                    <Comment user={user} post={post} />
                    <div className="mt-2 flex items-center">
                        <input
                            type="text"
                            placeholder="Add a Comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="flex-1 placeholder:text-gray-800 outline-none"
                        />
                        <p
                            role="button"
                            className="text-sm font-semibold text-blue-700 cursor-pointer"
                            onClick={() => handleComment(post._id)}
                        >
                            Post
                        </p>
                    </div>
                    <div className="pb-6 border-b-2"></div>
                </div>
            ))}
        </div>
    );
};

export default Feed;
