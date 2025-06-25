import React, { createContext, useContext, useState } from 'react';
import { Member, MembershipRequest } from '../types/member';

interface AppContextType {
  // Authentication
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Members
  members: Member[];
  getMemberById: (id: string) => Member | undefined;
  
  // Membership Requests
  membershipRequests: MembershipRequest[];
  submitMembershipRequest: (request: Omit<MembershipRequest, 'id' | 'requestDate' | 'status'>) => void;
  approveMembershipRequest: (id: string) => void;
  rejectMembershipRequest: (id: string) => void;
  
  // Admin functions
  deleteMember: (id: string) => void;
  updateMemberStatus: (id: string, status: 'active' | 'inactive') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const initialMembers: Member[] = [
  {
    id: '1',
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(initialRequests);

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

  const submitMembershipRequest = (request: Omit<MembershipRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: MembershipRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setMembershipRequests(prev => [...prev, newRequest]);
  };

  const approveMembershipRequest = (id: string) => {
    const request = membershipRequests.find(req => req.id === id);
    if (request) {
      // Add to members
      const newMember: Member = {
        id: Date.now().toString(),
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

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateMemberStatus = (id: string, status: 'active' | 'inactive') => {
    setMembers(prev => 
      prev.map(member => member.id === id ? { ...member, status } : member)
    );
  };

  return (
    <AppContext.Provider value={{
      isAdmin,
      login,
      logout,
      members,
      getMemberById,
      membershipRequests,
      submitMembershipRequest,
      approveMembershipRequest,
      rejectMembershipRequest,
      deleteMember,
      updateMemberStatus
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