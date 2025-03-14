'use client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { Loader, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import Feed from './Feed';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';

const Home = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getAuthUser = async () => {
            const getAuthUserReq = async () =>
                await axios.get(`${BASE_API_URL}/users/me`, { withCredentials: true });
            const result = await handleRequest(getAuthUserReq, setIsLoading);

            if (result) {
                dispatch(setAuthUser(result.data.data.user));
            }
        };

        getAuthUser();
    }, [dispatch]);

    useEffect(() => {
        if (!user) redirect('/auth/login');
    }, [user]);
	
	if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }

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
                <Feed />
            </div>
            <div className="w-[30%] pt-8 px-6 lg:block hidden">
                <RightSidebar />
            </div>
        </div>
    );
};

export default Home;
