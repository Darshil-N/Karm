import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, GraduationCap, Star, Github, Download, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user?.studentId) return;
      try {
        const student = await StudentService.getStudentByStudentId(user.studentId);
        setStudentData(student);
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!studentData) {
    return <div className="p-6">No profile data found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{studentData.name}</p>
              <p className="text-sm text-muted-foreground">{studentData.studentId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{studentData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{studentData.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p className="font-medium">{studentData.branch}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{studentData.year}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">CGPA: {studentData.cgpa}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {studentData.skillSet?.map((skill: string) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline">
          <Github className="h-4 w-4 mr-2" />
          Connect GitHub (Coming Soon)
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Projects (Coming Soon)
        </Button>
      </div>
    </div>
  );
};

export default Profile;
