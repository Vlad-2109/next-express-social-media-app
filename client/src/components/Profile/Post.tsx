import { User } from '../../../types';

type Props = {
	userProfile: User | undefined;
};

const Post = ({ userProfile }: Props) => {
	return <div>Post</div>;
};

export default Post;
