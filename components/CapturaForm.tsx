// components/CapturaForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { submitNetlifyForm } from '@/lib/netlifyForms';

function validateWhatsApp(value: string): boolean {
  // Accepts formats: 11999999999 (11 digits) or (11) 99999-9999
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

export default function CapturaForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'E-mail inválido.';
    if (!validateWhatsApp(form.whatsapp))
      e.whatsapp = 'WhatsApp inválido. Use o formato: (11) 99999-9999';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      // Per spec: do not block the user on API failure
      if (!res.ok) {
        console.error('Lead API error:', await res.text());
      }
    } catch (err) {
      console.error('Lead submission error:', err);
    }

    try {
      await submitNetlifyForm('ingresso_start', form);
    } catch (err) {
      console.error('Netlify Forms submission error:', err);
    }

    trackEvent('Lead', { plan: 'start' });
    setSubmitting(false);
    router.push('/obrigado');
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="poster-card paper-noise mx-auto flex w-full max-w-md flex-col gap-6 bg-paper p-6 text-ink sm:p-9"
      data-form="captura"
    >
      <div>
        <label htmlFor="nome" className="mb-2 block text-base font-black leading-tight text-ink">
          Seu nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="min-h-12 w-full border-2 border-ink bg-paper px-4 py-3 text-base font-medium text-ink transition placeholder:font-medium placeholder:text-ink/55 focus:bg-sun/10 focus:outline-none"
          aria-describedby={errors.nome ? 'error-nome' : undefined}
          data-field="nome"
        />
        {errors.nome && (
          <p id="error-nome" role="alert" className="mt-2 text-xs font-bold text-red-700" data-state="error">
            {errors.nome}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-base font-black leading-tight text-ink">
          Seu melhor e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="min-h-12 w-full border-2 border-ink bg-paper px-4 py-3 text-base font-medium text-ink transition placeholder:font-medium placeholder:text-ink/55 focus:bg-sun/10 focus:outline-none"
          aria-describedby={errors.email ? 'error-email' : undefined}
          data-field="email"
        />
        {errors.email && (
          <p id="error-email" role="alert" className="mt-2 text-xs font-bold text-red-700" data-state="error">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-2 block text-base font-black leading-tight text-ink">
          Seu WhatsApp (com DDD)
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="(11) 99999-9999"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="min-h-12 w-full border-2 border-ink bg-paper px-4 py-3 text-base font-medium text-ink transition placeholder:font-medium placeholder:text-ink/55 focus:bg-sun/10 focus:outline-none"
          aria-describedby={errors.whatsapp ? 'error-whatsapp' : undefined}
          data-field="whatsapp"
        />
        {errors.whatsapp && (
          <p id="error-whatsapp" role="alert" className="mt-2 text-xs font-bold text-red-700" data-state="error">
            {errors.whatsapp}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="poster-card mt-2 min-h-14 bg-sun px-6 py-4 text-base font-black uppercase tracking-wide text-ink transition duration-300 hover:-translate-y-1 hover:bg-forest hover:text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        data-cta="captura-submit"
      >
        {submitting ? 'Enviando...' : 'FINALIZAR CADASTRO'}
      </button>
    </form>
  );
}
