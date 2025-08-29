import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallback?: React.ReactNode;
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-lg",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
  fallback,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const getInitials = (name: string) => {
    if (!name) return "?";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ${sizeMap[size]} ${className}`}
      data-testid="avatar"
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : fallback ? (
        fallback
      ) : (
        <span className="text-gray-500 font-bold">{getInitials(alt)}</span>
      )}
    </span>
  );
};

export default Avatar;
