// src/types/index.ts
export type User = {
  nim: string;
  name: string;
  prodi: string | null;
  fakultas: string | null;
  angkatan: string | null;
};

export type Registration = {
  id: string;
  type: string;
  method: string;
  status: string;
  photoUrl: string | null;
  bookingDate: string | null;
  createdAt: string;
  user: User;
};