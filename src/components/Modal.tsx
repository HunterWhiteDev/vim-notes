import { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from "react";

interface ModalProps {
  content: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({ content, open, setOpen }: ModalProps) {
  const handleClose = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setOpen(false);
    }
  };

  if (open)
    return (
      <div className="fixed h-full w-full bg-black/50" onClick={handleClose}>
        <div className="w-[75%] bg-gray-700">{content}</div>
      </div>
    );
}
