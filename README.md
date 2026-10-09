# Lecture AI 🎓

**Appunti universitari intelligenti, generati dall'AI.**

 @==========================================@  
 ||.....................➡️ **https://lectureai-nvgr.onrender.com** ⬅️....................... ||
 @==========================================@

LectureAI trasforma lezioni registrate, trascrizioni o PDF in appunti strutturati,
schemi visuali, sommari e flashcard — pronti per lo studio.

<br>


##  Uso  
 

### 🌎 Versione online (consigliata)

Apri **https://lectureai-nvgr.onrender.com** da qualsiasi dispositivo.

1. Scegli il provider AI dal menu in alto
2. Incolla la tua API key personale e clicca **Salva** ( più informazioni sulla Api in basso)
3. Registra la lezione e/o carica il PDF del professore
4. Premi **✨ Genera Appunti AI**

> ⚠️ La API key è tua personale. Non è memorizzata sul server, resta solo nel tuo
> browser (localStorage). Nessuno può vederla né usarla.

### 🖥️ Versione desktop locale

```bash
pip install flask requests pystray pillow
python app.py
```
Il browser si apre automaticamente su `http://localhost:5000`.


<br><br>



#  Funzionalità

- 🎙️ **Trascrizione live** della lezione con riconoscimento vocale (Chrome/Edge)
- 📄 **Import PDF** del materiale del professore
- 🤖 **Multi-provider AI**: Google Gemini, Anthropic Claude, DeepSeek
- 📝 **Appunti strutturati** con sezioni tematiche, formule LaTeX, evidenziazioni
- 🔷 **Schemi visuali** generati automaticamente (flowchart + mindmap)
- 📊 **Sommario** con punti chiave, definizioni e livello di difficoltà
- 🃏 **Flashcard** per il ripasso rapido
- 💾 **Cronologia sessioni** salvata in locale
- 📤 **Export** in Obsidian, Markdown, HTML, PDF
- 🌍 **7 profili disciplina**: Informatica, Medicina, Giurisprudenza, Economia,
  Umanistiche, Scienze, Generale (riunioni/seminari)
- ✏️ **Prompt personalizzabili** per ogni profilo, salvati in locale
- ✍️ **Trascrizione editabile in tempo reale**: correggi le parole sbagliate
  mentre l'AI continua a scrivere, senza perdere nulla

<br>

## 🎓 Profili disciplina

Nelle **⚙️ Impostazioni** (icona ingranaggio in alto a destra) puoi scegliere il
profilo più adatto al tuo corso. LectureAI adatta automaticamente il formato degli
appunti alla disciplina.

| Profilo | Adatto per |
|---|---|
| 💻 Informatica / Ingegneria | Codice, algoritmi, complessità, diagrammi tecnici |
| 🩺 Medicina / Biologia | Nomenclature cliniche, farmaci, linee guida |
| ⚖️ Giurisprudenza / Diritto | Articoli di legge, sentenze, dottrina |
| 📈 Economia / Management | Modelli, indicatori, casi aziendali |
| 📚 Lettere / Filosofia / Storia | Autori, opere, date, correnti di pensiero |
| 🔬 Fisica / Chimica / Matematica | Formule LaTeX, reazioni, teoremi, dimostrazioni |
| 🗣️ Generale — Riunioni / Seminari | Decisioni, action items, prossimi passi |

Ogni profilo è **personalizzabile**: puoi modificare il prompt dal pannello
Impostazioni e salvare la tua versione. Le modifiche restano salvate solo nel tuo
browser.

---
<br>
<br>

# 🔑 Cos'è una API key e come ottenerla

### In parole semplici

