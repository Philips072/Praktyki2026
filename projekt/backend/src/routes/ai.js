import { Router } from 'express';

const router = Router();

// POST /api/ai/chat
// Przyjmuje: { messages: [{ role: 'user'|'assistant', content: string }] }
// Zwraca: { reply: string }
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Brak wiadomości w żądaniu.' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it',
        messages: [
          {
            role: 'system',
            content:
              'Jesteś pomocnym asystentem AI w aplikacji DataMindAI, która uczy podstaw SQL i analizy danych. ' +
              'Odpowiadaj po polsku, krótko i konkretnie. Pomagaj użytkownikom rozumieć SQL, zapytania bazodanowe i analizę danych. ' +
              'Możesz używać formatowania tekstu: pogrubienia (**tekst**), kursywy (*tekst*), inline code (`tekst`) oraz tabel Markdown. ' +
              'NIE używaj blokowych code blocks (```), ani żadnych innych znaków formatujących. ' +
              'Tylko inline code i tabele, nie na całą szerokość.',
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.message || 'Błąd OpenRouter API.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return res.json({ reply });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/interests
// Przyjmuje: { message: string } — tekst użytkownika o zainteresowaniach
// Zwraca: { message: string, interests: string } — odpowiedź AI + znormalizowane zainteresowania
router.post('/interests', async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Brak wiadomości w żądaniu.' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it',
        max_tokens: 250,
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content: `Jesteś przyjaznym asystentem platformy DataMindAI do nauki SQL. Użytkownik pisze Ci o swoich zainteresowaniach. Odpowiedz w formacie JSON (i tylko JSON, bez markdown):
{
  "message": "<ciepła, ludzka reakcja po polsku, 2-3 zdania — zacznij od czegoś w stylu 'Okej, super!' albo 'Fajnie!', odnieś się do tego co użytkownik napisał i powiedz że dostosujesz ćwiczenia SQL do tych zainteresowań>",
  "interests": "<przepisz zainteresowania użytkownika w 2. osobie liczby pojedynczej po polsku — używaj WYŁĄCZNIE informacji które użytkownik podał, nie dodawaj żadnych szczegółów, przykładów ani domysłów których nie było w wiadomości>"
}`,
          },
          { role: 'user', content: message.trim() },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || err.message || 'Błąd OpenRouter API.' });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? '';

    try {
      return res.json(JSON.parse(raw));
    } catch {
      return res.json({ message: raw, interests: raw });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/validate-exercise
// Przyjmuje: { task: string, sql: string, result: { columns: string[], rows: any[] }, validateOnly: boolean, schema: object }
// Zwraca: { valid: boolean, reason: string }
router.post('/validate-exercise', async (req, res, next) => {
  try {
    const { task, sql, result, validateOnly = false, schema = null } = req.body;

    if (!task || !sql) {
      return res.status(400).json({ error: 'Brak wymaganych pól (task, sql).' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    let prompt = '';

    // Format schema information if available
    let schemaInfo = '';
    if (schema && typeof schema === 'object') {
      if (Array.isArray(schema)) {
        // Schema is array of column info: { name: string, type: string, desc: string }[]
        schemaInfo = '\n\nSchemat tabeli:\n' + schema.map(col => `- ${col.name} (${col.type}): ${col.desc || ''}`).join('\n');
      } else {
        // Schema is object with table names as keys
        schemaInfo = '\n\nStruktura tabel:\n';
        for (const [tableName, columns] of Object.entries(schema)) {
          schemaInfo += `Tabela ${tableName}:\n`;
          if (Array.isArray(columns)) {
            columns.forEach(col => {
              schemaInfo += `  - ${col.name} (${col.type})${col.desc ? ': ' + col.desc : ''}\n`;
            });
          }
        }
      }
    }

    if (validateOnly) {
      prompt = `Jesteś asystentem AI sprawdzającym czy użytkownik poprawnie wykonał zadanie SQL.

Twoim zadaniem jest:
1. Przeczytać treść zadania użytkownika
2. Przeanalizować zapytanie SQL użytkownika
3. Sprawdzić czy zapytanie jest poprawne składniowo
4. Sprawdzić czy zapytanie pasuje do treści zadania
${schema ? '5. Sprawdzić czy użyte kolumny i tabele pasują do schematu' : ''}

Ważne: Niektóre polecenia (jak CREATE DATABASE, DROP DATABASE, USE) nie są obsługiwane w SQLite, ale są poprawne składniowo dla MySQL. Zadanie ma symulować te polecenia, więc uważaj na ich poprawność składni, a nie na wykonanie w bazie.

Przykłady:
- DROP DATABASE nazwa_bazy; (nie jest w SQLite, ale poprawne składniowo dla MySQL)
- USE nazwa_bazy; (nie jest w SQLite, ale poprawne składniowo dla MySQL)

Przykład błędnego rozwiązania:
- Zadanie: "Usuń bazę danych liga_pilkarska"
- SQL: DROP DATABASE (brak nazwy bazy)
- Wynik: Odpowiedź NIEPRAWIDŁOWA, bo brak nazwy

Odpowiedz TYLKO w formacie JSON (bez markdown):
{
  "valid": true/false,
  "reason": "krótkie wyjaśnienie po polsku dlaczego zadanie jest poprawne lub błędne"
}`;
    } else {
      prompt = `Jesteś asystentem AI sprawdzającym czy użytkownik poprawnie wykonał zadanie SQL. Zadanie sprawdzać czy wynik zapytania jest zgodny z treścią zadania, nie tylko czy zapytanie jest poprawne składniowo.

Twoim zadaniem jest:
1. Przeczytać treść zadania użytkownika
2. Przeanalizować zapytanie SQL użytkownika
3. Zobaczyć zwrócony wynik (kolumny i dane)
4. Sprawdzić czy wynik jest ZGODNY z treścią zadania
${schema ? '5. Sprawdzić czy użyte tabele i kolumny są zgodne ze schematem' : ''}${schemaInfo}

Przykład błędnego rozwiązania:
- Zadanie: "Wybierz wszystkich klientów z tabeli customers"
- SQL: SELECT name FROM customers (prawidłowe składniowo, ale nie zgodne z zadaniem)
- Wynik: Odpowiedź NIEPRAWIDŁOWA, bo wybrano tylko kolumnę name zamiast wszystkich

Odpowiedz TYLKO w formacie JSON (bez markdown):
{
  "valid": true/false,
  "reason": "krótkie wyjaśnienie po polsku dlaczego zadanie jest poprawne lub błędne"
}`;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it',
        max_tokens: 200,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: JSON.stringify({ task, sql, result })
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.message || 'Błąd OpenRouter API.' });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? '';

    try {
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch {
      return res.json({ valid: false, reason: 'Nie udało się zinterpretować odpowiedzi AI.' });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/hint
// Przyjmuje: { task: string, currentSql: string, schema: { name: string, type: string, desc: string }[] }
// Zwraca: { hint: string }
router.post('/hint', async (req, res, next) => {
  try {
    const { task, currentSql, schema = [] } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Brak wymaganych pól (task).' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    const schemaText = schema.map(col => `- ${col.name} (${col.type}): ${col.desc}`).join('\n');

    const prompt = `Jesteś asystentem AI pomagającym w rozwiązywaniu ćwiczeń SQL. Daj jedną stopniową podpowiedź.

Treść zadania: "${task}"

Co użytkownik już wpisał: "${currentSql}"

Schemat tabeli:
${schemaText || 'Brak informacji o schemacie'}

ZASADY:
1. Daj JEDNĄ konkretną podpowiedź - następną rzecz którą użytkownik powinien zrobić
2. Może to być słowo kluczowe, kolumna lub krótkie wyjaśnienie co dalej
3. Jeśli użytkownik nic nie wpisał: zacznij od pierwszego słowa polecenia (np. "Użyj CREATE DATABASE")
4. Jeśli użytkownik wpisał część: podaj co powinno być następnym krokiem
5. MAXIMUM 1-2 krótkie zdania, ok. 10-15 słów
6. Nie dawaj gotowej odpowiedzi ani pełnego kodu
7. Nie używaj formatowania markdown, tylko zwykły tekst

PRZYKŁADY DOBRYCH ODPOWIEDZI:
- "Zacznij od CREATE DATABASE"
- "Teraz podaj nazwę tabeli po FROM"
- "Dodaj WHERE z warunkiem filtrowania"`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it',
        max_tokens: 150,
        temperature: 0.5,
        messages: [
          { role: 'system', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.message || 'Błąd OpenRouter API.' });
    }

    const data = await response.json();
    const hint = data.choices?.[0]?.message?.content?.trim() || '';

    return res.json({ hint });
  } catch (err) {
    next(err);
  }
});

export default router;
