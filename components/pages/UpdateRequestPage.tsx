import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, CheckCircle, FileEdit, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface UpdateRequestPageProps {
  memberId?: string;
  onNavigate: (page: string, memberId?: string) => void;
}

export function UpdateRequestPage({ memberId, onNavigate }: UpdateRequestPageProps) {
  const { submitUpdateRequest, getMemberById } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [member, setMember] = useState(memberId ? getMemberById(memberId) : null);
  
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    requestedChanges: {
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      occupation: '',
      bio: ''
    },
    reason: ''
  });

  // Pre-populate form if memberId is provided
  useEffect(() => {
    if (memberId && member) {
      setFormData({
        memberId: member.memberId,
        memberName: member.name,
        requestedChanges: {
          name: member.name,
          email: member.email,
          phone: member.phone,
          city: member.city,
          state: member.state,
          country: member.country,
          occupation: member.occupation,
          bio: member.bio || ''
        },
        reason: ''
      });
    }
  }, [memberId, member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('requestedChanges.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requestedChanges: {
          ...prev.requestedChanges,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out unchanged fields
    const originalData = member || {};
    const changedFields: any = {};
    
    Object.entries(formData.requestedChanges).forEach(([key, value]) => {
      if (value !== originalData[key as keyof typeof originalData] && value.trim() !== '') {
        changedFields[key] = value;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      alert('Please make at least one change to submit an update request.');
      return;
    }

    submitUpdateRequest({
      memberId: formData.memberId,
      memberName: formData.memberName,
      requestedChanges: changedFields,
      reason: formData.reason
    });
    
    setIsSubmitted(true);
  };

  const hasChanges = () => {
    if (!member) return true; // If no member data, allow any input
    
    return Object.entries(formData.requestedChanges).some(([key, value]) => {
      const originalValue = member[key as keyof typeof member] || '';
      return value !== originalValue;
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Update Request Submitted!</CardTitle>
            <CardDescription>
              Your profile update request has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Your update request has been sent to the admin team for review. 
                You will be notified once the changes are approved and applied to your profile.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-3">
              {memberId && (
                <Button onClick={() => onNavigate('member-detail', memberId)}>
                  Back to Profile
                </Button>
              )}
              <Button variant="outline" onClick={() => onNavigate('members')}>
                View Directory
              </Button>
            </div>
            <Button variant="ghost" onClick={() => setIsSubmitted(false)} className="w-full">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => memberId ? onNavigate('member-detail', memberId) : onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {memberId ? 'Back to Profile' : 'Back to Home'}
          </Button>
          
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <FileEdit className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl mb-4">Request Profile Update</h1>
            <p className="text-muted-foreground">
              {member ? 
                `Update the information for ${member.name} (${member.memberId})` :
                'Request updates to a member profile'
              }
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Update Request</CardTitle>
            <CardDescription>
              {member ? 
                'Modify the fields below that you want to update. Only changed fields will be submitted for approval.' :
                'Please provide the member details and requested changes.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!memberId && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h3 className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Member Identification
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Member ID *</Label>
                      <Input
                        id="memberId"
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleInputChange}
                        placeholder="e.g., JS-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Member Name *</Label>
                      <Input
                        id="memberName"
                        name="memberName"
                        value={formData.memberName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3>Requested Changes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.name">Full Name</Label>
                    <Input
                      id="requestedChanges.name"
                      name="requestedChanges.name"
                      value={formData.requestedChanges.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.email">Email Address</Label>
                    <Input
                      id="requestedChanges.email"
                      name="requestedChanges.email"
                      type="email"
                      value={formData.requestedChanges.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.phone">Phone Number</Label>
                    <Input
                      id="requestedChanges.phone"
                      name="requestedChanges.phone"
                      type="tel"
                      value={formData.requestedChanges.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.occupation">Occupation</Label>
                    <Input
                      id="requestedChanges.occupation"
                      name="requestedChanges.occupation"
                      value={formData.requestedChanges.occupation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.city">City</Label>
                    <Input
                      id="requestedChanges.city"
                      name="requestedChanges.city"
                      value={formData.requestedChanges.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.state">State/Province</Label>
                    <Input
                      id="requestedChanges.state"
                      name="requestedChanges.state"
                      value={formData.requestedChanges.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedChanges.country">Country</Label>
                    <Input
                      id="requestedChanges.country"
                      name="requestedChanges.country"
                      value={formData.requestedChanges.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedChanges.bio">Bio/Description</Label>
                  <Textarea
                    id="requestedChanges.bio"
                    name="requestedChanges.bio"
                    value={formData.requestedChanges.bio}
                    onChange={handleInputChange}
                    placeholder="Brief description..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Update (Optional)</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please explain why you need these changes..."
                  rows={3}
                />
              </div>

              {member && !hasChanges() && (
                <Alert>
                  <AlertDescription>
                    Please make at least one change to the profile information to submit an update request.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> All profile update requests require admin approval. 
                  You will receive a notification once your request has been reviewed and processed.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full"
                disabled={member && !hasChanges()}
              >
                Submit Update Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}