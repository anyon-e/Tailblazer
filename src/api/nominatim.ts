export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
  );

  if (!res.ok) throw new Error("Failed to fetch address");

  const data = await res.json();
  return data.display_name;
}
