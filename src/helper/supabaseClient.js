import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fbvxknntlrywdkurkdja.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidnhrbm50bHJ5d2RrdXJrZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDYxMTksImV4cCI6MjA4NTM4MjExOX0.Qr18KKU04s8IBr_OFBw-rVxKmAqs34Kn_Wwui7s5978";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;