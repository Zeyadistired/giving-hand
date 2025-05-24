import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://foxilckqnxvpszwewsbr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveGlsY2txbnh2cHN6d2V3c2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDIwMDksImV4cCI6MjA2MjIxODAwOX0.RsifoyfUOX9RtLsJMiyV_5nKb8dbhgjVICBHYG-KOCY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
