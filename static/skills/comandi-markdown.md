---
name: comandi-markdown
description: Sintassi Markdown di Obsidian disponibile negli appunti, resa sia dal sito sia da Obsidian.
version: 2.0
targets: [app, obsidian]
---
# Sintassi disponibile

Puoi usare tutti questi strumenti. Scegli quello giusto con la skill `quando-usare-gli-elementi`.

| Elemento | Sintassi |
| --- | --- |
| Titoli | `##` sezione, `###` sotto-punto. Mai `#`: lo aggiunge l'app |
| Grassetto, corsivo, barrato | `**termine**`, `*termine tecnico*`, `~~superato~~` |
| Evidenza colorata | `==🟢testo==`: emoji subito dopo `==` (colori in `quando-usare-gli-elementi`) |
| Sottolineato | `<u>testo</u>` |
| Elenchi | `- voce`, `1. passo`, task `- [ ] da fare`; per annidare, rientro di 4 spazi |
| Citazione | `> testo` e sotto la fonte |
| Callout | `> [!tipo] Titolo` e poi righe `> testo`; chiuso `[!tipo]-`, aperto `[!tipo]+` |
| Tabella | `\| A \| B \|` e sotto `\| --- \| --- \|`; allineamento `:--`, `:--:`, `--:`; a capo nella cella `<br>` |
| Frecce | `A → B → C` su una riga a sé |
| Codice | blocco con il linguaggio (` ```python `); inline `` `x` `` |
| Formule | `$...$` inline, `$$...$$` su righe proprie |
| Nota a piè di pagina | `testo[^1]` e in fondo `[^1]: spiegazione`; breve e inline: `testo^[spiegazione]` |
| Link a una nota | `[[Concetto]]`, con testo diverso `[[Concetto\|testo]]`, a una sezione `[[Concetto#Parte]]` |
| Link esterno | `[testo](https://url)` |
| Embed | `![[file.pdf#page=3]]`, `![[immagine.png]]`; video `![](https://www.youtube.com/watch?v=ID)` |
| Tag | `#materia/argomento` (con almeno una lettera) |
| Commento nascosto | `%%testo%%` (visibile solo in modifica) |
| Separatore | `---` su una riga a sé |
| Schema | blocco ` ```mermaid ` (vedi `schemi-mermaid`) |
| Riferimento al PDF | riga che inizia con `📄 p.X:` |

## Regole
1. Lascia una riga vuota tra i paragrafi e prima e dopo elenchi, tabelle, callout e blocchi.
2. Per scrivere un simbolo come testo, anteponi `\`: `\*`, `\_`, `\|`, `\#`, `\=`.
3. HTML solo per `<u>` e per `<br>` nelle tabelle; dentro l'HTML il Markdown non funziona.
4. Link `[[...]]` solo a concetti della lezione che meritano una nota propria (Obsidian crea la nota al clic). Embed e link esterni solo per file, video o siti citati nelle fonti: non inventare nomi di file né indirizzi.
5. Tag: da 1 a 3, in fondo agli appunti, sulla materia e sugli argomenti principali.
6. Chiudi sempre ogni `%%`: un commento aperto nasconde il resto della nota.
7. Usa una sola forma per ogni elemento in tutto l'appunto.

## Esempio
Input: «La velocità è spazio diviso tempo, si misura in metri al secondo. Non confonderla con l'accelerazione.»

Output:
```md
## La velocità misura lo spazio percorso nel tempo

==🟢la velocità è lo spazio diviso il tempo==: $v=\frac{s}{t}$.[^1]

> [!warning] Errore comune
> Non confondere la velocità con l'[[Accelerazione]].

[^1]: Si misura in metri al secondo (m/s).
```
