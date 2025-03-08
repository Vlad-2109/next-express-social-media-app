'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { setPost } from '@/store/postSlice';

const Feed = () => {
	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.auth.user);
	const posts = useAppSelector((state) => state.post.posts);

	const [comment, setComment] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const getAllPosts = async () => {
			const getAllPostsReq = async () =>
				await axios.get(`${BASE_API_URL}/posts/all`);

			const result = await handleRequest(getAllPostsReq, setIsLoading);
			if (result) {
				dispatch(setPost(result.data.data.posts));
			}
		};
		getAllPosts();
	}, [dispatch]);

	return <div>Feed</div>;
};

export default Feed;
