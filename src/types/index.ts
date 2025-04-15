
export interface User {
  id: string;
  username: string;
  isAdmin?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  username: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  bookedUsers: User[];
  isFull: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
