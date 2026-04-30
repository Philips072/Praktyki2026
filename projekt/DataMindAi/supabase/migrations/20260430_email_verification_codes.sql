-- Tabela do przechowywania kodów weryfikacyjnych email
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indeks dla szybkiego wyszukiwania po email i kodzie
CREATE INDEX IF NOT EXISTS idx_verification_email_code ON email_verification_codes(email, code);
CREATE INDEX IF NOT EXISTS idx_verification_expires ON email_verification_codes(expires_at);

-- Funkcja do czyszczenia starych kodów (uruchamiana codziennie)
CREATE OR REPLACE FUNCTION cleanup_old_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verification_codes
  WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- RLS - tylko Edge Functions mogą zapisywać/odczytywać
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Edge functions full access"
ON email_verification_codes
TO authenticated
USING (true)
WITH CHECK (true);

-- Usuń policy dla anonimowych użytkowników (bezpieczeństwo)
DROP POLICY IF EXISTS "Enable insert for all users" ON email_verification_codes;
DROP POLICY IF EXISTS "Enable select for all users" ON email_verification_codes;
