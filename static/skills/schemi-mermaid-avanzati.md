---
name: schemi-mermaid-avanzati
description: Sintassi dei tipi di schema Mermaid meno comuni (serie numeriche, piani, versioni, flussi con quantità, bacheche, insiemi, griglie, bit, cloud, corsie).
version: 2.0
targets: [app, obsidian]
---
# Schemi Mermaid avanzati

Usali solo quando la struttura della lezione corrisponde esattamente al tipo. Valgono le regole di `schemi-mermaid` (pochi elementi, etichette brevi, dati solo dalla lezione). Un blocco ` ```mermaid ` per schema; il campo `diagrams` resta `[]`.

## Regole
1. Etichette con simboli o spazi tra doppi apici; circa 12 elementi al massimo.
2. `gantt`: ogni `after id` rimanda a un id esistente. `pie` e `sankey`: solo valori positivi.
3. `packet`: campi in ordine crescente di bit, senza buchi.
4. `architecture-beta`, `block-beta`, `venn-beta`: dichiara gli id prima di usarli. I tipi `-beta` hanno una sintassi che può cambiare: preferisci un tipo stabile quando basta.
5. `zenuml` non viene disegnato dal sito: per le sequenze usa `sequenceDiagram`.

## Esempi validi
**Serie numeriche** (`xychart`, barre e linee)
```mermaid
xychart
    title "Iscritti"
    x-axis [2022, 2023, 2024]
    y-axis "Studenti" 0 --> 500
    bar [200, 320, 450]
    line [200, 320, 450]
```
**Piano con date** (`gantt`; stati `done`, `active`, `crit`, `milestone`)
```mermaid
gantt
    title Tesi
    dateFormat YYYY-MM-DD
    section Lavoro
    Ricerca :done, t1, 2026-01-05, 10d
    Stesura :active, t2, after t1, 20d
    Consegna :milestone, m1, after t2, 0d
```
**Cronologia con periodi** (`timeline` con `section`)
```mermaid
timeline
    title Storia del web
    section Anni '90
        1991 : Prima pagina web
    section Anni 2000
        2004 : Web 2.0
```
**Versioni** (`gitGraph`)
```mermaid
gitGraph
    commit id:"base"
    branch dev
    checkout dev
    commit id:"feature"
    checkout main
    merge dev tag:"v1.0"
```
**Flussi con quantità** (`sankey`, righe `origine,destinazione,valore`)
```mermaid
sankey
Energia,Casa,60
Energia,Industria,40
Casa,Riscaldamento,35
Casa,Luce,25
```
**Bacheca** (`kanban`, compiti indentati sotto la colonna)
```mermaid
kanban
  todo[Da fare]
    t1[Ripassare]
  done[Fatto]
    t2[Esercizi]
```
**Insiemi** (`venn-beta`)
```mermaid
venn-beta
  set A["Frontend"]
  set B["Backend"]
  union A,B["Full stack"]
```
**Campi di bit** (`packet`)
```mermaid
packet
+16: "Porta origine"
+16: "Porta destinazione"
32-47: "Lunghezza"
48-63: "Checksum"
```
**Griglia di blocchi** (`block-beta`)
```mermaid
block-beta
    columns 3
    a["Input"] b["Elaborazione"] c["Output"]
    a --> b
    b --> c
```
**Servizi cloud** (`architecture-beta`)
```mermaid
architecture-beta
    group api(cloud)[API]
    service db(database)[DB] in api
    service srv(server)[Server] in api
    db:L -- R:srv
```
**Responsabilità per attore** (`swimlane-beta`, ogni `subgraph` è una corsia)
```mermaid
swimlane-beta LR
    subgraph cli [Cliente]
        R[Richiede]
        A[Riceve]
    end
    subgraph sup [Supporto]
        T[Risponde]
    end
    R --> T
    T --> A
```
