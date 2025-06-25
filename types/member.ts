export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  dateOfBirth: string;
  profileImage?: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface MembershipRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  dateOfBirth: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}