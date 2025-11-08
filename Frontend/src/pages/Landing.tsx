import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center gradient-hero px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-8">
            <GraduationCap className="h-20 w-20" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Future.<br />Streamline Your Placements.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            The complete AI-powered platform connecting students, colleges, and companies for seamless campus recruitment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/signup-hub')}
            >
              Sign Up
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/check-status')}
            >
              Check Application Status
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Project Nexus?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Students</h3>
              <p className="text-muted-foreground">
                AI-powered resume builder, mock interviews, and streamlined application process.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Colleges</h3>
              <p className="text-muted-foreground">
                Complete placement management with analytics, reporting, and student tracking.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Smart resume parsing, candidate matching, and automated interview scheduling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
