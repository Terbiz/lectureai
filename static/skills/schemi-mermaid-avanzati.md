---
name: schemi-mermaid-avanzati
description: Applica quando negli appunti serve uno schema Mermaid diverso da flowchart, sequence, mindmap, class e state: cronologie, piani, versioni, grafici, flussi, insiemi, griglie, bit, cloud.
owner: da definire
version: 1.0
targets: [app, obsidian]
---
# Schemi Mermaid avanzati

## Obiettivo
Produrre schemi Mermaid corretti per i tipi meno comuni, con un esempio completo e valido per ciascuno (gli altri tipi: vedi `schemi-mermaid`).

## Quando applicarla
- Eventi nel tempo (`timeline`), piano con date (`gantt`), versioni (`gitGraph`), bacheca (`kanban`).
- Proporzioni (`pie`), serie numeriche (`xychart`), flussi con quantità (`sankey`), insiemi (`venn-beta`).
- Griglie (`block-beta`), campi di bit (`packet`), servizi cloud (`architecture-beta`).
- Responsabilità per attore (`swimlane-beta`) e sequenze scritte come codice (`zenuml`).

## Regole
1. Tipo dai dati: tempo → timeline/gantt; quantità → pie/xychart/sankey; insiemi → venn.
2. Etichette chiare, circa 12 elementi al massimo; testo con simboli tra doppi apici.
3. Tipi `-beta` hanno sintassi mutabile; `zenuml` è un plugin: in Obsidian "da verificare".
4. `pie`: valori positivi (max 2 decimali). `gantt`: ogni `after id` rimanda a un id esistente.
5. `packet`: campi in ordine crescente di bit, senza buchi, mai `7-0`.
6. `venn`/`architecture`/`block`: gli id usati vanno prima dichiarati.
7. `kanban`: compiti indentati sotto la colonna; id unici. Priorità: Very High, High, Medium, Low, Very Low.
8. Commenti `%% testo` su riga propria; configurazione solo nel front matter `config:` (altre chiavi: "da verificare").
9. Aspetto precedente (venn, swimlane): front matter `config:` con `theme: default` e `look: classic`.

## Formato di output
### Per l'app e per Obsidian
Blocco di codice con linguaggio `mermaid`, come negli esempi sotto: il sito lo disegna e Obsidian lo disegna. Il campo `diagrams` resta `[]`.

**Torta e ciambella** (`pie`, `showData` mostra i valori; opzioni `textPosition`, `donutHole`, `legendPosition`, `highlightSlice`)
```mermaid
---
config:
  pie:
    donutHole: 0.4
    highlightSlice: Gatti
---
pie showData title Animali adottati
    "Cani" : 386
    "Gatti" : 85
    "Ratti" : 15
```
**Cronologia** (periodo : evento : altro evento; `section` raggruppa; `<br>` va a capo)
```mermaid
timeline
    title Storia moderna
    section Età moderna
        1492 : Scoperta dell'America
        1789 : Rivoluzione francese : Diritti dell'uomo
    section Età contemporanea
        1861 : Unità d'Italia<br>Regno d'Italia
```
**Gantt** (stati `done`, `active`, `crit`, `milestone`, `vert`; `after id`; `excludes weekends`; `axisFormat`, `tickInterval`, `todayMarker`)
```mermaid
gantt
    title Tesi
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    excludes weekends
    section Lavoro
    Ricerca :done, t1, 2026-01-05, 10d
    Stesura :crit, active, t2, after t1, 20d
    Consegna :milestone, m1, after t2, 0d
```
**Versioni** (`commit id/tag/type`, `branch`, `checkout`/`switch`, `merge`, `cherry-pick`; tipi NORMAL, REVERSE, HIGHLIGHT)
```mermaid
gitGraph
    commit id:"base"
    branch dev
    checkout dev
    commit id:"feature" tag:"v0.1"
    checkout main
    commit type:HIGHLIGHT
    merge dev tag:"v1.0"
    cherry-pick id:"feature" parent:"base"
```
**Grafico a barre e linee** (`xychart horizontal` per orientamento; serie con nome entrano in legenda)
```mermaid
xychart
    title "Vendite"
    x-axis [gen, feb, mar]
    y-axis "Euro" 0 --> 100
    bar "Reale" [20, 50, 80]
    line "Obiettivo" [30, 50, 70]
```
**Flussi con quantità** (`sankey`, righe `origine,destinazione,valore`, valori positivi)
```mermaid
sankey
Energia,Casa,60
Energia,Industria,40
Casa,Riscaldamento,35
Casa,Luce,25
```
**Bacheca** (metadati `ticket`, `assigned`, `priority`; link ticket con `ticketBaseUrl` e `#TICKET#`)
```mermaid
---
config:
  kanban:
    ticketBaseUrl: 'https://esempio.it/ticket/#TICKET#'
---
kanban
  todo[Da fare]
    t1[Ripassare]@{ ticket: T-12, assigned: 'Anna', priority: 'High' }
  done[Fatto]
    t2[Esercizi]
```
**Insiemi** (`set`, `union` anche di 3+ insiemi, `text` annidato, `:N` dimensione, `style` con fill, color, stroke, stroke-width, fill-opacity)
```mermaid
venn-beta
  title Competenze
  set A["Frontend"]:20
    text A1["React"]
  set B["Backend"]:12
  union A,B["Full stack"]:3
  style A fill:#ff6b6b
```
**Pacchetto** (`inizio-fine: "campo"`, `+N` bit consecutivi; opzioni `showBits`, `bitsPerRow`, `bitOrder: descending`)
```mermaid
packet
title UDP
+16: "Porta origine"
+16: "Porta destinazione"
32-47: "Lunghezza"
48-63: "Checksum"
64-95: "Dati"
```
**Cloud** (`group`, `service`, `junction`, lati T/B/L/R, frecce `<`/`>`, `{group}` per archi tra gruppi, `align row|column`)
```mermaid
architecture-beta
    group api(cloud)[API]
    service db(database)[DB] in api
    service disk(disk)[Disco] in api
    service srv(server)[Server] in api
    service web(internet)[Web]
    db:L -- R:srv
    disk:T -- B:srv
    srv:T --> B:web
    align column db disk
```
**Blocchi** (`columns N`, larghezza `:N`, `space`, `block:id … end`, forme `(( ))`, `[( )]`, `{ }`, frecce `<["x"]>(right)`, `style`)
```mermaid
block-beta
    columns 3
    a["A"] b("B") c(("C"))
    block:g:2
        columns 2
        d["D"] e["E"]
    end
    f[("DB")]
    space g2<["vai"]>(right) h{"H"}
    a --> b
    style a fill:#969,stroke:#333
```
**Corsie** (`swimlane-beta` + direzione; ogni `subgraph` è una corsia, con id e titolo `subgraph id [Titolo]`)
```mermaid
swimlane-beta LR
    subgraph cli [Cliente]
        R[Richiede]
        A[Riceve]
    end
    subgraph sup [Supporto]
        T[Risponde]
    end
    R -->|ticket| T
    T --> A
```
**Sequenza a codice** (`zenuml`: messaggi, `new`, `if/else`, `while`, `for`, `try/catch`, `return`, commenti `//`)
```mermaid
zenuml
    title Ordine
    Alice->John: Ciao
    John.verifica(dati) {
        if(valido) {
            return ok
        } else {
            return errore
        }
    }
```

## Esempio
Input: «Nel 2020 inizia il progetto, nel 2022 esce la versione 1.»
Output Obsidian:
```mermaid
timeline
    title Progetto
    2020 : Inizio
    2022 : Versione 1
```

## Da non fare
- Non usare id non dichiarati, valori negativi in `pie`, campi `packet` con buchi.
- Non eliminare, riassumere o generalizzare le informazioni dell'utente.
- Non inventare sintassi assente dalle fonti: scrivi "da verificare".
