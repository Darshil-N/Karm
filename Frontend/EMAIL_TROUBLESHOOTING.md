# Email Troubleshooting Guide

## 🔍 Why You Might Not See Test Emails

### 1. **Check These Places First:**
- ✅ **Spam/Junk Folder** - Most common issue
- ✅ **Promotions Tab** (Gmail)
- ✅ **Other/Updates Tab** (Gmail)
- ✅ **Inbox** (may take 2-5 minutes)

### 2. **Web3Forms Specific Issues:**

**Check if Web3Forms is working:**
1. Open browser console (F12)
2. Send a test email
3. Look for these logs:
   ```
   🌐 Using Web3Forms service
   📧 Recipients: [your-email]
   🔑 Access Key: Configured
   📤 Sending request to Web3Forms API...
   ✅ Web3Forms response: {success: true}
   ```

**Common Web3Forms Problems:**
- ❌ **Invalid Access Key** - Check `.env` file
- ❌ **Rate Limiting** - Wait 1 minute between tests
- ❌ **Network Issues** - Check internet connection

### 3. **Debug Steps:**

**Step 1: Check Configuration**
```bash
# In browser console, run:
localStorage.getItem('email-debug') || 'Not set'
```

**Step 2: Verify Environment Variables**
```bash
# Check if .env file exists with:
VITE_WEB3FORMS_ACCESS_KEY=62b535ab-702c-493a-8818-3e1e99120073
```

**Step 3: Test Web3Forms Directly**
Open: https://web3forms.com/api/test
- Enter your access key: `62b535ab-702c-493a-8818-3e1e99120073`
- Test with your email address

### 4. **Alternative Testing Methods:**

**Method 1: Use a Different Email Service**
```bash
# Add to .env file:
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Method 2: Test with Multiple Email Addresses**
- Gmail: your-email@gmail.com
- Outlook: your-email@outlook.com
- Yahoo: your-email@yahoo.com

### 5. **Check Email Content Issues:**

**HTML Content Problems:**
- Some email providers block HTML emails
- Images might not display
- Links might be filtered

**Sender Reputation:**
- `noreply@karm-placement.com` might be flagged
- Try changing sender email in emailService.ts

### 6. **Web3Forms Limitations:**

- **Free Tier**: 250 emails/month
- **Rate Limit**: 1 email per minute for free accounts
- **Content Filtering**: Some content might be blocked

### 7. **Debugging Commands:**

**Open browser console and run:**

```javascript
// Check email configuration
import('./lib/emailService.js').then(service => {
  console.log(service.checkEmailConfiguration());
});

// Test Web3Forms directly
fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    access_key: '62b535ab-702c-493a-8818-3e1e99120073',
    email: 'your-email@example.com',
    subject: 'Direct API Test',
    message: 'Testing Web3Forms API directly'
  })
}).then(r => r.json()).then(console.log);
```

### 8. **Quick Fixes:**

**Fix 1: Restart Dev Server**
```bash
npm run dev
```

**Fix 2: Clear Browser Cache**
- Ctrl + F5 (Windows)
- Cmd + Shift + R (Mac)

**Fix 3: Try Incognito Mode**
- Rules out browser extensions

**Fix 4: Use a Different Email Provider**
```bash
# Try with a different email provider
# Gmail, Yahoo, Outlook, etc.
```

### 9. **Expected Timeline:**
- **Web3Forms**: Usually instant, max 2-3 minutes
- **EmailJS**: Usually instant, max 1-2 minutes
- **SMTP.js**: Depends on your email provider

### 10. **Contact Support:**
If none of the above work:
1. Check Web3Forms status: https://status.web3forms.com/
2. Try their contact form: https://web3forms.com/contact
3. Use alternative email service (EmailJS)

---

## 🚀 Quick Test Script

Run this in your browser console to test everything:

```javascript
console.log('🔧 Email Service Debug Test');
console.log('Environment:', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ? 'Configured' : 'Missing');
console.log('Service URL:', 'https://api.web3forms.com/submit');
console.log('Rate limits: 1 email/minute for free accounts');
```