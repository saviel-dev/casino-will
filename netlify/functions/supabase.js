const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tgkxqwjvqzjxwgxwpxwb.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna3hxd2p2cXpqeHdneHdweHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MDc4NzEsImV4cCI6MjAxODA4Mzg3MX0.0Qnk_CX4_YoAYgO0L0QhGO1Iy9n-KN9YDQbGGe5DQCM';

console.log('Initializing Supabase with:', {
  url: SUPABASE_URL,
  keyExists: !!SUPABASE_ANON_KEY
});

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials');
}

let supabaseClient;

try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw error;
}

module.exports = supabaseClient;
