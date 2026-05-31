import React from 'react';
import { createServerSideClient } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createServerSideClient();

  // 1. Fetch KPI metrics in parallel
  const [
    { count: totalUsers },
    { count: pendingPaymentsCount },
    { count: activeSubscriptionsCount },
    { data: confirmedPayments }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending_confirmation'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payments').select('amount').eq('status', 'confirmed')
  ]);

  // Calculate gross revenue (in Euros)
  const totalRevenue = confirmedPayments 
    ? confirmedPayments.reduce((acc, curr) => acc + curr.amount, 0) / 100 
    : 0;

  // 2. Fetch pending payments list
  const { data: pendingPayments } = await supabase
    .from('payments')
    .select(`
      *,
      subscription:subscriptions(*),
      user:profiles(*)
    `)
    .eq('status', 'pending_confirmation')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Fetch recent administrative audit logs
  const { data: auditLogs } = await supabase
    .from('admin_audit_log')
    .select(`
      *,
      admin:profiles(*)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vue d'ensemble</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez vos abonnements, validez les transactions et supervisez l'activité système.</p>
      </div>

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Clients Totaux</span>
          <span className="text-3xl font-extrabold text-slate-900 block mt-2">{totalUsers || 0}</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Formules Actives</span>
          <span className="text-3xl font-extrabold text-green-600 block mt-2">{activeSubscriptionsCount || 0}</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Paiements en Attente</span>
          <span className="text-3xl font-extrabold text-amber-600 block mt-2">{pendingPaymentsCount || 0}</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Revenu Global</span>
          <span className="text-3xl font-extrabold text-blue-600 block mt-2">{(totalRevenue).toFixed(2)} €</span>
        </div>
      </div>

      {/* Main Grid: Pending Payments & Audit Trails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Actions Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Paiements virements récents à valider</h3>
            <Link 
              href="/admin/subscriptions" 
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Voir tout ({pendingPaymentsCount || 0})
            </Link>
          </div>

          {pendingPayments && pendingPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs font-semibold uppercase">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Client</th>
                    <th className="py-2.5">Plan</th>
                    <th className="py-2.5">Montant</th>
                    <th className="py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {pendingPayments.map((pay) => (
                    <tr key={pay.id}>
                      <td className="py-3">{new Date(pay.created_at).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3">{(pay as any).user?.full_name || 'Client'}</td>
                      <td className="py-3">{(pay as any).subscription?.plan_type || 'Premium'}</td>
                      <td className="py-3">{(pay.amount / 100).toFixed(2)} €</td>
                      <td className="py-3">
                        <Link 
                          href="/admin/subscriptions" 
                          className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded transition-colors"
                        >
                          Valider
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Aucun virement en attente de confirmation. Bon travail !
            </div>
          )}
        </div>

        {/* Audit Trails Logs */}
        <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-lg p-6 shadow-sm">
          <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-4 mb-4">
            Activité administrative
          </h3>

          {auditLogs && auditLogs.length > 0 ? (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-semibold">{(log as any).admin?.full_name || 'Admin'}</span>
                    <span>{new Date(log.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {log.action === 'confirm_payment' ? 'A validé le paiement' : log.action}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Ref: {log.target_id.substring(0, 8)}... | IP: {log.ip_address}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">Aucune activité enregistrée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
