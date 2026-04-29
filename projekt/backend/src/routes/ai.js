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
// Zwraca: { message: string, interests: string | null, valid: boolean }
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

    // Najpierw sprawdź czy zainteresowania są sensowne
    const validationResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it',
        max_tokens: 50,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `Sprawdź czy podane zainteresowania są sensowne i faktycznie opisują jakieś zainteresowania/hobby/pasje użytkownika.
Użytkownik może pisać: "sport", "programowanie", "gry komputerowe", "muzyka", "czytam książki", "film noir", "piłka nożna", "języki obce" itp.
Odrzuć jeśli to: przypadkowe znaki ("dsafas", "xyz"), negacje ("nic", "nie mam zainteresowań", "nie wiem"), wulgarności, bardzo ogólne odpowiedzi bez szczegółów ("coś", "różne rzeczy").

Odpowiedz TYLKO "true" jeśli zainteresowania są sensowne lub "false" jeśli nie. Bez markdown, bez cudzysłowów, bez dodatkowego tekstu.`,
          },
          { role: 'user', content: message.trim() },
        ],
      }),
    });

    let isValid = false;
    if (validationResponse.ok) {
      const validationData = await validationResponse.json();
      const validationRaw = validationData.choices?.[0]?.message?.content?.trim().toLowerCase() ?? '';
      isValid = validationRaw === 'true';
    }

    // Jeśli nie są sensowne, zwróć odpowiedź AI, że nie zaktualizowano zainteresowań
    if (!isValid) {
      return res.json({
        message: 'Rozumiem, że nie chcesz teraz podawać zainteresowań lub wpisałeś coś, co nie wygląda na faktyczne zainteresowanie. Możesz to zmienić w dowolnym momencie!',
        interests: null,
        valid: false
      });
    }

    // Jeśli są sensowne, wygeneruj normalną odpowiedź
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it',
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
      const parsed = JSON.parse(raw);
      return res.json({ ...parsed, valid: true });
    } catch {
      return res.json({ message: raw, interests: raw, valid: true });
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
3. Sprawdzić czy zapytanie jest poprawne składniowo DLA MYSQL
4. Sprawdzić czy zapytanie pasuje do treści zadania - nazwa tabeli/kolumny w SQL musi być identyczna z nazwą w zadaniu (case-insensitive)
${schema ? '5. Sprawdzić czy użyte kolumny i tabele pasują do schematu' : ''}

WAŻNE - SPRAWDZANIE NAZW TABEL/KOLUMN:
- Jeśli zadanie mówi "Usuń tabelę statystyki", a SQL to "DROP TABLE statystyki;" - to jest POPRAWNE
- Jeśli nazwa tabeli w SQL jest taka sama jak w zadaniu (case-insensitive) - to jest POPRAWNE
- Jeśli ciąg znaków nazwy tabeli w SQL jest identyczny (lub różni się tylko wielkością liter) z nazwą w zadaniu - to jest zgodne
- NIE ZNAJDUJ RÓŻNIC TAM GDZIE ICH NIE MA - jeśli ciągi są takie same (case-insensitive), uznaj za poprawne

WAŻNE - ŚREDNIK NA KOŃCU:
- KAŻDE zapytanie SQL MUSI kończyć się średnikiem (;)
- Jeśli brakuje średnika na końcu - zadanie jest NIEPRAWIDŁOWE
- Przykład błędu: "DROP TABLE statystyki" (brak średnika)
- Przykład poprawny: "DROP TABLE statystyki;" (jest średnik)

WAŻNE: Zadanie dotyczy składni MYSQL, a nie SQLite. Akceptuj TYLKO zapytania zgodne ze składnią MySQL.

ELEMENTY SPECYFICZNE DLA SQLITE (ODRZUĆ JE):
- sqlite_master, sqlite_sequence (tabele systemowe SQLite)
- LIMIT bez OFFSET w formie "LIMIT x,y" (w MySQL używa się "LIMIT x OFFSET y")
- date('now'), date('now', '+1 day') (funkcje SQLite - w MySQL używa się NOW(), DATE_ADD())
- strftime (funkcja SQLite - w MySQL używa się DATE_FORMAT())
- AUTOINCREMENT (w MySQL używa się AUTO_INCREMENT z podkreśleniem)
- ROWID (specyficzne dla SQLite)
- Przypisanie INTEGER PRIMARY KEY automatycznie jako auto_increment (w MySQL musi być AUTO_INCREMENT)

ELEMENTY SPECYFICZNE DLA MYSQL (AKCEPTUJ JE):
- AUTO_INCREMENT
- DROP TABLE IF EXISTS
- IF NOT EXISTS w CREATE TABLE
- NOW(), CURDATE(), CURRENT_DATE, CURRENT_TIME
- DATE_ADD(), DATE_SUB(), DATEDIFF()
- LIMIT x OFFSET y lub LIMIT x,y
- CHAR_LENGTH(), LOCATE()

Przykłady poprawnych zapytań MySQL:
- DROP DATABASE nazwa_bazy;
- USE nazwa_bazy;
- DROP TABLE statystyki; (jeśli zadanie mówi o "statystyki" - to jest poprawne)
- CREATE TABLE test (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50));
- SELECT * FROM users LIMIT 10 OFFSET 5;
- SELECT * FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY);

