import React, { useState } from 'react';
import { StudentService } from '../services/firebaseService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const WorkflowTest: React.FC = () => {
  const [testData, setTestData] = useState({
    name: 'Test Student',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
    university: 'Test University',
    universityId: 'test-uni-id',
    hodEmail: 'hod@test.com',
    hodUid: 'test-hod-uid'
  });
  
  const [pendingStudentId, setPendingStudentId] = useState('');
  const [status, setStatus] = useState('');

  const testSignup = async () => {
    try {
      setStatus('Creating student account...');
      const studentId = await StudentService.createPendingStudent(testData);
      setPendingStudentId(studentId);
      setStatus(`✅ Student account created! Pending approval. ID: ${studentId}`);
    } catch (error: any) {
      setStatus(`❌ Signup failed: ${error.message}`);
    }
  };

  const testApproval = async () => {
    if (!pendingStudentId) {
      setStatus('❌ No pending student ID available');
      return;
    }
    
    try {
      setStatus('Approving student...');
      await StudentService.approveStudent(pendingStudentId);
      setStatus('✅ Student approved! They can now login.');
    } catch (error: any) {
      setStatus(`❌ Approval failed: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setStatus('Testing student login...');
      const result = await StudentService.loginStudent(testData.email, testData.password);
      setStatus(`✅ Login successful! Welcome ${result.studentData.name}`);
    } catch (error: any) {
      setStatus(`❌ Login failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Workflow Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email:</label>
            <Input
              type="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Password:</label>
            <Input
              type="password"
              value={testData.password}
              onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button onClick={testSignup} variant="default">
              1. Test Signup (Create Auth + Pending)
            </Button>
            <Button onClick={testApproval} variant="secondary" disabled={!pendingStudentId}>
              2. Test HOD Approval
            </Button>
            <Button onClick={testLogin} variant="outline">
              3. Test Student Login
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium mb-1">Status:</div>
            <div className="text-sm">{status}</div>
          </div>

          {pendingStudentId && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="text-sm font-medium mb-1">Pending Student ID:</div>
              <div className="text-sm font-mono">{pendingStudentId}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTest;