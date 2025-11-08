import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building2, ArrowLeft, Users, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

const SignupHub = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-28 h-28 bg-cyber-lime/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-16 w-20 h-20 bg-electric-purple/15 rounded-full animate-float stagger-delay-2"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-cyber-lime/20 rounded-full animate-float stagger-delay-4"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-electric-purple/10 rounded-full animate-float stagger-delay-3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-cyber/5 rounded-full animate-pulse-slow"></div>
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        className={`absolute top-6 left-6 text-white hover:bg-white/10 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className={`max-w-4xl w-full relative z-10 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="text-center mb-12 animate-slide-in-top">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-mist-white">
            Join <span className="text-cyber-lime animate-text-shimmer bg-gradient-to-r from-cyber-lime via-white to-cyber-lime bg-clip-text">Project Nexus</span>
          </h1>
          <p className="text-xl text-mist-white/80">
            How are you joining us today?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="cursor-pointer cyber-card hover-glow-intense group animate-slide-in-left stagger-delay-1"
            onClick={() => navigate('/signup/user')}
          >
            <CardContent className="p-8 text-center relative overflow-hidden">
              {/* Card Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-lime/5 to-electric-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-cyber text-deep-space mb-6 group-hover:animate-bounce-gentle transition-all duration-300">
                  <GraduationCap className="h-10 w-10 group-hover:icon-wiggle" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-mist-white group-hover:text-cyber-lime transition-colors duration-300">I am a Student</h2>
                <p className="text-mist-white/80 group-hover:text-mist-white transition-colors duration-300">
                  Join as a student, placement officer, or head of department to access placement opportunities.
                </p>
                
                {/* Feature Icons */}
                <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-1 text-cyber-lime text-sm">
                    <Users className="h-4 w-4" />
                    <span>Connect</span>
                  </div>
                  <div className="flex items-center gap-1 text-electric-purple text-sm">
                    <Briefcase className="h-4 w-4" />
                    <span>Apply</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer cyber-card hover-glow-intense group animate-slide-in-right stagger-delay-2"
            onClick={() => navigate('/signup/college')}
          >
            <CardContent className="p-8 text-center relative overflow-hidden">
              {/* Card Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/5 to-cyber-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-electric-purple to-deep-space text-cyber-lime mb-6 group-hover:animate-spin-slow transition-all duration-300">
                  <Building2 className="h-10 w-10 group-hover:icon-heartbeat" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-mist-white group-hover:text-electric-purple transition-colors duration-300">I represent a College</h2>
                <p className="text-mist-white/80 group-hover:text-mist-white transition-colors duration-300">
                  Register your institution to manage placements and connect with top companies.
                </p>
                
                {/* Feature Icons */}
                <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-1 text-electric-purple text-sm">
                    <Users className="h-4 w-4" />
                    <span>Manage</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyber-lime text-sm">
                    <Briefcase className="h-4 w-4" />
                    <span>Recruit</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 animate-slide-in-bottom stagger-delay-3">
          <p className="text-mist-white/80">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cyber-lime font-medium hover:text-cyber-lime/80 hover-slide-right transition-all duration-300"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupHub;
