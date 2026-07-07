import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import { updateCategories } from './actions';
import type { Category } from '@/lib/types';

export default async function CategoriesPage() {
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

  const { data: mine } = await supabase.from('prestataire_categories').select('category_id').eq('prestataire_id', user.id);
  const mineIds = new Set((mine ?? []).map((c) => c.category_id));

  return (
    <main className="min-h-screen bg-canvas">
      <DashboardNav fullName={profile?.full_name ?? ''} role="prestataire" />
      <div className="max-w-xl mx-auto px-6 py-10">
        <Link href="/dashboard/prestataire" className="text-sm text-violet font-semibold">← Retour au tableau de bord</Link>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-1">Mes catégories de services</h1>
        <p className="text-navy/60 text-sm mb-6">
          Sélectionnez toutes les prestations que vous proposez. Vous serez notifié dès qu'une demande recoupe au moins une de ces catégories.
        </p>

        <form action={updateCategories} className="bg-white rounded-2xl border border-navy/10 p-6">
          <div className="grid grid-cols-2 gap-2">
            {(categories as Category[] | null)?.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm bg-canvas rounded-lg px-3 py-2 cursor-pointer">
                <input type="checkbox" name="categories" value={cat.id} defaultChecked={mineIds.has(cat.id)} className="accent-violet" />
                {cat.label}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 bg-brand-gradient text-white font-semibold rounded-lg py-3 px-6 hover:opacity-90 transition">
            Enregistrer
          </button>
        </form>
      </div>
    </main>
  );
}
