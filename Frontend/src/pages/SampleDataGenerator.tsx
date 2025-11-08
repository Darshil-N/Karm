import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { createSampleStudents, createSamplePendingStudents } from '../lib/sampleData';

const SampleDataGenerator: React.FC = () => {
  const { toast } = useToast();
  const [hodEmail, setHodEmail] = useState('hod@university.edu');
  const [universityName, setUniversityName] = useState('Sample University');
  const [loading, setLoading] = useState(false);

  const generateSampleData = async () => {
    setLoading(true);
    try {
      const [studentsResult, pendingResult] = await Promise.all([
        createSampleStudents(hodEmail, universityName),
        createSamplePendingStudents(hodEmail, universityName)
      ]);

      if (studentsResult.success && pendingResult.success) {
        toast({
          title: "Sample Data Created!",
          description: "Sample students and pending approvals have been added to the database.",
        });
      } else {
        throw new Error('Failed to create sample data');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create sample data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Sample Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">HOD Email:</label>
            <Input
              value={hodEmail}
              onChange={(e) => setHodEmail(e.target.value)}
              placeholder="hod@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">University Name:</label>
            <Input
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="Sample University"
            />
          </div>

          <Button 
            onClick={generateSampleData}
            disabled={loading || !hodEmail || !universityName}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Generate Sample Data'}
          </Button>

          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>This will create:</strong></p>
            <ul className="list-disc ml-4 space-y-1">
              <li>5 approved students (3 placed, 1 in process, 1 unplaced)</li>
              <li>3 pending approval students</li>
              <li>Sample placement data with companies and packages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleDataGenerator;