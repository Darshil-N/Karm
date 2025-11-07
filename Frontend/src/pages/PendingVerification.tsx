import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';

const PendingVerification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6">
            <Clock className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Pending Verification</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for registering your college! Your application is currently under review by our verification team. 
            We'll notify you via email once your college has been verified.
          </p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span>Application received</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>Under review (typically 24-48 hours)</span>
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

export default PendingVerification;
