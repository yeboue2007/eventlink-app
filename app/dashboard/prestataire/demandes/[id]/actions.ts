'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function submitOffre(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const demandeId = String(formData.get('demande_id'));
  const message = String(formData.get('message') || '');
  const lotIds = formData.getAll('lot_id').map((v) => String(v));

  if (lotIds.length === 0) {
    redirect(`/dashboard/prestataire/demandes/${demandeId}?error=${encodeURIComponent('Sélectionnez au moins une prestation.')}`);
  }

  // Récupère la taille de projet de chaque lot pour calculer le coût en crédits
  const { data: lots } = await supabase.from('demande_lots').select('id, project_size').in('id', lotIds);

  const { data: costRules } = await supabase
    .from('credit_costs')
    .select('project_size, credit_cost')
    .is('category_id', null)
    .eq('is_grouped_offer', false)
    .eq('active', true);

  const costFor = (size: string) => costRules?.find((r) => r.project_size === size)?.credit_cost ?? 1;

  let totalPrice = 0;
  const lotsPayload = lotIds.map((lotId) => {
    const prix = Number(formData.get(`prix_lot_${lotId}`) || 0);
    totalPrice += prix;
    return { demande_lot_id: lotId, prix_lot: prix };
  });

  let creditCost = (lots ?? []).reduce((sum, lot) => sum + costFor(lot.project_size), 0);
  if (lotIds.length > 1) {
    // Offre groupée multi-lots : réduction ~20% sur le coût en crédits, différenciateur multi-services
    creditCost = Math.max(1, Math.ceil(creditCost * 0.8));
  }

  const { error } = await supabase.rpc('rpc_creer_offre', {
    p_demande_id: demandeId,
    p_prestataire_id: user!.id,
    p_total_price: totalPrice,
    p_message: message,
    p_lots: lotsPayload,
    p_credit_cost: creditCost,
  });

  if (error) {
    redirect(`/dashboard/prestataire/demandes/${demandeId}?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard/prestataire');
}
