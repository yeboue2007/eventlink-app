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
    options: {
      data: {
        role,
        full_name: fullName,
        phone,
        ville,
        category_ids: role === 'prestataire' ? categoryIds : undefined,
      },
    },
  });

  if (authError || !authData.user) {
    redirect(`/inscription?role=${role}&error=${encodeURIComponent(authError?.message || 'Erreur inconnue')}`);
  }

  // La ligne profiles (+ prestataire_profiles/catégories) est créée automatiquement
  // par le trigger on_auth_user_created, à partir des métadonnées ci-dessus.

  if (!authData.session) {
    // Confirmation par email requise : pas de session tant que l'email n'est pas confirmé
    redirect('/inscription/verifiez-votre-email');
  }

  redirect(role === 'prestataire' ? '/dashboard/prestataire' : '/dashboard/client');
}
