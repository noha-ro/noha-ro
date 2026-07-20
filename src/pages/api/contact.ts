import type { APIRoute } from 'astro';
import { site } from '../../data/site';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const message = String(form.get('message') || '').trim();
  const honeypot = String(form.get('company') || '').trim();

  if (honeypot) {
    return json({ ok: true });
  }

  if (!name || !email || !message) {
    return json({ error: 'Completează numele, emailul și mesajul.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Adresa de email nu este validă.' }, 400);
  }

  const runtimeEnv = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env;
  const web3formsKey = runtimeEnv?.WEB3FORMS_ACCESS_KEY || import.meta.env.WEB3FORMS_ACCESS_KEY;

  const payload = {
    name,
    email,
    phone,
    message,
    subject: `Mesaj nou de pe ${site.name}: ${name}`,
    from_name: site.name,
    to: site.email,
  };

  if (web3formsKey) {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        ...payload,
      }),
    });

    if (!res.ok) {
      return json({ error: 'Serviciul de email nu a răspuns. Scrie-ne direct pe email.' }, 502);
    }

    return json({ ok: true });
  }

  // Fallback fără cheie: confirmă primirea local (util în preview) și ghidează spre email.
  console.info('[contact]', payload);
  return json({
    ok: true,
    note: `Configurează WEB3FORMS_ACCESS_KEY pe Cloudflare pentru livrare automată. Interim: ${site.email}`,
  });
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
