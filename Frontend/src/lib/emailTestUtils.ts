import { sendBulkEmailFree, checkEmailConfiguration } from './emailService';

// Test email configuration and sending
export const testEmailService = async (testEmail: string): Promise<void> => {
  console.log('🔧 Starting email test...');
  console.log('📧 Test email address:', testEmail);
  
  const config = checkEmailConfiguration();
  console.log('⚙️ Configuration status:', config);
  
  if (!config.configured) {
    console.error('❌ Email service not configured:', config.issues);
    throw new Error(`Email service not configured: ${config.issues.join(', ')}`);
  }
  
  try {
    console.log(`📤 Testing ${config.service}...`);
    
    const testEmailData = {
      to: [testEmail],
      subject: '🧪 Test Email from Karm Placement Portal',
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🧪 Test Email Successful!</h2>
          <p>This is a test email from the Karm Placement Portal.</p>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📊 Test Details:</h3>
            <ul>
              <li><strong>Service used:</strong> ${config.service}</li>
              <li><strong>Sent to:</strong> ${testEmail}</li>
              <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Status:</strong> ✅ Email service working correctly!</li>
            </ul>
          </div>
          
          <p><strong>✅ If you received this email, your email configuration is working perfectly!</strong></p>
          
          <hr style="margin: 20px 0;">
          <small style="color: #6B7280;">
            This is an automated test email from Karm Placement Portal<br>
            Time: ${new Date().toISOString()}
          </small>
        </div>
      `,
      from: 'noreply@karm-placement.com',
      senderName: '🎓 Karm Placement Portal'
    };
    
    console.log('📨 Sending test email with data:', {
      to: testEmailData.to,
      subject: testEmailData.subject,
      service: config.service
    });
    
    const result = await sendBulkEmailFree(testEmailData);
    
    console.log('📊 Email send result:', result);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log(`📤 Sent: ${result.sentCount} email(s)`);
      console.log(`❌ Failed: ${result.failedCount} email(s)`);
      
      if (result.failedCount > 0) {
        console.warn('⚠️ Some emails failed:', result.errors);
      }
    } else {
      console.error('❌ Email test failed:', result.errors);
      throw new Error(`Email sending failed: ${result.errors.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
    throw error;
  }
};

// Helper function to validate email configuration in development
export const validateEmailSetup = (): void => {
  const config = checkEmailConfiguration();
  
  if (import.meta.env.DEV) {
    console.log('🔧 Email Service Configuration Check:');
    console.log('- Configured:', config.configured);
    console.log('- Service:', config.service);
    
    if (config.issues.length > 0) {
      console.warn('- Issues:', config.issues);
      console.log('📖 Setup instructions: See EMAIL_SETUP.md file');
    } else {
      console.log('✅ Email service ready!');
    }
  }
};