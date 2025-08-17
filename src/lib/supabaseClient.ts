import {createClient} from "@supabase/supabase-js";

// Lấy thông tin từ biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Dùng service role key ở server

export const supabase = createClient(supabaseUrl, supabaseKey);