Przykłady błędnych zapytań (SQLite):
- SELECT * FROM sqlite_master; (systemowa tabela SQLite)
- SELECT date('now'); (funkcja SQLite)
- CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT); (składnia SQLite)

Przykład błędnego rozwiązania:
- Zadanie: "Usuń bazę danych liga_pilkarska"
- SQL: DROP DATABASE (brak nazwy bazy)
- Wynik: Odpowiedź NIEPRAWIDŁOWA, bo brak nazwy

Jeśli zapytanie używa składni specyficznej dla SQLite - ODRZUĆ JE!

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

    console.log('=== AI Raw Response ===');
    console.log(raw);

    try {
      // Remove markdown code blocks if present
      let cleanRaw = raw;
      const markdownMatch = raw.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (markdownMatch) {
        cleanRaw = markdownMatch[1];
      }
      const parsed = JSON.parse(cleanRaw);
      return res.json(parsed);
    } catch (e) {
      console.log('=== AI Parse Error ===');
      console.log(e.message);
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

    const prompt = `Jesteś asystentem AI pomagającym w rozwiązywaniu ćwiczeń SQL. Daj JEDNĄ krótką podpowiedź.

Treść zadania: "${task}"

Co użytkownik już wpisał: "${currentSql}"

Schemat tabeli:
${schemaText || 'Brak informacji o schemacie'}

ZASADY (bardzo ważne):
1. ZAWSZE użyj słów-kluczy na początku: "Zacznij od", "Następnie", "Teraz", "Dodaj"
2. ODPOWIEDŹ MA BYĆ KRÓTKA - maksymalnie 5-6 słów
3. Jeśli użytkownik NIC nie wpisał: Zacznij od "Zacznij od" + polecenie SQL
4. Jeśli użytkownik wpisał coś - NAJPIERW sprawdź błędy:
   a) Literówki w słowach kluczowych SQL (SELECT, FROM, WHERE, CREATE, TABLE, AUTO_INCREMENT)
   b) Literówki w nazwach tabel/kolumn UŻYTYCH przez użytkownika
   c) BRAK AUTO_INCREMENT przy id PRIMARY KEY - powiedz "Dodaj AUTO_INCREMENT"
   d) BRAK średnika na końcu - powiedz "Dodaj średnik"
   e) JEŚLI JEST BŁĄD: powiedz tylko co poprawić
5. DOPHIERO gdy brak błędów:
   - Użyj "Następnie" lub "Teraz" na początku
   - Podaj co dodać jako następną rzecz
   - Jeśli wszystko kompletne: powiedz "Wszystko jest w porządku"

SŁOWA-KLUCZE do użycia:
- "Zacznij od" - na początku, gdy input pusty
- "Następnie" - gdy kontynuujesz
- "Teraz" - gdy coś dodajesz
- "Dodaj" - gdy dodajesz element
- "Popraw" - gdy poprawiasz błąd
- "Wszystko jest w porządku" - gdy kompletne

PRZYKŁADY:
- "Zacznij od CREATE"
- "Następnie podaj nazwę"
- "Teraz FROM tabela"
- "Dodaj WHERE"
- "Następnie ORDER BY"
- "Dodaj AUTO_INCREMENT"
- "Dodaj średnik"
- "Wszystko jest w porządku"`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://datamindai.com',
        'X-Title': 'DataMindAI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it',
        max_tokens: 50,
        temperature: 0.3,
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

// POST /api/ai/personalized-content
// Przyjmuje: { lessonTitle: string, lessonSubtitle: string, sections: array, interests: string, schema: array, exercises: array }
// Zwraca: { sections: array, schema: array, exercises: array }
router.post('/personalized-content', async (req, res, next) => {
  try {
    const { lessonTitle, lessonSubtitle, sections = [], interests = '', schema = [], exercises = [] } = req.body;

    console.log('=== Personalized Content Request ===');
    console.log('Lesson Title:', lessonTitle);
    console.log('Interests:', interests);
    console.log('Sections count:', sections.length);
    console.log('Schema count:', schema.length);

    if (!lessonTitle || !sections || sections.length === 0) {
      return res.status(400).json({ error: 'Brak wymaganych pól (lessonTitle, sections).' });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'Klucz OpenRouter nie jest skonfigurowany.' });
    }

    const schemaText = schema.map(col => `- ${col.name} (${col.type}): ${col.desc}`).join('\n');

    // Przygotuj uproszczoną reprezentację sekcji dla AI
    const sectionsSummary = sections.map(s => {
      if (s.type === 'text') return `[${s.type}] ${s.content}`;
      if (s.type === 'heading') return `[${s.type}] ${s.content}`;
      if (s.type === 'code') return `[${s.type}] ${s.label || 'Kod'}: ${s.content.substring(0, 100)}...`;
      if (s.type === 'hint') return `[${s.type}] ${s.content}`;
      if (s.type === 'table') return `[${s.type}] ${s.label || 'Tabela'}`;
      return `[${s.type}]`;
    }).join('\n');

    // Przygotuj uproszczoną reprezentację ćwiczeń dla AI
    const exercisesSummary = exercises.map(e => `- [ZADANIE ${e.id}] ${e.task}`).join('\n');

    const prompt = `Jesteś przyjaznym asystentem AI platformy DataMindAI. Twoim zadaniem jest wygenerowanie SPERSONALIZOWANEJ wersji materiałów edukacyjnych o SQL.

INFORMACJE O UŻYTKOWNIKU:
Zainteresowania: ${interests || 'ogólne zainteresowania'}

LEKCJA:
Tytuł: ${lessonTitle}
Podtytuł: ${lessonSubtitle || ''}

Schemat tabeli:
${schemaText || 'Brak informacji o schemacie'}

ORYGINALNE SEKCJE TEORII (uproszczone):
${sectionsSummary}

ORYGINALNE ZADANIA (uproszczone):
${exercisesSummary}

ZASADY:
1. Przepisz treść w bardziej przystępny i osobisty sposób, dopasowując przykłady do zainteresowań użytkownika
2. Zainteresowania użytkownika: "${interests}". Wszystkie przykłady SQL i nazwy tabel/kolumn DOSTOSUJ do tych zainteresowań
3. Używaj języka potocznego, ale profesjonalnego
4. Dla sekcji "text" — używaj pogrubień (**tekst**) dla kluczowych terminów, kursyw (*tekst*) dla akcentów
5. Dla sekcji "code" — dostosuj przykłady SQL do zainteresowań użytkownika (zmień nazwy tabel, kolumn, danych)
6. Dla sekcji "hint" — zachowaj naturę porady
7. Dziel teksty na krótkie akapity (max 3-4 zdania)
8. ZADANIA — zmień nazwy tabel/kolumn w treści zadań (pole "task") aby pasowały do spersonalizowanego schematu i przykładów

DOSTOSOWANIE PRZYKŁADÓW DO ZAINTERESOWAŃ:
- Jeśli "sport" — używaj tabel: "druzyny", "pilkarze", "mecze", kolumn: "imie", "nazwisko", "pozycja", "bramki"
- Jeśli "gry" — używaj tabel: "postacie", "przedmioty", "questy", kolumn: "imie", "poziom", "klasa", "hp"
- Jeśli "muzyka" — używaj tabel: "artysci", "albumy", "piosenki", kolumn: "tytul", "gatunek", "rok"
- Jeśli "programowanie" — używaj tabel: "projekty", "programisci", "zadania", kolumn: "nazwa", "jezyk", "status"
- Jeśli "kino" — używaj tabel: "filmy", "aktorzy", "rezyserzy", kolumn: "tytul", "gatunek", "rok"

BARDZO WAŻNE - GENEROWANIE TABEL:
Jeśli oryginalna sekcja ma type "table", ZAWSZE zachowaj tę strukturę:
{
  "type": "table",
  "label": "opcjonalny opis tabeli",
  "columns": ["kolumna1", "kolumna2", "kolumna3"],
  "rows": [
    ["wartość1", "wartość2", "wartość3"],
    ["wartość4", "wartość5", "wartość6"]
  ]
}
ZAWSZE musisz podać "columns" (tablica nazw kolumn) i "rows" (tablica wierszy, gdzie każdy wiersz to tablica wartości).

WYMAGANY FORMAT ODPOWIEDZI:
Zwróć TYLKO JSON w tym formacie (bez żadnego tekstu przed ani po):
{
  "sections": [
    {"type": "heading", "content": "tytuł sekcji"},
    {"type": "text", "content": "treść sekcji"},
    {"type": "code", "label": "etykieta", "content": "kod SQL"},
    {"type": "hint", "content": "wskazówka"}
  ],
  "schema": [
    {"name": "nazwa_kolumny", "type": "TYP", "desc": "opis"}
  ],
  "exercises": [
    {"id": 1, "task": "spersonalizowana treść zadania"},
    {"id": 2, "task": "spersonalizowana treść zadania"}
  ]
}

ZACHOWAJ LICZBĘ I RODZAJE SEKCJI jak w oryginale!
SPERSONALIZUJ RÓWNIEŻ SCHEMAT TABELI - dopasuj opisy kolumn do zainteresowań użytkownika!
SPERSONALIZUJ ZADANIA - zmień nazwy tabel/kolumn w treści zadań aby pasowały do spersonalizowanego schematu!
W zadaniach zachowaj pole "id" - musi być takie samo jak w oryginale!`;

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
        max_tokens: 3000,
        temperature: 0.7,
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
    const raw = data.choices?.[0]?.message?.content?.trim() ?? '';

    console.log('=== AI Personalized Content Raw Response ===');
    console.log('Length:', raw.length);
    console.log('First 500 chars:', raw.substring(0, 500));
    console.log('Last 200 chars:', raw.substring(Math.max(0, raw.length - 200)));

    try {
      let cleanRaw = raw;
      const markdownMatch = raw.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (markdownMatch) {
        cleanRaw = markdownMatch[1];
        console.log('Usunięto markdown code blocks');
      }
      const parsed = JSON.parse(cleanRaw);
      console.log('=== AI Parsed Sections ===');
      console.log('Liczba sekcji:', parsed.sections?.length || 0);
      console.log('Pierwsza sekcja:', parsed.sections?.[0]);
      console.log('Ostatnia sekcja:', parsed.sections?.[parsed.sections?.length - 1]);

      if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
        console.error('AI nie zwrócił sekcji! Używam oryginalnych.');
        // Fallback: zwróć oryginalne sekcje z dodanym wstępem o zainteresowaniach
        const introSection = {
          type: 'text',
          content: interests
            ? `Zauważyłem, że Twoje zainteresowania to: **${interests}**. W tej lekcji postaram się użyć przykładów związanych z tymi tematami!`
            : 'Witaj! W tej lekcji poznasz podstawy SQL w przystępny sposób.'
        };
        return res.json({
          sections: [introSection, ...sections],
          schema: schema,
          exercises: exercises
        });
      }

      // Walidacja sekcji - każda musi mieć type i odpowiednie pola
      const validSections = parsed.sections.filter(s => {
        if (!s.type) return false;

        switch (s.type) {
          case 'heading':
          case 'text':
          case 'hint':
            return !!s.content;
          case 'code':
            return !!s.content;
          case 'table':
            return !!(s.columns && Array.isArray(s.columns) && s.rows && Array.isArray(s.rows));
          default:
            console.warn('Nieznany typ sekcji:', s.type);
            return false;
        }
      });

      console.log('Po walidacji:', validSections.length, 'poprawnych sekcji z', parsed.sections.length);

      if (validSections.length === 0) {
        console.error('Żadna sekcja nie przeszła walidacji! Używam oryginalnych.');
        const introSection = {
          type: 'text',
          content: interests
            ? `Zauważyłem, że Twoje zainteresowania to: **${interests}**. W tej lekcji postaram się użyć przykładów związanych z tymi tematami!`
            : 'Witaj! W tej lekcji poznasz podstawy SQL w przystępny sposób.'
        };
        return res.json({
          sections: [introSection, ...sections],
          schema: schema,
          exercises: exercises
        });
      }

      // Walidacja zadań - każde musi mieć id i task
      const validExercises = parsed.exercises && Array.isArray(parsed.exercises)
        ? parsed.exercises.filter(e => e.id !== undefined && e.task)
        : exercises;

      // Zwróć zarówno sekcje jak i spersonalizowany schemat oraz zadania
      const result = {
        sections: validSections,
        schema: parsed.schema || schema,
        exercises: validExercises
      };

      console.log('Zwracam:', result.sections.length, 'sekcji,', result.schema.length, 'kolumn schematu,', result.exercises.length, 'zadań');
      return res.json(result);
    } catch (e) {
      console.error('Parse error:', e.message);
      console.error('Raw that failed to parse:', raw);
      // Fallback: zwróć oryginalne sekcje w przypadku błędu parsowania
      const introSection = {
        type: 'text',
        content: interests
          ? `Zauważyłem, że Twoje zainteresowania to: **${interests}**. W tej lekcji postaram się użyć przykładów związanych z tymi tematami!`
          : 'Witaj! W tej lekcji poznasz podstawy SQL w przystępny sposób.'
      };
      return res.json({
        sections: [introSection, ...sections],
        schema: schema,
        exercises: exercises,
        error: 'Parse error: ' + e.message
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
