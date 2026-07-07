import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const { data: demandes } = await supabase
    .from('demandes')
    .select('id, titre, ville, date_evenement, budget_min, budget_max, status, created_at, demande_lots(id, category_id, categories(label))')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-canvas">
      <DashboardNav fullName={profile?.full_name ?? ''} role="client" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-navy">Mes demandes</h1>
          <Link
            href="/dashboard/client/nouvelle-demande"
            className="bg-brand-gradient text-white font-semibold rounded-lg px-5 py-2.5 text-sm hover:opacity-90"
          >
            + Publier une demande
          </Link>
        </div>

        {(!demandes || demandes.length === 0) && (
          <div className="bg-white rounded-xl border border-navy/10 p-10 text-center text-navy/60">
            Vous n'avez pas encore publié de demande. Décrivez votre événement pour recevoir des propositions de prestataires vérifiés.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {demandes?.map((d: any) => (
            <div key={d.id} className="bg-white rounded-xl border border-navy/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-navy">{d.titre}</h3>
                  <p className="text-sm text-navy/60">
                    {d.ville} {d.date_evenement ? `· ${d.date_evenement}` : ''} · {d.budget_min.toLocaleString()} – {d.budget_max.toLocaleString()} FCFA
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet/10 text-violet capitalize">
                  {d.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {d.demande_lots?.map((lot: any) => (
                  <span key={lot.id} className="text-xs font-semibold bg-canvas px-3 py-1 rounded-lg text-navy">
                    {lot.categories?.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
