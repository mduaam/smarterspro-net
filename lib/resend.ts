import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 're_12345678901234567890123456789012';
export const resend = new Resend(apiKey);

const FROM_EMAIL = 'IPTV Smarters Pro <noreply@iptvsmartersprofficiel.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return { success: false, error };
  }
}

// 1. Welcome Email Template
export async function sendWelcomeEmail(email: string, fullName: string) {
  const subject = 'Welcome to IPTV Smarters Pro Officiel!';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
      <h2 style="color: #2563eb; margin-bottom: 20px;">Welcome to the Official Clone of IPTV Smarters Pro</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for creating your account on our portal! You can now choose a subscription package and place an order to get instant setup instructions.</p>
      <p style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Browse Plans</a>
      </p>
      <p>If you have any questions, open a support ticket from your personal dashboard or contact us on WhatsApp.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b7280;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
}

// 2. Payment Instructions Email Template
export async function sendPaymentInstructionsEmail(
  email: string, 
  fullName: string, 
  planType: string, 
  amount: number, 
  bankDetails: string, 
  whatsappNumber?: string
) {
  const subject = `Payment Instructions for Your ${planType} Plan Order`;
  const formattedAmount = (amount / 100).toFixed(2);
  const whatsappCTA = whatsappNumber 
    ? `<p style="margin: 25px 0;">
         <a href="https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi!%20I%20just%20placed%20an%20order%20for%20the%20${planType}%20plan%20under%20my%20email%20${email}." style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Send Receipt via WhatsApp</a>
       </p>`
    : '';

  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
      <h2 style="color: #2563eb; margin-bottom: 20px;">Order Registered - Manual Payment Action Required</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>We received your subscription order for the <strong>${planType} Plan</strong> (€${formattedAmount}/month). To activate your service, please perform a manual bank transfer using the instructions below:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #111827;">Bank Details for Transfer</h4>
        <p style="font-family: monospace; white-space: pre-wrap; margin: 0;">${bankDetails}</p>
      </div>

      <p><strong>Note on Activation:</strong> Once the transfer is completed, please upload a screenshot of your transfer receipt to your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Customer Dashboard</a> by opening a support ticket, or contact us directly on WhatsApp for expedited activation.</p>

      ${whatsappCTA}

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b7280;">IPTV Smarters Pro Official Clone Support Team.</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
}

// 3. Subscription Activated Email Template
export async function sendSubscriptionActivatedEmail(
  email: string, 
  fullName: string, 
  planType: string, 
  expiryDate: string
) {
  const subject = `Your ${planType} Subscription is Now ACTIVE!`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
      <h2 style="color: #22c55e; margin-bottom: 20px;">Subscription Successfully Activated! 🎉</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Great news! We have successfully confirmed your manual payment. Your <strong>${planType} Plan</strong> subscription is now active.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; color: #166534;"><strong>Plan:</strong> ${planType}</p>
        <p style="margin: 5px 0 0 0; color: #166534;"><strong>Expiry Date:</strong> ${expiryDate}</p>
      </div>

      <p>You can access your setup guide, manage your profile, or chat with support right now in your dashboard.</p>
      
      <p style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b7280;">Thanks for choosing IPTV Smarters Pro Clone!</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
}
