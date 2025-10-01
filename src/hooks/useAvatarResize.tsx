import { useState } from "react";

export function useAvatarResize({ maxSize = 300, quality = 0.7 } = {}) {
  const [avatar, setAvatar] = useState<string>("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            setAvatar(dataUrl);
          }
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return { avatar, setAvatar, handleAvatarChange };
}
