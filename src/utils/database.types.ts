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
      dog_walk: {
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
      profiles: {
        Row: {
          bio: string
          city: string
          created_at: string
          emergency_phone_1: string
          emergency_phone_2: string
          f_name: string
          id: string
          image: string
          l_name: string
          phone: string
          role: string
          state: string
          street: string
          updated_at: string
          username: string
          zip: string
        }
        Insert: {
          bio?: string
          city?: string
          created_at?: string
          emergency_phone_1?: string
          emergency_phone_2?: string
          f_name?: string
          id: string
          image?: string
          l_name?: string
          phone?: string
          role?: string
          state?: string
          street?: string
          updated_at?: string
          username?: string
          zip?: string
        }
        Update: {
          bio?: string
          city?: string
          created_at?: string
          emergency_phone_1?: string
          emergency_phone_2?: string
          f_name?: string
          id?: string
          image?: string
          l_name?: string
          phone?: string
          role?: string
          state?: string
          street?: string
          updated_at?: string
          username?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      walks: {
        Row: {
          address: string
          admin_notes: string
          customer: string
          date: string
          description: string
          end: string
          group: boolean
          id: number
          lat: string
          long: string
          notes: string
          start: string
          status: string
          subtitle: string
          title: string
          walker: string | null
        }
        Insert: {
          address?: string
          admin_notes?: string
          customer: string
          date: string
          description: string
          end: string
          group?: boolean
          id?: number
          lat?: string
          long?: string
          notes?: string
          start: string
          status?: string
          subtitle: string
          title: string
          walker?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string
          customer?: string
          date?: string
          description?: string
          end?: string
          group?: boolean
          id?: number
          lat?: string
          long?: string
          notes?: string
          start?: string
          status?: string
          subtitle?: string
          title?: string
          walker?: string | null
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
      [_ in never]: never
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
