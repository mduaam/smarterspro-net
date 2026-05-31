import { NextResponse } from 'next/server';
import { createServerSideClient, createAdminClient } from '@/lib/supabase';
import { sendSubscriptionActivatedEmail } from '@/lib/resend';

export async function POST(request: Request) {
  const supabase = createServerSideClient();

  try {
    // 1. Authenticate admin user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    // Verify admin role in profiles
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: 'Accès refusé. Droits administrateur requis.' }, { status: 403 });
    }

    // 2. Parse request payload
    const { paymentId, notes } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Identifiant de paiement requis.' }, { status: 400 });
    }

    // Fetch the payment log along with subscription and profile details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        subscription:subscriptions(*),
        user:profiles(*)
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Paiement introuvable.' }, { status: 404 });
    }

    if (payment.status === 'confirmed') {
      return NextResponse.json({ error: 'Ce paiement a déjà été validé.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const expiryIso = expiryDate.toISOString();

    // 3. Update payment status to confirmed
    const { error: payUpdateError } = await supabase
      .from('payments')
      .update({
        status: 'confirmed',
        confirmed_by_admin_id: session.user.id,
        confirmed_at: now,
        notes: notes || payment.notes,
      })
      .eq('id', paymentId);

    if (payUpdateError) {
      return NextResponse.json({ error: 'Échec de la validation du paiement.' }, { status: 500 });
    }

    // 4. Activate the corresponding subscription
    const { error: subUpdateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: now,
        current_period_end: expiryIso,
      })
      .eq('id', payment.subscription_id);

    if (subUpdateError) {
      return NextResponse.json({ error: "Échec de l'activation de l'abonnement." }, { status: 500 });
    }

    // 5. Add record to Admin Audit Log
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_id: session.user.id,
        action: 'confirm_payment',
        target_type: 'payment',
        target_id: paymentId,
        ip_address: clientIp,
      });

    // 6. Send subscription activation email using Resend
    const clientEmail = (payment as any).user?.email || ''; // Wait! The profile doesn't have email. auth.users has email.
    // Since we queried profiles, profiles doesn't contain email per database structure.
    // Let's get the email from auth.users or we can look it up, or since profile email is not saved in profiles table,
    // let's fetch auth.users email using admin supabase client to be robust, or we can use the payment user's ID
    // to query Auth!
    let targetEmail = '';
    const adminSupabase = createServerSideClient(); // Wait, createServerSideClient accesses standard anon key.
    // Let's look up auth.users using createAdminClient (which has the SERVICE role key!)
    const adminClient = createAdminClient();
    const { data: userData } = await adminClient.auth.admin.getUserById(payment.user_id);
    targetEmail = userData?.user?.email || '';

    if (targetEmail) {
      const clientName = (payment as any).user?.full_name || 'Client';
      const formattedExpiry = new Date(expiryIso).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await sendSubscriptionActivatedEmail(
        targetEmail,
        clientName,
        (payment as any).subscription?.plan_type || 'Premium',
        formattedExpiry
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paiement confirmé et abonnement activé avec succès.'
    });

  } catch (error: any) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
