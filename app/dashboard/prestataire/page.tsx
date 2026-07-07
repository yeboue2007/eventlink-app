import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';

export default async function PrestataireDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();

  const { data: prestataireProfile } = await supabase
    .from('prestataire_profiles')
    .select('credits_balance, verification_level, is_solution_tout_en_un')
    .eq('user_id', user.id)
    .single();

  const { data: myCategories } = await supabase
    .from('prestataire_categories')
    .select('category_id, categories(label)')
    .eq('prestataire_id', user.id);

  const myCategoryIds = (myCategories ?? []).map((c: any) => c.category_id);

  // Demandes ouvertes recoupant au moins une de mes catégories, sur lesquelles je n'ai pas encore répondu
  const { data: matchingLots } = myCategoryIds.length
    ? await supabase
        .from('demande_lots')
        .select('demande_id, category_id, categories(label), demandes!inner(id, titre, ville, date_evenement, budget_min, budget_max, status, created_at)')
        .in('category_id', myCategoryIds)
        .eq('demandes.status', 'ouverte')
    : { data: [] };

  // Regrouper par demande
  const demandesMap = new Map<string, any>();
  (matchingLots ?? []).forEach((lot: any) => {
    const d = lot.demandes;
    if (!demandesMap.has(d.id)) {
      demandesMap.set(d.id, { ...d, lots: [] });
    }
    demandesMap.get(d.id).lots.push({ category_id: lot.category_id, label: lot.categories?.label });
  });
  const demandes = Array.from(demandesMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <main className="min-h-screen bg-canvas">
      <DashboardNav fullName={profile?.full_name ?? ''} role="prestataire" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-navy/10 p-5">
            <p className="text-xs text-navy/50 font-semibold uppercase">Solde de crédits</p>
            <p className="text-3xl font-extrabold text-violet mt-1">{prestataireProfile?.credits_balance ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy/10 p-5">
            <p className="text-xs text-navy/50 font-semibold uppercase">Vérification</p>
            <p className="text-lg font-bold text-navy mt-1 capitalize">{prestataireProfile?.verification_level?.replace('_', ' ')}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy/10 p-5">
            <p className="text-xs text-navy/50 font-semibold uppercase">Solution tout-en-un</p>
            <p className="text-lg font-bold text-navy mt-1">{prestataireProfile?.is_solution_tout_en_un ? 'Oui ✓' : 'Non'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy">Mes catégories</h2>
          <Link href="/dashboard/prestataire/categories" className="text-sm text-violet font-semibold">Modifier</Link>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {(myCategories ?? []).map((c: any) => (
            <span key={c.category_id} className="text-xs font-semibold bg-white border border-navy/10 px-3 py-1.5 rounded-lg text-navy">
              {c.categories?.label}
            </span>
          ))}
          {(!myCategories || myCategories.length === 0) && (
            <p className="text-sm text-navy/50">Aucune catégorie sélectionnée — vous ne recevrez aucune demande.</p>
          )}
        </div>

        <h2 className="font-bold text-navy mb-4">Demandes correspondant à vos services</h2>
        {demandes.length === 0 && (
          <div className="bg-white rounded-xl border border-navy/10 p-10 text-center text-navy/60">
            Aucune demande ouverte pour vos catégories en ce moment.
          </div>
        )}
        <div className="flex flex-col gap-4">
          {demandes.map((d) => (
            <Link
              key={d.id}
              href={`/dashboard/prestataire/demandes/${d.id}`}
              className="bg-white rounded-xl border border-navy/10 p-5 hover:border-violet/40 transition block"
            >
              <h3 className="font-bold text-navy">{d.titre}</h3>
              <p className="text-sm text-navy/60">
                {d.ville} {d.date_evenement ? `· ${d.date_evenement}` : ''} · {d.budget_min.toLocaleString()} – {d.budget_max.toLocaleString()} FCFA
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {d.lots.map((l: any, i: number) => (
                  <span key={i} className="text-xs font-semibold bg-violet/10 text-violet px-3 py-1 rounded-lg">
                    {l.label}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
