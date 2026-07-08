export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agences: {
        Row: {
          adresse: string | null
          created_at: string
          deleted_at: string | null
          entreprise_id: string
          id: string
          location: unknown
          nom: string
          ville: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          deleted_at?: string | null
          entreprise_id: string
          id?: string
          location?: unknown
          nom: string
          ville?: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          deleted_at?: string | null
          entreprise_id?: string
          id?: string
          location?: unknown
          nom?: string
          ville?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_profile_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string
          date: string
          entreprise_id: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          created_at?: string
          date: string
          entreprise_id: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          created_at?: string
          date?: string
          entreprise_id?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          display_order: number
          icon: string | null
          id: number
          label: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          active?: boolean
          display_order?: number
          icon?: string | null
          id?: number
          label: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          active?: boolean
          display_order?: number
          icon?: string | null
          id?: number
          label?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: []
      }
      credit_costs: {
        Row: {
          active: boolean
          category_id: number | null
          credit_cost: number
          id: string
          is_grouped_offer: boolean
          project_size: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          active?: boolean
          category_id?: number | null
          credit_cost: number
          id?: string
          is_grouped_offer?: boolean
          project_size?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          active?: boolean
          category_id?: number | null
          credit_cost?: number
          id?: string
          is_grouped_offer?: boolean
          project_size?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      credit_packs: {
        Row: {
          active: boolean
          credits_amount: number
          id: string
          is_popular: boolean
          label: string
          price_fcfa: number
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          active?: boolean
          credits_amount: number
          id?: string
          is_popular?: boolean
          label: string
          price_fcfa: number
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          active?: boolean
          credits_amount?: number
          id?: string
          is_popular?: boolean
          label?: string
          price_fcfa?: number
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          related_offre_id: string | null
          related_pack_id: string | null
          type: Database["public"]["Enums"]["credit_txn_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          related_offre_id?: string | null
          related_pack_id?: string | null
          type: Database["public"]["Enums"]["credit_txn_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          related_offre_id?: string | null
          related_pack_id?: string | null
          type?: Database["public"]["Enums"]["credit_txn_type"]
          wallet_id?: string
        }
        Relationships: []
      }
      demande_lots: {
        Row: {
          category_id: number
          created_at: string
          demande_id: string
          details: Json | null
          id: string
          project_size: string
          status: Database["public"]["Enums"]["demande_status"]
        }
        Insert: {
          category_id: number
          created_at?: string
          demande_id: string
          details?: Json | null
          id?: string
          project_size?: string
          status?: Database["public"]["Enums"]["demande_status"]
        }
        Update: {
          category_id?: number
          created_at?: string
          demande_id?: string
          details?: Json | null
          id?: string
          project_size?: string
          status?: Database["public"]["Enums"]["demande_status"]
        }
        Relationships: []
      }
      demandes: {
        Row: {
          budget_max: number
          budget_min: number
          client_id: string
          created_at: string
          date_evenement: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_urgent_boost: boolean
          projet_id: string
          status: Database["public"]["Enums"]["demande_status"]
          titre: string
          type_evenement: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          budget_max: number
          budget_min: number
          client_id: string
          created_at?: string
          date_evenement?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_urgent_boost?: boolean
          projet_id: string
          status?: Database["public"]["Enums"]["demande_status"]
          titre: string
          type_evenement?: string | null
          updated_at?: string
          ville?: string
        }
        Update: {
          budget_max?: number
          budget_min?: number
          client_id?: string
          created_at?: string
          date_evenement?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_urgent_boost?: boolean
          projet_id?: string
          status?: Database["public"]["Enums"]["demande_status"]
          titre?: string
          type_evenement?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      entreprise_membres: {
        Row: {
          created_at: string
          entreprise_id: string
          profile_id: string
          role: Database["public"]["Enums"]["entreprise_membre_role"]
        }
        Insert: {
          created_at?: string
          entreprise_id: string
          profile_id: string
          role?: Database["public"]["Enums"]["entreprise_membre_role"]
        }
        Update: {
          created_at?: string
          entreprise_id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["entreprise_membre_role"]
        }
        Relationships: []
      }
      entreprise_stats: {
        Row: {
          credits_consommes: number
          date: string
          entreprise_id: string
          nb_offres_acceptees: number
          nb_offres_envoyees: number
        }
        Insert: {
          credits_consommes?: number
          date: string
          entreprise_id: string
          nb_offres_acceptees?: number
          nb_offres_envoyees?: number
        }
        Update: {
          credits_consommes?: number
          date?: string
          entreprise_id?: string
          nb_offres_acceptees?: number
          nb_offres_envoyees?: number
        }
        Relationships: []
      }
      entreprises: {
        Row: {
          avg_response_time_min: number | null
          bio: string | null
          business_doc_url: string | null
          created_at: string
          deleted_at: string | null
          events_completed_count: number
          id: string
          id_document_url: string | null
          is_solution_tout_en_un: boolean
          nom: string
          reliability_score: number | null
          response_rate: number | null
          type: Database["public"]["Enums"]["entreprise_type"]
          updated_at: string
          verification_level: Database["public"]["Enums"]["verification_level"]
          ville: string | null
        }
        Insert: {
          avg_response_time_min?: number | null
          bio?: string | null
          business_doc_url?: string | null
          created_at?: string
          deleted_at?: string | null
          events_completed_count?: number
          id?: string
          id_document_url?: string | null
          is_solution_tout_en_un?: boolean
          nom: string
          reliability_score?: number | null
          response_rate?: number | null
          type?: Database["public"]["Enums"]["entreprise_type"]
          updated_at?: string
          verification_level?: Database["public"]["Enums"]["verification_level"]
          ville?: string | null
        }
        Update: {
          avg_response_time_min?: number | null
          bio?: string | null
          business_doc_url?: string | null
          created_at?: string
          deleted_at?: string | null
          events_completed_count?: number
          id?: string
          id_document_url?: string | null
          is_solution_tout_en_un?: boolean
          nom?: string
          reliability_score?: number | null
          response_rate?: number | null
          type?: Database["public"]["Enums"]["entreprise_type"]
          updated_at?: string
          verification_level?: Database["public"]["Enums"]["verification_level"]
          ville?: string | null
        }
        Relationships: []
      }
      favoris: {
        Row: {
          client_id: string
          created_at: string
          entreprise_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          entreprise_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          entreprise_id?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string
          display_order: number
          entreprise_id: string
          id: string
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          entreprise_id: string
          id?: string
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          entreprise_id?: string
          id?: string
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_meta: Json | null
          attachment_url: string | null
          content: string | null
          created_at: string
          demande_id: string
          id: string
          location: unknown
          offre_id: string | null
          read_at: string | null
          sender_id: string
          type: Database["public"]["Enums"]["message_type"]
        }
        Insert: {
          attachment_meta?: Json | null
          attachment_url?: string | null
          content?: string | null
          created_at?: string
          demande_id: string
          id?: string
          location?: unknown
          offre_id?: string | null
          read_at?: string | null
          sender_id: string
          type?: Database["public"]["Enums"]["message_type"]
        }
        Update: {
          attachment_meta?: Json | null
          attachment_url?: string | null
          content?: string | null
          created_at?: string
          demande_id?: string
          id?: string
          location?: unknown
          offre_id?: string | null
          read_at?: string | null
          sender_id?: string
          type?: Database["public"]["Enums"]["message_type"]
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          data: Json | null
          id: string
          profile_id: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          data?: Json | null
          id?: string
          profile_id: string
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          data?: Json | null
          id?: string
          profile_id?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      offre_lots: {
        Row: {
          demande_lot_id: string
          id: string
          offre_id: string
          prix_lot: number
        }
        Insert: {
          demande_lot_id: string
          id?: string
          offre_id: string
          prix_lot: number
        }
        Update: {
          demande_lot_id?: string
          id?: string
          offre_id?: string
          prix_lot?: number
        }
        Relationships: []
      }
      offre_participants: {
        Row: {
          created_at: string
          entreprise_id: string
          offre_id: string
          role: string
        }
        Insert: {
          created_at?: string
          entreprise_id: string
          offre_id: string
          role?: string
        }
        Update: {
          created_at?: string
          entreprise_id?: string
          offre_id?: string
          role?: string
        }
        Relationships: []
      }
      offres: {
        Row: {
          created_at: string
          credits_spent: number
          deleted_at: string | null
          demande_id: string
          entreprise_id: string
          id: string
          is_grouped: boolean
          message: string | null
          status: Database["public"]["Enums"]["offre_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_spent?: number
          deleted_at?: string | null
          demande_id: string
          entreprise_id: string
          id?: string
          is_grouped?: boolean
          message?: string | null
          status?: Database["public"]["Enums"]["offre_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_spent?: number
          deleted_at?: string | null
          demande_id?: string
          entreprise_id?: string
          id?: string
          is_grouped?: boolean
          message?: string | null
          status?: Database["public"]["Enums"]["offre_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      platform_stats_daily: {
        Row: {
          clients_actifs: number
          created_at: string
          credits_consommes: number
          date: string
          nb_demandes: number
          nb_offres: number
          prestataires_actifs: number
          revenus_fcfa: number
          taux_conversion: number | null
        }
        Insert: {
          clients_actifs?: number
          created_at?: string
          credits_consommes?: number
          date: string
          nb_demandes?: number
          nb_offres?: number
          prestataires_actifs?: number
          revenus_fcfa?: number
          taux_conversion?: number | null
        }
        Update: {
          clients_actifs?: number
          created_at?: string
          credits_consommes?: number
          date?: string
          nb_demandes?: number
          nb_offres?: number
          prestataires_actifs?: number
          revenus_fcfa?: number
          taux_conversion?: number | null
        }
        Relationships: []
      }
      prestataire_categories: {
        Row: {
          category_id: number
          entreprise_id: string
        }
        Insert: {
          category_id: number
          entreprise_id: string
        }
        Update: {
          category_id?: number
          entreprise_id?: string
        }
        Relationships: []
      }
      prestataire_subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          end_date: string
          entreprise_id: string
          id: string
          plan_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          end_date: string
          entreprise_id: string
          id?: string
          plan_id: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          end_date?: string
          entreprise_id?: string
          id?: string
          plan_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string
          id: string
          phone: string
          phone_verified: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          ville: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name: string
          id: string
          phone: string
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          ville?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      projets: {
        Row: {
          client_id: string
          created_at: string
          date_evenement: string | null
          deleted_at: string | null
          id: string
          lieu: string | null
          status: Database["public"]["Enums"]["projet_status"]
          titre: string
          type_evenement: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_evenement?: string | null
          deleted_at?: string | null
          id?: string
          lieu?: string | null
          status?: Database["public"]["Enums"]["projet_status"]
          titre: string
          type_evenement?: string | null
          updated_at?: string
          ville?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_evenement?: string | null
          deleted_at?: string | null
          id?: string
          lieu?: string | null
          status?: Database["public"]["Enums"]["projet_status"]
          titre?: string
          type_evenement?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          applies_to: string
          auto_apply: boolean
          code: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          label: string
          start_date: string
          target_category_id: number | null
          target_min_seniority_days: number | null
          target_ville: string | null
        }
        Insert: {
          active?: boolean
          applies_to?: string
          auto_apply?: boolean
          code?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          label: string
          start_date: string
          target_category_id?: number | null
          target_min_seniority_days?: number | null
          target_ville?: string | null
        }
        Update: {
          active?: boolean
          applies_to?: string
          auto_apply?: boolean
          code?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          label?: string
          start_date?: string
          target_category_id?: number | null
          target_min_seniority_days?: number | null
          target_ville?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          demande_id: string
          entreprise_id: string
          id: string
          rating: number
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          demande_id: string
          entreprise_id: string
          id?: string
          rating: number
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          demande_id?: string
          entreprise_id?: string
          id?: string
          rating?: number
        }
        Relationships: []
      }
      sponsored_visibility: {
        Row: {
          category_id: number
          end_date: string
          entreprise_id: string
          id: string
          price_paid_fcfa: number
          start_date: string
          ville: string
        }
        Insert: {
          category_id: number
          end_date: string
          entreprise_id: string
          id?: string
          price_paid_fcfa: number
          start_date?: string
          ville: string
        }
        Update: {
          category_id?: number
          end_date?: string
          entreprise_id?: string
          id?: string
          price_paid_fcfa?: number
          start_date?: string
          ville?: string
        }
        Relationships: []
      }
      sponsored_visibility_rates: {
        Row: {
          active: boolean
          category_id: number | null
          id: string
          price_per_week_fcfa: number
          ville: string | null
        }
        Insert: {
          active?: boolean
          category_id?: number | null
          id?: string
          price_per_week_fcfa: number
          ville?: string | null
        }
        Update: {
          active?: boolean
          category_id?: number | null
          id?: string
          price_per_week_fcfa?: number
          ville?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean
          badge_label: string | null
          credits_included: number
          features: Json | null
          id: string
          label: string
          price_fcfa: number
          slug: string
        }
        Insert: {
          active?: boolean
          badge_label?: string | null
          credits_included: number
          features?: Json | null
          id?: string
          label: string
          price_fcfa: number
          slug: string
        }
        Update: {
          active?: boolean
          badge_label?: string | null
          credits_included?: number
          features?: Json | null
          id?: string
          label?: string
          price_fcfa?: number
          slug?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          documents: Json
          entreprise_id: string
          id: string
          level_requested: Database["public"]["Enums"]["verification_level"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["verification_request_status"]
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          documents: Json
          entreprise_id: string
          id?: string
          level_requested: Database["public"]["Enums"]["verification_level"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_request_status"]
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          documents?: Json
          entreprise_id?: string
          id?: string
          level_requested?: Database["public"]["Enums"]["verification_level"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_request_status"]
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          entreprise_id: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          entreprise_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          entreprise_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_reliability_score: {
        Row: {
          entreprise_id: string | null
          score_sur_100: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      is_entreprise_admin: { Args: { ent_id: string }; Returns: boolean }
      is_entreprise_member: { Args: { ent_id: string }; Returns: boolean }
      rpc_creer_entreprise: {
        Args: {
          p_nom: string
          p_type?: Database["public"]["Enums"]["entreprise_type"]
        }
        Returns: string
      }
      rpc_creer_offre: {
        Args: {
          p_credit_cost: number
          p_demande_id: string
          p_entreprise_id: string
          p_lots: Json
          p_message: string
          p_total_price: number
        }
        Returns: string
      }
    }
    Enums: {
      availability_status:
        | "disponible"
        | "occupe"
        | "conge"
        | "indisponible"
        | "maintenance"
      credit_txn_type:
        | "achat"
        | "depense"
        | "bonus_gratuit"
        | "remboursement"
        | "promotion"
        | "correction_manuelle"
        | "annulation"
      demande_status: "ouverte" | "en_negociation" | "cloturee" | "annulee"
      entreprise_membre_role: "proprietaire" | "admin" | "employe"
      entreprise_type: "individuel" | "entreprise"
      media_type: "image" | "video_link"
      message_type:
        | "texte"
        | "image"
        | "pdf"
        | "devis"
        | "document"
        | "localisation"
        | "systeme"
      notification_channel: "realtime" | "email" | "push"
      offre_status: "envoyee" | "vue" | "acceptee" | "refusee" | "retiree"
      projet_status: "actif" | "termine" | "annule"
      subscription_status: "active" | "expiree" | "annulee" | "suspendue"
      user_role: "client" | "prestataire" | "admin"
      verification_level: "niveau_1" | "niveau_2" | "niveau_3"
      verification_request_status: "en_attente" | "approuvee" | "rejetee"
    }
    CompositeTypes: Record<string, never>
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  Name extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[Name] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name] extends { Insert: infer I } ? I : never

export type TablesUpdate<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name] extends { Update: infer U } ? U : never

export type Enums<Name extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][Name]
