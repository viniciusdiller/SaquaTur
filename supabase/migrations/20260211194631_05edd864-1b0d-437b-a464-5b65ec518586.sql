
-- Fix newsletter insert policy to be more specific (email must be provided)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email <> '');
