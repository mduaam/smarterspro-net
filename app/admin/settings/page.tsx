'use client';

import React, { useState, useEffect } from 'react';
import { createClientSideClient } from '@/lib/supabase-client';

export default function AdminSettingsPage() {
  const supabase = createClientSideClient();

  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [starterBank, setStarterBank] = useState('');
  const [starterWa, setStarterWa] = useState('');

  const [confortBank, setConfortBank] = useState('');
  const [confortWa, setConfortWa] = useState('');

  const [premiumBank, setPremiumBank] = useState('');
  const [premiumWa, setPremiumWa] = useState('');

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_instructions')
        .select('*');

      if (error) throw error;

      setSettings(data || []);

      // Distribute to local form states
      const starter = data?.find(s => s.plan_type === 'Starter');
      if (starter) {
        setStarterBank(starter.bank_details);
        setStarterWa(starter.whatsapp_number);
      }

      const confort = data?.find(s => s.plan_type === 'Confort');
      if (confort) {
        setConfortBank(confort.bank_details);
        setConfortWa(confort.whatsapp_number);
      }

      const premium = data?.find(s => s.plan_type === 'Premium');
      if (premium) {
        setPremiumBank(premium.bank_details);
        setPremiumWa(premium.whatsapp_number);
      }

    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (plan: 'Starter' | 'Confort' | 'Premium', bank: string, wa: string) => {
    setSuccessMsg(null);
    try {
      const { error } = await supabase
        .from('payment_instructions')
        .update({
          bank_details: bank.trim(),
          whatsapp_number: wa.trim(),
        })
        .eq('plan_type', plan);

      if (error) throw error;

      setSuccessMsg(`Paramètres de la formule ${plan} mis à jour avec succès.`);
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Échec de la sauvegarde.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paramètres Bancaires</h1>
        <p className="text-sm text-slate-500 mt-1">Configurez les IBAN de transfert et les numéros WhatsApp d'assistance affichés aux clients.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded shadow-sm">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 bg-white border border-slate-200 rounded-lg">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Starter Config */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">
              Configuration : Formule Starter
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp d'Assistance</label>
                <input
                  type="text"
                  value={starterWa}
                  onChange={(e) => setStarterWa(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coordonnées de Virement Bancaire (IBAN)</label>
                <input
                  type="text"
                  value={starterBank}
                  onChange={(e) => setStarterBank(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave('Starter', starterBank, starterWa)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
            >
              Enregistrer Starter
            </button>
          </div>

          {/* Confort Config */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">
              Configuration : Formule Confort
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp d'Assistance</label>
                <input
                  type="text"
                  value={confortWa}
                  onChange={(e) => setConfortWa(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coordonnées de Virement Bancaire (IBAN)</label>
                <input
                  type="text"
                  value={confortBank}
                  onChange={(e) => setConfortBank(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave('Confort', confortBank, confortWa)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
            >
              Enregistrer Confort
            </button>
          </div>

          {/* Premium Config */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">
              Configuration : Formule Premium
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp d'Assistance</label>
                <input
                  type="text"
                  value={premiumWa}
                  onChange={(e) => setPremiumWa(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coordonnées de Virement Bancaire (IBAN)</label>
                <input
                  type="text"
                  value={premiumBank}
                  onChange={(e) => setPremiumBank(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave('Premium', premiumBank, premiumWa)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
            >
              Enregistrer Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
