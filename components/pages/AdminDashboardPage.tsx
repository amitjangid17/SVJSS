import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye,
  UserMinus,
  UserPlus,
  Edit,
  AlertTriangle,
  History,
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AdminDashboardPageProps {
  onNavigate: (page: string, memberId?: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { 
    members, 
    membershipRequests, 
    updateRequests,
    updateLogs,
    approveMembershipRequest, 
    rejectMembershipRequest,
    approveUpdateRequest,
    rejectUpdateRequest,
    deleteMember,
    updateMemberStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUpdateRequest, setSelectedUpdateRequest] = useState<any>(null);
  const [selectedMembershipRequest, setSelectedMembershipRequest] = useState<any>(null);
  const [selectedMemberType, setSelectedMemberType] = useState<'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior'>('Regular');
  const [rejectionReason, setRejectionReason] = useState('');
  const [expandedMemberLogs, setExpandedMemberLogs] = useState<Set<string>>(new Set());

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    pendingRequests: membershipRequests.filter(r => r.status === 'pending').length,
    pendingUpdates: updateRequests.filter(r => r.status === 'pending').length,
    inactiveMembers: members.filter(m => m.status === 'inactive').length,
    totalUpdates: updateLogs.length
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleApprove = (requestId: string, memberType: 'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior') => {
    approveMembershipRequest(requestId, memberType);
    setSelectedMembershipRequest(null);
    setSelectedMemberType('Regular');
  };

  const handleReject = (requestId: string) => {
    rejectMembershipRequest(requestId);
  };

  const handleApproveUpdate = (requestId: string) => {
    approveUpdateRequest(requestId);
  };

  const handleRejectUpdate = (requestId: string, reason?: string) => {
    rejectUpdateRequest(requestId, reason);
    setSelectedUpdateRequest(null);
    setRejectionReason('');
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

  const toggleMemberLogExpansion = (memberId: string) => {
    const newExpanded = new Set(expandedMemberLogs);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMemberLogs(newExpanded);
  };

  const getMemberUpdateLogs = (memberId: string) => {
    return updateLogs.filter(log => log.memberId === memberId);
  };

  const renderChanges = (originalData: any, changes: any) => {
    return Object.entries(changes).map(([key, value]) => (
      <div key={key} className="mb-2">
        <span className="font-medium">{key}:</span>
        <div className="text-sm">
          <span className="text-red-600 line-through">{JSON.stringify(originalData[key])}</span>
          {' → '}
          <span className="text-green-600">{JSON.stringify(value)}</span>
        </div>
      </div>
    ));
  };

  const renderLogChanges = (previousData: any, newData: any) => {
    const changes = Object.keys({ ...previousData, ...newData });
    return changes.map(key => {
      const oldValue = previousData[key];
      const newValue = newData[key];
      
      if (oldValue === newValue) return null;
      
      return (
        <div key={key} className="text-sm">
          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
          <div className="ml-2">
            {oldValue && (
              <span className="text-red-600 line-through">
                {typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue)}
              </span>
            )}
            {oldValue && newValue && ' → '}
            {newValue && (
              <span className="text-green-600">
                {typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue)}
              </span>
            )}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'Life':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Honorary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Senior':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'direct_edit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved_request':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'status_change':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin_added':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'member_deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatChangeType = (type: string) => {
    switch (type) {
      case 'direct_edit':
        return 'Direct Edit';
      case 'approved_request':
        return 'Approved Request';
      case 'status_change':
        return 'Status Change';
      case 'admin_added':
        return 'Admin Added';
      case 'member_deleted':
        return 'Member Deleted';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage members, requests, and profile updates
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => onNavigate('add-member')} className="w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Member
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">
              Membership ({stats.pendingRequests})
            </TabsTrigger>
            <TabsTrigger value="updates">
              Updates ({stats.pendingUpdates})
            </TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
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
                  <CardTitle className="text-sm">Membership Requests</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-yellow-600">{stats.pendingRequests}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Update Requests</CardTitle>
                  <Edit className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600">{stats.pendingUpdates}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Updates</CardTitle>
                  <History className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-purple-600">{stats.totalUpdates}</div>
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
                            <p className="text-xs text-muted-foreground">{member.memberId}</p>
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
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest member updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {updateLogs
                      .slice(0, 5)
                      .map((log) => (
                        <div key={log.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{log.memberName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatChangeType(log.changeType)} • {new Date(log.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${getChangeTypeColor(log.changeType)} border text-xs`}>
                            {formatChangeType(log.changeType)}
                          </Badge>
                        </div>
                      ))}
                    {updateLogs.length === 0 && (
                      <p className="text-muted-foreground text-sm">No activity yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Membership Requests Tab */}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedMembershipRequest(request)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Member: {request.name}</DialogTitle>
                              <DialogDescription>
                                Select the appropriate membership type for this applicant.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="memberType">Membership Type</Label>
                                <Select value={selectedMemberType} onValueChange={(value: any) => setSelectedMemberType(value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select membership type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Regular">Regular - Standard membership</SelectItem>
                                    <SelectItem value="Life">Life - Lifetime membership</SelectItem>
                                    <SelectItem value="Student">Student - For students</SelectItem>
                                    <SelectItem value="Senior">Senior - For senior citizens</SelectItem>
                                    <SelectItem value="Honorary">Honorary - Special recognition</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => handleApprove(request.id, selectedMemberType)}>
                                  Approve as {selectedMemberType} Member
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMembershipRequest(null);
                                    setSelectedMemberType('Regular');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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

          {/* Update Requests Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="grid gap-6">
              {updateRequests.map((request) => {
                const member = members.find(m => m.memberId === request.memberId);
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.memberName}</CardTitle>
                          <CardDescription>Member ID: {request.memberId}</CardDescription>
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
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Request Date</p>
                        <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                      </div>
                      
                      {request.reason && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Reason</p>
                          <p className="text-sm bg-muted p-3 rounded">{request.reason}</p>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Requested Changes</p>
                        <div className="bg-muted p-3 rounded space-y-2">
                          {member && renderChanges(member, request.requestedChanges)}
                        </div>
                      </div>

                      {request.adminNotes && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                          <p className="text-sm bg-red-50 p-3 rounded border border-red-200">{request.adminNotes}</p>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button onClick={() => handleApproveUpdate(request.id)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Changes
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" onClick={() => setSelectedUpdateRequest(request)}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Update Request</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this update request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleRejectUpdate(request.id, rejectionReason)}
                                  >
                                    Reject Request
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUpdateRequest(null);
                                      setRejectionReason('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {updateRequests.length === 0 && (
                <Alert>
                  <AlertDescription>No update requests found.</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* Members Tab with Individual Update Logs */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid gap-4">
              {members.map((member) => {
                const memberLogs = getMemberUpdateLogs(member.memberId);
                const isExpanded = expandedMemberLogs.has(member.id);
                
                return (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3>{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {member.memberId} • {member.occupation}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getMemberTypeColor(member.memberType)} border text-xs`}>
                                {member.memberType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {member.city}, {member.country}
                              </span>
                            </div>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onNavigate('edit-member', member.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Individual Member Update Log */}
                      {memberLogs.length > 0 && (
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => toggleMemberLogExpansion(member.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <History className="h-4 w-4" />
                            <span>Update History ({memberLogs.length} changes)</span>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-4">
                            <div className="border-l-2 border-muted pl-4 space-y-4">
                              {memberLogs.map((log) => (
                                <div key={log.id} className="bg-muted/30 p-3 rounded">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge className={`${getChangeTypeColor(log.changeType)} border text-xs`}>
                                      {formatChangeType(log.changeType)}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(log.timestamp).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {log.reason && (
                                    <div className="mb-2 p-2 bg-muted/50 rounded text-sm">
                                      <div className="flex items-center gap-1 mb-1">
                                        <FileText className="h-3 w-3" />
                                        <span className="font-medium">Reason:</span>
                                      </div>
                                      <p className="text-muted-foreground">{log.reason}</p>
                                    </div>
                                  )}

                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">Changes:</p>
                                    <div className="text-sm space-y-1">
                                      {renderLogChanges(log.previousData, log.newData)}
                                      {Object.keys(log.newData).length === 0 && Object.keys(log.previousData).length > 0 && (
                                        <div className="text-red-600">
                                          Member account deleted
                                        </div>
                                      )}
                                      {Object.keys(log.previousData).length === 0 && Object.keys(log.newData).length > 0 && (
                                        <div className="text-green-600">
                                          New member account created
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-xs text-muted-foreground mt-2">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      Action by: {log.adminAction}
                                    </div>
                                    {log.requestId && (
                                      <div className="mt-1">
                                        Related to request ID: {log.requestId}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                      
                      {memberLogs.length === 0 && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                          <History className="h-4 w-4" />
                          <span>No update history available</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
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
                          <p className="text-xs text-muted-foreground">{member.memberId}</p>
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