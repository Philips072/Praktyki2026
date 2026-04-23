-- Dodaj kolumnę questions do tabeli tests
-- Uruchom to w Supabase SQL Editor

-- Dodaj kolumnę questions jako JSONB
ALTER TABLE tests ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;

-- Przykład struktury JSONB dla pytań:
-- [
--   {
--     "id": 1,
--     "type": "sql",              // lub "multiple_choice", "true_false"
--     "title": "Tytuł pytania",
--     "description": "Dodatkowa instrukcja",
--     "expectedSql": "SELECT ...", -- tylko dla type: "sql"
--     "options": ["A", "B", "C", "D"], -- tylko dla type: "multiple_choice"
--     "correctAnswer": "A",       -- tylko dla type: "multiple_choice" lub "true_false"
--     "points": 2,                 -- punkty za pytanie
--     "skill": "JOIN"             -- sprawdzana umiejętność
--   }
-- ]
