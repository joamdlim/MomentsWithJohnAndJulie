-- Create explicit policies that DENY ALL access via the Supabase Data API.
-- This clears the "RLS Enabled No Policy" warning and ensures top-notch security
-- by explicitly stating that no one (except admins/Prisma) can access these tables.

CREATE POLICY "Deny all access to User" ON "public"."User" FOR ALL TO PUBLIC USING (false);
CREATE POLICY "Deny all access to Album" ON "public"."Album" FOR ALL TO PUBLIC USING (false);
CREATE POLICY "Deny all access to Photo" ON "public"."Photo" FOR ALL TO PUBLIC USING (false);
CREATE POLICY "Deny all access to Vote" ON "public"."Vote" FOR ALL TO PUBLIC USING (false);
