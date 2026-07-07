'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updateCategories(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const selectedIds = formData.getAll('categories').map((v) => Number(v));

  // Remplace entièrement la sélection : simple et sans risque d'incohérence
  await supabase.from('prestataire_categories').delete().eq('prestataire_id', user!.id);

  if (selectedIds.length > 0) {
    const rows = selectedIds.map((category_id) => ({ prestataire_id: user!.id, category_id }));
    await supabase.from('prestataire_categories').insert(rows);
  }

  redirect('/dashboard/prestataire');
}
