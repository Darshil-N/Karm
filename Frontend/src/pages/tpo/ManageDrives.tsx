import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Building2,
  MapPin,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import CreateDriveModal from '@/components/modals/CreateDriveModal';
import DriveDetailsModal from '@/components/modals/DriveDetailsModal';

const ManageDrives = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [driveDetailsOpen, setDriveDetailsOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);

  // Mock drives data - replace with Firebase data
  const drives = [
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
      type: 'On-Campus',
      posted: '2024-11-01'
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
      type: 'Virtual',
      posted: '2024-11-05'
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
      type: 'On-Campus',
      posted: '2024-10-28'
    },
    { 
      id: 4, 
      companyName: 'Meta', 
      roleName: 'Frontend Developer', 
      applicants: 87, 
      status: 'Applications Closed',
      description: 'Create engaging user interfaces for web and mobile platforms.',
      requirements: ['React', 'JavaScript', 'TypeScript'],
      rounds: ['Coding Challenge', 'Technical Interview', 'Design Review'],
      benefits: 'Competitive salary, equity, health benefits',
      contactEmail: 'recruiting@meta.com',
      contactPhone: '+1-650-543-4800',
      salary: '₹26 LPA',
      location: 'Gurugram',
      deadline: '2024-11-30',
      type: 'Hybrid',
      posted: '2024-10-15'
    }
  ];

  const handleCreateNewDrive = () => {
    setCreateDriveOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleFilter = (filterType: string) => {
    setSelectedFilter(filterType);
    toast({
      title: "Filter Applied",
      description: `Filtering by: ${filterType}`,
    });
  };

  const handleViewDrive = (drive: any) => {
    setSelectedDrive(drive);
    setDriveDetailsOpen(true);
  };

  const handleEditDrive = (driveId: number, company: string) => {
    toast({
      title: "Edit Drive",
      description: `Opening ${company} drive editor...`,
    });
  };

  const handleDeleteDrive = (driveId: number, company: string) => {
    toast({
      title: "Delete Drive",
      description: `Are you sure you want to delete ${company} drive?`,
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-secondary text-secondary-foreground';
      case 'Closed': return 'bg-destructive text-destructive-foreground';
      case 'Draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Drives</h1>
          <p className="text-muted-foreground">Create, monitor and manage all placement drives</p>
        </div>
        <Button className="gap-2" onClick={handleCreateNewDrive}>
          <Plus className="h-4 w-4" />
          Create New Drive
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">608</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft Drives</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Salary</p>
                <p className="text-3xl font-bold">₹16.4L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search drives by company, role, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Status')}>
                <Filter className="h-4 w-4" />
                Status
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Date Range')}>
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Company')}>
                <Building2 className="h-4 w-4" />
                Company
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drives Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {drives.map((drive) => (
              <div key={drive.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {drive.companyName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{drive.companyName}</h3>
                      <Badge className={getStatusColor(drive.status)}>
                        {drive.status}
                      </Badge>
                      <Badge variant="outline">{drive.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{drive.roleName}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {drive.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {drive.applicants} applicants
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Deadline: {new Date(drive.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{drive.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => handleViewDrive(drive)}>
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => handleEditDrive(drive.id, drive.companyName)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" onClick={() => handleDeleteDrive(drive.id, drive.companyName)}>
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

export default ManageDrives;