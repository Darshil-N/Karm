import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import CreateDriveModal from '@/components/modals/CreateDriveModal';
import DriveDetailsModal from '@/components/modals/DriveDetailsModal';
import { 
  Briefcase, 
  Building2,
  TrendingUp,
  Users,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [driveDetailsOpen, setDriveDetailsOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);

  // Mock drive data - replace with Firebase data
  const activeDrives = [
    { 
      id: 1, 
      companyName: 'Google', 
      roleName: 'Software Engineer', 
      applicants: 145, 
      status: 'Round 2',
      description: 'Develop and maintain web applications using modern technologies.',
      requirements: ['React', 'Node.js', 'Python'],
      rounds: ['Resume Screening', 'Technical Round', 'Manager Round', 'HR Round'],
      benefits: 'Health insurance, flexible hours, remote work options',
      contactEmail: 'hr@google.com',
      contactPhone: '+1-650-253-0000',
      salary: '₹24 LPA',
      location: 'Bangalore',
      deadline: '2024-12-15',
      type: 'On-Campus'
    },
    { 
      id: 2, 
      companyName: 'Microsoft', 
      roleName: 'Cloud Architect', 
      applicants: 98, 
      status: 'Round 1',
      description: 'Design and implement cloud infrastructure solutions.',
      requirements: ['Azure', 'DevOps', 'Python'],
      rounds: ['Technical Assessment', 'System Design', 'Behavioral Round'],
      benefits: 'Comprehensive benefits package',
      contactEmail: 'careers@microsoft.com',
      contactPhone: '+1-425-882-8080',
      salary: '₹28 LPA',
      location: 'Hyderabad',
      deadline: '2024-12-20',
      type: 'Virtual'
    },
    { 
      id: 3, 
      companyName: 'Amazon', 
      roleName: 'SDE-1', 
      applicants: 120, 
      status: 'Applications Open',
      description: 'Build scalable distributed systems and services.',
      requirements: ['Java', 'AWS', 'Data Structures'],
      rounds: ['Online Assessment', 'Technical Interview', 'Bar Raiser'],
      benefits: 'Stock options, health benefits, career growth',
      contactEmail: 'university@amazon.com',
      contactPhone: '+1-206-266-1000',
      salary: '₹22 LPA',
      location: 'Mumbai',
      deadline: '2024-12-10',
      type: 'On-Campus'
    },
  ];

  const handleCreateNewDrive = () => {
    setCreateDriveOpen(true);
  };

  const handleManageDrive = (drive: any) => {
    setSelectedDrive(drive);
    setDriveDetailsOpen(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-drive':
        handleCreateNewDrive();
        break;
      case 'resume-parser':
        toast({
          title: "AI Resume Parser",
          description: "Opening resume parser tool...",
        });
        break;
      case 'bulk-email':
        toast({
          title: "Bulk Email",
          description: "Opening email composition tool...",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Placement Dashboard</h1>
          <p className="text-muted-foreground">Manage recruitment drives and student placements</p>
        </div>
        <Button className="gap-2" onClick={handleCreateNewDrive}>
          <Plus className="h-4 w-4" />
          Create New Drive
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-2">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-3xl font-bold">45</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Placed</p>
                <p className="text-3xl font-bold">287</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-2">68% placement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offers Rolled Out</p>
                <p className="text-3xl font-bold">342</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Drives */}
      <Card>
        <CardHeader>
          <CardTitle>Active Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeDrives.map((drive) => (
              <div key={drive.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xl">
                    {drive.companyName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{drive.companyName} - {drive.roleName}</p>
                    <p className="text-sm text-muted-foreground">{drive.applicants} applicants • {drive.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-secondary">{drive.status}</span>
                  <Button size="sm" onClick={() => handleManageDrive(drive)}>Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('create-drive')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Create New Drive</h3>
            <p className="text-sm text-muted-foreground">Add a new placement drive</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('resume-parser')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-bold mb-2">AI Resume Parser</h3>
            <p className="text-sm text-muted-foreground">Upload and parse resumes</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('bulk-email')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold mb-2">Send Bulk Email</h3>
            <p className="text-sm text-muted-foreground">Communicate with students</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateDriveModal 
        open={createDriveOpen} 
        onOpenChange={setCreateDriveOpen} 
      />
      <DriveDetailsModal 
        open={driveDetailsOpen} 
        onOpenChange={setDriveDetailsOpen}
        drive={selectedDrive}
      />
    </div>
  );
};

export default Dashboard;