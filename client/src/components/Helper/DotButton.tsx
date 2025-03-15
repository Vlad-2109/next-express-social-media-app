'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hook';
import { Post, User } from '../../../types';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Ellipsis } from 'lucide-react';
import { Button } from '../ui/button';
import { useFollowUnfollow } from '../hooks/use-auth';

type Props = {
  post: Post | null;
  user: User | null;
};

const DotButton = ({ post, user }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id && Array.isArray(user?.following) ? user?.following.includes(post?.user?._id) : false;

  const dispatch = useAppDispatch();

  const handleDeletePost = async () => await {};

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-8 h-8 text-black" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
            {!isOwnPost && (
              <div>
                <Button
                  onClick={() => { if (post?.user?._id) handleFollowUnfollow(post?.user?._id) }}
                  variant={isFollowing ? 'destructive' : 'secondary'}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </div>
            )}
            <Link href={`/profile/${post?.user?._id}`}>
              <Button variant="secondary">About This Account</Button>
            </Link>
            {isOwnPost && (
              <Button variant="destructive" onClick={handleDeletePost}>
                Delete Post
              </Button>
            )}
            <DialogClose>Cancel</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
