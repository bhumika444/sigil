export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          agent_code: string
          agent_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          principal_org: string
          principal_user: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_code: string
          agent_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          principal_org: string
          principal_user: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_code?: string
          agent_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          principal_org?: string
          principal_user?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          agent_id: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          severity: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          severity?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          agent_id: string
          created_at: string
          credential_type: string
          expires_at: string | null
          id: string
          issued_at: string
          jwt_token: string | null
          per_txn_limit: number | null
          revoked_at: string | null
          scope: Json | null
          spend_limit: number | null
          status: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          credential_type?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          jwt_token?: string | null
          per_txn_limit?: number | null
          revoked_at?: string | null
          scope?: Json | null
          spend_limit?: number | null
          status?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          credential_type?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          jwt_token?: string | null
          per_txn_limit?: number | null
          revoked_at?: string | null
          scope?: Json | null
          spend_limit?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation: {
        Row: {
          agent_id: string
          flagged_transactions: number | null
          id: string
          last_audit: string | null
          sigil_score: number
          total_transactions: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          flagged_transactions?: number | null
          id?: string
          last_audit?: string | null
          sigil_score?: number
          total_transactions?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          flagged_transactions?: number | null
          id?: string
          last_audit?: string | null
          sigil_score?: number
          total_transactions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reputation_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agent_id: string
          amount: number
          category: string | null
          counterparty: string | null
          created_at: string
          credential_id: string | null
          currency: string
          id: string
          metadata: Json | null
          rejection_reason: string | null
          status: string
        }
        Insert: {
          agent_id: string
          amount?: number
          category?: string | null
          counterparty?: string | null
          created_at?: string
          credential_id?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          status?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          category?: string | null
          counterparty?: string | null
          created_at?: string
          credential_id?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          rejection_reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "active" | "suspended" | "revoked"
      credential_status: "active" | "expired" | "revoked"
      severity_level: "info" | "warning" | "critical"
      transaction_status: "settled" | "pending" | "rejected" | "flagged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["active", "suspended", "revoked"],
      credential_status: ["active", "expired", "revoked"],
      severity_level: ["info", "warning", "critical"],
      transaction_status: ["settled", "pending", "rejected", "flagged"],
    },
  },
} as const
