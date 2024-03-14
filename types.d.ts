interface PostData {
  author_fullname: string;
  author_username: string | null;
  content: string;
  id: string;
  media: string[];
  user_id: string | null;
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
}

interface FormModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle?: String;
  children: React.ReactNode;
}
