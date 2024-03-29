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
  media: [];
  userId?: string;
  authorFullname?: string;
  authorUsername?: string;
  toDelete?: [];
}

interface FormModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle?: String;
  children: React.ReactNode;
}

interface DeletePostParams {
  postId: string;
  postMedia?: string[];
}

interface MediaItem {
  secure_url?: string;
  public_id?: string;
}