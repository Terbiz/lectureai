---
name: schemi-mermaid
description: Applica quando un processo, uno scambio tra attori, una gerarchia, delle classi, degli stati o dei dati negli appunti si capiscono meglio con uno schema Mermaid.
owner: da definire
version: 1.0
targets: [app, obsidian]
---
# Schemi Mermaid

## Obiettivo
Produrre schemi corretti e completi, solo quando aiutano a capire, senza sostituire il testo dell'utente.

## Quando applicarla
- Processo con passi e decisioni: `flowchart`; con responsabilità per attore: `swimlane-beta`.
- Scambio di messaggi tra attori: `sequenceDiagram` (alternativa a codice: `zenuml`).
- Gerarchia o mappa di concetti: `mindmap`. Classi e relazioni: `classDiagram`. Stati e transizioni: `stateDiagram-v2`.
- Altri casi (tabella sotto): cronologie, piani, versioni, proporzioni, serie, flussi, insiemi, griglie, bit, cloud.

## Regole
1. Ogni nodo ha un'etichetta chiara; ogni freccia ha un verso; nessun nodo isolato.
2. Massimo 8 nodi per schema: oltre, dividi in più schemi. Etichette brevi (massimo 5 parole).
2b. Forme: `[testo]` rettangolo per ogni passo; `{testo}` rombo solo per una domanda sì/no di massimo 3 parole. Non mettere frasi lunghe dentro il rombo.
3. La prima riga è il tipo di diagramma; direzioni `TD`/`TB`, `LR`, `BT`, `RL`.
4. Testo con parentesi o simboli tra doppi apici: `A["testo (con parentesi)"]`.
5. In flowchart `end` minuscolo in un nodo rompe il diagramma: scrivi `End`. In sequenceDiagram usa `(end)`.
6. Commenti: `%% testo` su riga propria. In sequenceDiagram `#` è un codice di escape (`#35;` = `#`, `#59;` = `;`): non scriverlo da solo.
7. Tipi `-beta` (`venn`, `swimlane`, `architecture`, `block`, `sankey`) hanno sintassi mutabile; `zenuml` è un plugin: in Obsidian "da verificare".
8. Colori: usa `classDef` con questi colori pastello e assegnali ai nodi importanti:
   - `classDef errore fill:#FEE2E2,stroke:#DC2626,color:#1E293B`
   - `classDef ok fill:#DCFCE7,stroke:#16A34A,color:#1E293B`
   - `classDef info fill:#DBEAFE,stroke:#2563EB,color:#1E293B`
   - `classDef nota fill:#FEF9C3,stroke:#CA8A04,color:#1E293B`
   Esempio: `class A ok` oppure `A:::ok`. Non più di tre colori per schema.
9. Dimensione: uno schema per concetto. Se serve più dettaglio, fai uno schema per fase invece di uno schema enorme.
10. Stile solo se serve: `linkStyle`, `class A internal-link;` (nodo che apre la nota in Obsidian).

## Formato di output
### Per l'app e per Obsidian
Lo schema va nel testo come blocco di codice con linguaggio `mermaid`: il sito lo disegna e Obsidian lo disegna. Il campo `diagrams` resta `[]`. Esempio di flowchart (sintassi identica per entrambi):
Esempi completi e validi per ogni tipo:
```mermaid
flowchart TD
    A[Inizio] --> B{"Capito?"}
    B -->|sì| C(Esercizi)
    B -->|no| D["Rileggi (cap. 1)"]
    D -.-> B
    C ==> E((Fine))
```
```mermaid
sequenceDiagram
    participant S as Studente
    participant P as Professore
    S->>P: Domanda
    alt chiara
        P-->>S: Risposta
    else confusa
        P-->>S: Chiarimento
    end
    Note right of P: Ricevimento
```
```mermaid
mindmap
  root((Cellula))
    Nucleo
      DNA
    Citoplasma
      Mitocondri
```
```mermaid
classDiagram
    class Animale { +nome +muovi() }
    class Cane { +abbaia() }
    Animale <|-- Cane
```
```mermaid
stateDiagram-v2
    [*] --> Attesa
    Attesa --> Studio : inizia
    Studio --> [*]
```
Funzioni avanzate dei cinque tipi (esempi validi):
```mermaid
flowchart LR
    subgraph Studio
        direction TB
        A@{ shape: rect, label: "Leggi" } --> B[("Archivio")]
    end
    B --> C{{"Esadecagono"}}
    C --> D[/"Parallelogramma"/]
    D --> E>"Asimmetrico"]
    A -- testo --- C
    A <--> D
    A ~~~ E
    classDef evid fill:#f96,stroke:#333
    class A evid
    click A "https://example.com" "Apri"
```
```mermaid
sequenceDiagram
    autonumber
    actor U as Utente
    participant S as Server
    U->>+S: Richiesta
    create participant DB as Database
    S->>DB: Crea record
    S-)DB: Salva (asincrono)
    par Log
        S->>S: Scrive log
    and Cache
        S-xDB: Svuota
    end
    opt Errore
        S-->>-U: Messaggio d'errore
    end
    loop Ogni minuto
        U->>S: Ping
    end
    critical Connessione
        S->>DB: Apri
    option Fallita
        S->>S: Riprova
    end
    break Utente esce
        U->>S: Chiudi
    end
    rect rgb(240, 240, 255)
        Note over U,S: Fase finale
    end
    destroy DB
    S-xDB: Chiudi
```
```mermaid
mindmap
  root((Biologia))
    id1[Cellula]
      id2(Nucleo)
      ::icon(fa fa-dna)
    id3))Evoluzione((
    id4)Genetica(
    {{Ecologia}}
```
```mermaid
classDiagram
    direction LR
    namespace Zoo {
        class Animale {
            <<abstract>>
            +String nome
            -int eta
            #peso
            +muovi()* void
        }
        class Cane
    }
    class Persona
    Animale <|-- Cane : estende
    Persona "1" --> "*" Cane : possiede
    Cane *-- Zampa
    Cane o-- Collare
    Cane ..> Cibo : dipende
    Cane ..|> Amico
    note for Cane "Razza da definire"
```
```mermaid
stateDiagram-v2
    direction LR
    [*] --> Attesa
    state scelta <<choice>>
    Attesa --> scelta
    scelta --> Studio : pronto
    scelta --> Pausa : stanco
    state Studio {
        [*] --> Lettura
        Lettura --> Esercizi
        --
        [*] --> Musica
    }
    state fork_in <<fork>>
    Pausa --> fork_in
    fork_in --> Studio
    note right of Pausa : Max 15 min
    Studio --> [*]
```
## Esempio
Input: «Prima si studia; se non si è pronti si ripassa, poi si fa l'esame.»
Output Obsidian:
```mermaid
flowchart LR
    A[Studia] --> B{"Pronto?"}
    B -->|no| C[Ripassa]
    C --> B
    B -->|sì| D[Esame]
```

## Da non fare
- Non lasciare nodi isolati, frecce senza verso o etichette vuote.
- Non usare `end` minuscolo nei nodi né simboli senza doppi apici.
- Per gli altri tipi (timeline, gantt, pie…) usa `schemi-mermaid-avanzati`.
- Non eliminare, riassumere o generalizzare le informazioni dell'utente: lo schema le affianca.
- Non inventare sintassi assente dalle fonti: scrivi "da verificare".
