import type { OrderFormData } from '../lib/orderSchema';

export function ownerNotificationHtml(data: OrderFormData): string {
  const fulfillmentDetail =
    data.fulfillment === 'delivery'
      ? `Delivery → ${data.county}${data.address ? ` / ${data.address}` : ''}`
      : 'Pickup';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Keri Bakes Inquiry</title>
  <style>
    body { margin: 0; padding: 0; background: #F5EFE8; font-family: Helvetica, sans-serif; color: #4A4040; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; }
    .header { background: #A89BAE; padding: 28px 40px; color: #fff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 400; }
    .body { padding: 32px 40px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 10px 0; border-bottom: 1px solid #F5EFE8; vertical-align: top; }
    td:first-child { color: #A89BAE; width: 150px; font-weight: 300; }
    td:last-child { color: #4A4040; }
    .notes { background: #F5EFE8; padding: 12px 16px; margin-top: 6px; font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>&#127874; New Cake Inquiry</h1>
      <p style="margin:4px 0 0; font-size:12px; opacity:0.8;">Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT</p>
    </div>
    <div class="body">
      <table>
        <tr><td>Name</td><td>${escHtml(data.name)}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${escHtml(data.email)}">${escHtml(data.email)}</a></td></tr>
        <tr><td>Phone</td><td>${escHtml(data.phone)}</td></tr>
        <tr><td>Occasion</td><td>${escHtml(data.occasion)}</td></tr>
        <tr><td>Requested Date</td><td>${escHtml(data.requestedDate)}</td></tr>
        <tr><td>Servings</td><td>${data.servings}</td></tr>
        <tr><td>Fulfillment</td><td>${escHtml(fulfillmentDetail)}</td></tr>
        ${data.referral ? `<tr><td>Referral</td><td>${escHtml(data.referral)}</td></tr>` : ''}
      </table>

      <p style="margin:24px 0 6px; font-size:13px; color:#A89BAE; text-transform:uppercase; letter-spacing:0.1em;">Flavor Notes</p>
      <div class="notes">${escHtml(data.flavorNotes)}</div>

      <p style="margin:16px 0 6px; font-size:13px; color:#A89BAE; text-transform:uppercase; letter-spacing:0.1em;">Design Notes</p>
      <div class="notes">${escHtml(data.designNotes)}</div>
    </div>
  </div>
</body>
</html>`;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
