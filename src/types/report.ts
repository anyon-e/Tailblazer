export enum AnimalType {
  Dog = "DOG",
  Cat = "CAT",
  Bird = "BIRD",
  Rabbit = "RABBIT",
  Other = "OTHER",
}

export enum ReportStatus {
  lost = "lost",
  found = "found",
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface AnimalReport {
  id: string;
  name: string;
  type: AnimalType;
  description: string;
  contact: string;
  imageUrl: string;
  location: Location;
  status: ReportStatus;
  passwordHash: string;
  createdAt: string;
}

export interface ReportDraft {
  name: string;
  type: AnimalType;
  description: string;
  contact: string;
  imageFile: File | null;
  location: Location | null;
  password: string;
}
