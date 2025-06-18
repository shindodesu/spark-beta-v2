// types/index.ts
export interface User {
    id: string; // Supabase auth.users の id と同じ
    email : string;
    name: string;
    university : string;
    part: string[];
    region: string;
    experience_years: number;
    real_name: string;
    bio: string;
  }

