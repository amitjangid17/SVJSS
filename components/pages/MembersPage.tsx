import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Search, MapPin, Briefcase, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Member } from '../../types/member';

interface MembersPageProps {
  onNavigate: (page: string, memberId?: string) => void;
}

export function MembersPage({ onNavigate }: MembersPageProps) {
  const { members } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !cityFilter || member.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesCity && member.status === 'active';
  });

  const cities = Array.from(new Set(members.map(member => member.city))).sort();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">Members Directory</h1>
          <p className="text-muted-foreground">
            Connect with Jangid community members from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, occupation, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Input
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredMembers.length} of {members.filter(m => m.status === 'active').length} members
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <div className="flex items-center justify-center text-muted-foreground text-sm">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {member.occupation}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {member.city}, {member.state}, {member.country}
                  </div>
                  {member.bio && (
                    <p className="text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  <div className="pt-2">
                    <Badge variant="secondary" className="text-xs">
                      Member since {new Date(member.joinDate).getFullYear()}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onNavigate('member-detail', member.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No members found matching your search criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}