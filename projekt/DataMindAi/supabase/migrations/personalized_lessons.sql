-- Tabela do przechowywania spersonalizowanych lekcji
CREATE TABLE IF NOT EXISTS personalized_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  sections JSONB NOT NULL,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Indeks dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_personalized_lessons_user_lesson ON personalized_lessons(user_id, lesson_id);

-- Trigger do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personalized_lessons_updated_at
  BEFORE UPDATE ON personalized_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE personalized_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownicy mogą widzieć własne spersonalizowane lekcje"
  ON personalized_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą dodawać własne spersonalizowane lekcje"
  ON personalized_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą aktualizować własne spersonalizowane lekcje"
  ON personalized_lessons FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą usuwać własne spersonalizowane lekcje"
  ON personalized_lessons FOR DELETE
  USING (auth.uid() = user_id);
