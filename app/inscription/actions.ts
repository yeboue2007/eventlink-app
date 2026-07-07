'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const fullName = String(formData.get('full_name'));
  const phone = String(formData.get('phone'));
  const ville = String(formData.get('ville') || 'Abidjan');
  const role = String(formData.get('role')) as 'client' | 'prestataire';
  const categoryIds = formData.getAll('categories').map((c) => Number(c));

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    redirect(`/inscription?role=${role}&error=${encodeURIComponent(authError?.message || 'Erreur inconnue')}`);
  }

  const userId = authData.user!.id;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role,
    full_name: fullName,
    phone,
    ville,
  });

  if (profileError) {
    redirect(`/inscription?role=${role}&error=${encodeURIComponent(profileError.message)}`);
  }

  if (role === 'prestataire') {
    const { error: prestataireError } = await supabase
      .from('prestataire_profiles')
      .insert({ user_id: userId });

    if (prestataireError) {
      redirect(`/inscription?role=${role}&error=${encodeURIComponent(prestataireError.message)}`);
    }

    if (categoryIds.length > 0) {
      const rows = categoryIds.map((category_id) => ({ prestataire_id: userId, category_id }));
      await supabase.from('prestataire_categories').insert(rows);
    }

    redirect('/dashboard/prestataire');
  }

  redirect('/dashboard/client');
}
