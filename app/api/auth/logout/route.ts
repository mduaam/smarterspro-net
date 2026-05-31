import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase';

export async function POST() {
  const supabase = createServerSideClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Une erreur est survenue lors de la déconnexion.' }, { status: 500 });
  }
}
