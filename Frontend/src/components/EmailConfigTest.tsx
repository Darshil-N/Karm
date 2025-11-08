// Email Configuration Test Component
// Add this to any page to test email setup

import { checkEmailConfiguration } from '../lib/emailService';

export function EmailConfigTest() {
  const config = checkEmailConfiguration();
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50 m-4">
      <h3 className="font-bold mb-2">Email Configuration Test</h3>
      <div className={`p-2 rounded ${config.configured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <strong>Status:</strong> {config.configured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}
      </div>
      <div className="mt-2">
        <strong>Service:</strong> {config.service}
      </div>
      {config.issues.length > 0 && (
        <div className="mt-2">
          <strong>Issues:</strong>
          <ul className="list-disc list-inside">
            {config.issues.map((issue, index) => (
              <li key={index} className="text-red-600">{issue}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-600">
        Check browser console for detailed logs
      </div>
    </div>
  );
}