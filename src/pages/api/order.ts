import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import { orderSchema } from '../../lib/orderSchema';
import { customerConfirmationHtml } from '../../emails/customerConfirmation';
import { ownerNotificationHtml } from '../../emails/ownerNotification';

export const POST: APIRoute = async ({ request }) => {
  // ── Parse body ─────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid request body' }, 400);
  }

  // ── Server-side validation (Zod) ───────────────────────────
  const result = orderSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    return json({ success: false, fieldErrors }, 422);
  }

  const data = result.data;

  // ── Env vars — never expose these to the client ────────────
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail   = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  if (!resendKey || !toEmail || !fromEmail) {
    console.error('Missing email environment variables');
    return json({ success: false, error: 'Server configuration error' }, 500);
  }

  const resend = new Resend(resendKey);

  // ── Send both emails concurrently ──────────────────────────
  const [customerResult, ownerResult] = await Promise.allSettled([
    resend.emails.send({
      from: `Keri Bakes <${fromEmail}>`,
      to:   [data.email],
      subject: `Your Keri Bakes inquiry — ${data.cakeSelection} on ${data.requestedDate}`,
      html: customerConfirmationHtml(data),
    }),
    resend.emails.send({
      from: `Keri Bakes Orders <${fromEmail}>`,
      to:   [toEmail],
      replyTo: data.email,
      subject: `New inquiry: ${data.name} — ${data.cakeSelection} (${data.requestedDate})`,
      html: ownerNotificationHtml(data),
    }),
  ]);

  if (customerResult.status === 'rejected' || ownerResult.status === 'rejected') {
    const reason =
      customerResult.status === 'rejected'
        ? String(customerResult.reason)
        : String((ownerResult as PromiseRejectedResult).reason);
    console.error('Resend error:', reason);
    return json({ success: false, error: 'Failed to send confirmation email. Please try again.' }, 500);
  }

  return json({ success: true });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
