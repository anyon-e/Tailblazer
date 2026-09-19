import type { JSONBinResponse } from "../types/api";
import type { AnimalReport } from "../types/report";

const BASE_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = import.meta.env.VITE_JSONBIN_ID;

export async function getReports(): Promise<AnimalReport[]> {
  const res = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
    headers: { "X-Master-Key": import.meta.env.VITE_JSONBIN_KEY as string },
  });

  if (!res.ok) throw new Error("Failed to fetch reports");

  const data: JSONBinResponse<{ reports: AnimalReport[] }> = await res.json();
  return data.record.reports;
}

export async function saveReports(reports: AnimalReport[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": import.meta.env.VITE_JSONBIN_KEY,
    },
    body: JSON.stringify({ reports }),
  });

  if (!res.ok) throw new Error("Failed to save reports");
}
