import { createClient } from '@/lib/supabase/server';
import { signUp } from './actions';
import type { Category } from '@/lib/types';
import Link from 'next/link';

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string }>;
}) {
  const { role: roleParam, error } = await searchParams;
  const role = roleParam === 'prestataire' ? 'prestataire' : 'client';

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, label, display_order')
    .eq('active', true)
    .order('display_order');

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-navy/5">
        <Link href="/" className="text-sm text-violet font-semibold">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-1">Créer un compte</h1>
        <p className="text-navy/60 text-sm mb-6">
          {role === 'prestataire'
            ? 'Recevez des demandes ciblées pour vos services.'
            : 'Publiez votre première demande gratuitement.'}
        </p>

        <div className="flex gap-2 mb-6 bg-canvas rounded-xl p-1">
          <Link
            href="/inscription?role=client"
            className={`flex-1 text-center text-sm font-semibold py-2 rounded-lg transition ${
              role === 'client' ? 'bg-white shadow text-navy' : 'text-navy/50'
            }`}
          >
            Je suis client
          </Link>
          <Link
            href="/inscription?role=prestataire"
            className={`flex-1 text-center text-sm font-semibold py-2 rounded-lg transition ${
              role === 'prestataire' ? 'bg-white shadow text-navy' : 'text-navy/50'
            }`}
          >
            Je suis prestataire
          </Link>
        </div>

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/20 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form action={signUp} className="flex flex-col gap-4">
          <input type="hidden" name="role" value={role} />

          <div>
            <label className="text-sm font-medium text-navy">Nom complet / Nom de l'entreprise</label>
            <input name="full_name" required className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-navy">Téléphone</label>
              <input name="phone" required className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-navy">Ville</label>
              <input name="ville" defaultValue="Abidjan" className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy">Email</label>
            <input type="email" name="email" required className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-navy">Mot de passe</label>
            <input type="password" name="password" required minLength={6} className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>

          {role === 'prestataire' && (
            <div>
              <label className="text-sm font-medium text-navy">
                Vos catégories de services <span className="text-navy/50 font-normal">(sélectionnez-en plusieurs si vous couvrez plusieurs prestations)</span>
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(categories as Category[] | null)?.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm bg-canvas rounded-lg px-3 py-2 cursor-pointer">
                    <input type="checkbox" name="categories" value={cat.id} className="accent-violet" />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 bg-brand-gradient text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-sm text-navy/60 mt-5 text-center">
          Déjà inscrit ? <Link href="/login" className="text-violet font-semibold">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
