export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      account: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      account_balance: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          date_calculated: string
          id: string
          product_id: string
        }
        Insert: {
          account_id: string
          balance?: number
          created_at?: string
          date_calculated: string
          id?: string
          product_id: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          date_calculated?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_balance_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_balance_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      action: {
        Row: {
          action: string
          id: number
        }
        Insert: {
          action: string
          id?: number
        }
        Update: {
          action?: string
          id?: number
        }
        Relationships: []
      }
      approval_type: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      contract: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          product_id: string | null
          template: Json | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          product_id?: string | null
          template?: Json | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          product_id?: string | null
          template?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      contract_signature: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          signature: string
          user_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          signature: string
          user_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          signature?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_signature_contract_id_fkey"
            columns: ["contract_id"]
            referencedRelation: "contract"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_signature_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      liquidity_pool: {
        Row: {
          apy: number
          created_at: string
          id: string
          liquidity_pool_id: string
          product_id: string
        }
        Insert: {
          apy: number
          created_at?: string
          id?: string
          liquidity_pool_id: string
          product_id: string
        }
        Update: {
          apy?: number
          created_at?: string
          id?: string
          liquidity_pool_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liquidity_pool_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      product: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      token: {
        Row: {
          chain: string
          contract_address: string
          created_at: string
          id: string
          name: string
          symbol: string
        }
        Insert: {
          chain: string
          contract_address: string
          created_at?: string
          id?: string
          name: string
          symbol: string
        }
        Update: {
          chain?: string
          contract_address?: string
          created_at?: string
          id?: string
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      token_liquidity_pool: {
        Row: {
          pool_id: string
          token_id: string
        }
        Insert: {
          pool_id: string
          token_id: string
        }
        Update: {
          pool_id?: string
          token_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_liquidity_pool_pool_id_fkey"
            columns: ["pool_id"]
            referencedRelation: "liquidity_pool"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_liquidity_pool_token_id_fkey"
            columns: ["token_id"]
            referencedRelation: "token"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          approval_type: number
          approve_date: string | null
          approved_by: string | null
          created_at: string
          email: string
          first_investment: string | null
          first_name: string
          handle: string | null
          id: string
          is_natural: boolean
          last_name: string
          user_type: number
        }
        Insert: {
          approval_type?: number
          approve_date?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          first_investment?: string | null
          first_name: string
          handle?: string | null
          id?: string
          is_natural?: boolean
          last_name: string
          user_type: number
        }
        Update: {
          approval_type?: number
          approve_date?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          first_investment?: string | null
          first_name?: string
          handle?: string | null
          id?: string
          is_natural?: boolean
          last_name?: string
          user_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_approval_type_fkey"
            columns: ["approval_type"]
            referencedRelation: "approval_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_approved_by_fkey"
            columns: ["approved_by"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_user_type_fkey"
            columns: ["user_type"]
            referencedRelation: "user_type"
            referencedColumns: ["id"]
          }
        ]
      }
      user_transaction: {
        Row: {
          account_id: string
          action_id: number
          amount: number
          created_at: string
          date_resolved: string | null
          hash: string | null
          id: string
          product_id: string
          resolved: boolean
          signature: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          action_id: number
          amount: number
          created_at?: string
          date_resolved?: string | null
          hash?: string | null
          id?: string
          product_id: string
          resolved?: boolean
          signature?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          action_id?: number
          amount?: number
          created_at?: string
          date_resolved?: string | null
          hash?: string | null
          id?: string
          product_id?: string
          resolved?: boolean
          signature?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_transaction_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transaction_action_id_fkey"
            columns: ["action_id"]
            referencedRelation: "action"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transaction_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transaction_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user_type: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      wallet: {
        Row: {
          address: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

