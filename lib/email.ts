type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

type OrderItem = {
  productName?: string;
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number | string;
  size?: string | null;
  color?: string | null;
};

type OrderForEmail = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  guestAccessToken?: string | null;
  guest_access_token?: string | null;
  total?: number | string;
  subtotal?: number | string;
  tax?: number | string;
  shipping?: number | string;
  status?: string;
  paymentStatus?: string;
  payment_status?: string;
  trackingNumber?: string | null;
  tracking_number?: string | null;
  shippingAddress?: Record<string, any>;
  shipping_address?: Record<string, any>;
  items?: OrderItem[];
  order_items?: OrderItem[];
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

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNaira(amount: unknown) {
  const value = Number(amount || 0);
  return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function titleCase(value: unknown) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStoreUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return '';
}

function getOrderNumber(order: OrderForEmail) {
  return order.orderNumber || order.order_number || order.id;
}

function getShippingAddress(order: OrderForEmail) {
  return order.shippingAddress || order.shipping_address || {};
}

function getOrderItems(order: OrderForEmail) {
  return order.items || order.order_items || [];
}

function getPaymentStatus(order: OrderForEmail) {
  return order.paymentStatus || order.payment_status || 'pending';
}

function getTrackingNumber(order: OrderForEmail) {
  return order.trackingNumber || order.tracking_number || '';
}

function getGuestAccessToken(order: OrderForEmail) {
  return order.guestAccessToken || order.guest_access_token || '';
}

function getCustomerEmail(order: OrderForEmail) {
  return getShippingAddress(order).email || '';
}

function getCustomerName(order: OrderForEmail) {
  const address = getShippingAddress(order);
  return [address.firstName, address.lastName].filter(Boolean).join(' ') || 'Customer';
}

function getTrackingUrl(order: OrderForEmail) {
  const storeUrl = getStoreUrl();
  if (!storeUrl) return '';

  const token = getGuestAccessToken(order);
  const path = `/order-tracking/${order.id}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  return `${storeUrl}${path}`;
}

function orderItemsHtml(order: OrderForEmail) {
  const items = getOrderItems(order);
  if (!items.length) return '<p style="margin:0;color:#6b7280;">No items listed.</p>';

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:12px;">
      ${items
        .map((item) => {
          const name = item.productName || item.product_name || item.name || 'Product';
          const meta = [item.size ? `Size: ${item.size}` : '', item.color ? `Color: ${item.color}` : '']
            .filter(Boolean)
            .join(' • ');

          return `
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                <div style="font-weight:600;color:#111827;">${escapeHtml(name)}</div>
                ${meta ? `<div style="font-size:13px;color:#6b7280;margin-top:4px;">${escapeHtml(meta)}</div>` : ''}
                <div style="font-size:13px;color:#6b7280;margin-top:4px;">Qty: ${escapeHtml(item.quantity || 1)}</div>
              </td>
              <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600;">
                ${escapeHtml(formatNaira(Number(item.price || 0) * Number(item.quantity || 1)))}
              </td>
            </tr>
          `;
        })
        .join('')}
    </table>
  `;
}

