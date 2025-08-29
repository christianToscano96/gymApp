import React from "react";

const NoChatSelected = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.963 7.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Selecciona un chat
        </h2>
        <p className="text-muted-foreground text-center">
          Por favor, selecciona una conversación para poder verla aquí.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
