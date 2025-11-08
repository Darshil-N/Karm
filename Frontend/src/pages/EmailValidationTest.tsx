import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const EmailValidationTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [validationResult, setValidationResult] = useState('');

  const validateEmail = (email: string) => {
    const results = [];

    // Basic regex test
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    results.push(`Basic format: ${emailRegex.test(email) ? '✅' : '❌'}`);

    // Domain length check
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      results.push('Domain check: ❌ No @ symbol found');
    } else {
      const domain = emailParts[1];
      results.push(`Domain length: ${domain.length >= 3 ? '✅' : '❌'} (${domain.length} chars)`);
      
      // TLD check
      if (!domain.includes('.')) {
        results.push('TLD check: ❌ No dot in domain');
      } else {
        const tld = domain.split('.').pop();
        results.push(`TLD length: ${tld && tld.length >= 2 ? '✅' : '❌'} (${tld?.length || 0} chars)`);
      }
    }

    return results.join('\n');
  };

  const testEmail = () => {
    const result = validateEmail(email);
    setValidationResult(result);
  };

  const testExamples = [
    { email: 'ee@e.e', valid: false, reason: 'Domain too short' },
    { email: 'test@example.com', valid: true, reason: 'Perfect format' },
    { email: 'student@university.edu', valid: true, reason: 'Educational domain' },
    { email: 'john.doe@company.co', valid: true, reason: 'Valid with subdomain' },
    { email: 'user@test.a', valid: false, reason: 'TLD too short' },
    { email: 'invalid@a', valid: false, reason: 'No TLD' },
    { email: 'test@example', valid: false, reason: 'No TLD' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Validation Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test..."
              className="flex-1"
            />
            <Button onClick={testEmail}>Test</Button>
          </div>

          {validationResult && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm font-medium mb-1">Validation Results:</div>
              <pre className="text-sm whitespace-pre-line">{validationResult}</pre>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Example Emails:</h3>
            <div className="space-y-2">
              {testExamples.map((example, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <code className="text-sm">{example.email}</code>
                  <div className="text-sm">
                    <span className={example.valid ? 'text-green-600' : 'text-red-600'}>
                      {example.valid ? '✅' : '❌'}
                    </span>
                    <span className="ml-2 text-gray-600">{example.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold mb-2">Firebase Email Requirements:</h4>
            <ul className="text-sm space-y-1">
              <li>✅ Must be a valid email format (user@domain.tld)</li>
              <li>✅ Domain must be at least 3 characters long</li>
              <li>✅ Must have a valid TLD (top-level domain) like .com, .edu, .org</li>
              <li>✅ TLD must be at least 2 characters long</li>
              <li>✅ No spaces allowed</li>
              <li>✅ Case insensitive (automatically converted to lowercase)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailValidationTest;