type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'DIVONE <onboarding@resend.dev>';

  if (!apiKey) {
    console.log('[email skipped]', { to, subject });
    return { skipped: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email failed: ${text}`);
  }

  return response.json();
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || '';
}
