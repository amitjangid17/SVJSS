import React, { createContext, useContext, useState } from 'react';
import { Member, MembershipRequest, UpdateRequest, MemberUpdateLog } from '../types/member';

interface AppContextType {
  // Authentication
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Members
  members: Member[];
  getMemberById: (id: string) => Member | undefined;
  updateMember: (id: string, updatedData: Partial<Member>, reason?: string) => void;
  
  // Membership Requests
  membershipRequests: MembershipRequest[];
  submitMembershipRequest: (request: Omit<MembershipRequest, 'id' | 'requestDate' | 'status'>) => void;
  approveMembershipRequest: (id: string, memberType: 'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior') => void;
  rejectMembershipRequest: (id: string) => void;
  
  // Update Requests
  updateRequests: UpdateRequest[];
  submitUpdateRequest: (request: Omit<UpdateRequest, 'id' | 'requestDate' | 'status'>) => void;
  approveUpdateRequest: (id: string) => void;
  rejectUpdateRequest: (id: string, adminNotes?: string) => void;
  
  // Update Logs
  updateLogs: MemberUpdateLog[];
  
  // Admin functions
  deleteMember: (id: string) => void;
  updateMemberStatus: (id: string, status: 'active' | 'inactive') => void;
  addMemberDirectly: (memberData: Omit<Member, 'id' | 'joinDate' | 'status' | 'memberId'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to generate member ID
const generateMemberId = (joinYear: number, sequence: number): string => {
  return `JS-${joinYear}-${sequence.toString().padStart(3, '0')}`;
};

// Mock data
const initialMembers: Member[] = [
  {
    id: '1',
    memberId: 'JS-2020-001',
    memberType: 'Life',
    name: 'Rajesh Jangid',
    email: 'rajesh.jangid@email.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    occupation: 'Software Engineer',
    dateOfBirth: '1985-03-15',
    status: 'active',
    joinDate: '2020-01-15',
    bio: 'Passionate about technology and community service. Working in fintech sector.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rajeshjangid',
      facebook: 'https://facebook.com/rajesh.jangid'
    }
  },
  {
    id: '2',
    memberId: 'JS-2019-002',
    memberType: 'Regular',
    name: 'Priya Jangid',
    email: 'priya.jangid@email.com',
    phone: '+91 87654 32109',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    occupation: 'Doctor',
    dateOfBirth: '1988-07-22',
    status: 'active',
    joinDate: '2019-06-10',
    bio: 'Medical practitioner specializing in pediatrics. Active in community health initiatives.'
  },
  {
    id: '3',
    memberId: 'JS-2021-003',
    memberType: 'Regular',
    name: 'Amit Jangid',
    email: 'amit.jangid@email.com',
    phone: '+1 555 123 4567',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    occupation: 'Business Analyst',
    dateOfBirth: '1990-11-08',
    status: 'active',
    joinDate: '2021-03-20',
    bio: 'Working in Silicon Valley, passionate about connecting Indian diaspora.'
  },
  {
    id: '4',
    memberId: 'JS-2018-004',
    memberType: 'Senior',
    name: 'Sunita Jangid',
    email: 'sunita.jangid@email.com',
    phone: '+91 98765 12345',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    occupation: 'Teacher',
    dateOfBirth: '1982-12-03',
    status: 'active',
    joinDate: '2018-09-12',
    bio: 'Dedicated educator working to preserve cultural values in young minds.'
  },
  {
    id: '5',
    memberId: 'JS-2020-005',
    memberType: 'Life',
    name: 'Vikram Jangid',
    email: 'vikram.jangid@email.com',
    phone: '+44 20 7946 0958',
    city: 'London',
    state: 'England',
    country: 'UK',
    occupation: 'Financial Consultant',
    dateOfBirth: '1987-04-18',
    status: 'active',
    joinDate: '2020-11-05',
    bio: 'Working in London financial district, organizing cultural events for Indian community.'
  }
];

const initialRequests: MembershipRequest[] = [
  {
    id: '1',
    name: 'Neha Jangid',
    email: 'neha.jangid@email.com',
    phone: '+91 99999 88888',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    occupation: 'Marketing Manager',
    dateOfBirth: '1992-06-15',
    requestDate: '2024-06-20',
    status: 'pending',
    message: 'Looking forward to connecting with the community and contributing to cultural activities.'
  },
  {
    id: '2',
    name: 'Rohit Jangid',
    email: 'rohit.jangid@email.com',
    phone: '+1 617 555 0123',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'USA',
    occupation: 'Research Scientist',
    dateOfBirth: '1989-09-30',
    requestDate: '2024-06-22',
    status: 'pending',
    message: 'Recently moved to Boston and eager to connect with fellow community members.'
  }
];

const initialUpdateRequests: UpdateRequest[] = [
  {
    id: '1',
    memberId: 'JS-2020-001',
    memberName: 'Rajesh Jangid',
    requestDate: '2024-06-23',
    status: 'pending',
    requestedChanges: {
      phone: '+91 98765 99999',
      city: 'Pune',
      occupation: 'Senior Software Engineer'
    },
    reason: 'Recently moved to Pune and got promoted to Senior position.'
  }
];

// Sample update logs for demonstration
const initialUpdateLogs: MemberUpdateLog[] = [
  {
    id: '1',
    memberId: 'JS-2020-001',
    memberName: 'Rajesh Jangid',
    adminAction: 'admin@jangidsamaj.org',
    changeType: 'direct_edit',
    previousData: { phone: '+91 98765 43210', city: 'Mumbai' },
    newData: { phone: '+91 98765 99999', city: 'Pune' },
    timestamp: '2024-06-20T10:30:00Z',
    reason: 'Member relocated and updated contact information'
  },
  {
    id: '2',
    memberId: 'JS-2019-002',
    memberName: 'Priya Jangid',
    adminAction: 'admin@jangidsamaj.org',
    changeType: 'status_change',
    previousData: { status: 'active' },
    newData: { status: 'inactive' },
    timestamp: '2024-06-18T14:15:00Z',
    reason: 'Member requested temporary deactivation'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(initialRequests);
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>(initialUpdateRequests);
  const [updateLogs, setUpdateLogs] = useState<MemberUpdateLog[]>(initialUpdateLogs);

  // Helper function to create update log entry
  const createUpdateLog = (
    member: Member,
    changeType: MemberUpdateLog['changeType'],
    previousData: Partial<Member>,
    newData: Partial<Member>,
    reason?: string,
    requestId?: string
  ) => {
    const log: MemberUpdateLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      memberId: member.memberId,
      memberName: member.name,
      adminAction: isAdmin ? 'admin@jangidsamaj.org' : 'System',
      changeType,
      previousData,
      newData,
      timestamp: new Date().toISOString(),
      reason,
      requestId
    };
    
    setUpdateLogs(prev => [log, ...prev]);
  };

  const login = (email: string, password: string): boolean => {
    // Mock admin credentials
    if (email === 'admin@jangidsamaj.org' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const getMemberById = (id: string): Member | undefined => {
    return members.find(member => member.id === id);
  };

  const updateMember = (id: string, updatedData: Partial<Member>, reason?: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    // Extract only the fields that are actually changing
    const previousData: Partial<Member> = {};
    const newData: Partial<Member> = {};
    
    Object.entries(updatedData).forEach(([key, value]) => {
      const memberKey = key as keyof Member;
      if (member[memberKey] !== value) {
        previousData[memberKey] = member[memberKey] as any;
        newData[memberKey] = value as any;
      }
    });

    // Only create log if there are actual changes
    if (Object.keys(newData).length > 0) {
      createUpdateLog(member, 'direct_edit', previousData, newData, reason);
    }

    setMembers(prev => 
      prev.map(m => 
        m.id === id 
          ? { ...m, ...updatedData }
          : m
      )
    );
  };

  const submitMembershipRequest = (request: Omit<MembershipRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: MembershipRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setMembershipRequests(prev => [...prev, newRequest]);
  };

  const approveMembershipRequest = (id: string, memberType: 'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior') => {
    const request = membershipRequests.find(req => req.id === id);
    if (request) {
      // Generate member ID
      const currentYear = new Date().getFullYear();
      const existingMembersThisYear = members.filter(m => 
        m.joinDate.startsWith(currentYear.toString())
      ).length;
      const newMemberId = generateMemberId(currentYear, existingMembersThisYear + 1);
      
      // Add to members with admin-selected member type
      const newMember: Member = {
        id: Date.now().toString(),
        memberId: newMemberId,
        memberType: memberType,
        name: request.name,
        email: request.email,
        phone: request.phone,
        city: request.city,
        state: request.state,
        country: request.country,
        occupation: request.occupation,
        dateOfBirth: request.dateOfBirth,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        bio: request.message
      };
      
      setMembers(prev => [...prev, newMember]);
      
      // Create log for new member addition
      createUpdateLog(
        newMember,
        'admin_added',
        {},
        { ...newMember },
        `Approved membership request with ${memberType} membership type`,
        id
      );
      
      // Update request status
      setMembershipRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: 'approved' } : req)
      );
    }
  };

