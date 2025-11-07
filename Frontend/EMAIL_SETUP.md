# EmailJS Configuration

This project uses EmailJS as a free alternative to Firebase Cloud Functions for sending bulk emails.

## Setup Steps:

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. Go to Email Services section
2. Add a new service (Gmail, Outlook, etc.)
3. Follow the OAuth flow to connect your email
4. Note down the **Service ID** (e.g., `service_gmail`)

### 3. Create Email Template
1. Go to Email Templates section
2. Create a new template with the following variables:
   ```
   Subject: {{subject}}
   From Name: {{from_name}}
   From Email: {{from_email}}
   To Email: {{to_email}}
   Message: {{message}}
   ```
3. Template content:
   ```html
   <h2>{{subject}}</h2>
   <p>From: {{from_name}} ({{from_email}})</p>
   <hr>
   <div>{{message}}</div>
   ```
4. Note down the **Template ID** (e.g., `template_abc123`)

### 4. Get Public Key
1. Go to Account -> General
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### 5. Update Configuration
Update the following constants in `/src/lib/emailService.ts`:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id';     // From step 2
const EMAILJS_TEMPLATE_ID = 'your_template_id';   // From step 3  
const EMAILJS_PUBLIC_KEY = 'your_public_key';     // From step 4
```

## Free Tier Limits:
- **200 emails/month** for free
- Rate limiting: ~10 emails/minute
- No credit card required

## Alternative Free Services:

### 1. SMTP.js (No signup required)
```javascript
// Add to index.html:
<script src="https://smtpjs.com/v3/smtp.js"></script>

// Use sendBulkEmailSMTP function
```

### 2. Web3Forms (Free tier: 1000 emails/month)
```javascript
// Get access key from web3forms.com
// Use sendBulkEmailWeb3Forms function
```

## Testing:
1. Update the configuration values
2. Test with 1-2 recipients first
3. Check spam folders initially
4. Monitor EmailJS dashboard for delivery status

## Production Considerations:
- Set up proper email templates
- Add error handling and retry logic
- Consider upgrading EmailJS plan for higher limits
- Implement email delivery status tracking