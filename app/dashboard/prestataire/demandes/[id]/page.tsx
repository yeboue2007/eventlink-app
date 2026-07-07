import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import { submitOffre } from './actions';

export default async function DemandeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();

  const { data: prestataireProfile } = await supabase
    .from('prestataire_profiles')
    .select('credits_balance')
    .eq('user_id', user.id)
    .single();

  const { data: myCategories } = await supabase.from('prestataire_categories').select('category_id').eq('prestataire_id', user.id);
  const myCategoryIds = new Set((myCategories ?? []).map((c) => c.category_id));

  const { data: demande } = await supabase
    .from('demandes')
    .select('id, titre, ville, date_evenement, budget_min, budget_max, description, status, demande_lots(id, category_id, project_size, categories(label))')
    .eq('id', id)
    .single();

  if (!demande) notFound();

  const { data: existingOffre } = await supabase
    .from('offres')
    .select('id, total_price, status')
    .eq('demande_id', id)
    .eq('prestataire_id', user.id)
    .maybeSingle();

  const relevantLots = (demande.demande_lots ?? []).filter((l: any) => myCategoryIds.has(l.category_id));

  return (
    <main className="min-h-screen bg-canvas">
      <DashboardNav fullName={profile?.full_name ?? ''} role="prestataire" />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/dashboard/prestataire" className="text-sm text-violet font-semibold">← Retour aux demandes</Link>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-1">{demande.titre}</h1>
        <p className="text-navy/60 text-sm mb-1">
          {demande.ville} {demande.date_evenement ? `· ${demande.date_evenement}` : ''} · Budget {demande.budget_min.toLocaleString()} – {demande.budget_max.toLocaleString()} FCFA
        </p>
        {demande.description && <p className="text-navy/70 text-sm mt-3 mb-6">{demande.description}</p>}

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/20 rounded-lg px-4 py-2">{error}</div>
        )}

        {existingOffre ? (
          <div className="bg-white rounded-2xl border border-navy/10 p-6">
            <p className="font-semibold text-navy">Vous avez déjà envoyé une offre pour cette demande</p>
            <p className="text-sm text-navy/60 mt-1">
              Montant : {existingOffre.total_price.toLocaleString()} FCFA · Statut : <span className="capitalize">{existingOffre.status}</span>
            </p>
          </div>
        ) : (
          <form action={submitOffre} className="bg-white rounded-2xl border border-navy/10 p-6 flex flex-col gap-4">
            <input type="hidden" name="demande_id" value={demande.id} />
            <p className="text-sm font-medium text-navy">
              Prestations concernées par votre profil
              {relevantLots.length > 1 && (
                <span className="block text-xs font-normal text-navy/50 mt-1">
                  Envoyez une seule offre groupée pour tous ces lots — coût en crédits réduit d'environ 20%.
                </span>
              )}
            </p>

            <div className="flex flex-col gap-3">
              {relevantLots.map((lot: any) => (
                <div key={lot.id} className="bg-canvas rounded-lg p-4 grid grid-cols-2 gap-3 items-center">
                  <div>
                    <input type="checkbox" name="lot_id" value={lot.id} defaultChecked className="accent-violet mr-2" />
                    <span className="font-semibold text-navy text-sm">{lot.categories?.label}</span>
                    <span className="text-xs text-navy/50 ml-2 capitalize">({lot.project_size.replace('_', ' ')})</span>
                  </div>
                  <input
                    type="number"
                    name={`prix_lot_${lot.id}`}
                    placeholder="Prix pour ce lot (FCFA)"
                    required
                    min={0}
                    className="border border-navy/15 rounded-lg px-3 py-2 bg-white text-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-navy">Message au client</label>
              <textarea name="message" rows={3} className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>

            <p className="text-xs text-navy/50">Solde actuel : {prestataireProfile?.credits_balance ?? 0} crédits</p>

            <button type="submit" className="bg-brand-gradient text-white font-semibold rounded-lg py-3 hover:opacity-90 transition">
              Envoyer mon offre
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
