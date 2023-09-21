import { createClient } from "@supabase/supabase-js";
import { type Database } from "utils/dbTypes";
export default createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
