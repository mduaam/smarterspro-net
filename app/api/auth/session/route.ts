import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerSideClient();

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur session' }, { status: 500 });
  }
}
