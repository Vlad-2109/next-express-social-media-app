'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import PasswordInput from './PasswordInput';
import LoadingButton from '../Helper/LoadingButton';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { useAppDispatch } from '@/store/hook';
import { setAuthUser } from '@/store/authSlice';

interface FormData {
	email: string;
	password: string;
}

const Login = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formData, setFormData] = useState<FormData>({
		email: '',
		password: '',
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const loginReq = async () =>
			await axios.post(`${BASE_API_URL}/users/login`, formData, {
				withCredentials: true,
			});

		const result = await handleRequest(loginReq, setIsLoading);
		if (result) {
			dispatch(setAuthUser(result.data.data.user));
			toast.success(result.data.message);
			router.push('/');
		}
	};

	return (
		<div className="w-full h-screen overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
				{/* Banner */}
				<div className="lg:col-span-4 h-screen hidden lg:block">
					<Image
						src="/images/signup-bunner.jpg"
						alt="signup"
						width={1000}
						height={1000}
						className="w-full h-full object-cover"
					/>
				</div>
				{/* Form */}
				<div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
					<h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
						Login with <span className="text-rose-600">PhotoFlow</span>
					</h1>
					<form
						onSubmit={handleSubmit}
						className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]"
					>
						<div className="mb-4">
							<label htmlFor="email" className="font-semibold mb-2 block">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Email address"
								className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div className="mb-4">
							<PasswordInput
								label="Password"
								name="password"
								placeholder="Enter password"
								value={formData.password}
								onChange={handleChange}
							/>
							<Link
								href="/auth/forget-password"
								className="mt-2 text-red-600 block font-semibold text-base cursor-pointer text-right"
							>
								Forget Password?
							</Link>
						</div>
						<LoadingButton
							size={'lg'}
							className="w-full mt-3"
							type="submit"
							isLoading={isLoading}
						>
							Login Now
						</LoadingButton>
					</form>
					<h1 className="mt-4 text-lg text-gray-800">
						Don&apos;t have an account?{' '}
						<Link href="/auth/signup">
							<span className="text-blue-800 underline cursor-pointer font-medium">
								Signup here
							</span>
						</Link>
					</h1>
				</div>
			</div>
		</div>
	);
};

export default Login;
