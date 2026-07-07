import Link from 'next/link';
import { signIn } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 border border-navy/5">
        <Link href="/" className="text-sm text-violet font-semibold">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-6">Se connecter</h1>

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/20 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form action={signIn} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-navy">Email</label>
            <input type="email" name="email" required className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Mot de passe</label>
            <input type="password" name="password" required className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2" />
          </div>
          <button
            type="submit"
            className="mt-2 bg-brand-gradient text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-navy/60 mt-5 text-center">
          Pas encore de compte ? <Link href="/inscription" className="text-violet font-semibold">S'inscrire</Link>
        </p>
      </div>
    </main>
  );
}
