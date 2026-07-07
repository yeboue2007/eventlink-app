'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message || 'Identifiants invalides')}`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user!.id)
    .single();

  if (profile?.role === 'prestataire') {
    redirect('/dashboard/prestataire');
  } else if (profile?.role === 'admin') {
    redirect('/dashboard/admin');
  }
  redirect('/dashboard/client');
}
