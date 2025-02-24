'use client';
import { ChangeEvent, useRef, useState, KeyboardEvent } from 'react';
import { MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import LoadingButton from '../Helper/LoadingButton';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { useAppDispatch } from '@/store/hook';
import { setAuthUser } from '@/store/authSlice';

const Verify = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (
		index: number,
		e: ChangeEvent<HTMLInputElement>
	): void => {
		const { value } = e.target;
		if (/^\d*$/.test(value) && value.length <= 1) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);
		}

		if (value.length === 1 && inputRefs.current[index + 1]) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		e: KeyboardEvent<HTMLInputElement>
	): void => {
		if (
			e.key === 'Backspace' &&
			!inputRefs.current[index]?.value &&
			inputRefs.current[index - 1]
		) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async () => {
		const otpValue = otp.join('');
		const verifyReq = async () =>
			await axios.post(
				`${BASE_API_URL}/users/verify`,
				{ otp: otpValue },
				{ withCredentials: true }
			);

		const result = await handleAuthRequest(verifyReq, setIsLoading);

		if (result) {
			dispatch(setAuthUser(result.data.data.user));
			toast.success(result.data.message);
			router.push('/');
		}
	};

	const handleResendOtp = async () => {
		const resendOtpReq = async () =>
			await axios.post(`${BASE_API_URL}/users/resend-otp`, null, {
				withCredentials: true,
			});

		const result = await handleAuthRequest(resendOtpReq, setIsLoading);

		if (result) {
			toast.success(result.data.message);
		}
	};

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
			<h1 className="text-2xl sm:text-3xl font-bold mb-3">OTP Verification</h1>
			<p className="mb-6 text-sm sm:text-base text-gray-600 font-medium">
				We have sent a code to code@gmail.com
			</p>
			<div className="flex space-x-4">
				{[1, 2, 3, 4, 5, 6].map((_, index) => (
					<input
						type="number"
						key={index}
						maxLength={1}
						className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200 text-lg sm:text-3xl font-bold outline-gray-500 text-center no-spinner"
						value={otp[index] || ''}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onChange={(e) => handleChange(index, e)}
					/>
				))}
			</div>
			<div className="flex items-center mt-4 space-x-2">
				<h1 className="text-sm sm:text-lg font-medium text-gray-700">
					Didn&apos;t Get the otp code?
				</h1>
				<button
					onClick={handleResendOtp}
					className="text-sm sm:text-lg font-medium text-blue-900 underline"
				>
					Resend Code
				</button>
			</div>
			<LoadingButton
				onClick={handleSubmit}
				isLoading={isLoading}
				size={'lg'}
				className="mt-6 w-52"
			>
				Verify
			</LoadingButton>
		</div>
	);
};

export default Verify;
