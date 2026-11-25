---
name: quando-usare-gli-elementi
description: Regole per titoli, evidenze colorate e scelta dello strumento Obsidian giusto per ogni tipo di contenuto. Applicala sempre.
version: 2.0
targets: [app, obsidian]
---
# Come scrivere gli appunti

## 1. Titoli
- Ogni `##` dice l'idea della sezione, non solo l'argomento.
  ❌ `## Ricerca binaria` → ✅ `## La ricerca binaria dimezza lo spazio a ogni passo`
- Il primo `##` non ripete il titolo della lezione.
- Le sezioni seguono l'ordine della lezione. Usa `###` solo se la sezione ha almeno due sotto-punti.
- Vietati i titoli fatti solo di parole generiche: "Introduzione", "Concetti chiave", "Principi", "Strategie", "Strumenti", "Conclusioni".

## 2. Evidenze colorate
| Colore | Uso |
| --- | --- |
| 🟢 | definizione o concetto chiave |
| 🟡 | da ricordare per l'esame (regola, numero, criterio) |
| 🔴 | errore comune o pericolo |
| 🔵 | esempio o caso pratico |
| 🟣 | approfondimento |
| 🟠 | rimando a un'altra parte del corso |

1. Evidenzia una frase di 2–12 parole che, letta da sola, riassume l'idea. Mai una parola singola.
2. Mai su nomi di persone, aziende, app, siti o strumenti, e mai su un titolo.
3. Massimo 1 evidenza per paragrafo o per elenco. Molti paragrafi non ne hanno nessuna.
4. Quantità: circa 1 ogni 200 parole di appunti (1.000 parole → 4–6 evidenze).
5. L'emoji va subito dopo `==`. Vietato `==testo==` senza colore.
6. Usa soprattutto 🟢 e 🟡. Usa 🔴 solo se il professore segnala un errore, 🟠 solo se rimanda a un'altra lezione.
7. Il grassetto non è un'evidenza: serve per il termine all'inizio di una voce di elenco o per un termine tecnico.

## 3. Quale strumento per quale contenuto
| Contenuto | Strumento |
| --- | --- |
| 3 o più elementi paralleli | elenco `- **Nome:** spiegazione` (mai voci con il solo grassetto) |
| Passi in ordine | elenco numerato `1.` |
| Catena causa → effetto, 2–4 passi senza decisioni | frecce su una riga a sé: `A → B → C` |
| Processo più lungo, con decisioni, gerarchia, tempi | schema Mermaid (vedi `schemi-mermaid`) |
| Confronto di due o più cose sugli stessi criteri | tabella |
| Numeri da confrontare | tabella, con `--:` per allineare i numeri |
| Esempio o aneddoto del professore | `> [!example] Titolo` |
| Errore comune | `> [!failure]` o `> [!bug]`, con la correzione |
| Avvertenza | `> [!warning]` (solo se grave: `> [!danger]`) |
| Consiglio pratico | `> [!tip]` |
| Precisazione importante | `> [!note]` o `> [!info]` |
| Riepilogo di una sezione lunga | `> [!abstract]` in testa alla sezione |
| Domanda di autoverifica | `> [!question]- Domanda` con la risposta nel corpo |
| Citazione testuale | `> [!quote]` o `> testo` con la fonte |
| Cose da fare o ripassare | task `- [ ]` |
| Fonte, dettaglio, curiosità che interrompe il filo | nota a piè di pagina `[^1]` |
| Concetto che merita una nota propria | link `[[Concetto]]` (la prima volta che compare) |
| File, video o pagina citati | embed `![[...]]` o link `[testo](url)` |
| Materia e argomenti | 1–3 tag in fondo: `#materia/argomento` |
| Formula | `$...$` inline, `$$...$$` se isolata o lunga |
| Codice | blocco con il linguaggio |
| Contenuto superato o corretto dal professore | barrato `~~...~~` seguito dalla forma giusta |

- Callout: massimo 1 per sezione, il tipo segue il significato e non l'estetica. Mai dentro una tabella: un'avvertenza su una riga va in una colonna "Note" come testo, oppure in un callout sotto la tabella.
- Formule: solo se il professore ne ha data una. Un concetto spiegato a parole resta a parole.
- Paragrafi di 2–5 frasi.
- Se un contenuto non rientra in nessun caso, usa un paragrafo normale.
- Lo strumento cambia solo la forma: frasi, dati e numeri della lezione restano tutti.

## Esempio
Input (trascrizione):
«la ricerca binaria funziona solo se l'array è ordinato... guardi l'elemento in mezzo, se è più grande vai a sinistra, se è più piccolo a destra... ogni volta dimezzi, quindi è logaritmica... errore tipico: usarla su dati non ordinati... con un milione di elementi bastano una ventina di confronti»

Output:
```md
## La ricerca binaria dimezza lo spazio a ogni passo

La ricerca binaria confronta l'elemento centrale con quello cercato e prosegue nella metà giusta: ==🟢a ogni confronto lo spazio di ricerca si dimezza==.

confronto con il centro → scelta della metà → nuovo centro

Per questo la complessità è $O(\log n)$: con un milione di elementi bastano circa 20 confronti.[^1]

> [!failure] Errore comune
> Usarla su dati non ordinati: ==🔴funziona solo se l'array è ordinato==.

[^1]: $\log_2 10^6 \approx 20$.
```
