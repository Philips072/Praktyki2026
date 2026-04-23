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
// Przyjmuje: { task: string, sql: string, result: { columns: string[], rows: any[] }, validateOnly: boolean }
// Zwraca: { valid: boolean, reason: string }
router.post('/validate-exercise', async (req, res, next) => {
  try {
    const { task, sql, result, validateOnly = false } = req.body;

    if (!task || !sql) {
      return res.status(400).json({ error: 'Brak wymaganych pól (task, sql).' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    let prompt = ''

    if (validateOnly) {
      prompt = `Jesteś asystentem AI sprawdzającym czy użytkownik poprawnie wykonał zadanie SQL.

Twoim zadaniem jest:
1. Przeczytać treść zadania użytkownika
2. Przeanalizować zapytanie SQL użytkownika
3. Sprawdzić czy zapytanie jest poprawne składniowo (nie sprawdzaj wyniku)
4. Sprawdzić czy zapytanie pasuje do treści zadania

Przykład błędnego rozwiązania:
- Zadanie: "Utwórz bazę danych o nazwie liga_pilkarska"
- SQL: CREATE DATABASE liga_pilkarsk (literówka)
- Wynik: Odpowiedź NIEPRAWIDŁOWA, bo literówka w nazwie

Odpowiedz TYLKO w formacie JSON (bez markdown):
{
  "valid": true/false,
  "reason": "krótkie wyjaśnienie po polsku dlaczego zadanie jest poprawne lub błędne"
}`
    } else {
      prompt = `Jesteś asystentem AI sprawdzającym czy użytkownik poprawnie wykonał zadanie SQL. Zadanie sprawdzać czy wynik zapytania jest zgodny z treścią zadania, nie tylko czy zapytanie jest poprawne składniowo.

Twoim zadaniem jest:
1. Przeczytać treść zadania użytkownika
2. Przeanalizować zapytanie SQL użytkownika
3. Zobaczyć zwrócony wynik (kolumny i dane)
4. Sprawdzić czy wynik jest ZGODNY z treścią zadania

Przykład błędnego rozwiązania:
- Zadanie: "Wybierz wszystkich klientów z tabeli customers"
- SQL: SELECT name FROM customers (prawidłowe składniowo, ale nie zgodne z zadaniem)
- Wynik: Odpowiedź NIEPRAWIDŁOWA, bo wybrano tylko kolumnę name zamiast wszystkich

Odpowiedz TYLKO w formacie JSON (bez markdown):
{
  "valid": true/false,
  "reason": "krótkie wyjaśnienie po polsku dlaczego zadanie jest poprawne lub błędne"
}`
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

export default router;
