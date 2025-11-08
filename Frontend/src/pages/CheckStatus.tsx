import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { StudentService } from '@/services/firebaseService';
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const CheckStatus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [statusResult, setStatusResult] = useState<{
    status: 'not_found' | 'pending' | 'approved' | 'rejected';
    studentId?: string;
    profileCompleted?: boolean;
    data?: any;
  } | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await StudentService.checkStudentStatusByEmail(email);
      setStatusResult(result);
      
      if (result.status === 'not_found') {
        toast({
          title: "No Registration Found",
          description: "No registration found with this email address",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Status check error:', error);
      toast({
        title: "Error Checking Status",
        description: error.message || "Failed to check status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusContent = () => {
    if (!statusResult) return null;

    const { status, studentId, profileCompleted, data } = statusResult;

    switch (status) {
      case 'pending':
        return (
          <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
            <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Pending Approval</h3>
            <p className="text-amber-700 mb-4">
              Your registration is currently being reviewed by the Head of Department.
            </p>
            {studentId && (
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  Student ID: {studentId}
                </Badge>
              </div>
            )}
          </div>
        );

      case 'approved':
        return (
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Application Approved</h3>
            <p className="text-green-700 mb-4">
              Congratulations! Your application has been approved.
            </p>
            {studentId && (
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Student ID: {studentId}
                </Badge>
              </div>
            )}
            
            {!profileCompleted ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Profile completion required</span>
                </div>
                <Button 
                  onClick={() => navigate(`/complete-profile?studentId=${studentId}`)}
                  className="w-full"
                >
                  Complete Your Profile
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  You can also <button 
                    onClick={() => navigate('/login')} 
                    className="text-blue-600 hover:underline"
                  >
                    login here
                  </button> with your email and password
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-green-600 text-sm">✅ Profile completed</p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Login to Student Portal
                </Button>
              </div>
            )}
          </div>
        );

      case 'rejected':
        return (
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Application Rejected</h3>
            <p className="text-red-700 mb-4">
              Unfortunately, your application was not approved.
            </p>
            {data?.rejectionReason && (
              <div className="bg-red-100 p-3 rounded border border-red-200 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Reason:</strong> {data.rejectionReason}
                </p>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup/user')}
              className="w-full"
            >
              Apply Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">Check Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckStatus} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for registration"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Checking Status...' : 'Check Status'}
            </Button>
          </form>

          {statusResult && (
            <div className="mt-6">
              {renderStatusContent()}
            </div>
          )}

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup/user')} className="text-primary hover:underline">
                Register Now
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              Already have access?{' '}
              <button onClick={() => navigate('/login')} className="text-primary hover:underline">
                Login Here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckStatus;