import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgkxqwjvqzjxwgxwpxwb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna3hxd2p2cXpqeHdneHdweHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MDc4NzEsImV4cCI6MjAxODA4Mzg3MX0.0Qnk_CX4_YoAYgO0L0QhGO1Iy9n-KN9YDQbGGe5DQCM'

export const supabase = createClient(supabaseUrl, supabaseKey)
