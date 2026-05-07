-- Enable Row Level Security (RLS) on all public tables to secure them from unauthorized access via the Supabase Data API (PostgREST)
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Album" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Photo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Vote" ENABLE ROW LEVEL SECURITY;

-- By default, when RLS is enabled and no policies are defined, 
-- access is DENIED for all operations (SELECT, INSERT, UPDATE, DELETE) 
-- for roles that don't have the BYPASSRLS privilege (like Supabase's anon role).
-- Your Next.js app uses Prisma with the connection string (usually the `postgres` role), 
-- which bypasses RLS, so your app will continue to work normally.
