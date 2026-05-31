import { NextResponse } from 'next/server';
import { createServerSideClient, createAdminClient } from '@/lib/supabase';
import { sendPaymentInstructionsEmail } from '@/lib/resend';

// Plan Price Map (in cents)
const PLAN_PRICES: Record<string, number> = {
  Starter: 999,
  Confort: 1999,
  Premium: 2999,
};

export async function POST(request: Request) {
  const supabase = createServerSideClient();

  try {
    // 1. Authenticate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email!;
    
    // 2. Parse request payload
    const { planType, phone, paymentMethod } = await request.json();

    if (!planType || !['Starter', 'Confort', 'Premium'].includes(planType)) {
      return NextResponse.json({ error: 'Plan invalide spécifié.' }, { status: 400 });
    }

    const priceCents = PLAN_PRICES[planType];

    // Fetch user profile info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 });
    }

    // 3. Update profile phone if provided and currently empty
    if (phone && !profile.phone) {
      await supabase
        .from('profiles')
        .update({ phone })
        .eq('id', userId);
    }

    // 4. Create pending subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
      
    // Create new subscription entry
    const { data: newSub, error: insertSubError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'pending_payment',
      })
      .select()
      .single();

    if (insertSubError || !newSub) {
      return NextResponse.json({ error: 'Échec de la création de la souscription.' }, { status: 500 });
    }

    // 5. Create pending payment record
    const { data: newPayment, error: insertPayError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        subscription_id: newSub.id,
        amount: priceCents,
        currency: 'eur',
        status: 'pending_instruction',
        payment_method: paymentMethod || 'bank_transfer',
      })
      .select()
      .single();

    if (insertPayError || !newPayment) {
      // Cleanup orphan subscription
      await supabase.from('subscriptions').delete().eq('id', newSub.id);
      return NextResponse.json({ error: 'Échec de la création du paiement.' }, { status: 500 });
    }

    // 6. Fetch manual payment instructions for specified plan
    const { data: instructions } = await supabase
      .from('payment_instructions')
      .select('*')
      .eq('plan_type', planType)
      .single();

    const bankDetails = instructions?.bank_details || 'Bank: EuroBank | IBAN: FR76 3000 1234 5678 9012 345';
    const whatsappNum = instructions?.whatsapp_number || '+33612345678';

    // 7. Fire off the automated instruction email via Resend
    const emailResult = await sendPaymentInstructionsEmail(
      userEmail,
      profile.full_name,
      planType,
      priceCents,
      bankDetails,
      whatsappNum
    );

    // If successful email, we transition payment status to 'pending_confirmation'
    if (emailResult.success) {
      await supabase
        .from('payments')
        .update({ status: 'pending_confirmation' })
        .eq('id', newPayment.id);
    }

    return NextResponse.json({
      success: true,
      subscriptionId: newSub.id,
      paymentId: newPayment.id,
      instructions: {
        bankDetails,
        whatsappNumber: whatsappNum,
      }
    });

  } catch (error: any) {
    console.error('Send payment instructions error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
