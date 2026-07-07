import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import LotBuilder from './LotBuilder';
import { createDemande } from '../actions';
import type { Category } from '@/lib/types';

export default async function NouvelleDemandePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, label, display_order')
    .eq('active', true)
    .order('display_order');

  return (
    <main className="min-h-screen bg-canvas">
      <DashboardNav fullName={profile?.full_name ?? ''} role="client" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/dashboard/client" className="text-sm text-violet font-semibold">← Mes demandes</Link>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-1">Publier une demande</h1>
        <p className="text-navy/60 text-sm mb-6">Gratuit. Décrivez votre événement une seule fois, même s'il comporte plusieurs prestations.</p>

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/20 rounded-lg px-4 py-2">{error}</div>
        )}

        <form action={createDemande} className="bg-white rounded-2xl border border-navy/10 p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-navy">Titre de l'événement</label>
            <input name="titre" required placeholder="Ex : Mariage — 200 invités" className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-navy">Type d'événement</label>
              <input name="type_evenement" placeholder="mariage, anniversaire…" className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Date</label>
              <input type="date" name="date_evenement" className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy">Ville</label>
            <input name="ville" defaultValue="Abidjan" className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-navy">Budget minimum (FCFA)</label>
              <input type="number" name="budget_min" required min={0} className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Budget maximum (FCFA)</label>
              <input type="number" name="budget_max" required min={0} className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy">Description</label>
            <textarea name="description" rows={3} className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          <LotBuilder categories={(categories as Category[]) ?? []} />

          <button
            type="submit"
            className="mt-2 bg-brand-gradient text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
          >
            Publier ma demande
          </button>
        </form>
      </div>
    </main>
  );
}
