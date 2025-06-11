// types/index.ts
export interface User {
    id: string; // Supabase auth.users の id と同じ
    nickname: string;
    part: string[];
    region: string;
    experienceYears: number;
    real_name: string;
    bio: string;
  }