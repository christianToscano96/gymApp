import React from "react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full h-full rounded-none max-w-full min-w-0 mx-0 sm:mx-4 sm:rounded-2xl sm:w-[40vw] sm:h-[90vh] sm:max-w-[900px] sm:min-w-[300px] bg-white shadow-lg flex flex-col overflow-x-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-3xl font-bold focus:outline-none z-10"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        {title && (
          <div className="px-4 pt-6 pb-2 border-b border-gray-100 text-lg font-semibold text-gray-800 sm:px-6">
            {title}
          </div>
        )}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full max-w-full mx-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
