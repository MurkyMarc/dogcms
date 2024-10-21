import { Role } from "../api/types"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          archived: boolean
          created_at: string
          customer: Tables<'profiles'>
          customer_last_viewed_at: string
          customer_unread_count: number
          employee: Tables<'profiles'> | null
          employee_last_viewed_at: string
          employee_unread_count: number
          id: number
          last_message: string
          last_message_at: string | null
          last_message_sender: string | null
          walk_id: number | null
        }
        Insert: {
          archived?: boolean
          created_at?: string
          customer: string
          customer_last_viewed_at?: string
          customer_unread_count?: number
          employee?: string | null
          employee_last_viewed_at?: string
          employee_unread_count?: number
          id?: number
          last_message?: string
          last_message_at?: string | null
          last_message_sender?: string | null
          walk_id?: number | null
        }
        Update: {
          archived?: boolean
          created_at?: string
          customer?: string
          customer_last_viewed_at?: string
          customer_unread_count?: number
          employee?: string | null
          employee_last_viewed_at?: string
          employee_unread_count?: number
          id?: number
          last_message?: string
          last_message_at?: string | null
          last_message_sender?: string | null
          walk_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_employee_fkey"
            columns: ["employee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_walk_id_fkey"
            columns: ["walk_id"]
            isOneToOne: false
            referencedRelation: "walks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_walk_id_fkey"
            columns: ["walk_id"]
            isOneToOne: false
            referencedRelation: "walks_with_dogs"
            referencedColumns: ["walk_id"]
          },
          {
            foreignKeyName: "conversations_walk_id_fkey"
            columns: ["walk_id"]
            isOneToOne: false
            referencedRelation: "walks_with_dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_walks: {
        Row: {
          dog: number
          id: number
          walk: number
        }
        Insert: {
          dog: number
          id?: number
          walk: number
        }
        Update: {
          dog?: number
          id?: number
          walk?: number
        }
        Relationships: [
          {
            foreignKeyName: "dog_walk_dog_fkey"
            columns: ["dog"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_walk_walk_fkey"
            columns: ["walk"]
            isOneToOne: false
            referencedRelation: "walks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_walk_walk_fkey"
            columns: ["walk"]
            isOneToOne: false
            referencedRelation: "walks_with_dogs"
            referencedColumns: ["walk_id"]
          },
          {
            foreignKeyName: "dog_walk_walk_fkey"
            columns: ["walk"]
            isOneToOne: false
            referencedRelation: "walks_with_dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          age: number
          bio: string
          breed: string
          created_at: string
          dob: string
          group_walks: boolean
          id: number
          image: string
          name: string
          notes: string
          owner: string
          sex: string
          updated_at: string
          weight: number
        }
        Insert: {
          age?: number
          bio?: string
          breed?: string
          created_at?: string
          dob: string
          group_walks?: boolean
          id?: number
          image?: string
          name?: string
          notes?: string
          owner?: string
          sex?: string
          updated_at?: string
          weight?: number
        }
        Update: {
          age?: number
          bio?: string
          breed?: string
          created_at?: string
          dob?: string
          group_walks?: boolean
          id?: number
          image?: string
          name?: string
          notes?: string
          owner?: string
          sex?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_dogs_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: number
          created_at: string
          deleted_at: string | null
          id: number
          pic: string
          sender_id: string
        }
        Insert: {
          content?: string
          conversation_id: number
          created_at?: string
          deleted_at?: string | null
          id?: number
          pic?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: number
          created_at?: string
          deleted_at?: string | null
          id?: number
          pic?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string
          city: string
          created_at: string
          credits: number
          emergency_phone_1: string
          emergency_phone_2: string
          f_name: string
          id: string
          image: string
          l_name: string
          phone: string
          role: Role
          state: string
          street: string
          updated_at: string
          zip: string
        }
        Insert: {
          bio?: string
          city?: string
          created_at?: string
          credits?: number
          emergency_phone_1?: string
          emergency_phone_2?: string
          f_name?: string
          id: string
          image?: string
          l_name?: string
          phone?: string
          role?: Role
          state?: string
          street?: string
          updated_at?: string
          zip?: string
        }
        Update: {
          bio?: string
          city?: string
          created_at?: string
          credits?: number
          emergency_phone_1?: string
          emergency_phone_2?: string
          f_name?: string
          id?: string
          image?: string
          l_name?: string
          phone?: string
          role?: Role
          state?: string
          street?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      service_prices: {
        Row: {
          created_at: string
          credit_cost: number
          description: string
          duration_minutes: number
          effective_date: string
          expiry_date: string | null
          id: number
          is_active: boolean
          is_discounted: boolean
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credit_cost?: number
          description?: string
          duration_minutes?: number
          effective_date?: string
          expiry_date?: string | null
          id?: number
          is_active?: boolean
          is_discounted?: boolean
          service_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credit_cost?: number
          description?: string
          duration_minutes?: number
          effective_date?: string
          expiry_date?: string | null
          id?: number
          is_active?: boolean
          is_discounted?: boolean
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      walks: {
        Row: {
          admin_notes: string
          city: string
          customer: string
          end: string
          id: number
          lat: string
          long: string
          notes: string
          price: number
          start: string
          state: string
          status: string
          street: string
          walker: Tables<'profiles'> | null
          zip: string
        }
        Insert: {
          admin_notes?: string
          city?: string
          customer: string
          end: string
          id?: number
          lat?: string
          long?: string
          notes?: string
          price?: number
          start: string
          state?: string
          status?: string
          street?: string
          walker?: string | null
          zip?: string
        }
        Update: {
          admin_notes?: string
          city?: string
          customer?: string
          end?: string
          id?: number
          lat?: string
          long?: string
          notes?: string
          price?: number
          start?: string
          state?: string
          status?: string
          street?: string
          walker?: string | null
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "walks_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "walks_walker_fkey"
            columns: ["walker"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      walks_with_dogs: {
        Row: {
          admin_notes: string
          city: string
          customer: Tables<'profiles'>
          dogs: Tables<'dogs'>[]
          end: string
          id: number
          lat: string
          long: string
          notes: string
          start: string
          state: string
          status: string
          street: string
          walk_id: number
          walker: Tables<'profiles'> | null
          zip: string
        }
        Relationships: [
          {
            foreignKeyName: "walks_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "walks_walker_fkey"
            columns: ["walker"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_avatar: {
        Args: {
          image: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
