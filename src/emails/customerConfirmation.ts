import type { OrderFormData } from '../lib/orderSchema';

export function customerConfirmationHtml(data: OrderFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Keri Bakes Inquiry</title>
  <style>
    body { margin: 0; padding: 0; background: #F5EFE8; font-family: 'Jost', Helvetica, sans-serif; color: #4A4040; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; }
    .header { background: #D9C5C0; padding: 36px 40px; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.04em; color: #4A4040; }
    .body { padding: 36px 40px; }
    .body p { line-height: 1.7; margin: 0 0 16px; font-weight: 300; font-size: 15px; }
    .detail-row { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F5EFE8; font-size: 14px; }
    .detail-label { color: #A89BAE; width: 140px; flex-shrink: 0; font-weight: 300; }
    .detail-value { color: #4A4040; font-weight: 400; }
    .footer { padding: 24px 40px; background: #4A4040; color: rgba(245,239,232,0.6); font-size: 12px; font-weight: 200; letter-spacing: 0.08em; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Keri Bakes</h1>
      <p style="margin:8px 0 0; font-size:13px; font-weight:200; letter-spacing:0.1em; text-transform:uppercase; color:#4A4040; opacity:0.6;">
        Inquiry Received
      </p>
    </div>
    <div class="body">
      <p>Hi ${escHtml(data.name)},</p>
      <p>
        Thank you so much for reaching out! I've received your inquiry and will
        be in touch within <strong>24–48 hours</strong> to discuss the details
        and confirm availability.
      </p>
      <p>Here's a summary of what you submitted:</p>

      ${row('Cake', data.cakeSelection)}
      ${row('Requested Date', data.requestedDate)}
      ${row('Fulfillment', data.fulfillment === 'delivery' ? `Delivery — ${data.county}` : 'Pickup')}
      ${data.fulfillment === 'delivery' && data.address ? row('Address', data.address) : ''}

      <p style="margin-top:28px;">
        Can't wait to bake something special for you!<br/>
        <em>— Keri</em>
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Keri Bakes &middot; Orange County, CA
    </div>
  </div>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `
    <div class="detail-row">
      <span class="detail-label">${escHtml(label)}</span>
      <span class="detail-value">${escHtml(value)}</span>
    </div>`;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
