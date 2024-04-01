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
  media: any[];
  userId?: string;
  authorFullname?: string;
  authorUsername?: string;
}

interface UpdatePost {
  content: string;
  media: any[];
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
  secure_url?: string;
  public_id?: string;
}

interface UpdatePostRoute {
  content: string;
  media?: any;
  post_id: string;
  toDelete?: string[];
  currentMedia: MediaItem[];
}