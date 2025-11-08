import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/services/firebaseService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Star, 
  Calendar,
  Briefcase,
  Award,
  Code,
  FileText
} from 'lucide-react';

interface StudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

const StudentProfileModal = ({ open, onOpenChange, student }: StudentProfileModalProps) => {
  const { toast } = useToast();

  const handleDownloadResume = () => {
    if (!student) return;

    toast({
      title: "Generating Resume",
      description: `Creating PDF resume for ${student.name}...`,
    });

    try {
      // Create a comprehensive resume PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(40);
      doc.text(student.name, 20, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(student.email, 20, 35);
      if (student.phone) doc.text(student.phone, 20, 42);
      if (student.location) doc.text(student.location, 20, 49);

      // Education Section
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Education', 20, 65);
      
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(`${student.branch || 'N/A'} - ${student.year || 'N/A'}`, 20, 75);
      doc.text(`CGPA: ${student.cgpa || 'N/A'}/10`, 20, 82);
      
      if (student.academicDetails) {
        if (student.academicDetails.tenthPercentage) {
          doc.text(`10th Grade: ${student.academicDetails.tenthPercentage}%`, 20, 89);
        }
        if (student.academicDetails.twelfthPercentage) {
          doc.text(`12th Grade: ${student.academicDetails.twelfthPercentage}%`, 20, 96);
        }
        if (student.academicDetails.backlogs > 0) {
          doc.text(`Backlogs: ${student.academicDetails.backlogs}`, 20, 103);
        }
      }

      // Skills Section
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Skills', 20, 120);
      
      doc.setFontSize(12);
      doc.setTextColor(60);
      const skillsText = (student.skillSet || []).join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, 130);

      // Projects Section
      if (student.academicDetails?.projects && student.academicDetails.projects.length > 0) {
        let yPosition = 150;
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Projects', 20, yPosition);
        
        student.academicDetails.projects.forEach((project, index) => {
          yPosition += 15;
          doc.setFontSize(14);
          doc.setTextColor(60);
          doc.text(`${index + 1}. ${project.title}`, 20, yPosition);
          
          yPosition += 8;
          doc.setFontSize(10);
          doc.setTextColor(80);
          const descLines = doc.splitTextToSize(project.description, 170);
          doc.text(descLines, 25, yPosition);
          
          yPosition += descLines.length * 5;
          doc.text(`Technologies: ${project.technologies.join(', ')}`, 25, yPosition);
          doc.text(`Duration: ${project.duration}`, 25, yPosition + 5);
          yPosition += 10;
        });
      }

      // Placement Information
      let placementY = 220;
      if (student.placementStatus === 'Placed' && student.company) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Placement Details', 20, placementY);
        
        doc.setFontSize(12);
        doc.setTextColor(60);
        doc.text(`Company: ${student.company}`, 20, placementY + 12);
        if (student.package) doc.text(`Package: ${student.package}`, 20, placementY + 19);
        doc.text(`Status: ${student.placementStatus}`, 20, placementY + 26);
      }

      // Save the PDF
      const fileName = `${student.name.replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(fileName);

      toast({
        title: "Resume Downloaded",
        description: `${student.name}'s resume has been downloaded successfully.`,
      });

    } catch (error) {
      toast({
        title: "Error Generating Resume",
        description: "There was an error creating the resume PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{student.name} - Student Profile</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                <Download className="h-4 w-4 mr-1" />
                Resume
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.studentId || 'N/A'}</p>
                    <Badge className={
                      student.placementStatus === 'Placed' ? 'bg-secondary text-secondary-foreground' :
                      student.placementStatus === 'In Process' ? 'bg-accent text-accent-foreground' :
                      'bg-muted text-muted-foreground'
                    }>
                      {student.placementStatus || 'Unplaced'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {student.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {student.location || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {student.branch || 'N/A'} - {student.year || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CGPA</span>
                    <span className="font-bold text-primary">{student.cgpa || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Resume Score</span>
                    <span className="font-bold text-secondary">{student.resumeScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="font-bold">{student.applications || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Offers</span>
                    <span className="font-bold text-accent">{student.offers || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(student.skillSet || []).map((skill, idx) => (
                  <Badge key={idx} variant="outline">{skill}</Badge>
                ))}
                {(!student.skillSet || student.skillSet.length === 0) && (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Placement Status */}
          {student.company && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Current Placement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{student.company}</h4>
                    <p className="text-muted-foreground">Package: {student.package || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;