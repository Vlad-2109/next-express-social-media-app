'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import PasswordInput from './PasswordInput';
import LoadingButton from '../Helper/LoadingButton';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/store/hook';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';

const PasswordReset = () => {
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const [otp, setOtp] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleSubmit = async () => {
		if (!otp || !password || !passwordConfirm) {
			return;
		}

		const data = { email, otp, password, passwordConfirm };

		const resetPassReq = async () =>
			await axios.post(`${BASE_API_URL}/users/reset-password`, data, {
				withCredentials: true,
			});

		const result = await handleRequest(resetPassReq, setIsLoading);

		if (result) {
			dispatch(setAuthUser(result.data.data.user));
			toast.success(result.data.message);
			router.push('/auth/login');
		}
	};

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<h1 className="text-2xl sm:text-3xl font-bold mb-3">
				Reset your password
			</h1>
			<p className="mb-6 text-sm sm:text-base text-center text-gray-600 font-medium">
				Enter your OTP and new password to reset your password
			</p>
			<input
				type="number"
				placeholder="Enter Otp"
				className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto px-6 py-3 bg-gray-300 rounded-lg no-spinner outline-none"
				value={otp}
				onChange={(e) => setOtp(e.target.value)}
			/>
			<div className="mb-4 mt-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
				<PasswordInput
					name="password"
					placeholder="Enter new password"
					inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
				<PasswordInput
					name="passwordconfirm"
					placeholder="Confirm new password"
					inputClassName="px-6 py-3 bg-gray-300 rounded-lg outline-none"
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
				/>
			</div>
			<div className="flex items-center space-x-4 mt-6">
				<LoadingButton onClick={handleSubmit} isLoading={isLoading}>
					Change Password
				</LoadingButton>
				<Button variant={'ghost'}>
					<Link href={'/auth/forget=password'}>Go Back</Link>
				</Button>
			</div>
		</div>
	);
};

export default PasswordReset;
