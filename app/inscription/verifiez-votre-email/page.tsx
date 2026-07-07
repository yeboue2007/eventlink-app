import Link from 'next/link';

export default function VerifiezVotreEmailPage() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-navy/5 text-center">
        <h1 className="text-2xl font-bold text-navy mb-3">Vérifiez votre email</h1>
        <p className="text-navy/60 text-sm mb-6">
          Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour activer votre compte, puis connectez-vous.
        </p>
        <Link href="/login" className="text-violet font-semibold text-sm">← Aller à la connexion</Link>
      </div>
    </main>
  );
}
