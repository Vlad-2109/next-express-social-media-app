'use client';

import { useAppSelector } from '@/store/hook';
import { useEffect, useState } from 'react';
import { User } from '../../../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';

const RightSidebar = () => {
	const user = useAppSelector((state) => state.auth.user);
	const router = useRouter();

	const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	console.log('SUGGESTED USER', suggestedUser);

	useEffect(() => {
		const getSuggestedUser = async () => {
			const getSuggestedUserReq = async () =>
				await axios.get(`${BASE_API_URL}/users/suggested-user`, {
					withCredentials: true,
				});

			const result = await handleRequest(getSuggestedUserReq, setIsLoading);

			if (result) setSuggestedUser(result.data.data.users);
		};
		getSuggestedUser();
	}, []);
	return <div>RightSidebar</div>;
};

export default RightSidebar;
