'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClientSideClient } from '@/lib/supabase-client';

export default function AdminChatPage() {
  const supabase = createClientSideClient();

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();

    async function getAdminSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAdminId(session.user.id);
      }
    }
    getAdminSession();
  }, []);

  // Fetch chat messages when ticket is selected
  async function fetchMessages(ticketId: string) {
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles(*)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setChatLoading(false);
      scrollToBottom();
    }
  }

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket || !adminId) return;

    const payload = {
      ticket_id: selectedTicket.id,
      sender_id: adminId,
      message_text: newMessage.trim(),
    };

    setNewMessage('');

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert(payload);

      if (error) throw error;

      // Update ticket status to in_progress if currently open
      if (selectedTicket.status === 'open') {
        await supabase
          .from('support_tickets')
          .update({ status: 'in_progress' })
          .eq('id', selectedTicket.id);

        fetchTickets();
        setSelectedTicket({ ...selectedTicket, status: 'in_progress' });
      }

      fetchMessages(selectedTicket.id);
    } catch (err: any) {
      alert(err.message || 'Échec de l\'envoi du message.');
    }
  };

  const handleToggleStatus = async (status: 'open' | 'in_progress' | 'resolved') => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      setSelectedTicket({ ...selectedTicket, status });
      fetchTickets();
    } catch (err: any) {
      alert(err.message || 'Échec de la modification du statut.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[30rem] items-stretch">
      {/* Left Pane: Ticket Feed */}
      <div className="bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-55 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Tickets d'Assistance</h3>
          <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold px-2 py-0.5 rounded uppercase">
            {tickets.filter(t => t.status !== 'resolved').length} Actifs
          </span>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : tickets && tickets.length > 0 ? (
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 text-sm">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                onClick={() => handleSelectTicket(t)}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col ${selectedTicket?.id === t.id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-800">{t.user?.full_name || 'Client'}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    t.status === 'open' 
                      ? 'bg-blue-100 text-blue-700' 
                      : t.status === 'in_progress' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.status === 'in_progress' ? 'En cours' : t.status === 'open' ? 'Ouvert' : 'Résolu'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs truncate">{t.subject}</h4>
                <span className="text-[10px] text-slate-400 mt-1">{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-400 text-xs">
            Aucun ticket de support ouvert.
          </div>
        )}
      </div>

      {/* Right Pane: Selected conversation feed */}
      <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
        {selectedTicket ? (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Chat Room Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-55 flex-shrink-0">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedTicket.subject}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Auteur: {selectedTicket.user?.full_name || 'Client'}</p>
              </div>

              {/* Status Switcher Buttons */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <button
                  onClick={() => handleToggleStatus('open')}
                  className={`px-2 py-1 rounded border transition-colors ${selectedTicket.status === 'open' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                >
                  Ouvert
                </button>
                <button
                  onClick={() => handleToggleStatus('in_progress')}
                  className={`px-2 py-1 rounded border transition-colors ${selectedTicket.status === 'in_progress' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                >
                  En cours
                </button>
                <button
                  onClick={() => handleToggleStatus('resolved')}
                  className={`px-2 py-1 rounded border transition-colors ${selectedTicket.status === 'resolved' ? 'bg-green-600 text-white border-green-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                >
                  Résolu
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
              {/* Original Message Card */}
              <div className="flex items-start max-w-[85%]">
                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 gap-6 font-bold">
                    <span>{selectedTicket.user?.full_name || 'Client'}</span>
                    <span>{new Date(selectedTicket.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                    {selectedTicket.message}
                  </p>
                </div>
              </div>

              {/* Message History list */}
              {chatLoading ? (
                <div className="flex justify-center py-6">
                  <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : messages && messages.length > 0 ? (
                messages.map((m) => {
                  const isMe = m.sender_id === adminId;
                  return (
                    <div 
                      key={m.id} 
                      className={`flex items-start max-w-[85%] ${isMe ? 'ml-auto justify-end' : ''}`}
                    >
                      <div className={`p-3 rounded-lg shadow-sm border ${
                        isMe 
                          ? 'bg-slate-900 border-slate-800 text-white' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        <div className={`flex justify-between items-center text-[9px] gap-6 font-bold ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                          <span>{isMe ? 'Support' : (m.sender?.full_name || 'Client')}</span>
                          <span>{new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-xs font-semibold mt-1 leading-relaxed whitespace-pre-wrap">
                          {m.message_text}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Rédigez votre réponse ici..."
                className="flex-grow border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-950 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-400 text-sm">
            Sélectionnez un ticket dans le menu de gauche pour consulter la discussion.
          </div>
        )}
      </div>
    </div>
  );
}
