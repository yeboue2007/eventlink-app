import Link from 'next/link';
import { signOut } from '@/lib/actions';

export default function DashboardNav({
  fullName,
  role,
}: {
  fullName: string;
  role: 'client' | 'prestataire' | 'admin';
}) {
  return (
    <nav className="bg-white border-b border-navy/10 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-extrabold text-navy text-lg">
        Event<span className="text-violet">Link</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-navy/70">
          {fullName} <span className="text-navy/40">· {role === 'prestataire' ? 'Prestataire' : 'Client'}</span>
        </span>
        <form action={signOut}>
          <button className="text-violet font-semibold hover:underline">Se déconnecter</button>
        </form>
      </div>
    </nav>
  );
}
