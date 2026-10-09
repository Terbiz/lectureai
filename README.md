# LectureAI 🎓

**Appunti universitari intelligenti, generati dall'AI.**

LectureAI trasforma lezioni registrate, trascrizioni o PDF in appunti strutturati,
schemi visuali, sommari e flashcard — pronti per lo studio.

---

## ✨ Funzionalità

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

---

## 🚀 Uso

### Versione online (consigliata)

Apri **https://lectureai-nvgr.onrender.com** da qualsiasi dispositivo.

1. Scegli il provider AI dal menu in alto
2. Incolla la tua API key personale e clicca **Salva**
3. Registra la lezione e/o carica il PDF del professore
4. Premi **✨ Genera Appunti AI**

> ⚠️ La API key è tua personale. Non è memorizzata sul server, resta solo nel tuo
> browser (localStorage). Nessuno può vederla né usarla.

### Versione desktop locale

```bash
pip install flask requests pystray pillow
python app.py