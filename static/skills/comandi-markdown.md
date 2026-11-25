---
name: comandi-markdown
description: Applica quando devi scrivere o formattare appunti in Markdown per Obsidian e serve la sintassi corretta di ogni comando.
owner: da definire
version: 1.0
targets: [app, obsidian]
---
# Comandi Markdown di Obsidian

## Obiettivo
Usare tutta la sintassi Markdown di Obsidian in modo corretto e leggibile, senza alterare il contenuto dell'utente.

## Quando applicarla
- Scrivi, riformatti o struttura un appunto.
- Devi scegliere la sintassi esatta di un comando (callout, link, tabella, formula).
- Devi inserire commenti, note a piè di pagina, tag o embed.

## Regole
1. Separa i paragrafi con una riga vuota; a capo nello stesso paragrafo: due spazi a fine riga, `Shift+Enter` o `<br>`.
2. Spazi multipli si comprimono: per mantenerli usa `&nbsp;`.
3. Una sola sintassi per elemento, sempre con la stessa forma nell'intero appunto.
4. Dentro l'HTML il Markdown non viene interpretato e i blocchi HTML non devono avere righe vuote.
5. Per mostrare un simbolo come testo anteponi `\` (`\*`, `\_`, `\#`, `` \` ``, `\|`, `\~`); in `1\.` il backslash va prima del punto.
6. Chiudi sempre ogni `%%` di blocco: altrimenti la lettura nasconde il resto della nota.
7. Info non presenti nelle fonti (es. riferimenti a blocco `^id`, proprietà YAML): scrivi "da verificare".

## Formato di output
### Per l'app
Testo Markdown nel campo degli appunti. Tutti i comandi sotto sono ammessi, schemi compresi (blocchi `mermaid`, vedi `schemi-mermaid`).
### Per Obsidian
Stessa sintassi nel file `.md`. Riferimento (sintassi → quando usarla → esempio):

**Struttura**
- Titoli `#`…`######` → gerarchia dell'appunto → `## Definizione`
- Elenco `- `, `* `, `+ ` → elementi senza ordine → `- Massa`
- Numerato `1.` o `1)` → passi in sequenza → `1. Misura`
- Task `- [ ]` / `- [x]` (ogni carattere vale "fatto", es. `[?]`, `[-]`) → cose da fare
- Annidamento: indenta di 4 spazi o Tab; si possono mischiare i tipi di lista
- Linea orizzontale `---`, `***`, `___` (anche `* * *`) → separare sezioni
- Citazione `> testo` → frasi citate → `> Cit. (Autore, 1961)`

**Testo**
- `**grassetto**`, `__grassetto__` · `*corsivo*`, `_corsivo_` · `***grassetto corsivo***`
- Grassetto con corsivo annidato: `**testo _annidato_ testo**`
- Barrato `~~testo~~` → contenuto superato
- Evidenziato `==testo==`; con colore: `==🔴Importante==`, `==🟠…==`, `==🟡…==`, `==🟢…==`, `==🔵…==`, `==🟣…==` (emoji subito dopo `==`)
- Sottolineato `<u>testo</u>` · barrato HTML `<s>testo</s>`
- Stile/classe: `<span style="font-family: cursive">testo</span>` (anche `<div>`)
- Codice inline `` `codice` `` (con backtick dentro: ``` `` a`b `` ```)

**Link, embed, tag, commenti**
- Link interno `[[Nota]]`, alias `[[Nota|testo]]`, sezione `[[Nota#Titolo]]`; forma Markdown `[testo](Nota%20x.md)`
- Link esterno `[testo](https://url)`; con spazi `%20` o `<…>`; URI `obsidian://open?vault=V&file=N.md`
- Embed nota `![[Nota]]`, immagine `![[foto.jpg]]`, ridimensionata `![[foto.jpg|200]]`, PDF `![[Doc.pdf#page=3]]`
- Immagine esterna `![alt|100x145](https://url)` (solo `|100` mantiene le proporzioni)
- Video/tweet: `![](https://www.youtube.com/watch?v=ID)`; pagina web: `<iframe src="URL"></iframe>` (alcuni siti non lo consentono)
- Tag `#materia`, `#area/sotto` (almeno una lettera)
- Commento Obsidian `%%inline%%` o blocco `%%` su righe proprie; commento HTML `<!-- testo -->`
- Nota a piè di pagina `testo[^1]` + `[^1]: spiegazione` (anche `[^nome]`); righe successive con 2 spazi; inline `^[testo]` (solo lettura)

**Callout** (prima riga di una citazione)
- `> [!tip] Titolo` + righe `> …`; solo titolo ammesso; contengono Markdown, link, embed
- Tipi: note, abstract (summary, tldr), info, todo, tip (hint, important), success (check, done), question (help, faq), warning (caution, attention), failure (fail, missing), danger (error), bug, example, quote (cite); tipo sconosciuto = note; maiuscole indifferenti
- Ripiegabile: `[!faq]-` chiuso, `[!faq]+` aperto; annidati con `> >`
- Personalizzati: solo via CSS `.callout[data-callout="x"]` (`--callout-color`, `--callout-icon`)

**Tabelle**: `| A | B |`, riga `| --- | --- |` (almeno 2 trattini); allineamento `:--`, `:--:`, `--:`; alias o resize nella cella: `\|`.
**Codice**: tre backtick o tre `~~~` + linguaggio (Prism); annidato: recinto esterno più lungo; anche rientro di 4 spazi.
**Formule** (MathJax/LaTeX): inline `$e^{2i\pi}=1$`; blocco `$$` su riga propria, formula, `$$`.
**Diagrammi**: blocco ` ```mermaid ` (vedi `schemi-mermaid`); nodo cliccabile: `class A,B internal-link;`.

## Esempio
Input: «La velocità è spazio/tempo. Attenzione: non confonderla con l'accelerazione.»
Output:
```md
## Velocità
La velocità è ==spazio/tempo==: $v=\frac{s}{t}$.[^1]

> [!warning] Errore comune
> Non confonderla con l'accelerazione ([[Accelerazione]]).

[^1]: Vedi anche [[Cinematica#Definizioni]]. #fisica/cinematica
```

## Da non fare
- Non eliminare, riassumere o generalizzare le informazioni dell'utente.
- Non mettere Markdown dentro blocchi HTML né righe vuote dentro un blocco HTML.
- Non lasciare `%%` di blocco aperto; non usare tag senza lettere (`#2024`).
- Non inventare sintassi assente dalle fonti: scrivi "da verificare".
