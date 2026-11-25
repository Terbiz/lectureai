---
name: quando-usare-gli-elementi
description: Applica quando devi decidere quale elemento Obsidian (callout, tabella, lista, formula, codice, link, evidenziazione) usare per un dato tipo di contenuto negli appunti.
owner: da definire
version: 1.0
targets: [app, obsidian]
---
# Quando usare gli elementi

## Obiettivo
Scegliere per ogni tipo di contenuto l'elemento Obsidian più adatto, senza perdere informazioni.

## Quando applicarla
- Stai trasformando testo grezzo in appunti strutturati.
- Hai dubbi tra più elementi per lo stesso contenuto (callout o lista? tabella o elenco?).
- Devi rendere coerente lo stile di appunti già scritti.

## Regole
1. Individua il tipo di contenuto, poi usa l'elemento della tabella sotto.
2. Al massimo una evidenza per paragrafo: un solo `==evidenziato==`, oppure un solo grassetto, oppure un solo callout.
3. Mantieni integralmente i dati, le frasi e i numeri dell'utente: cambia solo la forma.
4. Un callout per volta in sequenza; non annidarli senza necessità.
5. Il tipo di callout deve corrispondere al significato (vedi tabella), non al gusto estetico.
6. Per sintassi esatta di ogni elemento vedi `comandi-markdown`; per gli schemi vedi `schemi-mermaid`.
7. Se il contenuto non rientra in nessun caso, usa un paragrafo normale e non inventare elementi.

## Formato di output
### Per l'app
Testo Markdown con gli elementi scelti. Gli schemi sono blocchi `mermaid` nel testo (vedi `schemi-mermaid`).
### Per Obsidian
Markdown Obsidian completo (callout, link `[[ ]]`, embed, tag, commenti). Tabella decisionale:

| Contenuto | Elemento da usare | Perché |
| :-- | :-- | :-- |
| Definizione | `> [!info] Termine` oppure `==termine==` nella frase | separa il concetto dal discorso; l'evidenziazione basta se la definizione è una frase |
| Procedura a passi | Lista numerata `1.` (task `- [ ]` se si esegue) | l'ordine conta; per processi con decisioni, flowchart |
| Confronto tra due cose | Tabella a due colonne | affianca gli stessi criteri riga per riga |
| Esempio pratico | `> [!example] Titolo` | distingue il caso dalla teoria |
| Errore comune | `> [!failure]` o `> [!bug]` con la correzione | segnala cosa NON fare |
| Avvertenza importante | `> [!warning]` (grave: `> [!danger]`) | massima visibilità, usa un solo livello |
| Formula | `$...$` inline, blocco `$$` se isolata o lunga | resa matematica corretta |
| Codice | Blocco con linguaggio (` ```js `); inline con `` ` `` | mantiene formattazione e colori |
| Dato numerico da confrontare | Tabella (confronto di trend: schema `xychart` o `pie`) | numeri allineati con `--:` |
| Elenco di caratteristiche | Lista con `-` | elementi paralleli senza ordine |
| Concetto da evidenziare | `==concetto==` (o `**grassetto**` se già evidenziato altrove) | una sola evidenza per paragrafo |
| Riferimento a un'altra nota | `[[Nota]]`, `[[Nota#Titolo]]`, `[[Nota\|testo]]` in tabella | crea il collegamento nel grafo |
| Domanda di autoverifica | `> [!question]- Domanda` con risposta nel corpo | resta chiusa finché si apre |
| Riepilogo di sezione | `> [!abstract]` | sintesi in testa, senza sostituire il testo |
| Suggerimento / trucco | `> [!tip]` | consiglio non vincolante |
| Citazione | `> testo` + fonte, o `> [!quote]` | attribuzione chiara |
| Cosa da fare / ripassare | `- [ ]` | spuntabile in lettura |
| Nota marginale o fonte | Nota a piè `[^1]` | non interrompe il filo del testo |
| Argomento trasversale | Tag `#materia/argomento` | ricerca e filtri |
| Appunto personale nascosto | `%%testo%%` | visibile solo in modifica |
| Materiale esterno | `![[Doc.pdf#page=3]]`, `![[foto.jpg]]`, `![](url)` | incorpora senza copiare |
| Processo, gerarchia, classi, stati, tempi | Schema Mermaid | vedi `schemi-mermaid` |

## Esempio
Input: «Il fattoriale n! è il prodotto da 1 a n. Errore frequente: dimenticare che 0! vale 1. Ad esempio 4! = 24.»
Output:
```md
Il fattoriale ==n!== è il prodotto dei numeri da 1 a $n$.

> [!failure] Errore comune
> Dimenticare che $0! = 1$.

> [!example] Esempio
> $4! = 1\cdot2\cdot3\cdot4 = 24$
```

## Da non fare
- Non mettere due evidenze nello stesso paragrafo (es. `==a==` e `**b**`).
- Non usare callout per testo ordinario né tabelle per un solo dato.
- Non eliminare, riassumere o generalizzare le informazioni dell'utente.
- Non usare `[!danger]` per avvertenze lievi: svaluta quelle vere.
- Non inventare elementi o sintassi assenti dalle fonti: scrivi "da verificare".
