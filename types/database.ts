export type PlanType = 'Starter' | 'Confort' | 'Premium';
export type SubscriptionStatus = 'pending_payment' | 'active' | 'canceled' | 'expired';
export type PaymentStatus = 'pending_instruction' | 'pending_confirmation' | 'confirmed' | 'failed';
export type PaymentMethod = 'bank_transfer' | 'whatsapp' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  country_code: string | null;
  is_blocked: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface PaymentInstruction {
  id: string;
  plan_type: PlanType;
  instruction_text: string;
  bank_details: string;
  whatsapp_number: string | null;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  confirmed_by_admin_id: string | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
  profile?: Profile;
  subscription?: Subscription;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  attachment_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface CRMNote {
  id: string;
  user_id: string;
  admin_id: string;
  note: string;
  created_at: string;
  admin?: Profile;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  ip_address: string | null;
  created_at: string;
  admin?: Profile;
}

export interface SiteSettings {
  key: string;
  value: any;
}
