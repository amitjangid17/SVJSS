import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/pages/HomePage';
import { MembersPage } from './components/pages/MembersPage';
import { MemberDetailPage } from './components/pages/MemberDetailPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { AdminLoginPage } from './components/pages/AdminLoginPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { AddMemberPage } from './components/pages/AddMemberPage';
import { UpdateRequestPage } from './components/pages/UpdateRequestPage';
import { EditMemberPage } from './components/pages/EditMemberPage';

function AppContent() {
  const { isAdmin, logout } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const handleNavigation = (page: string, memberId?: string) => {
    setCurrentPage(page);
    if (memberId) {
      setSelectedMemberId(memberId);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'members':
        return <MembersPage onNavigate={handleNavigation} />;
      case 'member-detail':
        return (
          <MemberDetailPage 
            memberId={selectedMemberId} 
            onNavigate={handleNavigation} 
          />
        );
      case 'edit-member':
        return (
          <EditMemberPage 
            memberId={selectedMemberId} 
            onNavigate={handleNavigation} 
          />
        );
      case 'register':
        return <RegisterPage />;
      case 'update-request':
        return (
          <UpdateRequestPage 
            memberId={selectedMemberId || undefined}
            onNavigate={handleNavigation} 
          />
        );
      case 'admin-login':
        return <AdminLoginPage onNavigate={handleNavigation} />;
      case 'admin':
        return isAdmin ? (
          <AdminDashboardPage onNavigate={handleNavigation} />
        ) : (
          <AdminLoginPage onNavigate={handleNavigation} />
        );
      case 'add-member':
        return <AddMemberPage onNavigate={handleNavigation} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={handleNavigation}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}