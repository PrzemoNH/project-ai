import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.https://ixyismzenlorsxygwxnv.supabase.co/rest/v1/!;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eWlzbXplbmxvcnN4eWd3eG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTY1NzEsImV4cCI6MjEwMDQ5MjU3MX0.BgC2dZffrXnD0NFxQBmLAq-dG3-R7pG4qy0R6olpjTM!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
