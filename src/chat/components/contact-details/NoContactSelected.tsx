const NoContactSelected = () => {
  return (
    <div className="mt-10 p-4 flex justify-center">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-md shadow-md max-w-md w-full flex items-center gap-3">
        <svg
          className="w-6 h-6 text-yellow-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01"
          />
        </svg>
        <span className="text-lg font-medium">
          Por favor, selecciona un cliente para iniciar la conversación.
        </span>
      </div>
    </div>
  );
};

export default NoContactSelected;
