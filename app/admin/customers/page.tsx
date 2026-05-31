'use client';

import React, { useState, useEffect } from 'react';
import { createClientSideClient } from '@/lib/supabase-client';

export default function AdminCustomersPage() {
  const supabase = createClientSideClient();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);

  // CRM notes states
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  
  async function fetchCustomers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
    
    // Get current admin user ID
    async function getAdminSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAdminId(session.user.id);
      }
    }
    getAdminSession();
  }, []);

  // Fetch CRM Notes for selected customer
  async function fetchCustomerNotes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('crm_notes')
        .select(`
          *,
          admin:profiles(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching CRM notes:', err);
    }
  }

  // Toggle user block status
  const handleToggleBlock = async (cust: any) => {
    const nextStatus = !cust.is_blocked;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: nextStatus })
        .eq('id', cust.id);

      if (error) throw error;

      // Update local state
      setSelectedCust({ ...selectedCust, is_blocked: nextStatus });
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Échec de la modification du statut.');
    }
  };

  // Add a CRM note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedCust || !adminId) return;

    setNoteLoading(true);
    try {
      const { error } = await supabase
        .from('crm_notes')
        .insert({
          user_id: selectedCust.id,
          admin_id: adminId,
          note_text: newNote.trim(),
        });

      if (error) throw error;

      setNewNote('');
      fetchCustomerNotes(selectedCust.id);
    } catch (err: any) {
      alert(err.message || "Échec de l'enregistrement de la note.");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleSelectCustomer = (cust: any) => {
    setSelectedCust(cust);
    fetchCustomerNotes(cust.id);
  };

  const filteredCustomers = customers.filter(c => 
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Columns: Search & Customers List */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portail CRM Clients</h1>
          <p className="text-sm text-slate-500 mt-1">Consultez les informations clients, ajoutez des annotations de suivi et bloquez des profils.</p>
        </div>

        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro de téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
          />
        </div>

        {/* Customers Table List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-55 border-b border-slate-200">
                    <th className="px-6 py-3.5">Nom Complet</th>
                    <th className="px-6 py-3.5">Téléphone (WhatsApp)</th>
                    <th className="px-6 py-3.5">Inscrit le</th>
                    <th className="px-6 py-3.5">Statut</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                  {filteredCustomers.map((cust) => (
                    <tr 
                      key={cust.id} 
                      onClick={() => handleSelectCustomer(cust)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedCust?.id === cust.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{cust.full_name || 'Client'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">{cust.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(cust.created_at).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cust.is_blocked ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">Bloqué</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">Actif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-blue-600 font-bold">
                        Gérer &rarr;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Aucun profil trouvé correspondant à vos critères.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: CRM Details Panel & Note Taking */}
      <div className="space-y-6">
        {selectedCust ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
            {/* Header / Info */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-lg">{selectedCust.full_name || 'Client'}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">ID: {selectedCust.id}</p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleToggleBlock(selectedCust)}
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                    selectedCust.is_blocked 
                      ? 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-200' 
                      : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {selectedCust.is_blocked ? 'Débloquer le profil' : 'Bloquer le profil'}
                </button>
              </div>
            </div>

            {/* Note Taking Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Ajouter une note de suivi CRM
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ex: Client très réactif, configuration effectuée sur Smart TV Samsung ok."
                rows={3}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
              />
              <button
                type="submit"
                disabled={noteLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs transition-colors flex justify-center items-center"
              >
                {noteLoading ? 'Enregistrement...' : 'Enregistrer la note'}
              </button>
            </form>

            {/* History of notes */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                Historique des notes ({notes.length})
              </h4>

              {notes.length > 0 ? (
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-slate-50 border border-slate-100 p-3 rounded space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold">{(note as any).admin?.full_name || 'Admin'}</span>
                        <span>{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {note.note_text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs text-center py-4">Aucune note enregistrée pour le moment.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500 text-sm">
            Veuillez sélectionner un client dans la liste pour gérer son dossier et ses notes CRM.
          </div>
        )}
      </div>
    </div>
  );
}
