-- Funkcje RPC dla Sandbox - DataMindAI
-- Uruchom te zapytania w Supabase SQL Editor

-- Funkcja pobierająca listę schematów dostępnych dla użytkownika
CREATE OR REPLACE FUNCTION get_schemas()
RETURNS TABLE (schema_name text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT schema_name
  FROM information_schema.schemata
  WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND has_schema_privilege(current_user, schema_name, 'USAGE')
  ORDER BY schema_name;
$$;

-- Funkcja pobierająca listę tabel w podanym schemacie
CREATE OR REPLACE FUNCTION get_tables(schema_name text)
RETURNS TABLE (table_name text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = $1
    AND table_type = 'BASE TABLE'
    AND has_table_privilege(quote_ident($1) || '.' || quote_ident(table_name), 'SELECT')
  ORDER BY table_name;
$$;

-- Funkcja pobierająca strukturę tabeli (kolumny, typy, klucze)
CREATE OR REPLACE FUNCTION get_table_structure(schema_name text, table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text,
  is_primary_key boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    c.column_name,
    c.data_type,
    c.is_nullable,
    EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = $1
        AND tc.table_name = $2
        AND kcu.column_name = c.column_name
        AND tc.constraint_type = 'PRIMARY KEY'
    ) as is_primary_key
  FROM information_schema.columns c
  WHERE c.table_schema = $1
    AND c.table_name = $2
  ORDER BY c.ordinal_position;
$$;

-- Grantowanie uprawnień do funkcji dla authenticated role
GRANT EXECUTE ON FUNCTION get_schemas() TO authenticated;
GRANT EXECUTE ON FUNCTION get_tables(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_structure(text, text) TO authenticated;
