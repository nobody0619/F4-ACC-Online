
export interface Video {
  VideoID: string;
  Title: string;
  Category: string;
  MaterialLink?: string;
  IsFree: "Yes" | "No";
  DurationMin: number;
  // Local UI status
  isUnlocked?: boolean;
  isWatched?: boolean;
  realVideoUrl?: string;
  realMaterialLink?: string;
}

export interface Student {
  StudentID: string;
  ExpiryDate: string;
  WatchedHistory: string[]; // Array of VideoIDs
  LastUsageDate: string;
  UsageCount: number;
  MaxUsage: number;
}

export interface AuthState {
  user: Student | null;
  isAuthenticated: boolean;
}

export interface GASResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
