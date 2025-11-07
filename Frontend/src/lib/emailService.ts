import emailjs from '@emailjs/browser';

// EmailJS configuration - get these from your EmailJS dashboard
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_karm_placement';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_bulk_email';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your-public-key';

// Alternative service configurations
const SMTP_TOKEN = import.meta.env.VITE_SMTP_TOKEN || 'your-smtp-token';
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'your-web3forms-key';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your-public-key') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Configuration check function
export const checkEmailConfiguration = (): { configured: boolean; service: string; issues: string[] } => {
  const issues: string[] = [];
  
  // Check EmailJS configuration
  if (EMAILJS_SERVICE_ID === 'service_karm_placement' || !EMAILJS_SERVICE_ID) {
    issues.push('EmailJS Service ID not configured');
  }
  if (EMAILJS_TEMPLATE_ID === 'template_bulk_email' || !EMAILJS_TEMPLATE_ID) {
    issues.push('EmailJS Template ID not configured');
  }
  if (EMAILJS_PUBLIC_KEY === 'your-public-key' || !EMAILJS_PUBLIC_KEY) {
    issues.push('EmailJS Public Key not configured');
  }
  
  if (issues.length === 0) {
    return { configured: true, service: 'EmailJS', issues: [] };
  }
  
  // Check alternative services
  if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'your-web3forms-key') {
    return { configured: true, service: 'Web3Forms', issues: [] };
  }
  
  if (SMTP_TOKEN && SMTP_TOKEN !== 'your-smtp-token') {
    return { configured: true, service: 'SMTP.js', issues: [] };
  }
  
  return { 
    configured: false, 
    service: 'none', 
    issues: [
      ...issues,
      'No alternative email service configured',
      'Please configure at least one email service'
    ]
  };
};

export interface EmailData {
  to: string[];
  subject: string;
  message: string;
  from: string;
  senderName: string;
}

export interface EmailResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  errors: string[];
}

// Send bulk email using EmailJS
export const sendBulkEmailJS = async (emailData: EmailData): Promise<EmailResult> => {
  const result: EmailResult = {
    success: true,
    sentCount: 0,
    failedCount: 0,
    errors: []
  };

  // EmailJS has limitations on bulk sending, so we'll send emails one by one
  // For better user experience, we'll batch them
  const batchSize = 5; // Send 5 emails at a time to avoid rate limiting
  const batches = [];
  
  for (let i = 0; i < emailData.to.length; i += batchSize) {
    batches.push(emailData.to.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (recipientEmail) => {
      try {
        const templateParams = {
          to_email: recipientEmail,
          from_name: emailData.senderName,
          from_email: emailData.from,
          subject: emailData.subject,
          message: emailData.message,
          // Add any additional template variables here
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );
        
        result.sentCount++;
        return { success: true, email: recipientEmail };
      } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
        result.failedCount++;
        result.errors.push(`Failed to send to ${recipientEmail}: ${error}`);
        return { success: false, email: recipientEmail, error };
      }
    });

    // Wait for current batch to complete before starting next batch
    await Promise.allSettled(batchPromises);
    
    // Add delay between batches to respect rate limits
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
  }

  result.success = result.failedCount === 0;
  return result;
};

// Alternative: Send a single email to yourself with all recipients in BCC
// This is more efficient but less personalized
export const sendBulkEmailSingle = async (emailData: EmailData): Promise<EmailResult> => {
  const result: EmailResult = {
    success: false,
    sentCount: 0,
    failedCount: 0,
    errors: []
  };

  try {
    const templateParams = {
      to_email: emailData.from, // Send to yourself
      bcc_emails: emailData.to.join(', '), // BCC all recipients
      from_name: emailData.senderName,
      from_email: emailData.from,
      subject: emailData.subject,
      message: emailData.message,
      recipient_count: emailData.to.length,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_bulk_email_single', // Different template for single email
      templateParams
    );

    result.success = true;
    result.sentCount = emailData.to.length;
  } catch (error) {
    console.error('Failed to send bulk email:', error);
    result.failedCount = emailData.to.length;
    result.errors.push(`Bulk send failed: ${error}`);
  }

  return result;
};

