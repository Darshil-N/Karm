import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { loginWithEmail } from '@/lib/firebaseService';
import { LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

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
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Username</Label>
              <Input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value.toLowerCase().trim() })}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup-hub')} className="text-primary hover:underline">
              Sign up
            </button>
            {' | '}
            <button onClick={() => navigate('/authority-signup')} className="text-red-600 hover:underline">
              Authority Signup
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
