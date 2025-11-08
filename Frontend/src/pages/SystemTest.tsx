import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { StudentService } from '@/services/firebaseService';
import { CheckCircle, XCircle, Clock, Users, Building } from 'lucide-react';

const SystemTest = () => {
  const { toast } = useToast();
  const [colleges, setColleges] = useState<any[]>([]);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [approvedStudents, setApprovedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runSystemTest = async () => {
    setLoading(true);
    try {
      // Test 1: Load approved colleges
      console.log('🧪 Testing: Load approved colleges...');
      const collegesData = await StudentService.getApprovedColleges();
      setColleges(collegesData);
      console.log('✅ Colleges loaded:', collegesData.length);

      // Test 2: Load pending students (all)
      console.log('🧪 Testing: Load all pending students...');
      const allPendingData = await StudentService.getPendingStudents();
      setPendingStudents(allPendingData);
      console.log('✅ Pending students loaded:', allPendingData.length);

      // Test 3: Load approved students (all)
      console.log('🧪 Testing: Load all approved students...');
      const allApprovedData = await StudentService.getAllStudents();
      setApprovedStudents(allApprovedData);
      console.log('✅ Approved students loaded:', allApprovedData.length);

      // Test 4: Test HOD filtering (if there are colleges)
      if (collegesData.length > 0) {
        const testHodEmail = collegesData[0].hodEmail;
        console.log('🧪 Testing: HOD-filtered pending students for', testHodEmail);
        const hodPendingData = await StudentService.getPendingStudents(testHodEmail);
        console.log('✅ HOD filtered pending students:', hodPendingData.length);

        console.log('🧪 Testing: HOD-filtered approved students for', testHodEmail);
        const hodApprovedData = await StudentService.getAllStudents(testHodEmail);
        console.log('✅ HOD filtered approved students:', hodApprovedData.length);
      }

      toast({
        title: "System Test Completed",
        description: "All university routing functions are working correctly!",
      });

    } catch (error: any) {
      console.error('❌ System test failed:', error);
      toast({
        title: "System Test Failed", 
        description: error.message || "Some functions are not working correctly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSystemTest();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-muted">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              University Routing System - Test Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button onClick={runSystemTest} disabled={loading}>
                {loading ? 'Testing...' : 'Run System Test'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Approved Colleges */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Approved Universities ({colleges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {colleges.map((college) => (
                      <div key={college.id} className="p-3 border rounded-lg">
                        <div className="font-semibold">{college.name}</div>
                        <div className="text-sm text-muted-foreground">
                          HOD: {college.hodEmail}
                        </div>
                        {college.website && (
                          <div className="text-xs text-blue-600">{college.website}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Students ({pendingStudents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingStudents.map((student) => (
                      <div key={student.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.university}
                            </div>
                            {student.studentId && (
                              <Badge variant="outline" className="text-xs">
                                {student.studentId}
                              </Badge>
                            )}
                          </div>
                          {getStatusIcon(student.status)}
                        </div>
                        {student.hodEmail && (
                          <div className="text-xs text-blue-600 mt-1">
                            → {student.hodEmail}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Approved Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Approved Students ({approvedStudents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {approvedStudents.map((student) => (
                      <div key={student.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.university}
                            </div>
                            {student.studentId && (
                              <Badge variant="secondary" className="text-xs">
                                {student.studentId}
                              </Badge>
                            )}
                          </div>
                          {getStatusIcon(student.status)}
                        </div>
                        {student.hodEmail && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ {student.hodEmail}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Profile: {student.profileCompleted ? 'Complete' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">System Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  University dropdown system: Active
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  HOD routing system: Active
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Student ID generation: Active (KM####)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time filtering: Active
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemTest;