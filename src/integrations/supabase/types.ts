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
      character_factions: {
        Row: {
          character_id: string
          created_at: string
          faction_id: string
          role: string | null
        }
        Insert: {
          character_id: string
          created_at?: string
          faction_id: string
          role?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string
          faction_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_factions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_factions_faction_id_fkey"
            columns: ["faction_id"]
            isOneToOne: false
            referencedRelation: "factions"
            referencedColumns: ["id"]
          },
        ]
      }
      character_powers: {
        Row: {
          character_id: string
          created_at: string
          notes: string | null
          power_system_id: string
        }
        Insert: {
          character_id: string
          created_at?: string
          notes?: string | null
          power_system_id: string
        }
        Update: {
          character_id?: string
          created_at?: string
          notes?: string | null
          power_system_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_powers_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_powers_power_system_id_fkey"
            columns: ["power_system_id"]
            isOneToOne: false
            referencedRelation: "power_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      character_stories: {
        Row: {
          character_id: string
          created_at: string
          role: string | null
          story_id: string
        }
        Insert: {
          character_id: string
          created_at?: string
          role?: string | null
          story_id: string
        }
        Update: {
          character_id?: string
          created_at?: string
          role?: string | null
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_stories_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      character_worlds: {
        Row: {
          character_id: string
          created_at: string
          world_id: string
        }
        Insert: {
          character_id: string
          created_at?: string
          world_id: string
        }
        Update: {
          character_id?: string
          created_at?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_worlds_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_worlds_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          accent_color: string | null
          alias: string | null
          canon_status: string
          canon_summary_md: string | null
          created_at: string
          eyebrow: string | null
          id: string
          identity_md: string | null
          last_synced_at: string | null
          name: string
          notion_source_url: string | null
          portrait_url: string | null
          primary_story_id: string | null
          role: string | null
          slug: string
          spoiler_md: string | null
          story_id: string | null
          story_role_md: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          alias?: string | null
          canon_status?: string
          canon_summary_md?: string | null
          created_at?: string
          eyebrow?: string | null
          id?: string
          identity_md?: string | null
          last_synced_at?: string | null
          name: string
          notion_source_url?: string | null
          portrait_url?: string | null
          primary_story_id?: string | null
          role?: string | null
          slug: string
          spoiler_md?: string | null
          story_id?: string | null
          story_role_md?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          alias?: string | null
          canon_status?: string
          canon_summary_md?: string | null
          created_at?: string
          eyebrow?: string | null
          id?: string
          identity_md?: string | null
          last_synced_at?: string | null
          name?: string
          notion_source_url?: string | null
          portrait_url?: string | null
          primary_story_id?: string | null
          role?: string | null
          slug?: string
          spoiler_md?: string | null
          story_id?: string | null
          story_role_md?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_primary_story_id_fkey"
            columns: ["primary_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      factions: {
        Row: {
          canon_status: string
          created_at: string
          id: string
          image_url: string | null
          last_synced_at: string | null
          name: string
          notion_source_url: string | null
          slug: string
          spoiler_md: string | null
          summary_md: string | null
          updated_at: string
        }
        Insert: {
          canon_status?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          name: string
          notion_source_url?: string | null
          slug: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Update: {
          canon_status?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          name?: string
          notion_source_url?: string | null
          slug?: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      power_systems: {
        Row: {
          canon_status: string
          created_at: string
          id: string
          last_synced_at: string | null
          name: string
          notion_source_url: string | null
          slug: string
          spoiler_md: string | null
          summary_md: string | null
          updated_at: string
        }
        Insert: {
          canon_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          name: string
          notion_source_url?: string | null
          slug: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Update: {
          canon_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          name?: string
          notion_source_url?: string | null
          slug?: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      spoiler_notes: {
        Row: {
          body_md: string | null
          canon_status: string
          created_at: string
          id: string
          last_synced_at: string | null
          notion_source_url: string | null
          related_story_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body_md?: string | null
          canon_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          notion_source_url?: string | null
          related_story_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string | null
          canon_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          notion_source_url?: string | null
          related_story_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spoiler_notes_related_story_id_fkey"
            columns: ["related_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          canon_status: string
          cover_image_url: string | null
          created_at: string
          id: string
          last_synced_at: string | null
          notion_source_url: string | null
          number: number
          slug: string
          summary_md: string | null
          summary_spoiler_md: string | null
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          canon_status?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          last_synced_at?: string | null
          notion_source_url?: string | null
          number: number
          slug: string
          summary_md?: string | null
          summary_spoiler_md?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          canon_status?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          last_synced_at?: string | null
          notion_source_url?: string | null
          number?: number
          slug?: string
          summary_md?: string | null
          summary_spoiler_md?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      worlds: {
        Row: {
          canon_status: string
          created_at: string
          id: string
          image_url: string | null
          last_synced_at: string | null
          name: string
          notion_source_url: string | null
          slug: string
          spoiler_md: string | null
          summary_md: string | null
          updated_at: string
        }
        Insert: {
          canon_status?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          name: string
          notion_source_url?: string | null
          slug: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Update: {
          canon_status?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          name?: string
          notion_source_url?: string | null
          slug?: string
          spoiler_md?: string | null
          summary_md?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