  const rejectMembershipRequest = (id: string) => {
    setMembershipRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
    );
  };

  const submitUpdateRequest = (request: Omit<UpdateRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: UpdateRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setUpdateRequests(prev => [...prev, newRequest]);
  };

  const approveUpdateRequest = (id: string) => {
    const request = updateRequests.find(req => req.id === id);
    if (request) {
      // Find the member and update their details
      const member = members.find(m => m.memberId === request.memberId);
      if (member) {
        // Create log entry for approved request
        createUpdateLog(
          member,
          'approved_request',
          { ...member },
          { ...member, ...request.requestedChanges },
          request.reason,
          id
        );

        setMembers(prev => 
          prev.map(m => 
            m.memberId === request.memberId 
              ? { ...m, ...request.requestedChanges }
              : m
          )
        );
      }
      
      // Update request status
      setUpdateRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: 'approved' } : req)
      );
    }
  };

  const rejectUpdateRequest = (id: string, adminNotes?: string) => {
    setUpdateRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, status: 'rejected', adminNotes } 
          : req
      )
    );
  };

  const deleteMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (member) {
      // Create log entry for deletion
      createUpdateLog(
        member,
        'member_deleted',
        { ...member },
        {},
        'Member account deleted by admin'
      );
    }
    
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateMemberStatus = (id: string, status: 'active' | 'inactive') => {
    const member = members.find(m => m.id === id);
    if (member) {
      // Create log entry for status change
      createUpdateLog(
        member,
        'status_change',
        { status: member.status },
        { status },
        `Status changed from ${member.status} to ${status}`
      );
    }

    setMembers(prev => 
      prev.map(member => member.id === id ? { ...member, status } : member)
    );
  };

  const addMemberDirectly = (memberData: Omit<Member, 'id' | 'joinDate' | 'status' | 'memberId'>) => {
    // Generate member ID
    const currentYear = new Date().getFullYear();
    const existingMembersThisYear = members.filter(m => 
      m.joinDate.startsWith(currentYear.toString())
    ).length;
    const newMemberId = generateMemberId(currentYear, existingMembersThisYear + 1);
    
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
      memberId: newMemberId,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    setMembers(prev => [...prev, newMember]);

    // Create log entry for direct member addition
    createUpdateLog(
      newMember,
      'admin_added',
      {},
      { ...newMember },
      'Member added directly by admin'
    );
  };

  return (
    <AppContext.Provider value={{
      isAdmin,
      login,
      logout,
      members,
      getMemberById,
      updateMember,
      membershipRequests,
      submitMembershipRequest,
      approveMembershipRequest,
      rejectMembershipRequest,
      updateRequests,
      submitUpdateRequest,
      approveUpdateRequest,
      rejectUpdateRequest,
      updateLogs,
      deleteMember,
      updateMemberStatus,
      addMemberDirectly
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}