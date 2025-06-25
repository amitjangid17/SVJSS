import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye,
  UserMinus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AdminDashboardPageProps {
  onNavigate: (page: string, memberId?: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { 
    members, 
    membershipRequests, 
    approveMembershipRequest, 
    rejectMembershipRequest,
    deleteMember,
    updateMemberStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    pendingRequests: membershipRequests.filter(r => r.status === 'pending').length,
    inactiveMembers: members.filter(m => m.status === 'inactive').length
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleApprove = (requestId: string) => {
    approveMembershipRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectMembershipRequest(requestId);
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      deleteMember(memberId);
    }
  };

  const handleToggleMemberStatus = (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateMemberStatus(memberId, newStatus);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage members and membership requests
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({stats.pendingRequests})
            </TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stats.totalMembers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Active Members</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{stats.activeMembers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-yellow-600">{stats.pendingRequests}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Inactive Members</CardTitle>
                  <UserX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600">{stats.inactiveMembers}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Members</CardTitle>
                  <CardDescription>Latest members who joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members
                      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                      .slice(0, 5)
                      .map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.city}</p>
                          </div>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>New membership applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {membershipRequests
                      .filter(req => req.status === 'pending')
                      .slice(0, 5)
                      .map((request) => (
                        <div key={request.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">{request.name}</p>
                            <p className="text-xs text-muted-foreground">{request.city}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleApprove(request.id)}>
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {membershipRequests.filter(req => req.status === 'pending').length === 0 && (
                      <p className="text-muted-foreground text-sm">No pending requests</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="grid gap-6">
              {membershipRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.name}</CardTitle>
                        <CardDescription>{request.email}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          request.status === 'pending' ? 'default' : 
                          request.status === 'approved' ? 'secondary' : 'destructive'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{request.city}, {request.state}, {request.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p>{request.occupation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{request.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Request Date</p>
                        <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {request.message && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Message</p>
                        <p className="text-sm bg-muted p-3 rounded">{request.message}</p>
                      </div>
                    )}
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button onClick={() => handleApprove(request.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {membershipRequests.length === 0 && (
                <Alert>
                  <AlertDescription>No membership requests found.</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3>{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.occupation} • {member.city}, {member.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigate('member-detail', member.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Alert>
              <AlertDescription>
                Use caution when managing member accounts. These actions cannot be undone.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3>{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleMemberStatus(member.id, member.status)}
                        >
                          {member.status === 'active' ? (
                            <>
                              <UserMinus className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}