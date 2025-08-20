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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      accessory_catalog: {
        Row: {
          brand: string
          category: string
          created_at: string
          description: string | null
          id: string
          model_compatibility: string[] | null
          name: string
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          brand: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          model_compatibility?: string[] | null
          name: string
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          model_compatibility?: string[] | null
          name?: string
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipment_accessories: {
        Row: {
          accessory_catalog_id: string | null
          accessory_equipment_id: string | null
          accessory_type: string | null
          created_at: string
          id: string
          notes: string | null
          parent_equipment_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          accessory_catalog_id?: string | null
          accessory_equipment_id?: string | null
          accessory_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          parent_equipment_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          accessory_catalog_id?: string | null
          accessory_equipment_id?: string | null
          accessory_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          parent_equipment_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_accessories_accessory_catalog_id_fkey"
            columns: ["accessory_catalog_id"]
            isOneToOne: false
            referencedRelation: "accessory_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_accessories_accessory_equipment_id_fkey"
            columns: ["accessory_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_accessories_parent_equipment_id_fkey"
            columns: ["parent_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_history: {
        Row: {
          acquisition_date: string | null
          deleted_at: string
          deleted_by: string | null
          equipment_type: string
          id: string
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          observations: string | null
          original_equipment_id: string
          responsible_user: string | null
          sequence_number: number
          serial_number: string | null
          sisant_registration: string | null
          status: string | null
          value: number | null
        }
        Insert: {
          acquisition_date?: string | null
          deleted_at?: string
          deleted_by?: string | null
          equipment_type: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          observations?: string | null
          original_equipment_id: string
          responsible_user?: string | null
          sequence_number: number
          serial_number?: string | null
          sisant_registration?: string | null
          status?: string | null
          value?: number | null
        }
        Update: {
          acquisition_date?: string | null
          deleted_at?: string
          deleted_by?: string | null
          equipment_type?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          observations?: string | null
          original_equipment_id?: string
          responsible_user?: string | null
          sequence_number?: number
          serial_number?: string | null
          sisant_registration?: string | null
          status?: string | null
          value?: number | null
        }
        Relationships: []
      }
      equipment_sequence: {
        Row: {
          created_at: string
          id: string
          last_sequence_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_sequence_number?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_sequence_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      equipments: {
        Row: {
          acquisition_date: string | null
          created_at: string
          equipment_type: string
          id: string
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          observations: string | null
          responsible_user: string | null
          sequence_number: number | null
          serial_number: string | null
          sisant_registration: string | null
          status: string
          updated_at: string
          value: number | null
        }
        Insert: {
          acquisition_date?: string | null
          created_at?: string
          equipment_type?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          observations?: string | null
          responsible_user?: string | null
          sequence_number?: number | null
          serial_number?: string | null
          sisant_registration?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          acquisition_date?: string | null
          created_at?: string
          equipment_type?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          observations?: string | null
          responsible_user?: string | null
          sequence_number?: number | null
          serial_number?: string | null
          sisant_registration?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      flight_accessories: {
        Row: {
          accessory_id: string
          created_at: string
          flight_id: string
          id: string
        }
        Insert: {
          accessory_id: string
          created_at?: string
          flight_id: string
          id?: string
        }
        Update: {
          accessory_id?: string
          created_at?: string
          flight_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_accessories_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "equipment_accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_accessories_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          created_at: string
          created_by: string
          end_time: string | null
          equipment_id: string
          id: string
          incidents: string | null
          location: string
          notes: string | null
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_time?: string | null
          equipment_id: string
          id?: string
          incidents?: string | null
          location: string
          notes?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_time?: string | null
          equipment_id?: string
          id?: string
          incidents?: string | null
          location?: string
          notes?: string | null
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flights_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      pilots: {
        Row: {
          allocation: string | null
          courses: string[] | null
          created_at: string
          functional_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          allocation?: string | null
          courses?: string[] | null
          created_at?: string
          functional_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          allocation?: string | null
          courses?: string[] | null
          created_at?: string
          functional_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: string
          progress: number
          responsible_user: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: string
          progress?: number
          responsible_user?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: string
          progress?: number
          responsible_user?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_progress: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_equipment_sequence: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