function emailLayout(preheader: string, body: string) {
  return `
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>
    <div style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f4ef;padding:28px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #eee5da;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 18px;border-bottom:1px solid #f0e6d8;">
                  <div style="font-size:22px;font-weight:700;letter-spacing:1px;color:#111827;">DIVONE</div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  ${body}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px;background:#111827;color:#f9fafb;font-size:13px;line-height:1.6;">
                  Thank you for shopping with DIVONE. For support, reply to this email or contact us through the store.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function trySendEmail(payload: EmailPayload) {
  try {
    return await sendEmail(payload);
  } catch (error) {
    console.error('[email failed]', error);
    return { error: true };
  }
}

export async function sendOrderCreatedEmails(order: OrderForEmail) {
  const orderNumber = getOrderNumber(order);
  const customerEmail = getCustomerEmail(order);
  const adminEmail = getAdminEmail();
  const trackingUrl = getTrackingUrl(order);

  const customerBody = `
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#111827;">Order received</h1>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">Hi ${escapeHtml(getCustomerName(order))}, we received your order <strong>${escapeHtml(orderNumber)}</strong>. Please complete your bank transfer, then submit your payment confirmation from the payment page.</p>
    ${trackingUrl ? `<p style="margin:0 0 20px;"><a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:600;">Track order</a></p>` : ''}
    ${orderItemsHtml(order)}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
      <tr><td style="padding:4px 0;color:#6b7280;">Subtotal</td><td align="right" style="padding:4px 0;">${escapeHtml(formatNaira(order.subtotal))}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Shipping</td><td align="right" style="padding:4px 0;">${escapeHtml(formatNaira(order.shipping))}</td></tr>
      <tr><td style="padding:10px 0 0;font-weight:700;font-size:18px;">Total</td><td align="right" style="padding:10px 0 0;font-weight:700;font-size:18px;">${escapeHtml(formatNaira(order.total))}</td></tr>
    </table>
  `;

  const adminBody = `
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#111827;">New order placed</h1>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;"><strong>${escapeHtml(orderNumber)}</strong> was placed by ${escapeHtml(getCustomerName(order))} (${escapeHtml(customerEmail || 'No email')}).</p>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">Total: <strong>${escapeHtml(formatNaira(order.total))}</strong></p>
    ${orderItemsHtml(order)}
  `;

  await Promise.all([
    customerEmail
      ? trySendEmail({
          to: customerEmail,
          subject: `DIVONE order ${orderNumber} received`,
          html: emailLayout(`Order ${orderNumber} received`, customerBody),
        })
      : Promise.resolve(),
    adminEmail
      ? trySendEmail({
          to: adminEmail,
          subject: `New DIVONE order ${orderNumber}`,
          html: emailLayout(`New order ${orderNumber}`, adminBody),
        })
      : Promise.resolve(),
  ]);
}

export async function sendPaymentSubmittedEmail(order: OrderForEmail) {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return;

  const orderNumber = getOrderNumber(order);
  const address = getShippingAddress(order);
  const body = `
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#111827;">Payment confirmation submitted</h1>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">${escapeHtml(getCustomerName(order))} submitted payment confirmation for <strong>${escapeHtml(orderNumber)}</strong>.</p>
    <p style="margin:0;color:#374151;line-height:1.6;">Email: ${escapeHtml(address.email || 'No email')}</p>
    <p style="margin:0;color:#374151;line-height:1.6;">Phone: ${escapeHtml(address.phone || 'No phone')}</p>
    <p style="margin:16px 0 0;color:#374151;line-height:1.6;">Total: <strong>${escapeHtml(formatNaira(order.total))}</strong></p>
  `;

  await trySendEmail({
    to: adminEmail,
    subject: `Payment confirmation for ${orderNumber}`,
    html: emailLayout(`Payment confirmation for ${orderNumber}`, body),
  });
}

export async function sendOrderStatusEmail(order: OrderForEmail, previous?: { status?: string; paymentStatus?: string }) {
  const customerEmail = getCustomerEmail(order);
  if (!customerEmail) return;

  const orderNumber = getOrderNumber(order);
  const trackingUrl = getTrackingUrl(order);
  const status = order.status || 'pending';
  const paymentStatus = getPaymentStatus(order);
  const trackingNumber = getTrackingNumber(order);
  const changedPayment = previous?.paymentStatus && previous.paymentStatus !== paymentStatus;
  const changedStatus = previous?.status && previous.status !== status;

  if (!changedPayment && !changedStatus) return;

  const body = `
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#111827;">Order update</h1>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;">Hi ${escapeHtml(getCustomerName(order))}, your order <strong>${escapeHtml(orderNumber)}</strong> has been updated.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:12px 0 18px;background:#f9fafb;border-radius:6px;padding:12px;">
      <tr><td style="padding:4px 0;color:#6b7280;">Order status</td><td align="right" style="padding:4px 0;font-weight:700;">${escapeHtml(titleCase(status))}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Payment status</td><td align="right" style="padding:4px 0;font-weight:700;">${escapeHtml(paymentStatus === 'completed' ? 'Approved' : titleCase(paymentStatus))}</td></tr>
      ${trackingNumber ? `<tr><td style="padding:4px 0;color:#6b7280;">Tracking number</td><td align="right" style="padding:4px 0;font-weight:700;">${escapeHtml(trackingNumber)}</td></tr>` : ''}
    </table>
    ${trackingUrl ? `<p style="margin:0;"><a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:600;">Track order</a></p>` : ''}
  `;

  await trySendEmail({
    to: customerEmail,
    subject: `DIVONE order ${orderNumber} update`,
    html: emailLayout(`Order ${orderNumber} updated`, body),
  });
}
