'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Post, User } from '../../../types';
import { useAppDispatch } from '@/store/hook';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import DotButton from './DotButton';

type Props = {
    user: User | null;
    post: Post | null;
};

const Comment = ({ user, post }: Props) => {
    const dispatch = useAppDispatch();

    const [comment, setComment] = useState<string>('');

    const addCommentHandler = async (id: string) => {};
    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <p className="mt-2 text-sm font-semibold">
                        View All {post?.comments.length} Comments
                    </p>
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-0 gap-0 flex flex-col">
                    <DialogTitle></DialogTitle>
                    <div className="flex flex-1">
                        <div className="sm:w-1/2 hidden max-h-[80vh] sm:block">
                            <Image
                                src={`${post?.image?.url}`}
                                alt="Post Image"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 flex flex-col justify-between">
                            <div className="mt-4 flex items-center justify-between p-4">
                                <div className="flex gap-3 items-center">
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{user?.username}</p>
                                    </div>
                                </div>
                                <DotButton user={user} post={post} />
                            </div>
                            <hr />
                            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                                {post?.comments.map(comment => (
                                    <div key={comment._id} className="flex mb-4 gap-3 items-center">
                                        <Avatar>
                                            <AvatarImage src={comment?.user?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-bold">
                                                {comment?.user?.username}
                                            </p>
                                            <p className="text-sm font-normal">{comment?.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={comment}
                                        placeholder="Add a comment..."
                                        onChange={e => setComment(e.target.value)}
                                        className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                                    />
                                    <Button variant="outline">Send</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Comment;
