import React from "react";

interface SearchProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      />
    </div>
  );
};
