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
      doc.text(student.phone, 20, 42);
      doc.text(student.location, 20, 49);

      // Education Section
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Education', 20, 65);
      
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(`${student.branch} - ${student.year}`, 20, 75);
      doc.text(`CGPA: ${student.cgpa}/10`, 20, 82);
      
      if (student.academicDetails) {
        doc.text(`10th Grade: ${student.academicDetails.tenthPercentage}%`, 20, 89);
        doc.text(`12th Grade: ${student.academicDetails.twelfthPercentage}%`, 20, 96);
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

      // Academic Details
      if (student.academicDetails) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Academic Performance', 20, 96);
        
        doc.setFontSize(12);
        doc.setTextColor(60);
        if (student.academicDetails.tenthPercentage) {
          doc.text(`10th Grade: ${student.academicDetails.tenthPercentage}%`, 20, 103);
        }
        if (student.academicDetails.twelfthPercentage) {
          doc.text(`12th Grade: ${student.academicDetails.twelfthPercentage}%`, 20, 110);
        }
        if (student.academicDetails.backlogs !== undefined) {
          doc.text(`Backlogs: ${student.academicDetails.backlogs}`, 20, 117);
        }
      }
                    <p className="text-2xl font-bold text-secondary">{student.academicDetails.twelfthPercentage}%</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Current CGPA</p>
                    <p className="text-2xl font-bold text-accent">{student.cgpa}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Backlogs</p>
                    <p className="text-2xl font-bold">{student.academicDetails.backlogs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.academicDetails.projects.map((project, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        <span className="text-sm text-muted-foreground">{project.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIdx) => (
                          <Badge key={techIdx} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Internships */}
            <Card>
              <CardHeader>
                <CardTitle>Internships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.academicDetails.internships.map((internship, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{internship.role} at {internship.company}</h4>
                        <span className="text-sm text-muted-foreground">{internship.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{internship.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.academicDetails.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placement" className="space-y-4">
            {/* Placement Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold text-primary">{student.applications}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold text-secondary">{student.offers}</p>
                  <p className="text-sm text-muted-foreground">Offers Received</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold text-accent">
                    {student.offers > 0 ? ((student.offers / student.applications) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Placement History */}
            <Card>
              <CardHeader>
                <CardTitle>Placement History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.placementHistory.map((history, idx) => (
                    <div key={idx} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                          {history.company[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold">{history.company}</h4>
                          <p className="text-sm text-muted-foreground">{history.role}</p>
                          <p className="text-xs text-muted-foreground">Applied: {history.applicationDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          history.status === 'Selected' ? 'bg-secondary text-secondary-foreground' :
                          history.status === 'In Process' ? 'bg-accent text-accent-foreground' :
                          history.status === 'Rejected' ? 'bg-destructive text-destructive-foreground' :
                          'bg-muted text-muted-foreground'
                        }>
                          {history.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{history.currentRound}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Resume', type: 'PDF', size: '245 KB', uploaded: '2024-10-15' },
                    { name: '10th Marksheet', type: 'PDF', size: '182 KB', uploaded: '2024-09-20' },
                    { name: '12th Marksheet', type: 'PDF', size: '195 KB', uploaded: '2024-09-20' },
                    { name: 'College Transcript', type: 'PDF', size: '320 KB', uploaded: '2024-11-01' },
                    { name: 'Aadhaar Card', type: 'PDF', size: '156 KB', uploaded: '2024-09-18' },
                    { name: 'Passport Photo', type: 'JPG', size: '45 KB', uploaded: '2024-09-18' },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • Uploaded {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;