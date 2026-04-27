-- Dodanie kolumny exercises do tabeli personalized_lessons
ALTER TABLE personalized_lessons
ADD COLUMN IF NOT EXISTS exercises JSONB;
