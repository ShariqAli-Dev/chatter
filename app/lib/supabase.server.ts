import { createClient } from "@supabase/supabase-js";
import { type Database } from "~/utils/dbTypes";
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
export default supabase;
