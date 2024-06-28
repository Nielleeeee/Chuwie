interface PostData {
  author_fullname: string;
  author_username: string;
  content: string;
  id: string;
  media: string[];
  user_id: string;
  xata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

interface CreatePost {
  content: string;
  media: Media;
  userId?: string;
}

interface Media {
  image: file[];
  video: file[];
}

interface CombinedMedia {
  data: Buffer;
  mimetype: string;
  filename: string;
}

interface UpdatePost {
  content: string;
  media: Media;
  toDelete?: string[];
}

interface FormModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle?: String;
  children: React.ReactNode;
  onRequestClose?: () => void;
}

interface DeletePostParams {
  postId: string;
  postMedia?: string[];
}

interface MediaItem {
  url: string;
  type: string;
  fileName: string;
  timestamp: string;
}

interface UpdatePostRoute {
  content: string;
  media?: any;
  post_id: string;
  toDelete?: string[];
  currentMedia: MediaItem[];
}

interface UserInfo {
  clerk_id: string | null | undefined;
  email: string | null | undefined;
  username: string | null | undefined;
  first_name: string | null | undefined;
  last_name: string | null | undefined;
  profile_picture: string | null | undefined;
  user_id?: string | null | undefined;
}

interface UserInfoProps {
  clerk_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  user_id?: string;
}

interface LikePostParams {
  post_id: string;
}
