'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Loader, MenuIcon } from 'lucide-react';
import { useAppSelector } from '@/store/hook';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '../../../types';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import LeftSidebar from '../Home/LeftSidebar';
import { Button } from '../ui/button';

type Props = { id: string };

const Profile = ({ id }: Props) => {
	const router = useRouter();
	const user = useAppSelector((state) => state.auth.user);

	const [postOrSave, setPostOrSave] = useState<string>('POST');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userProfile, setUserProfile] = useState<User>();

	const isOwnProfile = user?._id === id;
	const isFollowing = user?.following.includes(id);

	console.log('USER:', userProfile);
	console.log('ISOWNPROFILE:', isOwnProfile);

	useEffect(() => {
		if (!user) {
			return router.push('/auth/login');
		}

		const getUser = async () => {
			const getUserReq = async () =>
				await axios.get(`${BASE_API_URL}/users/profile/${id}`);

			const result = await handleRequest(getUserReq, setIsLoading);
			if (result) {
				setUserProfile(result.data.data.user);
			}
		};

		getUser();
	}, [user, router, id]);

	if (isLoading) {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center">
				<Loader className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex mb-20">
			<div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
				<LeftSidebar />
			</div>
			<div className="flex-1 md:ml-[20%] overflow-y-auto">
				<div className="md:hidden">
					<Sheet>
						<SheetTrigger>
							<MenuIcon />
						</SheetTrigger>
						<SheetContent>
							<SheetTitle></SheetTitle>
							<SheetDescription></SheetDescription>
							<LeftSidebar />
						</SheetContent>
					</Sheet>
				</div>
				<div className="w-[90%] sm:w-[80%] mx-auto">
					{/* TOP PROFILE */}
					<div className="mt-16 flex md:flex-row flex-col md:items-center pb-16 border-b-2 md:space-x-20">
						<Avatar className="w-[10rem] h-[10rem] mb-8 md:mb-0">
							<AvatarImage
								src={userProfile?.profilePicture}
								className="h-full w-full rounded-full"
							/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center space-x-8">
								<h1 className="text-2xl font-bold">{userProfile?.username}</h1>
								{isOwnProfile && (
									<Link href="/edit-profile">
										<Button variant="secondary">Edit Profile</Button>
									</Link>
								)}
								{!isOwnProfile && (
									<Button variant={isFollowing ? 'destructive' : 'secondary'}>
										{isFollowing ? 'Unfollow' : 'Follow'}
									</Button>
								)}
							</div>
							<div className="flex items-center space-x-8 mt-6 mb-6">
								<div>
									<span className="font-bold">{userProfile?.posts.length}</span>
									<span> Posts</span>
								</div>
								<div>
									<span className="font-bold">{userProfile?.followers.length}</span>
									<span> Followers</span>
                                </div>
                                <div>
									<span className="font-bold">{userProfile?.following.length}</span>
									<span> Following</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
