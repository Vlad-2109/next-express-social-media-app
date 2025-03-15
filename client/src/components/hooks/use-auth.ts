import axios from 'axios';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hook';
import { BASE_API_URL } from '../../../server';
import { handleRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';

export const useFollowUnfollow = () => {
    const dispatch = useAppDispatch();

    const handleFollowUnfollow = async (userId: string) => {
        const followUnfollowReq = async () =>
            await axios.post(
                `${BASE_API_URL}/users/follow-unfollow/${userId}`,
                {},
                { withCredentials: true }
            );

        const result = await handleRequest(followUnfollowReq);
        if (result?.data.status === 'success') {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
    };

    return { handleFollowUnfollow };
};
