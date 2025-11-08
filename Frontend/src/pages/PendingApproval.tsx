import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-secondary mb-6">
            <Clock className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Pending HOD Approval</h1>
          <p className="text-muted-foreground mb-8">
            Your registration has been submitted successfully! Your application is now pending approval from the Head of Department (HOD). 
            Once approved, you'll receive your unique Student ID (KM####) and can complete your detailed profile to access the student portal.
          </p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Basic registration completed</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-amber-600">
              <Clock className="h-5 w-5" />
              <span>Waiting for HOD approval</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="text-xs">After approval: Complete profile → Access student portal</span>
            </div>
          </div>
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
