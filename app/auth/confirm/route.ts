import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = user
        ? await supabase.from('profiles').select('role').eq('id', user.id).single()
        : { data: null };

      redirect(profile?.role === 'prestataire' ? '/dashboard/prestataire' : '/dashboard/client');
    }
  }

  redirect('/login?error=' + encodeURIComponent("Le lien de confirmation est invalide ou a expiré."));
}
