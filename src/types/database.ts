export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type UserOwned = {
  id: string;
  user_id: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Timestamps & {
          id: string;
          email: string | null;
          display_name: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          display_name?: string | null;
          updated_at?: string;
        };
      };
      personas: {
        Row: Timestamps &
          UserOwned & {
            ip_name: string | null;
            industry_identity: string | null;
            target_customers: string | null;
            products_services: string | null;
            expression_style: string | null;
            forbidden_expressions: string | null;
            moment_goals: string | null;
            common_cta: string | null;
          };
        Insert: {
          id?: string;
          user_id: string;
          ip_name?: string | null;
          industry_identity?: string | null;
          target_customers?: string | null;
          products_services?: string | null;
          expression_style?: string | null;
          forbidden_expressions?: string | null;
          moment_goals?: string | null;
          common_cta?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["personas"]["Insert"], "user_id">>;
      };
      persona_images: {
        Row: Timestamps &
          UserOwned & {
            storage_path: string;
            public_url: string | null;
            description: string | null;
            is_default: boolean;
          };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          public_url?: string | null;
          description?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["persona_images"]["Insert"], "user_id">>;
      };
      materials: {
        Row: Timestamps &
          UserOwned & {
            material_type: string;
            title: string | null;
            body: string | null;
            storage_path: string | null;
            metadata: Json;
          };
        Insert: {
          id?: string;
          user_id: string;
          material_type: string;
          title?: string | null;
          body?: string | null;
          storage_path?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["materials"]["Insert"], "user_id">>;
      };
      moments: {
        Row: Timestamps &
          UserOwned & {
            moment_type: string | null;
            title: string | null;
            body: string | null;
            image_storage_path: string | null;
            image_url: string | null;
            angle_summary: string | null;
            self_comment_suggestion: string | null;
            comment_suggestion: string | null;
            private_chat_suggestion: string | null;
            status: string;
            scheduled_at: string | null;
            published_at: string | null;
            metadata: Json;
          };
        Insert: {
          id?: string;
          user_id: string;
          moment_type?: string | null;
          title?: string | null;
          body?: string | null;
          image_storage_path?: string | null;
          image_url?: string | null;
          angle_summary?: string | null;
          self_comment_suggestion?: string | null;
          comment_suggestion?: string | null;
          private_chat_suggestion?: string | null;
          status?: string;
          scheduled_at?: string | null;
          published_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["moments"]["Insert"], "user_id">>;
      };
      plans: {
        Row: Timestamps &
          UserOwned & {
            plan_type: string;
            title: string;
            status: string;
            starts_on: string | null;
            ends_on: string | null;
            inputs: Json;
          };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: string;
          title: string;
          status?: string;
          starts_on?: string | null;
          ends_on?: string | null;
          inputs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["plans"]["Insert"], "user_id">>;
      };
      plan_items: {
        Row: Timestamps &
          UserOwned & {
            plan_id: string;
            moment_id: string | null;
            item_order: number;
            purpose: string | null;
            suggested_at: string | null;
            status: string;
            content: Json;
          };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          moment_id?: string | null;
          item_order?: number;
          purpose?: string | null;
          suggested_at?: string | null;
          status?: string;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["plan_items"]["Insert"], "user_id" | "plan_id">>;
      };
      ai_generation_jobs: {
        Row: Timestamps &
          UserOwned & {
            job_type: string;
            status: string;
            input_summary: Json;
            output_result: Json | null;
            error_message: string | null;
            duration_ms: number | null;
          };
        Insert: {
          id?: string;
          user_id: string;
          job_type: string;
          status?: string;
          input_summary?: Json;
          output_result?: Json | null;
          error_message?: string | null;
          duration_ms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["ai_generation_jobs"]["Insert"], "user_id" | "job_type">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
