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
      <div
        className="relative mx-4 bg-white rounded-2xl shadow-lg flex flex-col"
        style={{
          width: "70vw",
          height: "90vh",
          maxWidth: "900px",
          minWidth: "300px",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold focus:outline-none"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        {title && (
          <div className="px-6 pt-6 pb-2 border-b border-gray-100 text-lg font-semibold text-gray-800">
            {title}
          </div>
        )}
        <div
          className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 h-full"
          style={{ height: "calc(90vh - 64px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
