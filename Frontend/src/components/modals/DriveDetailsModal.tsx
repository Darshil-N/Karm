import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Drive {
  id: number;
  companyName: string;
  roleName: string;
  salary: string;
  location: string;
  deadline: string;
  status: string;
  type: string;
  description: string;
  requirements: string[];
  rounds: string[];
  benefits: string;
  contactEmail: string;
  contactPhone: string;
}

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: number;
  skills: string[];
  resumeUrl: string;
  applicationDate: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Selected';
  currentRound: string;
  notes: string;
}

interface DriveDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: Drive | null;
}

const DriveDetailsModal = ({ open, onOpenChange, drive }: DriveDetailsModalProps) => {
  const { toast } = useToast();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedDrive, setEditedDrive] = useState<Drive | null>(drive);

  // Mock applicant data - replace with Firebase data
  const mockApplicants: Applicant[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 9876543210',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 8.7,
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      resumeUrl: '/resumes/rahul-sharma.pdf',
      applicationDate: '2024-11-01',
      status: 'Shortlisted',
      currentRound: 'Technical Round',
      notes: 'Strong technical background, good communication skills.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 9876543211',
      branch: 'Information Technology',
      year: '4th Year',
      cgpa: 9.1,
      skills: ['Java', 'Spring', 'Angular', 'Docker'],
      resumeUrl: '/resumes/priya-patel.pdf',
      applicationDate: '2024-10-30',
      status: 'Selected',
      currentRound: 'Completed',
      notes: 'Excellent performance in all rounds.'
    },
    {
      id: 3,
      name: 'Arjun Singh',
      email: 'arjun@example.com',
      phone: '+91 9876543212',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 7.8,
      skills: ['C++', 'Data Structures', 'Algorithms'],
      resumeUrl: '/resumes/arjun-singh.pdf',
      applicationDate: '2024-11-02',
      status: 'Applied',
      currentRound: 'Resume Screening',
      notes: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected': return 'bg-secondary text-secondary-foreground';
      case 'Shortlisted': return 'bg-primary text-primary-foreground';
      case 'Applied': return 'bg-accent text-accent-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Selected': return <CheckCircle className="h-4 w-4" />;
      case 'Shortlisted': return <Star className="h-4 w-4" />;
      case 'Applied': return <Clock className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = (applicantId: number, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Applicant status updated to ${newStatus}`,
    });
    // Update status in Firebase
  };

  const handleDownloadResume = (applicant: Applicant) => {
    toast({
      title: "Download Resume",
      description: `Downloading ${applicant.name}'s resume...`,
    });
  };

  const handleEditDrive = () => {
    setEditMode(true);
    setEditedDrive(drive);
  };

  const handleSaveDrive = () => {
    toast({
      title: "Drive Updated",
      description: "Drive details have been updated successfully.",
    });
    setEditMode(false);
    // Save to Firebase
  };

  const handleDeleteDrive = () => {
    toast({
      title: "Delete Drive",
      description: "Are you sure you want to delete this drive?",
      variant: "destructive",
    });
  };

  const filteredApplicants = mockApplicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!drive) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{drive.companyName} - {drive.roleName}</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEditDrive}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeleteDrive}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Drive Overview</TabsTrigger>
              <TabsTrigger value="applicants">Applicants ({mockApplicants.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <Input 
                        value={editedDrive?.companyName || ''} 
                        onChange={(e) => setEditedDrive(prev => prev ? {...prev, companyName: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role Name</label>
                      <Input 
                        value={editedDrive?.roleName || ''} 
                        onChange={(e) => setEditedDrive(prev => prev ? {...prev, roleName: e.target.value} : null)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      value={editedDrive?.description || ''} 
                      onChange={(e) => setEditedDrive(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveDrive}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Company</span>
                        </div>
                        <p className="font-bold">{drive.companyName}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">Location</span>
                        </div>
                        <p className="font-bold">{drive.location}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">Deadline</span>
                        </div>
                        <p className="font-bold">{drive.deadline}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{drive.description}</p>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {drive.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline">{req}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Selection Rounds</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {drive.rounds.map((round, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {round}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{drive.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{drive.contactPhone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applicants" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Applicants List */}
              <div className="space-y-3">
                {filteredApplicants.map((applicant) => (
                  <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {applicant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold">{applicant.name}</h4>
                              <Badge className={getStatusColor(applicant.status)}>
                                {getStatusIcon(applicant.status)}
                                <span className="ml-1">{applicant.status}</span>
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div>{applicant.email}</div>
                              <div>{applicant.branch} - {applicant.year}</div>
                              <div>CGPA: {applicant.cgpa}</div>
                              <div>Current Round: {applicant.currentRound}</div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {applicant.skills.slice(0, 4).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedApplicant(applicant)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadResume(applicant)}>
                            <Download className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{mockApplicants.length}</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">
                        {mockApplicants.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Shortlisted</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">
                        {mockApplicants.filter(a => a.status === 'Selected').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Selected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedApplicant.name} - Application Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedApplicant.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{selectedApplicant.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Branch</label>
                  <p>{selectedApplicant.branch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CGPA</label>
                  <p>{selectedApplicant.cgpa}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApplicant.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(selectedApplicant.status)}>
                    {getStatusIcon(selectedApplicant.status)}
                    <span className="ml-1">{selectedApplicant.status}</span>
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="mt-1 text-sm">{selectedApplicant.notes || 'No notes available'}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUpdateStatus(selectedApplicant.id, 'Shortlisted')}>
                  Shortlist
                </Button>
                <Button onClick={() => handleUpdateStatus(selectedApplicant.id, 'Selected')}>
                  Select
                </Button>
                <Button variant="outline" onClick={() => handleUpdateStatus(selectedApplicant.id, 'Rejected')}>
                  Reject
                </Button>
                <Button variant="outline" onClick={() => handleDownloadResume(selectedApplicant)}>
                  <Download className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DriveDetailsModal;