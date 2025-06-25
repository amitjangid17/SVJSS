import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, Heart, Handshake, Award, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Users,
      title: 'Community Directory',
      description: 'Connect with fellow Jangid community members from around the world.'
    },
    {
      icon: Heart,
      title: 'Cultural Heritage',
      description: 'Preserve and celebrate our rich cultural traditions and values.'
    },
    {
      icon: Handshake,
      title: 'Support Network',
      description: 'Get help and support from community members in times of need.'
    },
    {
      icon: Award,
      title: 'Achievement Recognition',
      description: 'Celebrate the accomplishments of our community members.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Jangid Samaj
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connecting Jangid community members worldwide through tradition, culture, and mutual support.
            Join our growing family and be part of something greater.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('register')}
              className="px-8 py-3"
            >
              Join Our Community
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => onNavigate('members')}
              className="px-8 py-3"
            >
              Browse Members
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Why Join Jangid Samaj?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our community offers a platform for connection, support, and cultural preservation
              for Jangid families around the globe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-12">Our Growing Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-2 text-primary">500+</div>
              <p className="text-muted-foreground">Active Members</p>
            </div>
            <div>
              <div className="text-4xl mb-2 text-primary">25+</div>
              <p className="text-muted-foreground">Cities Worldwide</p>
            </div>
            <div>
              <div className="text-4xl mb-2 text-primary">10+</div>
              <p className="text-muted-foreground">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Community Administration</CardTitle>
              <CardDescription>
                Are you an admin? Access the dashboard to manage members and membership requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('admin-login')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                Demo credentials: admin@jangidsamaj.org / admin123
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}