import type { ImgBBResponse } from "../types/api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data: ImgBBResponse = await res.json();
  return data.data.url;
}
