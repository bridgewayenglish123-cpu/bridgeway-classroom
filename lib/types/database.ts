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
      accounts: {
        Row: {
          billing_type: string
          course_family: string
          course_label: string
          created_at: string
          duration_type: string
          enrollment_id: string
          id: string
          is_trial: boolean
          snapshot: Json
          start_lesson_date: string | null
          status_override: string | null
          student_id: string
          teacher_type: string
          total_lessons: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          billing_type: string
          course_family: string
          course_label: string
          created_at?: string
          duration_type: string
          enrollment_id: string
          id: string
          is_trial?: boolean
          snapshot: Json
          start_lesson_date?: string | null
          status_override?: string | null
          student_id: string
          teacher_type: string
          total_lessons: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          billing_type?: string
          course_family?: string
          course_label?: string
          created_at?: string
          duration_type?: string
          enrollment_id?: string
          id?: string
          is_trial?: boolean
          snapshot?: Json
          start_lesson_date?: string | null
          status_override?: string | null
          student_id?: string
          teacher_type?: string
          total_lessons?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      app_meta: {
        Row: {
          id: number
          last_backup_at: string | null
          php_rate: number
          seed_version: number | null
          student_seed_version: number | null
          updated_at: string
        }
        Insert: {
          id?: number
          last_backup_at?: string | null
          php_rate?: number
          seed_version?: number | null
          student_seed_version?: number | null
          updated_at?: string
        }
        Update: {
          id?: number
          last_backup_at?: string | null
          php_rate?: number
          seed_version?: number | null
          student_seed_version?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string
          id: string
          note: string | null
          payment_date: string
          price_rule_code: string | null
          snapshot: Json
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          note?: string | null
          payment_date: string
          price_rule_code?: string | null
          snapshot: Json
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          payment_date?: string
          price_rule_code?: string | null
          snapshot?: Json
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_reports: {
        Row: {
          analysis_en: Json | null
          analysis_zh: Json | null
          comparison: Json | null
          created_at: string
          errors: Json | null
          id: string
          lesson_id: string
          milestone: string | null
          next_focus: string | null
          phrases: Json | null
          strengths: Json | null
          student_id: string
          teacher_note: string | null
          transcript_vtt: string | null
          updated_at: string
          vocabulary: Json | null
        }
        Insert: {
          analysis_en?: Json | null
          analysis_zh?: Json | null
          comparison?: Json | null
          created_at?: string
          errors?: Json | null
          id: string
          lesson_id: string
          milestone?: string | null
          next_focus?: string | null
          phrases?: Json | null
          strengths?: Json | null
          student_id: string
          teacher_note?: string | null
          transcript_vtt?: string | null
          updated_at?: string
          vocabulary?: Json | null
        }
        Update: {
          analysis_en?: Json | null
          analysis_zh?: Json | null
          comparison?: Json | null
          created_at?: string
          errors?: Json | null
          id?: string
          lesson_id?: string
          milestone?: string | null
          next_focus?: string | null
          phrases?: Json | null
          strengths?: Json | null
          student_id?: string
          teacher_note?: string | null
          transcript_vtt?: string | null
          updated_at?: string
          vocabulary?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_reports_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          account_id: string
          class_type: string
          created_at: string
          date: string
          duration: number
          id: string
          is_active: boolean
          is_backfill: boolean
          is_substitute: boolean
          note: string | null
          original_class_id: string | null
          original_payout_snapshot: Json | null
          original_teacher_id: string | null
          payout_snapshot: Json
          schedule_rule_id: string | null
          status: string
          student_id: string
          superseded: boolean
          teacher_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          account_id: string
          class_type?: string
          created_at?: string
          date: string
          duration: number
          id: string
          is_active?: boolean
          is_backfill?: boolean
          is_substitute?: boolean
          note?: string | null
          original_class_id?: string | null
          original_payout_snapshot?: Json | null
          original_teacher_id?: string | null
          payout_snapshot: Json
          schedule_rule_id?: string | null
          status?: string
          student_id: string
          superseded?: boolean
          teacher_id?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          class_type?: string
          created_at?: string
          date?: string
          duration?: number
          id?: string
          is_active?: boolean
          is_backfill?: boolean
          is_substitute?: boolean
          note?: string | null
          original_class_id?: string | null
          original_payout_snapshot?: Json | null
          original_teacher_id?: string | null
          payout_snapshot?: Json
          schedule_rule_id?: string | null
          status?: string
          student_id?: string
          superseded?: boolean
          teacher_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_original_class_id_fkey"
            columns: ["original_class_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_original_teacher_id_fkey"
            columns: ["original_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_schedule_rule_id_fkey"
            columns: ["schedule_rule_id"]
            isOneToOne: false
            referencedRelation: "schedule_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      price_rules: {
        Row: {
          active_status: string
          billing_type: string
          course_family: string
          created_at: string
          display_name: string
          duration_type: string
          hanne_share_ntd: number
          id: string
          lesson_count: number
          price_ntd: number
          price_rule_code: string
          teacher_payout_ntd: number
          teacher_type: string
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          active_status?: string
          billing_type: string
          course_family: string
          created_at?: string
          display_name: string
          duration_type: string
          hanne_share_ntd?: number
          id: string
          lesson_count?: number
          price_ntd: number
          price_rule_code: string
          teacher_payout_ntd: number
          teacher_type: string
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          active_status?: string
          billing_type?: string
          course_family?: string
          created_at?: string
          display_name?: string
          duration_type?: string
          hanne_share_ntd?: number
          id?: string
          lesson_count?: number
          price_ntd?: number
          price_rule_code?: string
          teacher_payout_ntd?: number
          teacher_type?: string
          updated_at?: string
          validity_days?: number | null
        }
        Relationships: []
      }
      reflection_responses: {
        Row: {
          created_at: string
          id: string
          lesson_report_id: string
          question: string | null
          question_en: string | null
          question_zh: string | null
          response: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          lesson_report_id: string
          question?: string | null
          question_en?: string | null
          question_zh?: string | null
          response?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_report_id?: string
          question?: string | null
          question_en?: string | null
          question_zh?: string | null
          response?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflection_responses_lesson_report_id_fkey"
            columns: ["lesson_report_id"]
            isOneToOne: false
            referencedRelation: "lesson_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflection_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      remittance_extras: {
        Row: {
          amount_ntd: number
          amount_php: number
          created_at: string
          date: string
          id: string
          note: string | null
          period_key: string
          teacher_id: string | null
        }
        Insert: {
          amount_ntd: number
          amount_php: number
          created_at?: string
          date: string
          id: string
          note?: string | null
          period_key: string
          teacher_id?: string | null
        }
        Update: {
          amount_ntd?: number
          amount_php?: number
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          period_key?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remittance_extras_period_key_fkey"
            columns: ["period_key"]
            isOneToOne: false
            referencedRelation: "remittance_periods"
            referencedColumns: ["period_key"]
          },
          {
            foreignKeyName: "remittance_extras_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      remittance_periods: {
        Row: {
          created_at: string
          paid: boolean
          paid_date: string | null
          period_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          paid?: boolean
          paid_date?: string | null
          period_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          paid?: boolean
          paid_date?: string | null
          period_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_vocabulary: {
        Row: {
          created_at: string
          definition_en: string | null
          definition_zh: string | null
          example_en: string | null
          example_zh: string | null
          id: string
          lesson_report_id: string
          student_id: string
          type: string
          word: string
        }
        Insert: {
          created_at?: string
          definition_en?: string | null
          definition_zh?: string | null
          example_en?: string | null
          example_zh?: string | null
          id: string
          lesson_report_id: string
          student_id: string
          type: string
          word: string
        }
        Update: {
          created_at?: string
          definition_en?: string | null
          definition_zh?: string | null
          example_en?: string | null
          example_zh?: string | null
          id?: string
          lesson_report_id?: string
          student_id?: string
          type?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_vocabulary_lesson_report_id_fkey"
            columns: ["lesson_report_id"]
            isOneToOne: false
            referencedRelation: "lesson_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_vocabulary_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_rules: {
        Row: {
          account_id: string
          active_status: string
          batch_id: string | null
          created_at: string
          duration: number
          end_date: string | null
          id: string
          start_date: string | null
          teacher_id: string | null
          time: string
          updated_at: string
          weekdays: number[]
        }
        Insert: {
          account_id: string
          active_status?: string
          batch_id?: string | null
          created_at?: string
          duration: number
          end_date?: string | null
          id: string
          start_date?: string | null
          teacher_id?: string | null
          time: string
          updated_at?: string
          weekdays: number[]
        }
        Update: {
          account_id?: string
          active_status?: string
          batch_id?: string | null
          created_at?: string
          duration?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          teacher_id?: string | null
          time?: string
          updated_at?: string
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "schedule_rules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_rules_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age: string | null
          auth_user_id: string | null
          contact_info: string | null
          created_at: string
          current_teacher_id: string | null
          en_name: string | null
          id: string
          learning_goal: string | null
          status: string
          updated_at: string
          zh_name: string
          zoom_email: string | null
        }
        Insert: {
          age?: string | null
          auth_user_id?: string | null
          contact_info?: string | null
          created_at?: string
          current_teacher_id?: string | null
          en_name?: string | null
          id: string
          learning_goal?: string | null
          status?: string
          updated_at?: string
          zh_name: string
          zoom_email?: string | null
        }
        Update: {
          age?: string | null
          auth_user_id?: string | null
          contact_info?: string | null
          created_at?: string
          current_teacher_id?: string | null
          en_name?: string | null
          id?: string
          learning_goal?: string | null
          status?: string
          updated_at?: string
          zh_name?: string
          zoom_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_current_teacher_id_fkey"
            columns: ["current_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          active_status: string
          created_at: string
          email: string | null
          id: string
          notes: string | null
          teacher_code: string
          teacher_name: string
          teacher_type: string
          updated_at: string
        }
        Insert: {
          active_status?: string
          created_at?: string
          email?: string | null
          id: string
          notes?: string | null
          teacher_code: string
          teacher_name: string
          teacher_type: string
          updated_at?: string
        }
        Update: {
          active_status?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          teacher_code?: string
          teacher_name?: string
          teacher_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
