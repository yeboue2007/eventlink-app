'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createDemande(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const titre = String(formData.get('titre'));
  const type_evenement = String(formData.get('type_evenement') || '');
  const date_evenement = String(formData.get('date_evenement') || '') || null;
  const ville = String(formData.get('ville') || 'Abidjan');
  const budget_min = Number(formData.get('budget_min'));
  const budget_max = Number(formData.get('budget_max'));
  const description = String(formData.get('description') || '');

  const lotCategoryIds = formData.getAll('lot_category_id').map((v) => Number(v));
  const lotSizes = formData.getAll('lot_project_size').map((v) => String(v));
  const lotDetails = formData.getAll('lot_details').map((v) => String(v));

  const { data: demande, error } = await supabase
    .from('demandes')
    .insert({
      client_id: user!.id,
      titre,
      type_evenement,
      date_evenement,
      ville,
      budget_min,
      budget_max,
      description,
    })
    .select('id')
    .single();

  if (error || !demande) {
    redirect(`/dashboard/client/nouvelle-demande?error=${encodeURIComponent(error?.message || 'Erreur')}`);
  }

  const lotRows = lotCategoryIds
    .filter((id) => !Number.isNaN(id))
    .map((category_id, i) => ({
      demande_id: demande!.id,
      category_id,
      project_size: lotSizes[i] || 'standard',
      details: lotDetails[i] ? { notes: lotDetails[i] } : null,
    }));

  if (lotRows.length > 0) {
    await supabase.from('demande_lots').insert(lotRows);
  }

  redirect('/dashboard/client');
}
