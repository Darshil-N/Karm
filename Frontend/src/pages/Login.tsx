import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { loginWithEmail } from '@/lib/firebaseService';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let user = null;
      
      // Try student login first
      try {
        const studentLogin = await StudentService.loginStudent(credentials.email, credentials.password);
        user = {
          uid: studentLogin.user.uid,
          email: studentLogin.studentData.email,
          name: studentLogin.studentData.name,
          role: 'student',
          isApproved: studentLogin.studentData.isApproved,
          studentId: studentLogin.studentData.studentId,
          university: studentLogin.studentData.university,
          profileCompleted: studentLogin.studentData.profileCompleted
        };
      } catch (studentError) {
        // If student login fails, try regular login
        console.log('Student login failed, trying regular login...');
        user = await loginWithEmail(credentials.email, credentials.password);
      }
      
      if (user) {
        login(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        // Route based on role
        switch (user.role) {
          case 'student':
            // Check if profile is completed
            if (user.profileCompleted) {
              navigate('/student/dashboard');
            } else {
              navigate(`/complete-profile?studentId=${user.studentId}`);
            }
            break;
          case 'tpo':
            navigate('/tpo/dashboard');
            break;
          case 'hod':
            navigate('/hod/dashboard');
            break;
          case 'authority':
            navigate('/admin/verify');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyber-lime/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-electric-purple/15 rounded-full animate-float stagger-delay-2"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-cyber-lime/20 rounded-full animate-float stagger-delay-4"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-electric-purple/10 rounded-full animate-float stagger-delay-3"></div>
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

      <Card className={`max-w-md w-full cyber-card relative z-10 ${isVisible ? 'animate-zoom-in' : 'opacity-0 scale-75'}`}>
        <CardHeader className="animate-slide-in-top stagger-delay-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center animate-glow-cycle">
              <LogIn className="h-8 w-8 text-deep-space animate-bounce-gentle" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center text-mist-white">Welcome Back</CardTitle>
          <CardDescription className="text-center text-mist-white/80">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-slide-in-bottom stagger-delay-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-mist-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyber-lime" />
                Email / Username
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value.toLowerCase().trim() })}
                placeholder="Enter your email"
                className="cyber-input hover-glow group-hover:border-cyber-lime/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="password" className="text-mist-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-electric-purple" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                className="cyber-input hover-glow group-hover:border-electric-purple/50 transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-cyber-lime hover:text-cyber-lime/80 transition-colors duration-300 hover-slide-right"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>

            <Button 
              type="submit" 
              className={`w-full bg-gradient-cyber hover:bg-gradient-cyber/90 btn-wave hover-scale text-deep-space font-semibold ${
                isLoading ? 'loading-pulse' : ''
              }`}
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4 border-2 border-deep-space/30 border-t-deep-space rounded-full"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-mist-white/60">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup-hub')} 
                className="text-cyber-lime hover:text-cyber-lime/80 hover-slide-right transition-all duration-300"
              >
                Sign up
              </button>
            </p>
            <p className="text-center text-sm text-mist-white/60">
              <button 
                onClick={() => navigate('/authority-signup')} 
                className="text-electric-purple hover:text-electric-purple/80 hover-slide-right transition-all duration-300"
              >
                Authority Signup
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