Immagina di dover entrare in una biblioteca molto grande e di dover chiedere aiuto
a un bibliotecario super esperto (l'AI) per farti riassumere dei libri. Per entrare
ti serve una **tessera personale**. Quella tessera è la tua **API key**.

In pratica:

- **L'AI** (Gemini, Claude, DeepSeek) è come il bibliotecario: sa fare il lavoro.
- **L'API** è la porta d'ingresso: il modo con cui LectureAI parla con l'AI.
- **La API key** è la tua chiave personale: dice al servizio "sono io, autorizzami".

Senza una API key, LectureAI non può parlare con l'AI e non può generare nulla.
Serve una tessera per ogni "bibliotecario", ma **ne basta una sola**: scegline uno,
prendi la sua chiave, e usa quella.

### 🟢 Google Gemini (consigliato — ha un piano gratuito)

È l'unico dei tre che offre un **piano gratuito** con quota mensile generosa:
perfetto per provare LectureAI senza spendere nulla.

1. Vai su **https://aistudio.google.com/apikey**
2. Accedi con il tuo account Google (quello di Gmail, per intenderci)
3. Clicca **"Create API key"** (o "Crea chiave API")
4. Clicca **"Create API key in new project"** — Google crea un progetto automatico
5. Ti appare una stringa che inizia con **`AIzaSy...`**: quella è la tua chiave
6. Clicca l'icona **📋 Copia** accanto alla chiave
7. Torna su LectureAI, incollala nel campo in alto, premi **Salva**

**Costo**: gratis entro i limiti mensili di Google (più che sufficienti per uso
studentesco). Se li superi, l'app ti avvisa e ti suggerisce di riprovare più tardi.

> **ℹ️ Nota sugli altri due provider (Claude e DeepSeek)**
>
> LectureAI supporta anche **Anthropic Claude** e **DeepSeek**, ma questi **non
> offrono un piano gratuito**: vanno ricaricati con una piccola somma (di solito
> $2-5) prima di poter essere usati. Il procedimento per ottenere la chiave è lo
> stesso:
>
> - **Claude**: registrati su [console.anthropic.com](https://console.anthropic.com/),
>   vai su **Settings → API Keys → Create Key**, ricarica il credito, e incolla
>   la chiave che inizia con `sk-ant-...`
> - **DeepSeek**: registrati su [platform.deepseek.com](https://platform.deepseek.com/),
>   vai su **API Keys → Create new API key**, ricarica almeno $2, e incolla la
>   chiave che inizia con `sk-...`
>
> Se non hai esigenze particolari, inizia con **Gemini**: è gratis e va benissimo
> per la maggior parte delle lezioni.

### ⚠️ Come trattare la tua API key

Trattala come **la password del tuo conto in banca**.

**DA FARE:**
- ✅ Incollala **solo** in LectureAI (o sul sito ufficiale del provider)
- ✅ Conservala in un posto sicuro (gestore di password, note cifrate)
- ✅ Se sospetti che sia stata rubata, **revocala subito** dal sito del provider
  e creane una nuova

**DA NON FARE:**
- ❌ Non condividerla con amici o su chat (è personale, come una password)
- ❌ Non pubblicarla su GitHub, forum, social, screenshot
- ❌ Non incollarla su siti sconosciuti che "promettono AI gratis"
- ❌ Non mandarla per email

**Come funziona la sicurezza in LectureAI:**
La tua chiave **non viene mai salvata sui nostri server**. Resta nel tuo browser
(tecnicamente `localStorage`), come se fosse un appunto locale. Quando generi
gli appunti, LectureAI la usa solo per quella singola richiesta e poi la dimentica.
Nessuno — né noi né altri utenti — può vederla o usarla.

---
## Stack tecnico

- **Backend**: Flask (Python)
- **Frontend**: HTML / CSS / JavaScript vanilla
- **AI**: Gemini API, Anthropic API, DeepSeek API
- **Rendering formule**: KaTeX
- **Estrazione PDF**: PDF.js
- **Riconoscimento vocale**: Web Speech API (Chrome/Edge)
- **Hosting**: Render (free tier)

---

##  Licenza

Progetto personale a scopo didattico. Sentiti libero di forkarlo e adattarlo
alle tue esigenze. Lascaindo i crediti, o qualche citazione che la base e stata fatta da me. 

Terbiz Prod DC

---
## Crediti
Sviluppato da **Terbiz** con l'assistenza di Claude (Claudio), Deepseek, Gemini.