import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kitrzeyvualyhsrwednc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdHJ6ZXl2dWFseWhzcndlZG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDI1NjIsImV4cCI6MjA2MzU3ODU2Mn0.CSW5G1SOTt-6XwazNukiPyYnr-Xl71XOsOL3NrZX1dY'

export const supabase = createClient(supabaseUrl, supabaseKey)
