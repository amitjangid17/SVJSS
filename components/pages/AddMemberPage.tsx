import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AddMemberPageProps {
  onNavigate: (page: string) => void;
}

export function AddMemberPage({ onNavigate }: AddMemberPageProps) {
  const { addMemberDirectly, isAdmin } = useApp();
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
              You need admin privileges to access this page.
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

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, memberType: value as any }));
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

    const memberData = {
      ...formData,
      socialLinks: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : undefined
    };

    addMemberDirectly(memberData);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      occupation: '',
      dateOfBirth: '',
      memberType: 'Regular',
      bio: '',
      socialLinks: {
        linkedin: '',
        facebook: '',
        twitter: ''
      }
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Member Added Successfully!</CardTitle>
            <CardDescription>
              The new member has been added to the community directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                {formData.name} has been added as an active {formData.memberType.toLowerCase()} member and can now be found in the members directory.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => onNavigate('members')} className="flex-1">
                View Members Directory
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Add Another Member
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl mb-4">Add New Member</h1>
            <p className="text-muted-foreground">
              Add a new member directly to the community directory
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
            <CardDescription>
              Fill out the form below to add a new active member to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                  <Label htmlFor="memberType">Member Type *</Label>
                  <Select value={formData.memberType} onValueChange={handleSelectChange}>
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
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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

              <div className="space-y-4">
                <Label className="text-base">Social Links (Optional)</Label>
                <div className="grid md:grid-cols-3 gap-4">
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
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}