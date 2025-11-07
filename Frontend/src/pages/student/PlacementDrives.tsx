import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const PlacementDrives = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [drives] = useState([
    {
      id: 1,
      companyName: 'Google',
      roleName: 'Software Engineer',
      jobType: 'Full-time',
      location: 'Bangalore',
      salary: '₹24 LPA',
      deadline: '2024-12-15',
      status: 'Open',
      applicants: 145,
      eligibility: 'B.Tech/M.Tech in CS/IT/ECE with CGPA ≥ 8.0',
      description: 'Join Google as a Software Engineer and work on cutting-edge technologies that impact billions of users worldwide.',
      requirements: ['Strong programming skills in Java/Python/C++', 'Knowledge of data structures and algorithms', 'Experience with web technologies'],
      rounds: ['Online Assessment', 'Technical Interview', 'Manager Round', 'HR Round'],
      companyLogo: '/logos/google.png',
      applied: false,
      bookmarked: true,
      applicationDeadline: '2024-12-15',
      driveDate: '2024-12-20',
      skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'System Design']
    },
    {
      id: 2,
      companyName: 'Microsoft',
      roleName: 'Cloud Solutions Architect',
      jobType: 'Full-time',
      location: 'Hyderabad',
      salary: '₹28 LPA',
      deadline: '2024-12-20',
      status: 'Open',
      applicants: 98,
      eligibility: 'B.Tech/M.Tech with CGPA ≥ 7.5',
      description: 'Design and implement cloud infrastructure solutions for enterprise clients using Microsoft Azure.',
      requirements: ['Experience with cloud platforms', 'Knowledge of DevOps practices', 'Strong problem-solving skills'],
      rounds: ['Technical Assessment', 'System Design', 'Behavioral Round'],
      companyLogo: '/logos/microsoft.png',
      applied: true,
      bookmarked: false,
      applicationDeadline: '2024-12-20',
      driveDate: '2024-12-25',
      skills: ['Azure', 'DevOps', 'Cloud Architecture', 'Python', 'Docker']
    },
    {
      id: 3,
      companyName: 'Amazon',
      roleName: 'SDE-1',
      jobType: 'Full-time',
      location: 'Mumbai',
      salary: '₹22 LPA',
      deadline: '2024-12-10',
      status: 'Closed',
      applicants: 120,
      eligibility: 'B.Tech in CS/IT/ECE with CGPA ≥ 7.0',
      description: 'Build scalable distributed systems and services that power Amazon\'s e-commerce platform.',
      requirements: ['Proficiency in Java/C++', 'Understanding of distributed systems', 'Strong analytical skills'],
      rounds: ['Online Assessment', 'Technical Interview', 'Bar Raiser'],
      companyLogo: '/logos/amazon.png',
      applied: true,
      bookmarked: false,
      applicationDeadline: '2024-12-10',
      driveDate: '2024-12-15',
      skills: ['Java', 'AWS', 'Distributed Systems', 'Data Structures', 'Algorithms']
    },
    {
      id: 4,
      companyName: 'Infosys',
      roleName: 'Software Developer',
      jobType: 'Full-time',
      location: 'Pune',
      salary: '₹4.2 LPA',
      deadline: '2024-12-05',
      status: 'Upcoming',
      applicants: 156,
      eligibility: 'B.Tech/B.E in any stream with CGPA ≥ 6.0',
      description: 'Join Infosys as a Software Developer and work on diverse projects across multiple technologies.',
      requirements: ['Basic programming knowledge', 'Good communication skills', 'Eagerness to learn'],
      rounds: ['Aptitude Test', 'Technical Interview', 'HR Round'],
      companyLogo: '/logos/infosys.png',
      applied: false,
      bookmarked: true,
      applicationDeadline: '2024-12-05',
      driveDate: '2024-12-08',
      skills: ['Java', 'Web Development', 'Database', 'Communication']
    }
  ]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleApply = (driveId: number, companyName: string) => {
    toast({
      title: "Application Submitted",
      description: `Your application for ${companyName} has been submitted successfully.`,
    });
  };

  const handleBookmark = (driveId: number, companyName: string, isBookmarked: boolean) => {
    toast({
      title: isBookmarked ? "Removed from Bookmarks" : "Added to Bookmarks",
      description: `${companyName} drive ${isBookmarked ? 'removed from' : 'added to'} your bookmarks.`,
    });
  };

  const handleViewDetails = (driveId: number) => {
    toast({
      title: "Drive Details",
      description: "Opening detailed drive information...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <CheckCircle className="h-4 w-4" />;
      case 'Closed': return <XCircle className="h-4 w-4" />;
      case 'Upcoming': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || drive.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || drive.jobType.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalDrives: drives.length,
    openDrives: drives.filter(d => d.status === 'Open').length,
    appliedDrives: drives.filter(d => d.applied).length,
    bookmarkedDrives: drives.filter(d => d.bookmarked).length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Placement Drives</h1>
          <p className="text-muted-foreground">Explore and apply to placement opportunities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drives</p>
                <p className="text-3xl font-bold">{stats.totalDrives}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Drives</p>
                <p className="text-3xl font-bold text-green-600">{stats.openDrives}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="text-3xl font-bold text-blue-600">{stats.appliedDrives}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bookmarked</p>
                <p className="text-3xl font-bold text-orange-600">{stats.bookmarkedDrives}</p>
              </div>
              <Bookmark className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies or roles..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drives List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Drives</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredDrives.map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold">{drive.companyName}</h3>
                        <Badge className={`${getStatusColor(drive.status)} border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(drive.status)}
                            {drive.status}
                          </div>
                        </Badge>
                        {drive.applied && (
                          <Badge variant="secondary">Applied</Badge>
                        )}
                      </div>
                      <p className="text-lg font-medium text-primary mb-2">{drive.roleName}</p>
                      <p className="text-sm text-muted-foreground mb-3">{drive.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {drive.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {drive.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(drive.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {drive.applicants} applied
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {drive.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {drive.skills.length > 4 && (
                          <Badge variant="outline">
                            +{drive.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmark(drive.id, drive.companyName, drive.bookmarked)}
                    >
                      {drive.bookmarked ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(drive.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {drive.status === 'Open' && !drive.applied && (
                      <Button onClick={() => handleApply(drive.id, drive.companyName)}>
                        Apply Now
                      </Button>
                    )}
                    {drive.applied && (
                      <Button variant="secondary" disabled>
                        Applied
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Eligibility:</p>
                      <p className="text-muted-foreground">{drive.eligibility}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Selection Process:</p>
                      <p className="text-muted-foreground">{drive.rounds.join(' → ')}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Drive Date:</p>
                      <p className="text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          {filteredDrives.filter(drive => drive.applied).map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{drive.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{drive.roleName}</p>
                      <p className="text-xs text-muted-foreground">Applied on: {drive.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Applied</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{drive.salary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4">
          {filteredDrives.filter(drive => drive.bookmarked).map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{drive.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{drive.roleName}</p>
                      <p className="text-xs text-muted-foreground">Deadline: {drive.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmark(drive.id, drive.companyName, drive.bookmarked)}
                    >
                      <BookmarkCheck className="h-4 w-4" />
                    </Button>
                    {drive.status === 'Open' && !drive.applied && (
                      <Button onClick={() => handleApply(drive.id, drive.companyName)}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlacementDrives;