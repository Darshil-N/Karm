import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className={`flex-1 flex items-center justify-center gradient-hero px-4 py-20 relative ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-cyber-lime/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-electric-purple/30 rounded-full animate-float stagger-delay-2"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-cyber-lime/25 rounded-full animate-float stagger-delay-4"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-electric-purple/20 rounded-full animate-float stagger-delay-3"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <GraduationCap className="h-20 w-20 animate-bounce-gentle text-cyber-lime" />
              <Sparkles className="h-6 w-6 absolute -top-2 -right-2 animate-spin-slow text-cyber-lime" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight animate-slide-in-bottom stagger-delay-1">
            Find Your Future.<br />
            <span className="text-cyber-lime animate-text-shimmer bg-gradient-to-r from-cyber-lime via-white to-cyber-lime bg-clip-text">
              Streamline Your Placements.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto animate-slide-in-bottom stagger-delay-2">
            The complete AI-powered platform connecting students, colleges, and companies for seamless campus recruitment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-bottom stagger-delay-3">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary btn-animate hover-scale cyber-card-border"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-cyber-lime text-deep-space hover:bg-cyber-lime/90 btn-wave hover-scale"
              onClick={() => navigate('/signup-hub')}
            >
              Sign Up
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-electric-purple hover:bg-electric-purple/90 btn-animate hover-glow-intense"
              onClick={() => navigate('/check-status')}
            >
              Check Application Status
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-deep-space py-20 px-4 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-mist-white animate-slide-in-top">
            Why Choose <span className="text-cyber-lime">Project Nexus</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 cyber-card hover-glow-intense animate-slide-in-left stagger-delay-1 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-lime/20 text-cyber-lime mb-4 group-hover:animate-pulse-slow transition-all duration-300">
                <GraduationCap className="h-8 w-8 group-hover:icon-wiggle" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-mist-white group-hover:text-cyber-lime transition-colors duration-300">For Students</h3>
              <p className="text-mist-white/80 group-hover:text-mist-white transition-colors duration-300">
                AI-powered resume builder, mock interviews, and streamlined application process.
              </p>
            </div>

            <div className="text-center p-6 cyber-card hover-glow-intense animate-slide-in-bottom stagger-delay-2 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-purple/20 text-electric-purple mb-4 group-hover:animate-bounce-gentle transition-all duration-300">
                <Briefcase className="h-8 w-8 group-hover:icon-heartbeat" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-mist-white group-hover:text-electric-purple transition-colors duration-300">For Colleges</h3>
              <p className="text-mist-white/80 group-hover:text-mist-white transition-colors duration-300">
                Complete placement management with analytics, reporting, and student tracking.
              </p>
            </div>

            <div className="text-center p-6 cyber-card hover-glow-intense animate-slide-in-right stagger-delay-3 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-cyber/20 text-cyber-lime mb-4 group-hover:animate-spin-slow transition-all duration-300">
                <TrendingUp className="h-8 w-8 group-hover:icon-flash" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-mist-white group-hover:text-cyber-lime transition-colors duration-300">AI-Powered</h3>
              <p className="text-mist-white/80 group-hover:text-mist-white transition-colors duration-300">
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
