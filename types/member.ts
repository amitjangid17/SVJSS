export interface Member {
  id: string;
  memberId: string; // Display format like "JS-2024-001"
  memberType: 'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior';
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
  // memberType is NOT included here - admin decides during approval
}

export interface UpdateRequest {
  id: string;
  memberId: string;
  memberName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedChanges: Partial<Member>;
  reason?: string;
  adminNotes?: string;
}

export interface MemberUpdateLog {
  id: string;
  memberId: string;
  memberName: string;
  adminAction: string; // Who performed the action (admin email or "System")
  changeType: 'direct_edit' | 'approved_request' | 'status_change' | 'admin_added' | 'member_deleted';
  previousData: Partial<Member>;
  newData: Partial<Member>;
  timestamp: string;
  reason?: string;
  requestId?: string; // If this was from an approved update request
}