interface CreatePost {
  content: string;
  media: string;
  userId: string;
  authorFullname: string;
  authorUsername: string;
}

interface FormModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle?: String;
  children: React.ReactNode;
}