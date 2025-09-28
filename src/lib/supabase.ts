import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ujbeatnyhhpqwtwybcqr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYmVhdG55aGhwcXd0d3liY3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTY1MDgsImV4cCI6MjA3NDUzMjUwOH0.3bbWaJSly4iuKg6-mACCHnoPI58Yj24TixIBhVGzPwU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)