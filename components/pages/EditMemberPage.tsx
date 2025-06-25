import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Save, CheckCircle, User, Mail, Phone, MapPin, Briefcase, IdCard } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface EditMemberPageProps {
  memberId: string;
  onNavigate: (page: string, memberId?: string) => void;
}

export function EditMemberPage({ memberId, onNavigate }: EditMemberPageProps) {
  const { getMemberById, updateMember, isAdmin } = useApp();
  const [member, setMember] = useState(getMemberById(memberId));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    occupation: '',
    dateOfBirth: '',
    memberType: 'Regular' as 'Regular' | 'Life' | 'Honorary' | 'Student' | 'Senior',
    status: 'active' as 'active' | 'inactive',
    bio: '',
    socialLinks: {
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  });

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to edit member details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('home')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If member not found
  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Member Not Found</CardTitle>
            <CardDescription>
              The member you're trying to edit could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('admin')}>
              Back to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initialize form data when member is loaded
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        city: member.city,
        state: member.state,
        country: member.country,
        occupation: member.occupation,
        dateOfBirth: member.dateOfBirth,
        memberType: member.memberType,
        status: member.status,
        bio: member.bio || '',
        socialLinks: {
          linkedin: member.socialLinks?.linkedin || '',
          facebook: member.socialLinks?.facebook || '',
          twitter: member.socialLinks?.twitter || ''
        }
      });
    }
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up social links - only include non-empty ones
    const cleanedSocialLinks: any = {};
    Object.entries(formData.socialLinks).forEach(([key, value]) => {
      if (value.trim()) {
        cleanedSocialLinks[key] = value.trim();
      }
    });

    const updatedData = {
      ...formData,
      socialLinks: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : undefined
    };

    updateMember(memberId, updatedData);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        city: member.city,
        state: member.state,
        country: member.country,
        occupation: member.occupation,
        dateOfBirth: member.dateOfBirth,
        memberType: member.memberType,
        status: member.status,
        bio: member.bio || '',
        socialLinks: {
          linkedin: member.socialLinks?.linkedin || '',
          facebook: member.socialLinks?.facebook || '',
          twitter: member.socialLinks?.twitter || ''
        }
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Member Updated Successfully!</CardTitle>
            <CardDescription>
              {member.name}'s profile has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                All changes have been saved and are now visible in the member directory.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => onNavigate('member-detail', memberId)} className="flex-1">
                View Member Profile
              </Button>
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="flex-1">
                Edit Again
              </Button>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('admin')} className="w-full">
              Back to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('member-detail', memberId)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Member Profile
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl">Edit Member</h1>
              <p className="text-muted-foreground">
                Update {member.name}'s profile information
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Member Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5" />
                  Member Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Member ID</Label>
                  <p className="font-mono">{member.memberId}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Join Date</Label>
                  <p>{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Current Status</Label>
                  <p className="capitalize">{member.status}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Member Information</CardTitle>
                <CardDescription>
                  Update the member's profile information below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation *</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member Status */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      Membership Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberType">Member Type *</Label>
                        <Select value={formData.memberType} onValueChange={(value) => handleSelectChange('memberType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Life">Life</SelectItem>
                            <SelectItem value="Honorary">Honorary</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio/Description (Optional)</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Brief description about the member..."
                      rows={4}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3>Social Links (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="socialLinks.linkedin" className="text-sm">LinkedIn URL</Label>
                        <Input
                          id="socialLinks.linkedin"
                          name="socialLinks.linkedin"
                          type="url"
                          value={formData.socialLinks.linkedin}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialLinks.facebook" className="text-sm">Facebook URL</Label>
                        <Input
                          id="socialLinks.facebook"
                          name="socialLinks.facebook"
                          type="url"
                          value={formData.socialLinks.facebook}
                          onChange={handleInputChange}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialLinks.twitter" className="text-sm">Twitter URL</Label>
                        <Input
                          id="socialLinks.twitter"
                          name="socialLinks.twitter"
                          type="url"
                          value={formData.socialLinks.twitter}
                          onChange={handleInputChange}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset to Original
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}