// SMTP.js alternative (completely free, no signup required)
// Note: Requires adding <script src="https://smtpjs.com/v3/smtp.js"></script> to index.html
export const sendBulkEmailSMTP = async (emailData: EmailData): Promise<EmailResult> => {
  const result: EmailResult = {
    success: false,
    sentCount: 0,
    failedCount: 0,
    errors: []
  };

  try {
    // Check if SMTP.js is loaded
    // @ts-ignore - SMTP Email is loaded via CDN
    if (typeof window !== 'undefined' && (window as any).Email) {
      // @ts-ignore - SMTP Email is loaded via CDN
      const response = await (window as any).Email.send({
        SecureToken: SMTP_TOKEN,
        To: emailData.to.join(','),
        From: emailData.from,
        Subject: emailData.subject,
        Body: emailData.message
      });

      if (response === 'OK') {
        result.success = true;
        result.sentCount = emailData.to.length;
      } else {
        result.errors.push(`SMTP send failed: ${response}`);
        result.failedCount = emailData.to.length;
      }
    } else {
      throw new Error('SMTP.js not loaded. Please add the script to index.html');
    }
  } catch (error) {
    console.error('SMTP send failed:', error);
    result.failedCount = emailData.to.length;
    result.errors.push(`SMTP send failed: ${error}`);
  }

  return result;
};

// Web3Forms alternative (completely free)
export const sendBulkEmailWeb3Forms = async (emailData: EmailData): Promise<EmailResult> => {
  const result: EmailResult = {
    success: false,
    sentCount: 0,
    failedCount: 0,
    errors: []
  };

  try {
    console.log('🌐 Using Web3Forms service');
    console.log('📧 Recipients:', emailData.to);
    console.log('📝 Subject:', emailData.subject);
    console.log('🔑 Access Key:', WEB3FORMS_ACCESS_KEY ? 'Configured' : 'Missing');

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', emailData.senderName);
    formData.append('email', emailData.from);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    
    // Add recipients info
    formData.append('to', emailData.to.join(', '));
    
    console.log('📤 Sending request to Web3Forms API...');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);

    if (response.ok) {
      const responseData = await response.json();
      console.log('✅ Web3Forms response:', responseData);
      
      result.success = true;
      result.sentCount = emailData.to.length;
      console.log(`✅ Email sent successfully to ${emailData.to.length} recipient(s)`);
    } else {
      const errorData = await response.json();
      console.error('❌ Web3Forms error response:', errorData);
      result.errors.push(`Web3Forms failed: ${errorData.message || 'Unknown error'}`);
      result.failedCount = emailData.to.length;
    }
  } catch (error) {
    console.error('❌ Web3Forms send failed:', error);
    result.failedCount = emailData.to.length;
    result.errors.push(`Web3Forms send failed: ${error}`);
  }

  return result;
};

// Smart email service - automatically selects the best available service
export const sendBulkEmailSmart = async (emailData: EmailData): Promise<EmailResult> => {
  const config = checkEmailConfiguration();
  
  if (!config.configured) {
    return {
      success: false,
      sentCount: 0,
      failedCount: emailData.to.length,
      errors: [
        'No email service configured. Please set up one of the following:',
        '1. EmailJS (recommended) - See EMAIL_SETUP.md',
        '2. Web3Forms - Get free access key from web3forms.com',
        '3. SMTP.js - Get token from smtpjs.com',
        ...config.issues
      ]
    };
  }
  
  console.log(`Using ${config.service} for email delivery`);
  
  try {
    switch (config.service) {
      case 'EmailJS':
        return await sendBulkEmailJS(emailData);
      case 'Web3Forms':
        return await sendBulkEmailWeb3Forms(emailData);
      case 'SMTP.js':
        return await sendBulkEmailSMTP(emailData);
      default:
        throw new Error('No valid email service available');
    }
  } catch (error) {
    console.error(`${config.service} failed, trying fallback services...`, error);
    
    // Try fallback services if the primary one fails
    const services = [sendBulkEmailWeb3Forms, sendBulkEmailSMTP];
    
    for (const service of services) {
      try {
        console.log('Attempting fallback email service...');
        return await service(emailData);
      } catch (fallbackError) {
        console.warn('Fallback service also failed:', fallbackError);
      }
    }
    
    // If all services fail
    return {
      success: false,
      sentCount: 0,
      failedCount: emailData.to.length,
      errors: [`All email services failed. Primary error: ${error}`]
    };
  }
};

// Default export - use smart service selection
export const sendBulkEmailFree = sendBulkEmailSmart;