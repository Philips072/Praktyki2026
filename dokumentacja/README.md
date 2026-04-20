# Dokumentacja projektu DataMindAI

## Zawartość

- [Architektura](architektura.md) — struktura folderów, technologie, endpointy backendu, komponenty
- [Uruchomienie](uruchomienie.md) — jak uruchomić frontend i backend, zmienne środowiskowe
- [Wymagania](wymagania.md) — wymagania funkcjonalne i niefunkcjonalne

## Skrócony opis

**DataMindAI** to platforma do nauki SQL z personalizacją opartą na AI.

Projekt składa się z dwóch części:

| Folder | Technologia | Adres |
|--------|-------------|-------|
| `projekt/DataMindAi/` | React + Vite + Supabase | `http://localhost:5173` |
| `projekt/backend/` | Node.js + Express | `http://localhost:3001` |

## Kluczowe funkcje

- **Uczenie SQL** z lekcjami dostosowanymi do poziomu użytkownika
- **Asystent AI** (Google Gemma 4 przez OpenRouter) odpowiada na pytania o SQL
- **Personalizacja** zainteresowań przez AI podczas onboardingu
- **Panel nauczyciela** z zarządzaniem uczniami, klasami i testami
- **Panel administratora** do zarządzania użytkownikami i statystykami systemu
- **Wiadomości** między użytkownikami w czasie rzeczywistym (Supabase Realtime)
- **System klas** z masowym przypisywaniem uczniów

## Struktura ról

| Rola | Opis |
|------|------|
| `uczen` | Uczeń platformy — dostęp do lekcji, zadań, czatu AI |
| `nauczyciel` | Nauczyciel — dostęp do panelu nauczyciela, tworzenie klas, testów |
| `administrator` | Administrator — pełny dostęp do panelu administratora, zarządzanie użytkownikami |
