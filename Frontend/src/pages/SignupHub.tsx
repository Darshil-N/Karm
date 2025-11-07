import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Building2 } from 'lucide-react';

const SignupHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Project Nexus</h1>
          <p className="text-xl text-muted-foreground">
            How are you joining us today?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => navigate('/signup/user')}
          >
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary text-white mb-6">
                <GraduationCap className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I am a Student / Staff</h2>
              <p className="text-muted-foreground">
                Join as a student, placement officer, or head of department to access placement opportunities.
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => navigate('/signup/college')}
          >
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-secondary text-white mb-6">
                <Building2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I represent a College</h2>
              <p className="text-muted-foreground">
                Register your institution to manage placements and connect with top companies.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-medium hover:underline"
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
