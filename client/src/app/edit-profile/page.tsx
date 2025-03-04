'use client';

import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { MenuIcon } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import LeftSidebar from '@/components/Home/LeftSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingButton from '@/components/Helper/LoadingButton';
import PasswordInput from '@/components/Auth/PasswordInput';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '@/components/utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';

const EditProfile = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);

	const [selectedImage, setSelectedImage] = useState<string | null>(
		user?.profilePicture || null
	);
	const [bio, setBio] = useState<string>(user?.bio || '');
	const [currentPassword, setCurrentPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleAvatarClick = () => {
		if (fileInputRef.current) fileInputRef.current.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setSelectedImage(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handleUpdateProfile = async () => {
		const formData = new FormData();
		formData.append('bio', bio);

		if (fileInputRef.current?.files?.[0]) {
			formData.append('profilePicture', fileInputRef.current.files?.[0]);
		}

		const updateProfileReq = async () =>
			await axios.post(`${BASE_API_URL}/users/edit-profile`, formData, {
				withCredentials: true,
			});

		const result = await handleRequest(updateProfileReq, setIsLoading);
		if (result) {
			dispatch(setAuthUser(result.data.data.user));
			toast.success(result.data.message);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = {
			currentPassword,
			newPassword,
			newPasswordConfirm,
		};

		const updatePasswordReq = async () =>
			await axios.post(`${BASE_API_URL}/users/change-password`, data, {
				withCredentials: true,
			});

		const result = await handleRequest(updatePasswordReq, setIsLoading);
		if (result) {
			dispatch(setAuthUser(result.data.data.user));
			toast.success(result.data.message);
		}
	};

	return (
		<div className="flex">
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
				<div className="w-[80%] mx-auto">
					<div className="mt-16 pb-16 border-b-2">
						<div
							onClick={handleAvatarClick}
							className="flex items-center justify-center cursor-pointer"
						>
							<Avatar className="w-[10rem] h-[10rem]">
								<AvatarImage src={selectedImage || ''} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</div>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
						<div className="flex items-center justify-center">
							<LoadingButton
								isLoading={isLoading}
								size="lg"
								className="bg-blue-800 mt-4"
								onClick={handleUpdateProfile}
							>
								Change Photo
							</LoadingButton>
						</div>
					</div>
					<div className="mt-10 border-b-2 pb-10">
						<label htmlFor="bio" className="block text-lg font-bold mb-2">
							Bio
						</label>
						<textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="w-full h-[7rem] bg-gray-200 outline-none p-6 rounded-md"
						></textarea>
						<LoadingButton
							isLoading={isLoading}
							size="lg"
							className="mt-6"
							onClick={handleUpdateProfile}
						>
							Change Bio
						</LoadingButton>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mt-6">
							Change Password
						</h1>
						<form className="mt-8 mb-8" onSubmit={handlePasswordChange}>
							<div className="w-[90%] md:w-[80%] lg:w-[60%]">
								<PasswordInput
									name="currentPassword"
									value={currentPassword}
									label="Current Password"
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
							</div>
							<div className="w-[90%] md:w-[80%] lg:w-[60%] mt-4 mb-4">
								<PasswordInput
									name="newPassword"
									value={newPassword}
									label="New Password"
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</div>
							<div className="w-[90%] md:w-[80%] lg:w-[60%]">
								<PasswordInput
									name="confirmNewPassword"
									value={newPasswordConfirm}
									label="Confirm New Password"
									onChange={(e) => setNewPasswordConfirm(e.target.value)}
								/>
							</div>
							<div className="mt-6">
								<LoadingButton
									isLoading={isLoading}
									type="submit"
									className="bg-red-700"
								>
									Change Password
								</LoadingButton>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
