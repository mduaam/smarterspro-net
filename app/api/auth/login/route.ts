import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const supabase = createServerSideClient();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Adresse e-mail et mot de passe requis.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
