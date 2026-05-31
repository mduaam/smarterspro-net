import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(request: Request) {
  const supabase = createServerSideClient();

  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être renseignés.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Trigger Resend welcome email in background
    if (data.user) {
      try {
        await sendWelcomeEmail(email, fullName);
      } catch (emailErr) {
        console.error('Welcome email sending error:', emailErr);
      }
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Registration route error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
