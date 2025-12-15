import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR KEYS FROM SUPABASE SETTINGS -> API
const supabaseUrl = 'https://buvcgbkdtphayprbnlbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmNnYmtkdHBoYXlwcmJubGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDM4NzQsImV4cCI6MjA4MTM3OTg3NH0.SveRYbLHgMPEYiQDSj0RIG34Di1Db8A3toDrXn8V-Sc';

export const supabase = createClient(supabaseUrl, supabaseKey);



