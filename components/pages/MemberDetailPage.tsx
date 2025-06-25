import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ArrowLeft, MapPin, Briefcase, Calendar, Mail, Phone, ExternalLink, IdCard, UserCheck, Edit, FileEdit } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface MemberDetailPageProps {
  memberId: string;
  onNavigate: (page: string, memberId?: string) => void;
}

export function MemberDetailPage({ memberId, onNavigate }: MemberDetailPageProps) {
  const { getMemberById, isAdmin } = useApp();
  const member = getMemberById(memberId);

  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Member Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested member profile could not be found.</p>
          <Button onClick={() => onNavigate('members')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('members')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
            <div className="flex gap-2 mb-4">
              {isAdmin && (
                <Button 
                  onClick={() => onNavigate('edit-member', memberId)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Member
                </Button>
              )}
              {!isAdmin && (
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('update-request', memberId)}
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Request Update
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
            
            {/* Member ID and Type */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {member.memberId}
                </span>
              </div>
              <Badge className={`${getMemberTypeColor(member.memberType)} border`}>
                {member.memberType} Member
              </Badge>
            </div>

            <div className="flex items-center justify-center text-muted-foreground mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              {member.occupation}
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {member.city}, {member.state}, {member.country}
            </div>
            <div className="mt-4">
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                <UserCheck className="w-3 h-3 mr-1" />
                {member.status === 'active' ? 'Active Member' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{member.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{member.phone}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p>{calculateAge(member.dateOfBirth)} years old</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                <p className="font-mono">{member.memberId}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Type</p>
                <Badge className={`${getMemberTypeColor(member.memberType)} border`}>
                  {member.memberType}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                <p>{new Date(member.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p>{member.city}, {member.state}</p>
                <p className="text-sm text-muted-foreground">{member.country}</p>
              </div>
              {member.socialLinks && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Social Links</p>
                    <div className="space-y-2">
                      {member.socialLinks.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {member.socialLinks.facebook && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Facebook
                          </a>
                        </Button>
                      )}
                      {member.socialLinks.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Twitter
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bio Section */}
        {member.bio && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}