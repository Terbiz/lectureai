    // ══════════════════════════════════════════════════════════════
    //  SPA NAVIGATION HELPERS
    // ══════════════════════════════════════════════════════════════
    function showView(viewId) {
      ['view-dashboard', 'view-recorder', 'view-notes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', id === viewId);
      });
      const navMap = {
        'view-dashboard': 'nav-dashboard',
        'view-recorder': 'nav-recorder',
        'view-notes': 'nav-notes'
      };
      Object.keys(navMap).forEach(k => {
        const btn = document.getElementById(navMap[k]);
        if (btn) btn.classList.toggle('active', k === viewId);
      });
      window.scrollTo(0, 0);
    }

    function goToDashboard() { showView('view-dashboard'); }
    function goToRecorder() { showView('view-recorder'); }
    function goToNotes() { showView('view-notes'); }

    function rigenera() {
      generate();
    }

    // ══════════════════════════════════════════════════════════════
    //  MATH NORMALIZATION
    // ══════════════════════════════════════════════════════════════
    const MR = [
      { r: /\b(\w+)\s+elevato\s+(?:alla\s+potenza\s+)?(\w+)/gi, o: '$1^{$2}' },
      { r: /\b(\w+)\s+alla\s+potenza\s+(\w+)/gi, o: '$1^{$2}' },
      { r: /\b(\w+)\s+al\s+quadrato\b/gi, o: '$1^2' },
      { r: /\b(\w+)\s+al\s+cubo\b/gi, o: '$1^3' },
      { r: /radice\s+quadrata\s+(?:di\s+)?(\w+)/gi, o: '\\sqrt{$1}' },
      { r: /radice\s+(?:di\s+)?(\w+)/gi, o: '\\sqrt{$1}' },
      { r: /(\w+)\s+diviso\s+(\w+)/gi, o: '\\frac{$1}{$2}' },
      { r: /sommatoria\s+(?:di\s+)?/gi, o: '\\sum ' },
      { r: /integrale\s+(?:di\s+)?/gi, o: '\\int ' },
      { r: /derivata\s+(?:di\s+)?(\w+)\s+rispetto\s+(?:a\s+)?(\w+)/gi, o: '\\frac{d$1}{d$2}' },
      { r: /limite\s+per\s+(\w+)\s+(?:che\s+)?(?:tende|va)\s+(?:a\s+)?(\w+)/gi, o: '\\lim_{$1\\to $2}' },
      { r: /\b(?:alfa|alpha)\b/gi, o: '\\alpha' }, { r: /\bbeta\b/gi, o: '\\beta' },
      { r: /\bgamma\b/gi, o: '\\gamma' }, { r: /\bdelta\b/gi, o: '\\delta' },
      { r: /\btheta\b/gi, o: '\\theta' }, { r: /\blambda\b/gi, o: '\\lambda' },
      { r: /\bmu\b/gi, o: '\\mu' }, { r: /\b(?:pi\s+greco)\b/gi, o: '\\pi' },
      { r: /\bsigma\b/gi, o: '\\sigma' }, { r: /\bomega\b/gi, o: '\\omega' },
      { r: /\bphi\b/gi, o: '\\phi' }, { r: /\bepsilon\b/gi, o: '\\epsilon' },
      { r: /\bappartiene\s+(?:a\s+)?/gi, o: '\\in ' },
      { r: /\bunione\s+(?:con\s+)?/gi, o: '\\cup ' },
      { r: /\bintersezione\s+(?:con\s+)?/gi, o: '\\cap ' },
      { r: /\bper\s+ogni\b/gi, o: '\\forall ' },
      { r: /\besiste\s+(?:un\s+)?/gi, o: '\\exists ' },
      { r: /\bimplica\b/gi, o: '\\Rightarrow ' },
      { r: /\bse\s+e\s+solo\s+se\b/gi, o: '\\Leftrightarrow ' },
      { r: /\bnumeri\s+reali\b/gi, o: '\\mathbb{R}' },
      { r: /\bnumeri\s+naturali\b/gi, o: '\\mathbb{N}' },
      { r: /\bnumeri\s+complessi\b/gi, o: '\\mathbb{C}' },
      { r: /\bnumeri\s+interi\b/gi, o: '\\mathbb{Z}' },
      { r: /seno\s+(?:di\s+)?/gi, o: '\\sin(' }, { r: /coseno\s+(?:di\s+)?/gi, o: '\\cos(' },
      { r: /tangente\s+(?:di\s+)?/gi, o: '\\tan(' },
      { r: /logaritmo\s+naturale\s+(?:di\s+)?/gi, o: '\\ln(' },
      { r: /logaritmo\s+(?:di\s+)?/gi, o: '\\log(' },
      { r: /\binfinito\b/gi, o: '\\infty' },
      { r: /\bmaggiore\s+(?:o\s+)?uguale\b/gi, o: '\\geq' },
      { r: /\bminore\s+(?:o\s+)?uguale\b/gi, o: '\\leq' },
      { r: /\bdiverso\s+(?:da\s+)?/gi, o: '\\neq ' },
      { r: /\btende\s+a\b/gi, o: '\\to' },
      { r: /o\s+grande\s+(?:di\s+)?/gi, o: 'O(' },
      { r: /vettore\s+(\w+)/gi, o: '\\vec{$1}' },
    ];
    const MT = /elevato|alla\s+potenza|radice\s+quad|integrale|derivata|sommatoria|limite\s+per|seno\s+di|coseno\s+di|infinito|per\s+ogni|appartiene|alfa\b|beta\b|gamma\b|delta\b|theta\b|lambda\b|sigma\b|omega\b|phi\b|sqrt|lim\s|o\s+grande|vettore\s/i;
    function hasMath(t) { return MT.test(t); }
    function normMath(t) { let o = t; for (const r of MR) o = o.replace(r.r, r.o); return o; }

    function compressTranscript(text) {
      let t = text.replace(/\b(uhm+|eh+|ah+|mh+|beh|cioè\s+cioè|allora\s+allora|quindi\s+quindi)\b/gi, ' ');
      t = t.replace(/\b(\w{3,})\s+\1\b/gi, '$1');
      return t.replace(/\s{2,}/g, ' ').trim();
    }

    const LONG_TRANSCRIPT_CHARS = 120000;
    const WORDS_PER_CHUNK = 1500;
    function splitChunks(text) {
      const words = text.split(/\s+/);
      if (words.length <= WORDS_PER_CHUNK * 1.2) return [text];
      const chunks = []; let i = 0;
      while (i < words.length) {
        const slice = words.slice(i, i + WORDS_PER_CHUNK);
        let cut = slice.length;
        for (let j = slice.length - 1; j > slice.length * 0.7; j--) { if (/[.!?]$/.test(slice[j])) { cut = j + 1; break; } }
        chunks.push(slice.slice(0, cut).join(' '));
        i += cut;
      }
      return chunks;
    }

    // ══════════════════════════════════════════════════════════════
    //  STATE
    // ══════════════════════════════════════════════════════════════
    let recObj = null, isRec = false, finalTr = '', interimTr = '', pastedTr = '', tmode = 'live';
    let _lastSRActivity = 0, _srRestartFails = 0, _srWatchdog = null;
    let timerSec = 0, timerInt = null, mathDet = false;
    let uploadedFiles = [];
    let apiKey = '', provider = 'gemini', lastData = null;
    let currentLessonId = null;
    let activeFolderFilter = null;
    let selectedFolderColor = '#3B82F6';
    const FOLDER_PALETTE = ['#3B82F6', '#22C55E', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
    let _lastTruncated = false;
    let _micStream = null;
    // Skill (istruzioni di formato) caricate da static/skills/
    const SKILL_BASE = ['comandi-markdown.md', 'quando-usare-gli-elementi.md']; // sempre attive
    const SKILL_GRAFICI = ['schemi-mermaid.md', 'schemi-mermaid-avanzati.md'];   // opzionali
    const SKILL_SCHEMI_KEY = 'lai_skill_schemi';
    let SKILL_TEXT = {};
    let skillSchemiOn = safeGet(SKILL_SCHEMI_KEY) === 'true';
    let skillsReady = Promise.resolve();

    // Gestione sospensione pagina (iPad/iPhone)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (isRec && recObj) {
      console.log('[SR] Pagina visibile, tentativo di riavvio...');
      try {
        recObj.stop();
      } catch(e) {}
      
      setTimeout(() => {
        if (isRec) {
          try {
            recObj.start();
            toast('Trascrizione riavviata automaticamente', 'ok');
          } catch(e) {
            console.warn('[SR] Riavvio fallito dopo visibilitychange:', e);
          }
        }
      }, 500);
    }
  } else {
    if (isRec) {
      console.log('[SR] Pagina in background, la trascrizione potrebbe fermarsi');
    }
  }
});

    // Avviso prima di uscire: se c'è una registrazione in corso o una bozza di trascrizione
    window.addEventListener('beforeunload', (e) => {
      const hasDraft = !!(finalTr || interimTr || pastedTr);
      if (isRec || hasDraft) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    function getDocFiles() { return uploadedFiles.filter(f => !f.isAudio); }

    // Ping keepalive: avvisa Flask che il browser è ancora aperto
    setInterval(() => { fetch('/api/ping', { method: 'POST' }).catch(() => { }); }, 5000);

    document.getElementById('hdate').textContent =
      new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

    // Chiudi tutti i menu dropdown/popover cliccando fuori
    document.addEventListener('click', () => {
      closeAllDropdowns();
    });

    // ══════════════════════════════════════════════════════════════
    //  SAFE STORAGE — resiste a Safari ITP che blocca localStorage
    // ══════════════════════════════════════════════════════════════
    let _storageBlocked = false;
    function safeGet(k) {
      try { return localStorage.getItem(k); }
      catch (e) {
        if (!_storageBlocked) {
          _storageBlocked = true;
          console.warn('[LectureAI] localStorage bloccato (Safari ITP?)');
        }
        return null;
      }
    }
    function safeSet(k, v) {
      try { localStorage.setItem(k, v); return true; }
      catch (e) {
        if (!_storageBlocked) {
          _storageBlocked = true;
          console.warn('[LectureAI] localStorage bloccato o pieno:', e);
        }
        return false;
      }
    }
    function safeRemove(k) {
      try { localStorage.removeItem(k); }
      catch (e) { /* silenzioso */ }
    }

    // ══════════════════════════════════════════════════════════════
    //  BACKUP TRASCRIZIONE — Auto-Save + Ripristino (Recovery)
    //  La bozza in corso viene salvata periodicamente in localStorage
    //  (chiave: lai_transcript_backup) e recuperata all'avvio se recente.
    // ══════════════════════════════════════════════════════════════
    const TRANS_BACKUP_KEY = 'lai_transcript_backup';
    const TRANS_BACKUP_MAX_AGE = 3 * 60 * 60 * 1000; // backup scaduti dopo 3 ore

    let _transBackupTimer = null;

    // Salva SEMPRE entrambe le caselle (trascrizione Live e testo), qualunque sia la modalità attiva
    function saveTranscriptBackup() {
      syncTranscriptFromUI();
      const live = (finalTr || '') + (interimTr ? ' ' + interimTr : '');
      const text = pastedTr || '';
      if (!live.trim() && !text.trim()) { safeRemove(TRANS_BACKUP_KEY); return; }
      safeSet(TRANS_BACKUP_KEY, JSON.stringify({
        live: finalTr || '',
        interim: interimTr || '',
        text: pastedTr || '',
        timestamp: Date.now()
      }));
    }

    function startTranscriptAutoSave() {
      stopTranscriptAutoSave();
      _transBackupTimer = setInterval(saveTranscriptBackup, 2000);
    }
    function stopTranscriptAutoSave() {
      if (_transBackupTimer) { clearInterval(_transBackupTimer); _transBackupTimer = null; }
    }

    function recoverTranscriptBackup() {
      const raw = safeGet(TRANS_BACKUP_KEY);
      if (!raw) return false;
      let obj = null;
      try { obj = JSON.parse(raw); } catch (e) { safeRemove(TRANS_BACKUP_KEY); return false; }
      const ts = obj ? obj.timestamp : null;
      const fresh = ts && Number.isFinite(ts) && (Date.now() - ts) < TRANS_BACKUP_MAX_AGE;
      if (!fresh) { safeRemove(TRANS_BACKUP_KEY); return false; }
      const str = v => (typeof v === 'string' ? v : '');
      // Formato nuovo: live + text. Formato vecchio (solo final/interim): lo trattiamo come trascrizione Live
      const liveTxt = obj.live !== undefined ? str(obj.live) : str(obj.final);
      const interimTxt = str(obj.interim);
      const textTxt = str(obj.text);
      if (!liveTxt.trim() && !interimTxt.trim() && !textTxt.trim()) { safeRemove(TRANS_BACKUP_KEY); return false; }
      finalTr = liveTxt;
      interimTr = interimTxt;
      pastedTr = textTxt;
      const tp = document.getElementById('tpaste');
      if (tp) tp.value = textTxt;
      renderTbox();
      onPasteInput();
      chkBtn();
      toast('✓ Trascrizione e testo recuperati da un backup recente.', 'ok');
      return true;
    }

    // ══════════════════════════════════════════════════════════════
    //  SISTEMA DI TEMI (light, dark, pink, warm + custom color)
    // ══════════════════════════════════════════════════════════════
    const THEME_KEY = 'lai_theme';
    const CUSTOM_COLOR_KEY = 'lai_custom_theme_color';
    const DARK_KEY = 'lai_darkmode';

    function clearCustomPrimaryVars() {
      const root = document.documentElement;
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--btn-primary');
      root.style.removeProperty('--btn-primary-hover');
      root.style.removeProperty('--primary-soft');
      document.body.style.removeProperty('--primary-color');
      document.body.style.removeProperty('--btn-primary');
      document.body.style.removeProperty('--btn-primary-hover');
      document.body.style.removeProperty('--primary-soft');
    }

    function applyCustomPrimaryVars(color) {
      if (!color) return;
      const root = document.documentElement;
      const soft = hexToRgba(color, 0.12);
      root.style.setProperty('--primary-color', color);
      root.style.setProperty('--btn-primary', color);
      root.style.setProperty('--btn-primary-hover', color);
      root.style.setProperty('--primary-soft', soft);
      document.body.style.setProperty('--primary-color', color);
      document.body.style.setProperty('--btn-primary', color);
      document.body.style.setProperty('--btn-primary-hover', color);
      document.body.style.setProperty('--primary-soft', soft);
    }

    function updateThemeUI(activeTheme, customColor) {
      document.querySelectorAll('#themeSelectorGrid .theme-option-card').forEach(btn => {
        btn.classList.toggle('active', !customColor && btn.getAttribute('data-theme') === activeTheme);
      });
      const customBar = document.getElementById('customThemeBar');
      if (customBar) {
        customBar.classList.toggle('active', !!customColor);
      }
      document.querySelectorAll('.custom-dot').forEach(dot => {
        dot.classList.toggle('active', !!customColor && dot.getAttribute('data-color')?.toLowerCase() === customColor.toLowerCase());
      });
      const picker = document.getElementById('customThemeColorPicker');
      if (picker && customColor) {
        picker.value = customColor;
      }
    }

    function applyThemeClasses(theme) {
      const valid = ['light', 'dark', 'pink', 'warm'].includes(theme) ? theme : 'light';
      document.body.classList.remove('theme-light', 'theme-dark', 'theme-pink', 'theme-warm', 'theme-blue', 'theme-green', 'dark-mode');
      document.body.classList.add('theme-' + valid);
      if (valid === 'dark') {
        document.body.classList.add('dark-mode');
      }
      return valid;
    }

    function loadAppTheme() {
      let savedTheme = safeGet(THEME_KEY);
      if (!savedTheme || savedTheme === 'blue' || savedTheme === 'green') {
        savedTheme = safeGet(DARK_KEY) === 'true' ? 'dark' : 'light';
      }
      const valid = applyThemeClasses(savedTheme);
      const customColor = safeGet(CUSTOM_COLOR_KEY);
      if (customColor) {
        applyCustomPrimaryVars(customColor);
      } else {
        clearCustomPrimaryVars();
      }
      updateThemeUI(valid, customColor);
    }

    // Selezione di un tema predefinito: rimuove e ignora eventuale colore personalizzato
    function setAppTheme(theme) {
      clearCustomPrimaryVars();
      safeRemove(CUSTOM_COLOR_KEY);
      const valid = applyThemeClasses(theme);
      safeSet(THEME_KEY, valid);
      safeSet(DARK_KEY, valid === 'dark' ? 'true' : 'false');
      updateThemeUI(valid, null);
      renderFolders();
      loadHistList();
    }

    // Scelta di un colore primario personalizzato
    function setCustomThemeColor(color) {
      if (!color) return;
      safeSet(CUSTOM_COLOR_KEY, color);
      applyCustomPrimaryVars(color);
      const currentTheme = safeGet(THEME_KEY) || 'light';
      updateThemeUI(currentTheme, color);
      renderFolders();
      loadHistList();
    }

    function toggleDarkMode(enabled) {
      setAppTheme(enabled ? 'dark' : 'light');
    }

    // ══════════════════════════════════════════════════════════════
    //  CARTELLE (lai_folders) E COLORI PASTELLO
    // ══════════════════════════════════════════════════════════════
    const FOLDERS_KEY = 'lai_folders';

    function hexToRgba(hex, alpha) {
      const clean = String(hex || '#3B82F6').replace('#', '');
      if (clean.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getFolders() {
      try { return JSON.parse(safeGet(FOLDERS_KEY) || '[]'); } catch { return []; }
    }

    function saveFolders(folders) {
      safeSet(FOLDERS_KEY, JSON.stringify(folders));
    }

    function selectFolderColor(color) {
      selectedFolderColor = color;
      document.querySelectorAll('#folderColorSwatches .color-swatch').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color') === color);
      });
    }

    function renderFolders() {
      const container = document.getElementById('folders-container');
      if (!container) return;
      const folders = getFolders();
      const isDark = document.body.classList.contains('dark-mode') || document.body.classList.contains('theme-dark');

      if (!folders.length) {
        container.innerHTML = `
          <div class="folder-empty-card" onclick="openFolderModal()">
            <div class="folder-empty-plus">+</div>
            <div class="folder-empty-label">Crea la tua prima cartella</div>
          </div>
        `;
        return;
      }

      const cardsHtml = folders.map(f => {
        const count = Array.isArray(f.lessonIds) ? f.lessonIds.length : 0;
        const isActive = activeFolderFilter === f.id;
        const col = f.color || '#3B82F6';
        const bgAlpha = isActive ? (isDark ? 0.28 : 0.22) : (isDark ? 0.16 : 0.12);
        const borderAlpha = isActive ? 0.85 : 0.45;
        const emoji = f.emoji || f.icon || '📁';

        const swatchesHtml = FOLDER_PALETTE.map(c => `
          <button type="button"
                  class="popover-swatch ${c.toLowerCase() === col.toLowerCase() ? 'active' : ''}"
                  style="background:${c}"
                  onclick="event.stopPropagation(); updateFolderColor('${escHtml(f.id)}', '${c}')"
                  title="Cambia colore"></button>
        `).join('');

        return `
          <div class="folder-card ${isActive ? 'active' : ''}"
               style="background:${hexToRgba(col, bgAlpha)};border-color:${hexToRgba(col, borderAlpha)}"
               onclick="filterByFolder('${escHtml(f.id)}')">
            <div class="folder-card-main">
              <div class="folder-ico" style="color:${escHtml(col)}">${escHtml(emoji)}</div>
              <div style="min-width:0">
                <div class="folder-name">${escHtml(f.name)}</div>
                <div class="folder-count">${count} ${count === 1 ? 'lezione' : 'lezioni'}</div>
              </div>
            </div>
            <div class="folder-card-actions">
              <button type="button" class="folder-color-btn" onclick="event.stopPropagation(); toggleFolderColorPopover(event, '${escHtml(f.id)}')" title="Modifica colore cartella">
                <span class="folder-color-dot" style="background:${escHtml(col)}"></span>
              </button>
              <button type="button" class="folder-del-btn" onclick="event.stopPropagation(); deleteFolder('${escHtml(f.id)}')" title="Elimina cartella">
                <svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
            <div class="folder-color-popover" id="fcol-pop-${escHtml(f.id)}" onclick="event.stopPropagation()">
              ${swatchesHtml}
            </div>
          </div>
        `;
      }).join('');

      const addCardHtml = `
        <div class="folder-empty-card" onclick="openFolderModal()">
          <div class="folder-empty-plus">+</div>
          <div class="folder-empty-label">Nuova cartella</div>
        </div>
      `;

      container.innerHTML = cardsHtml + addCardHtml;
    }

    function toggleFolderColorPopover(e, folderId) {
      e.stopPropagation();
      const targetId = 'fcol-pop-' + folderId;
      const pop = document.getElementById(targetId);
      const wasOpen = pop?.classList.contains('open');
      closeAllDropdowns();
      if (pop && !wasOpen) {
        pop.classList.add('open');
      }
    }

    function updateFolderColor(folderId, newColor) {
      const folders = getFolders();
      const folder = folders.find(f => f.id === folderId);
      if (!folder) return;
      folder.color = newColor;
      saveFolders(folders);
      closeAllDropdowns();
      renderFolders();
      loadHistList();
      toast('Colore cartella aggiornato!', 'ok');
    }

    function openFolderModal() {
      const nameIn = document.getElementById('folderNameInput');
      const iconIn = document.getElementById('folderIconInput');
      if (nameIn) nameIn.value = '';
      if (iconIn) iconIn.value = '📁';
      selectFolderColor('#3B82F6');
      document.getElementById('folderModal')?.classList.add('on');
      setTimeout(() => nameIn?.focus(), 50);
    }

    function closeFolderModal() {
      document.getElementById('folderModal')?.classList.remove('on');
    }

    function selectFolderEmoji(emoji) {
      const iconIn = document.getElementById('folderIconInput');
      if (iconIn) iconIn.value = emoji;
    }

    function confirmCreateFolder() {
      const name = (document.getElementById('folderNameInput')?.value || '').trim();
      const emoji = (document.getElementById('folderIconInput')?.value || '📁').trim() || '📁';
      const color = selectedFolderColor || '#3B82F6';
      if (!name) {
        toast('Inserisci un nome per la cartella.', 'err');
        return;
      }
      const folders = getFolders();
      folders.push({
        id: 'fld_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        name,
        emoji,
        icon: emoji,
        color,
        lessonIds: []
      });
      saveFolders(folders);
      closeFolderModal();
      renderFolders();
      loadHistList();
      toast('Cartella "' + name + '" creata!', 'ok');
    }

    function deleteFolder(folderId) {
      const folders = getFolders().filter(f => f.id !== folderId);
      saveFolders(folders);
      if (activeFolderFilter === folderId) {
        activeFolderFilter = null;
        const clearBtn = document.getElementById('clearFolderFilterBtn');
        if (clearBtn) clearBtn.style.display = 'none';
        const lbl = document.getElementById('history-section-label');
        if (lbl) lbl.textContent = 'Cronologia lezioni';
      }
      renderFolders();
      loadHistList();
      toast('Cartella eliminata.', 'ok');
    }

    function filterByFolder(folderId) {
      if (!folderId || activeFolderFilter === folderId) {
        activeFolderFilter = null;
      } else {
        activeFolderFilter = folderId;
      }
      const clearBtn = document.getElementById('clearFolderFilterBtn');
      const lbl = document.getElementById('history-section-label');
      if (activeFolderFilter) {
        const f = getFolders().find(x => x.id === activeFolderFilter);
        if (clearBtn) clearBtn.style.display = 'inline-block';
        if (lbl) lbl.textContent = f ? `Lezioni in "${f.name}"` : 'Cronologia lezioni';
      } else {
        if (clearBtn) clearBtn.style.display = 'none';
        if (lbl) lbl.textContent = 'Cronologia lezioni';
      }
      renderFolders();
      loadHistList();
    }

    function toggleFolderAssignDropdown(e) {
      e.stopPropagation();
      const menu = document.getElementById('folderAssignMenu');
      const wasOpen = menu?.classList.contains('open');
      closeAllDropdowns();
      if (!menu || wasOpen) return;

      const folders = getFolders();
      if (!folders.length) {
        menu.innerHTML = `
          <div class="dropdown-empty">
            Nessuna cartella creata.<br>
            <button class="btn-text-action" style="margin-top:6px" onclick="closeAllDropdowns(); openFolderModal()">+ Crea cartella</button>
          </div>
        `;
      } else {
        menu.innerHTML = folders.map(f => {
          const isSaved = currentLessonId && Array.isArray(f.lessonIds) && f.lessonIds.includes(currentLessonId);
          const emoji = f.emoji || f.icon || '📁';
          const col = f.color || '#3B82F6';
          return `
            <div class="dropdown-item" onclick="assignCurrentLessonToFolder('${escHtml(f.id)}')">
              <div class="dropdown-item-info">
                <div class="dropdown-item-title">
                  <span style="width:10px;height:10px;border-radius:50%;background:${escHtml(col)};display:inline-block;flex-shrink:0"></span>
                  <span>${escHtml(emoji)} ${escHtml(f.name)}</span>
                </div>
              </div>
              ${isSaved ? '<span style="color:var(--accent);font-weight:700;font-size:0.78rem">✓</span>' : ''}
            </div>
          `;
        }).join('');
      }
      menu.classList.add('open');
    }

    function closeAllDropdowns() {
      document.getElementById('folderAssignMenu')?.classList.remove('open');
      document.getElementById('histDropdownMenu')?.classList.remove('open');
      document.querySelectorAll('.folder-color-popover.open, .lesson-quick-menu.open').forEach(el => {
        el.classList.remove('open');
      });
    }

    function assignCurrentLessonToFolder(folderId) {
      if (!lastData) {
        toast('Nessuna lezione attiva da salvare.', 'err');
        return;
      }
      if (!currentLessonId) {
        saveHist(true);
      }
      assignLessonToFolder(currentLessonId, folderId);
    }

    // Assegna una qualsiasi lezione (anche dalla Dashboard tramite menu "⋮") a una cartella
    function assignLessonToFolder(lessonId, folderId) {
      if (!lessonId) return;
      const folders = getFolders();
      const target = folders.find(f => f.id === folderId);
      if (!target) return;

      // Rimuovi da altre cartelle per mantenere un'associazione chiara al colore, oppure toggle se già presente
      const alreadyInTarget = Array.isArray(target.lessonIds) && target.lessonIds.includes(lessonId);
      folders.forEach(f => {
        if (!Array.isArray(f.lessonIds)) f.lessonIds = [];
        f.lessonIds = f.lessonIds.filter(id => id !== lessonId);
      });

      if (!alreadyInTarget) {
        target.lessonIds.push(lessonId);
        saveFolders(folders);
        closeAllDropdowns();
        renderFolders();
        loadHistList();
        toast(`Lezione assegnata a "${target.name}"!`, 'ok');
      } else {
        saveFolders(folders);
        closeAllDropdowns();
        renderFolders();
        loadHistList();
        toast(`Lezione rimossa da "${target.name}".`, 'ok');
      }
    }

    function toggleLessonQuickMenu(e, lessonId) {
      e.stopPropagation();
      const menuId = 'lqm-' + lessonId;
      const menu = document.getElementById(menuId);
      const wasOpen = menu?.classList.contains('open');
      closeAllDropdowns();
      if (menu && !wasOpen) {
        menu.classList.add('open');
      }
    }

    // ══════════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════════
    (function init() {
      try {
        loadAppTheme();
        const p = safeGet('lai_provider') || 'gemini';
        provider = p; document.getElementById('provSel').value = p;
        const k = safeGet('lai_key_' + p) || '';
        if (k) { apiKey = k; document.getElementById('apiInput').value = k; setAok('ok'); }
      } catch (e) {
        console.warn('[LectureAI] init fallito, uso default:', e);
      }
      document.getElementById('apiInput').placeholder =
        provider === 'gemini' ? 'AIza... o AQ.... (aistudio.google.com)'
          : provider === 'anthropic' ? 'sk-ant-... (console.anthropic.com)'
            : 'sk-... (platform.deepseek.com)';
      try { renderFolders(); } catch (e) { console.warn('[LectureAI] renderFolders fallito:', e); }
      try { loadHistList(); } catch (e) { console.warn('[LectureAI] loadHistList fallito:', e); }
      try { recoverTranscriptBackup(); } catch (e) { console.warn('[LectureAI] Ripristino backup trascrizione fallito:', e); }
      startTranscriptAutoSave();
      skillsReady = loadSkills();
      const skEl = document.getElementById('skSchemi');
      if (skEl) skEl.checked = skillSchemiOn;
    })();

    // ══════════════════════════════════════════════════════════════
    //  API KEY
    // ══════════════════════════════════════════════════════════════
    function onProvChange() {
      provider = document.getElementById('provSel').value;
      safeSet('lai_provider', provider);
      const k = safeGet('lai_key_' + provider) || '';
      document.getElementById('apiInput').value = k; apiKey = k;
      document.getElementById('apiInput').placeholder =
        provider === 'gemini' ? 'AIza... o AQ.... (aistudio.google.com)'
          : provider === 'anthropic' ? 'sk-ant-... (console.anthropic.com)'
            : 'sk-... (platform.deepseek.com)';
      setAok(k ? 'ok' : '');
    }
    // Chiavi Gemini: formato classico (AIza...) e formato nuovo di AI Studio (AQ....)
    function cleanKey(v) { return String(v || '').replace(/[\s\u200B-\u200D\u2060\uFEFF"'`]/g, ''); }
    function isGeminiKey(v) { return /^(AIza|AQ\.)\S{10,}$/.test(v); }
    function onKeyInput() {
      const v = cleanKey(document.getElementById('apiInput').value);
      let ok;
      if (provider === 'gemini') ok = isGeminiKey(v);
      else if (provider === 'anthropic') ok = v.startsWith('sk-ant-');
      else ok = v.startsWith('sk-');
      setAok(v.length > 8 ? (ok ? 'ok' : 'warn') : '');
    }
    function saveKey() {
      const v = cleanKey(document.getElementById('apiInput').value);
      document.getElementById('apiInput').value = v;
      let ok, hint;
      if (provider === 'gemini') { ok = isGeminiKey(v); hint = 'Chiave Gemini: deve iniziare con AIza oppure con AQ. (formato nuovo di AI Studio)'; }
      else if (provider === 'anthropic') { ok = v.startsWith('sk-ant-'); hint = 'Chiave Anthropic: deve iniziare con sk-ant-'; }
      else { ok = v.startsWith('sk-'); hint = 'Chiave DeepSeek: deve iniziare con sk-'; }
      if (!ok) { toast(hint, 'err'); return; }
      apiKey = v; safeSet('lai_key_' + provider, v);
      setAok('ok'); toast('✓ API key salvata!', 'ok');
    }
    function setAok(s) {
      const el = document.getElementById('apiOk'); el.className = 'aok';
      if (s === 'ok') { el.textContent = '✓ Pronta'; el.classList.add('ok'); }
      else if (s === 'warn') { el.textContent = '⚠ Formato?'; el.classList.add('warn'); }
      else el.textContent = '';
    }

    // ══════════════════════════════════════════════════════════════
    //  FILE UPLOAD
    // ══════════════════════════════════════════════════════════════
    function dzOver(e) { e.preventDefault(); document.getElementById('dz').classList.add('over'); }
    function dzLeave() { document.getElementById('dz').classList.remove('over'); }
    function dzDrop(e) { e.preventDefault(); dzLeave(); Array.from(e.dataTransfer.files).forEach(f => loadFile(f)); }
    function onFile(e) { Array.from(e.target.files).forEach(f => loadFile(f)); e.target.value = ''; }

    async function loadFile(file) {
      if (uploadedFiles.find(f => f.name === file.name)) { toast('⚠ "' + file.name + '" già caricato', 'err'); return; }
      
      let fileType = file.type || '';
      const fileName = (file.name || '').toLowerCase();
      
      if (!fileType || fileType === 'application/octet-stream') {
        if (/\.(m4a|mp3|wav|aac|ogg|webm|mp4)$/i.test(fileName)) {
          fileType = 'audio/' + fileName.split('.').pop();
        }
      }

      const isAudio = fileType.startsWith('audio/') || /\.(m4a|mp3|wav|mp4|webm|aac|ogg)$/i.test(fileName);

      if (isAudio) {
        uploadedFiles.push({
          name: file.name, file: file, isAudio: true,
          info: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        });
        renderFileList(); chkBtn();
        toast('✓ Audio "' + file.name + '" caricato. Verrà trascritto prima di generare.', 'ok');
        return;
      }

      try {
        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        let txt, pages;
        if (isPdf) {
          toast('Estrazione testo da "' + file.name + '"...', 'ok');
          const buf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          pages = pdf.numPages;
          const parts = [];
          for (let p = 1; p <= pages; p++) {
            const page = await pdf.getPage(p);
            const content = await page.getTextContent();
            const pageTxt = content.items.map(it => it.str).join(' ').replace(/\s{2,}/g, ' ').trim();
            parts.push('[Slide ' + p + ']\n' + pageTxt);
          }
          txt = parts.join('\n\n');
          if (!txt.replace(/\[Slide \d+\]/g, '').trim()) {
            throw new Error('Nessun testo estraibile: il PDF sembra fatto di immagini/scansioni senza testo selezionabile.');
          }
        } else {
          txt = await file.text();
          pages = Math.ceil(txt.length / 2500);
        }
        if (txt.length > 90000) txt = txt.slice(0, 90000) + '\n[...troncato...]';
        uploadedFiles.push({
          name: file.name, txt, pages, isAudio: false,
          info: pages + ' pag. · ' + Math.round(txt.length / 1000) + 'k'
        });
        renderFileList(); chkBtn();
        toast('✓ "' + file.name + '" caricato (' + pages + ' pag.)', 'ok');
      } catch (err) { toast('Errore: ' + err.message, 'err'); }
    }

    const SVG_DOC_ICON = '<svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
    const SVG_AUDIO_ICON = '<svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';

    function renderFileList() {
      const list = document.getElementById('fileList');
      const dz = document.getElementById('dz');
      if (!uploadedFiles.length) {
        list.innerHTML = '';
        dz.classList.remove('has-files');
        document.getElementById('dzTxt').innerHTML = 'Trascina qui i tuoi file<br><small>PDF · TXT · MD · Audio</small>';
        return;
      }
      dz.classList.add('has-files');
      document.getElementById('dzTxt').innerHTML = uploadedFiles.length + ' file caricato' + (uploadedFiles.length > 1 ? 'i' : '')
        + '<br><small>trascina altri o clicca per aggiungere</small>';
      list.innerHTML = uploadedFiles.map((f, i) =>
        '<div class="file-item">'
        + '<span class="fi-ico">' + (f.isAudio ? SVG_AUDIO_ICON : SVG_DOC_ICON) + '</span>'
        + '<span class="fi-name" title="' + escHtml(f.name) + '">' + escHtml(f.name) + '</span>'
        + '<span class="fi-info">' + f.info + '</span>'
        + '<button class="fi-rm" onclick="rmFile(' + i + ')" title="Rimuovi">✕</button>'
        + '</div>'
      ).join('');
    }
    function rmFile(i) { uploadedFiles.splice(i, 1); renderFileList(); chkBtn(); }

    // Allinea le variabili a ciò che si vede nelle caselle: dopo un ricaricamento il browser
    // può rimettere il testo nella casella senza segnalarlo (nessun evento "input").
    function syncTranscriptFromUI() {
      if (isRec) return;   // durante la registrazione le variabili sono già la fonte aggiornata
      const tp = document.getElementById('tpaste');
      if (tp && tp.value !== pastedTr) pastedTr = tp.value;
      // La casella Live è aggiornata solo in modalità Live: in modalità Testo potrebbe essere vecchia
      const tbox = document.getElementById('tbox');
      if (tmode === 'live' && tbox && !tbox.querySelector('.tbox-ph')) {
        const visible = extractFinalText(tbox);
        if (visible !== finalTr) finalTr = visible;
      }
    }

    function chkBtn() {
      syncTranscriptFromUI();
      const hasTr = ((finalTr + interimTr + pastedTr).trim().length > 15);
      const hasPdf = uploadedFiles.length > 0;
      const b = document.getElementById('genBtn');
      b.disabled = !(hasTr || hasPdf);
      if (hasTr && hasPdf) b.textContent = 'Genera Appunti Integrati';
      else if (hasPdf) b.textContent = 'Genera Appunti dal PDF';
      else b.textContent = 'Genera Appunti';
      const words = finalTr.trim().split(/\s+/).filter(Boolean).length;
      const badge = document.getElementById('tkBadge');
      if (words > 9000) {
        badge.innerHTML = `⚠ Trascrizione lunga (${words.toLocaleString()} parole) — elaborazione a blocchi`;
        badge.classList.add('on');
      } else if (words > 7000) {
        badge.innerHTML = `${words.toLocaleString()} parole — vicino alla soglia per l'elaborazione a blocchi`;
        badge.classList.add('on');
      } else badge.classList.remove('on');
    }

    // ══════════════════════════════════════════════════════════════
    //  SPEECH RECOGNITION
    // ══════════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', () => {
      const sel = document.getElementById('langSel');
      if (sel) {
        sel.addEventListener('change', () => {
          if (isRec) {
            console.log('[SR] Lingua cambiata durante la registrazione:', sel.value);
          }
          try {
            if (recObj) {
              try { recObj.stop(); } catch(_) {}
              try { recObj.onend = null; recObj.onerror = null; recObj.onresult = null; } catch(_) {}
            }
            recObj = null;
            buildRecObj();
            console.log('[SR] Oggetto ricreato con lingua:', sel.value);
          } catch (e) {
            console.warn('[SR] Errore ricreando oggetto:', e);
          }
        });
      }
    });
    function toggleRec() { isRec ? pauseRec() : startRec(); }

    async function startRec() {
      const hasSR = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
      if (!hasSR) {
        toast('Usa Chrome, Edge o Safari — questo browser non supporta la registrazione vocale.', 'err');
        return;
      }
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      if (!isSecure) {
        toast('Apri il sito su http://localhost:5000 (non su 127.0.0.1).', 'err');
        return;
      }
      if (isRec) return;

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isSafari && isIOS) {
        toast('Su Safari/iPad: tieni la pagina in primo piano. Se esci dal browser la trascrizione potrebbe interrompersi.', 'ok');
      }

      if (!_micStream) {
        try {
          _micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          if (err.name === 'NotAllowedError')
            toast('Permesso microfono negato. Clicca il lucchetto in alto a sinistra → Microfono → Consenti.', 'err');
          else if (err.name === 'NotFoundError')
            toast('Nessun microfono trovato. Collega un microfono e riprova.', 'err');
          else
            toast('Errore microfono: ' + err.message, 'err');
          return;
        }
      }

      const track = _micStream.getAudioTracks()[0];
      if (track && !track.onended) {
        track.onended = () => {
          if (isRec) {
            toast('Il microfono si è disconnesso. Ricollegalo e premi di nuovo Registra.', 'err');
            _micStream = null;
            stopRec();
          }
        };
      }

      isRec = true;
      _srRestartFails = 0;
      _lastSRActivity = Date.now();
      document.getElementById('recBtn').classList.add('on');
      document.getElementById('recLbl').textContent = 'In Registrazione...';
      document.getElementById('stopBtn').style.display = 'block';
      document.getElementById('tmr').classList.add('on');
      startTimer();
      startSRWatchdog();

      if (!recObj) buildRecObj();
      try { recObj.start(); } catch (e) { console.warn('[SR start]', e.message); }
    }

    function buildRecObj() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recObj = new SR();
      recObj.lang = document.getElementById('langSel').value;
      recObj.continuous = true; recObj.interimResults = true; recObj.maxAlternatives = 1;

      recObj.onresult = (e) => {
        _lastSRActivity = Date.now(); _srRestartFails = 0;
        let newFinal = '';
        interimTr = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            newFinal += t + ' ';
            if (hasMath(t)) { mathDet = true; document.getElementById('mathBadge').classList.add('on'); }
          } else interimTr += t;
        }
        if (newFinal) {
          finalTr += newFinal;
          appendFinalToTbox(newFinal);
        }
        updateInterimTbox(interimTr);
        chkBtn();
      };

      recObj.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          isRec = false;
          stopSRWatchdog();
          document.getElementById('recBtn').classList.remove('on');
          document.getElementById('recLbl').textContent = 'Inizia Registrazione';
          document.getElementById('stopBtn').style.display = 'none';
          document.getElementById('tmr').classList.remove('on');
          stopTimer();
          toast('Permesso revocato. Aggiorna la pagina e riprova.', 'err');
        } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('[SR]', e.error);
        }
      };

      const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      recObj.onend = () => {
        if (!isRec) return;

        if (interimTr && interimTr.trim()) {
          const pending = interimTr.trim() + ' ';
          finalTr += pending;
          appendFinalToTbox(pending);
          interimTr = '';
          updateInterimTbox('');
          chkBtn();
        }

        const restartDelay = isSafariIOS ? 1200 : 300;

        setTimeout(() => {
          if (!isRec) return;
          try {
            recObj.start();
            _srRestartFails = 0;
          } catch (err) {
            _srRestartFails++;
            if (_srRestartFails >= 3) {
              console.warn('[SR] ricreo oggetto dopo riavvii falliti');
              try { recObj.onend = null; recObj.onerror = null; recObj.onresult = null; } catch (_) { }
              buildRecObj();
              try { recObj.start(); } catch (_) { }
              _srRestartFails = 0;
            }
          }
        }, restartDelay);
      };
    }

    function startSRWatchdog() {
      stopSRWatchdog();
      _srWatchdog = setInterval(() => {
        if (!isRec) return;
        const silentFor = Date.now() - _lastSRActivity;
        if (silentFor > 25000) {
          _lastSRActivity = Date.now();
          toast('Trascrizione bloccata, riavvio automatico in corso...', 'ok');
          try { recObj.stop(); } catch (_) { }
          try { recObj.onend = null; recObj.onerror = null; recObj.onresult = null; } catch (_) { }
          buildRecObj();
          setTimeout(() => { if (isRec) { try { recObj.start(); } catch (_) { } } }, 300);
        }
      }, 8000);
    }
    function stopSRWatchdog() {
      if (_srWatchdog) { clearInterval(_srWatchdog); _srWatchdog = null; }
    }

    function pauseRec() {
      if (!isRec) return;
      isRec = false;
      stopSRWatchdog();
      if (recObj) { try { recObj.stop(); } catch (_) { } }
      document.getElementById('recBtn').classList.remove('on');
      document.getElementById('recLbl').textContent = 'Riprendi';
      stopTimer();
    }

    function stopRec() {
      if (interimTr && interimTr.trim() && !document.getElementById('tbox').querySelector('.tbox-ph')) {
        finalTr += interimTr + ' ';
        interimTr = '';
        renderTbox();
      }
      isRec = false;
      stopSRWatchdog();
      if (recObj) { try { recObj.stop(); } catch (_) { } }
      document.getElementById('recBtn').classList.remove('on');
      document.getElementById('recLbl').textContent = 'Inizia Registrazione';
      document.getElementById('stopBtn').style.display = 'none';
      document.getElementById('tmr').classList.remove('on');
      stopTimer(); chkBtn();
    }

    function renderTbox() {
      if (tmode !== 'live') return;
      const tbox = document.getElementById('tbox');
      tbox.innerHTML = '';
      if (!finalTr && !interimTr) {
        const ph = document.createElement('span');
        ph.className = 'tbox-ph';
        ph.style.color = 'var(--muted)';
        ph.style.fontStyle = 'italic';
        ph.textContent = 'La trascrizione apparirà qui durante la registrazione...';
        tbox.appendChild(ph);
        return;
      }
      if (finalTr) tbox.appendChild(document.createTextNode(finalTr));
      if (interimTr) {
        const inter = document.createElement('span');
        inter.className = 'interim';
        inter.setAttribute('contenteditable', 'false');
        inter.textContent = interimTr;
        tbox.appendChild(inter);
      }
      tbox.scrollTop = tbox.scrollHeight;
    }

    function onTboxEdit() {
      if (tmode !== 'live') return;
      const tbox = document.getElementById('tbox');
      const ph = tbox.querySelector('.tbox-ph');
      if (ph) ph.remove();
      finalTr = extractFinalText(tbox);
      if (hasMath(finalTr)) { mathDet = true; document.getElementById('mathBadge').classList.add('on'); }
      chkBtn();
    }

    function extractFinalText(tbox) {
      const clone = tbox.cloneNode(true);
      clone.querySelectorAll('.interim, .tbox-ph').forEach(n => n.remove());
      return clone.textContent;
    }

    function appendFinalToTbox(text) {
      if (tmode !== 'live') return;
      const tbox = document.getElementById('tbox');
      const ph = tbox.querySelector('.tbox-ph');
      if (ph) ph.remove();
      const atBottom = tbox.scrollTop + tbox.clientHeight >= tbox.scrollHeight - 40;
      let inter = tbox.querySelector('.interim');
      if (inter) inter.remove();
      tbox.appendChild(document.createTextNode(text));
      if (inter) tbox.appendChild(inter);
      if (atBottom) tbox.scrollTop = tbox.scrollHeight;
    }

    function updateInterimTbox(text) {
      if (tmode !== 'live') return;
      const tbox = document.getElementById('tbox');
      let inter = tbox.querySelector('.interim');
      if (!text) {
        if (inter) inter.textContent = '';
        return;
      }
      if (!inter) {
        inter = document.createElement('span');
        inter.className = 'interim';
        inter.setAttribute('contenteditable', 'false');
        tbox.appendChild(inter);
      }
      inter.textContent = text;
      const atBottom = tbox.scrollTop + tbox.clientHeight >= tbox.scrollHeight - 40;
      if (atBottom) tbox.scrollTop = tbox.scrollHeight;
    }

    function setTmode(m) {
      tmode = m;
      document.getElementById('tmodeLive').classList.toggle('on', m === 'live');
      document.getElementById('tmodeText').classList.toggle('on', m === 'text');
      document.getElementById('tbox').style.display = m === 'live' ? 'block' : 'none';
      document.getElementById('tpaste').style.display = m === 'text' ? 'block' : 'none';
      document.getElementById('tpaste-info').style.display = m === 'text' ? 'block' : 'none';
      if (m === 'live') renderTbox();
      chkBtn();
    }

    function clearTranscript() {
      finalTr = '';
      interimTr = '';
      pastedTr = '';
      safeRemove(TRANS_BACKUP_KEY);
      renderTbox();
      chkBtn();
      toast('Trascrizione svuotata.', 'ok');
    }

    function copyTranscript() {
      let text = '';
      if (tmode === 'live') {
        text = (finalTr + (interimTr ? ' ' + interimTr : '')).trim();
      } else {
        text = (pastedTr || '').trim();
      }

      if (!text) { toast('Niente da copiare: la trascrizione è vuota.', 'err'); return; }

      navigator.clipboard.writeText(text)
        .then(() => {
          safeRemove(TRANS_BACKUP_KEY);
          const words = text.split(/\s+/).filter(Boolean).length;
          toast(`✓ Copiato (${words.toLocaleString('it')} parole)`, 'ok');
        })
        .catch(err => {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            safeRemove(TRANS_BACKUP_KEY);
            toast(`✓ Copiato`, 'ok');
          } catch (_) {
            toast('Impossibile copiare: ' + err.message, 'err');
          }
          document.body.removeChild(ta);
        });
    }

    function onPasteInput() {
      pastedTr = document.getElementById('tpaste').value;
      const wc = pastedTr.trim() ? pastedTr.trim().split(/\s+/).length : 0;
      document.getElementById('tpaste-info').textContent = wc ? `${wc.toLocaleString('it')} parole` : '';
      chkBtn();
    }

    function onTextDrop(e) {
      e.preventDefault();
      document.getElementById('tpaste').classList.remove('drag-over');
      const txt = e.dataTransfer.getData('text/plain');
      if (txt) {
        const ta = document.getElementById('tpaste');
        ta.value = ta.value ? ta.value + '\n\n' + txt : txt;
        onPasteInput();
      }
    }

    function escHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function startTimer() {
      timerSec = 0;
      timerInt = setInterval(() => {
        timerSec++;
        const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
        const s = String(timerSec % 60).padStart(2, '0');
        document.getElementById('tmr').textContent = m + ':' + s;
        if (timerSec % 30 === 0) chkBtn();
      }, 1000);
    }
    function stopTimer() { clearInterval(timerInt); }

    // ══════════════════════════════════════════════════════════════
    //  CRONOLOGIA (localStorage)
    // ══════════════════════════════════════════════════════════════
    const HIST_KEY = 'lai_history';

    function getHist() {
      try {
        const arr = JSON.parse(safeGet(HIST_KEY) || '[]');
        let mutated = false;
        arr.forEach((item, idx) => {
          if (!item.id) {
            item.id = 'les_' + idx + '_' + Date.now();
            mutated = true;
          }
        });
        if (mutated) safeSet(HIST_KEY, JSON.stringify(arr));
        return arr;
      } catch {
        return [];
      }
    }

    function findFolderForLesson(lessonId) {
      if (!lessonId) return null;
      const folders = getFolders();
      if (activeFolderFilter) {
        const activeF = folders.find(f => f.id === activeFolderFilter);
        if (activeF && Array.isArray(activeF.lessonIds) && activeF.lessonIds.includes(lessonId)) {
          return activeF;
        }
      }
      return folders.find(f => Array.isArray(f.lessonIds) && f.lessonIds.includes(lessonId)) || null;
    }

    function loadHistList() {
      const hist = getHist();
      const folders = getFolders();
      const container = document.getElementById('history-list-container');
      const isDark = document.body.classList.contains('dark-mode') || document.body.classList.contains('theme-dark');

      if (container) {
        let filtered = hist.map((s, originalIdx) => ({ ...s, originalIdx }));
        if (activeFolderFilter) {
          const folder = folders.find(f => f.id === activeFolderFilter);
          const allowedIds = new Set(folder?.lessonIds || []);
          filtered = filtered.filter(s => allowedIds.has(s.id));
        } else {
          // Mostra solo le ultime 6 lezioni generate
          filtered = filtered.slice(0, 6);
        }

        if (!filtered.length) {
          container.innerHTML = `
            <div class="dash-empty-history">
              ${activeFolderFilter ? 'Nessuna lezione salvata in questa cartella.' : 'Nessuna lezione generata di recente. Premi "+ Nuova Lezione" per iniziare.'}
            </div>
          `;
        } else {
          container.innerHTML = filtered.map(s => {
            const folder = findFolderForLesson(s.id);
            const col = folder?.color || null;
            const cardStyle = col
              ? `background:${hexToRgba(col, isDark ? 0.2 : 0.12)};border-color:${hexToRgba(col, 0.48)}`
              : '';
            const badgeStyle = col
              ? `background:${hexToRgba(col, isDark ? 0.32 : 0.2)};color:${isDark ? '#F1F5F9' : col}`
              : '';
            const folderTag = folder
              ? `<span style="font-size:0.75rem;margin-right:4px">${escHtml(folder.emoji || folder.icon || '📁')}</span>`
              : '';

            let quickMenuItems = '';
            if (!folders.length) {
              quickMenuItems = `
                <div class="dropdown-empty">
                  Nessuna cartella.<br>
                  <button type="button" class="btn-text-action" style="margin-top:4px" onclick="event.stopPropagation(); closeAllDropdowns(); openFolderModal()">+ Crea cartella</button>
                </div>
              `;
            } else {
              quickMenuItems = `<div class="lesson-quick-menu-head">Assegna a cartella</div>` + folders.map(f => {
                const isAssigned = Array.isArray(f.lessonIds) && f.lessonIds.includes(s.id);
                const fCol = f.color || '#3B82F6';
                const fEmoji = f.emoji || f.icon || '📁';
                return `
                  <div class="dropdown-item" onclick="event.stopPropagation(); assignLessonToFolder('${escHtml(s.id)}', '${escHtml(f.id)}')">
                    <div class="dropdown-item-info">
                      <div class="dropdown-item-title">
                        <span style="width:9px;height:9px;border-radius:50%;background:${escHtml(fCol)};display:inline-block;flex-shrink:0"></span>
                        <span>${escHtml(fEmoji)} ${escHtml(f.name)}</span>
                      </div>
                    </div>
                    ${isAssigned ? '<span style="color:var(--accent);font-weight:700;font-size:0.78rem">✓</span>' : ''}
                  </div>
                `;
              }).join('');
            }

            return `
              <div class="lesson-card" style="${cardStyle}" onclick="loadHist(${s.originalIdx})">
                <div>
                  <div class="lesson-card-top">
                    <span class="lesson-badge" style="${badgeStyle}">${folderTag}${escHtml(s.subject || 'Lezione')}</span>
                    <div class="lesson-card-top-right">
                      <span class="lesson-date">${escHtml(s.date || '')}</span>
                      <button type="button" class="lesson-more-btn" onclick="toggleLessonQuickMenu(event, '${escHtml(s.id)}')" title="Salva in cartella">⋮</button>
                      <div class="lesson-quick-menu" id="lqm-${escHtml(s.id)}" onclick="event.stopPropagation()">
                        ${quickMenuItems}
                      </div>
                    </div>
                  </div>
                  <h3 style="margin-top:12px">${escHtml(s.title || 'Senza titolo')}</h3>
                  <p style="margin-top:6px">${escHtml((s.data?.summary?.overview || '').slice(0, 110))}${(s.data?.summary?.overview || '').length > 110 ? '...' : ''}</p>
                </div>
                <div class="lesson-card-foot">
                  <span style="${col && !isDark ? 'color:' + escHtml(col) : ''}">Apri appunti →</span>
                  <button class="hist-btn" onclick="event.stopPropagation(); deleteHist(${s.originalIdx})" title="Elimina sessione">
                    <svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // Popola il menu custom "Cronologia appunti" nella vista Notes
      const histMenu = document.getElementById('histDropdownMenu');
      if (histMenu) {
        if (!hist.length) {
          histMenu.innerHTML = '<div class="dropdown-empty">Nessun appunto salvato</div>';
        } else {
          histMenu.innerHTML = hist.map((s, i) => `
            <div class="dropdown-item" onclick="loadHist(${i})">
              <div class="dropdown-item-info">
                <div class="dropdown-item-title">${escHtml(s.title || 'Senza titolo')}</div>
                <div class="dropdown-item-sub">${escHtml(s.date || '')} · ${escHtml(s.subject || 'Lezione')}</div>
              </div>
              <button class="folder-del-btn" onclick="event.stopPropagation(); deleteHist(${i})" title="Elimina">
                <svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `).join('');
        }
      }

      const sel = document.getElementById('histSel');
      if (sel) {
        sel.innerHTML = '<option value="">Cronologia appunti</option>';
        hist.forEach((s, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `${s.date} — ${s.title || 'Senza titolo'}`;
          sel.appendChild(opt);
        });
      }
    }

    function toggleHistDropdown(e) {
      e.stopPropagation();
      const menu = document.getElementById('histDropdownMenu');
      const wasOpen = menu?.classList.contains('open');
      closeAllDropdowns();
      if (menu && !wasOpen) {
        menu.classList.add('open');
      }
    }

    function saveHist(silent) {
      if (!lastData) {
        if (!silent) toast('Prima genera degli appunti da salvare.', 'err');
        return;
      }
      const hist = getHist();
      const newId = 'les_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      currentLessonId = newId;
      const entry = {
        id: newId,
        date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
        title: lastData.title || 'Senza titolo',
        subject: lastData.subject || '',
        transcript: finalTr,
        data: lastData,
      };
      hist.unshift(entry);
      if (hist.length > 30) hist.length = 30;
      if (!safeSet(HIST_KEY, JSON.stringify(hist))) {
        currentLessonId = null;
        toast('⚠ Memoria del browser piena: la lezione non è stata salvata in cronologia. Elimina le sessioni vecchie.', 'err');
        return false;
      }
      loadHistList();
      const lbl = document.getElementById('histDropdownLabel');
      if (lbl) lbl.textContent = entry.title;
      if (!silent) toast('✓ Sessione salvata in cronologia!', 'ok');
      return true;
    }

    function loadHist(idxParam) {
      let idx = idxParam;
      if (idx === undefined) {
        const sel = document.getElementById('histSel');
        if (!sel || sel.value === '') return;
        idx = sel.value;
      }
      const hist = getHist();
      const entry = hist[parseInt(idx)];
      if (!entry) return;
      lastData = entry.data;
      currentLessonId = entry.id;
      if (entry.transcript) { finalTr = entry.transcript; interimTr = ''; renderTbox(); }
      safeRemove(TRANS_BACKUP_KEY);
      const lbl = document.getElementById('histDropdownLabel');
      if (lbl) lbl.textContent = entry.title || 'Cronologia appunti';
      closeAllDropdowns();
      renderAll(entry.data).then(() => {
        document.getElementById('xbar').style.display = 'flex';
        toast('✓ Sessione "' + entry.title + '" ripristinata', 'ok');
        goToNotes();
      });
    }

    function deleteHist(idxParam) {
      let idx = idxParam;
      if (idx === undefined) {
        const sel = document.getElementById('histSel');
        if (!sel || sel.value === '') { toast('Seleziona una sessione da eliminare.', 'err'); return; }
        idx = sel.value;
      }
      const hist = getHist();
      const removed = hist.splice(parseInt(idx), 1)[0];
      safeSet(HIST_KEY, JSON.stringify(hist));
      if (removed && removed.id) {
        const folders = getFolders();
        folders.forEach(f => {
          if (Array.isArray(f.lessonIds)) {
            f.lessonIds = f.lessonIds.filter(id => id !== removed.id);
          }
        });
        saveFolders(folders);
        renderFolders();
      }
      loadHistList();
      toast('Sessione eliminata.', 'ok');
    }

    // ══════════════════════════════════════════════════════════════
    //  TABS
    // ══════════════════════════════════════════════════════════════
    function goTab(n) {
      const ns = ['notes', 'diagrams', 'summary', 'flash'];
      document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('on', ns[i] === n));
      document.querySelectorAll('.pane').forEach(p => p.classList.remove('on'));
      document.getElementById('p-' + n).classList.add('on');
    }

    // ══════════════════════════════════════════════════════════════
    //  PROMPT SYSTEM — base comune + pannello disciplina
    // ══════════════════════════════════════════════════════════════

    const BASE_SYS = `Sei un assistente accademico universitario multidisciplinare.
Trasformi la trascrizione di una lezione in appunti universitari completi, fedeli, chiari e facili da ripassare, adattando il formato alla disciplina.
Rispondi ESCLUSIVAMENTE con JSON valido: nessun testo fuori dal JSON e nessun recinto di codice attorno al JSON.

Schema JSON (rispetta quest'ordine dei campi):
{
  "title": "Titolo che dice di cosa parla la lezione",
  "subject": "Materia (disciplina accademica riconoscibile)",
  "key_topics": ["t1","t2","t3"],
  "lecture_outline": {
    "tesi": "l'idea centrale della lezione in 1-2 frasi",
    "sequenza": ["argomenti nell'ordine in cui il professore li tratta"],
    "elenchi_numerati": ["ogni elenco di N elementi della lezione, es. N fasi: F1 ..., F2 ..., F3 ..."],
    "termini_corretti": [{"sentito":"forma trascritta","corretto":"termine corretto"}],
    "dubbi": ["termini non riconoscibili, riportati come sentiti"]
  },
  "pdf_alignment": "posizione nel PDF se presente, stringa vuota altrimenti",
  "notes_md": "appunti in Markdown Obsidian che seguono lecture_outline, le regole sotto e le skill",
  "diagrams": [
    {"type":"flowchart","title":"Titolo","nodes":[{"id":"A","label":"Passo A","shape":"rect"},{"id":"B","label":"Condizione?","shape":"diamond"}],"edges":[{"from":"A","to":"B","label":""}]},
    {"type":"mindmap","title":"Mappa","root":"Argomento","children":[{"label":"Concetto A","children":[{"label":"Dettaglio 1"}]},{"label":"Concetto B","children":[]}]}
  ],
  "summary": {
    "overview": "3-4 frasi",
    "key_points": ["p1","p2","p3","p4","p5"],
    "definitions": [{"term":"termine","def":"definizione"}],
    "difficulty": "Base|Intermedio|Avanzato",
    "missing_from_lecture": "parti del PDF non trattate, stringa vuota se non c'è PDF"
  },
  "flashcards": [{"question":"q","answer":"a"}]
}

═══ ISTRUZIONI SPECIFICHE PER QUESTA DISCIPLINA ═══
{DISCIPLINE_PANEL}

═══ 1. FEDELTÀ (priorità massima) ═══
- La trascrizione è automatica e può contenere errori di riconoscimento vocale. Prima di scrivere notes_md, compila lecture_outline.
- Se un termine è chiaramente la storpiatura di un termine noto e il contesto non lascia dubbi, scrivi il termine corretto e annotalo in termini_corretti.
- Se non sei sicuro, riporta la forma sentita seguita da [?] e aggiungila a dubbi. Non indovinare.
- Riporta i riferimenti specifici che il professore cita: nomi propri, titoli, date, numeri, sigle, casi, esempi, aneddoti (questi ultimi in 1-2 frasi). Non sostituirli con formule generiche come "alcuni autori sostengono".
- Non aggiungere strumenti, autori, esempi o fonti che il professore non ha citato, anche se pertinenti.
- Se la lezione elenca N livelli, fasi, tipi o autori, negli appunti ce ne sono esattamente N, nello stesso ordine e senza accorparli.
- Non trasformare un concetto detto a parole in una formula, in codice o in dati che il professore non ha dato: una formula entra negli appunti solo se nella lezione c'è davvero.
- Ometti il rumore: comunicazioni organizzative, battute, divagazioni non legate all'argomento.

═══ 2. STRUTTURA E FORMATO ═══
- notes_md segue lecture_outline.sequenza: una sezione ## per argomento, nell'ordine della lezione (di solito 5-10 sezioni). Il titolo # lo aggiunge l'app.
- Se la lezione è costruita su una progressione (livelli, fasi, passi), quella è la spina dorsale degli appunti: ha una sezione sua e, se gli schemi sono attivi, uno schema.
- Hai a disposizione tutta la sintassi di Obsidian descritta nelle skill (evidenze colorate, callout, tabelle, frecce, note a piè di pagina, link, tag, formule, codice, schemi). Usa ogni strumento quando rende gli appunti più chiari, scegliendolo come indicano le skill.
- Scrivi in Markdown; l'HTML solo nei casi previsti dalla skill comandi-markdown.
- Codice in blocchi solo per materie tecniche. Formule LaTeX solo per formule presenti nella lezione: inline $...$, display $$...$$. Nel JSON ogni backslash va raddoppiato (es. \\\\frac).
- Riferimenti al PDF: una riga che inizia con 📄 p.X: ...

═══ 3. ALTRI CAMPI ═══
- diagrams: [] se sotto ci sono le skill degli schemi (gli schemi vanno in notes_md come blocchi mermaid). Altrimenti da 1 a 3 diagrammi, solo per processi o gerarchie presenti nella lezione.
- flashcards: almeno 7, su concetti della lezione.
- Tutto in italiano.`;

    const PRESET_PANELS = {
      informatica: `DISCIPLINA: Informatica / Ingegneria / Scienze informatiche.
Riferimenti tipici da preservare: nomi di algoritmi, tecnologie, framework,
progetti, aziende informatiche, sigle tecniche (es. EDP, SLA, OLTP, WIP, API, MVC),
complessità asintotiche (Θ, O, Ω), nomi di pattern.
Formato: formule matematiche in LaTeX quando presenti; blocchi di codice per
esempi; diagrammi flowchart per algoritmi/processi, mindmap per architetture.
Se il prof descrive N livelli/fasi di maturità, mantienili tutti numerati.`,

      medicina: `DISCIPLINA: Medicina / Biologia / Scienze della salute.
Riferimenti tipici: nomenclature anatomiche e cliniche, sigle (ICD, Glasgow, ASA,
NYHA, GCS), nomi di patologie, farmaci (nome commerciale e principio attivo),
scala di valori, linee guida (nazionali, internazionali, es. OMS).
Formato: formule/chimica in LaTeX quando utile; diagrammi flow per iter diagnostico
e terapie; mindmap per sistemi/apparati. Cita SEMPRE i nomi clinici completi.
NON inventare dosaggi, valori, nomi di farmaci: se il prof non li ha detti,
non aggiungerli. Il rischio clinico è alto.`,

      giurisprudenza: `DISCIPLINA: Giurisprudenza / Diritto / Scienze giuridiche.
Riferimenti tipici: articoli di legge (es. "art. 2043 c.c.", "art. 575 c.p."),
codici (c.c., c.p., c.p.c., c.p.p., Cost., TUE, TFUE), sentenze (es. "Cass. SS.UU.
12345/2020"), dottrina (Carnelutti, Satta, Criscuolo, ecc.), istituti giuridici,
principi generali dell'ordinamento.
Formato: NIENTE LaTeX. Corsivo *...* per i termini latini (es. *pacta sunt servanda*).
Diagrammi: mindmap per mappe di istituti; flowchart per iter processuali.
Citare le norme ESATTAMENTE come pronunciate dal prof (numero + fonte).`,

      economia: `DISCIPLINA: Economia / Management / Marketing / Finanza / Aziendale.
Riferimenti tipici: modelli economici (es. domanda-offerta, curva IS-LM, CAPM),
scuole di pensiero (Keynes, Friedman, Chicago, Harvard), indicatori (PIL, ROI,
EBITDA, WACC), teorie di management (Porter, SWOT, BCG), casi aziendali reali.
Formato: LaTeX per formule quantitative (rendimenti, tassi, elasticità);
diagrammi flowchart per processi aziendali; mindmap per framework.
Cita SEMPRE i numeri e le percentuali menzionati dal prof.`,

      umanistiche: `DISCIPLINA: Lettere / Filosofia / Storia / Lingue / Beni culturali / Arte.
Riferimenti tipici: autori (Kant, Manzoni, Leopardi, Foucault), opere ("Critica
della Ragion Pura", "Promessi Sposi"), date (1781, 1815, 1968), correnti
(Idealismo, Verismo, Postmoderno, Scuola delle Annales), luoghi storici, eventi.
Formato: NIENTE LaTeX. Citazioni testuali tra virgolette con attribuzione.
Corsivo *...* per i titoli di opere (in stile italiano).
Diagrammi: mindmap per mappe concettuali/autori; flowchart per sequenze storiche
o genealogie di pensiero.
Riporta SEMPRE le date con anno, i nomi completi, i titoli nella lingua originale
se il prof li ha usati (es. "Die Welt als Wille und Vorstellung").`,

      scienze: `DISCIPLINA: Fisica / Chimica / Matematica / Scienze naturali / Geologia.
Riferimenti tipici: leggi fisiche (Newton, Ohm, Coulomb), costanti universali
(g, h, c, N_A), reazioni chimiche, teoremi, dimostrazioni, esperimenti storici
(Michelson-Morley, Rutherford), simboli matematici.
Formato: LaTeX SEMPRE per formule, dimostrazioni, reazioni chimiche.
Blocchi di codice Markdown solo per pseudocodice di calcolo numerico.
Diagrammi: flowchart per procedure sperimentali; mindmap per classificazioni.
Riporta SEMPRE unità di misura corrette e cifre significative se menzionate.`,

      generale: `DISCIPLINA: Generico — vale per riunioni aziendali, corsi di formazione,
seminari, presentazioni, workshop, corsi professionali, conferenze.
Riferimenti tipici: nomi di progetti interni, persone citate per ruolo
(es. "il CTO", "Anna del marketing"), date di scadenze, decisioni prese,
documenti citati, metriche di business (KPI, OKR), prossimi passi.
Formato: NIENTE LaTeX (a meno che la riunione sia tecnica). Diagrammi flow
per processi decisionali; mindmap per aree tematiche.
Includi se menzionati:
  · Decisioni prese (con chi le ha prese, se esplicitato)
  · Action items / prossimi passi (chi fa cosa, entro quando)
  · Problemi aperti / questioni rimandate
  · Persone e ruoli menzionati (in forma "Nome (ruolo)")
NON inventare decisioni o scadenze non dette esplicitamente.
Adatta "key_points" per riflettere decisioni e azioni, non solo concetti teorici.`
    };

    const DEFAULT_PRESET = 'informatica';
    let activePreset = safeGet('lai_preset') || DEFAULT_PRESET;
    function getCustomKey(p) { return 'lai_preset_custom_' + p; }
    let customPanel = safeGet(getCustomKey(activePreset)) || null;

    // Controllo finale: va in fondo al prompt, dove il modello (soprattutto quello leggero) gli dà più peso
    const FINAL_CHECK = `

═══ CONTROLLO FINALE (prima di rispondere) ═══
1. lecture_outline è compilato e ogni voce di "sequenza" ed "elenchi_numerati" compare negli appunti.
2. Nessuno strumento, autore o esempio aggiunto; i termini incerti hanno [?].
3. Ogni ## dice un'idea; il primo ## non ripete il titolo.
4. Evidenze: circa 1 ogni 200 parole, massimo 1 per paragrafo, sempre con l'emoji, mai su nomi propri o parole singole.
5. Nessuna voce di elenco con il solo grassetto.
6. Hai usato gli strumenti di Obsidian dove rendono il testo più chiaro (callout, tabelle, frecce, note).`;

    const FINAL_CHECK_SCHEMI = `
7. Schemi: massimo 6 nodi (al massimo 8), etichette di massimo 5 parole, rombo solo per domande di massimo 3 parole.`;

    function getPanel() {
      return customPanel || PRESET_PANELS[activePreset] || PRESET_PANELS[DEFAULT_PRESET];
    }
    // extra: istruzioni aggiuntive (es. unione dei segmenti), inserite prima del controllo finale
    function getSys(extra) {
      return BASE_SYS.replace('{DISCIPLINE_PANEL}', getPanel()) + getSkillsBlock() + (extra || '')
        + FINAL_CHECK + (skillSchemiOn ? FINAL_CHECK_SCHEMI : '');
    }

    async function loadSkills() {
      await Promise.all([...SKILL_BASE, ...SKILL_GRAFICI].map(async n => {
        try {
          const r = await fetch('/static/skills/' + n);
          if (!r.ok) throw new Error('HTTP ' + r.status);
          SKILL_TEXT[n] = (await r.text()).replace(/^---[\s\S]*?---\s*/, '');
        } catch (e) { console.warn('[skill] non caricata:', n, e.message); }
      }));
    }

    function getSkillsBlock() {
      const names = skillSchemiOn ? [...SKILL_BASE, ...SKILL_GRAFICI] : SKILL_BASE;
      const parts = names.filter(n => SKILL_TEXT[n]).map(n => '═══ SKILL: ' + n.replace(/\.md$/, '') + ' ═══\n' + SKILL_TEXT[n]);
      if (!parts.length) return '';
      return '\n\n' + parts.join('\n\n');
    }

    function onSkillToggle() {
      skillSchemiOn = !!document.getElementById('skSchemi').checked;
      safeSet(SKILL_SCHEMI_KEY, String(skillSchemiOn));
    }
    function getSysMerge() {
      return getSys(`

────────────────────────────────
CONTESTO: stai UNENDO gli appunti di più segmenti della stessa lezione in UN UNICO documento con lo schema JSON descritto sopra.
- notes_md è obbligatorio ed è il corpo completo degli appunti in Markdown: sezioni ##, mai HTML per i titoli.
- Compila lecture_outline sull'intera lezione; la sequenza segue l'ordine dei segmenti.
- Non perdere nulla: ogni esempio, nome proprio, numero, sigla o aneddoto di un segmento resta negli appunti finali. Se due segmenti trattano lo stesso argomento, uniscili senza togliere esempi.
- Se i segmenti descrivono N livelli, fasi o tipi, negli appunti finali ce ne sono N.
- Flashcard: almeno 10.`);
    }
    // ══════════════════════════════════════════════════════════════
    //  PROMPT SEGMENTO (usato per il chunking di trascrizioni lunghe)
    // ══════════════════════════════════════════════════════════════
    const SYS_CHUNK = `Sei un assistente accademico universitario multidisciplinare.
Stai analizzando il segmento {N} di {TOT} di una trascrizione automatica di lezione, che può contenere errori di riconoscimento vocale.
Rispondi SOLO con JSON valido, senza testo fuori dal JSON:
{"segment":{N},"topics_covered":["argomenti nell'ordine in cui compaiono"],"key_points":["punto 1","punto 2"],"formulas_or_code":["formula o codice se presente"],
"summary_text":"appunti del segmento in Markdown semplice, lunghi circa un terzo del segmento: tutti i concetti, gli esempi, i nomi propri, i numeri e gli aneddoti, nell'ordine della lezione. Nessuna evidenza e nessuno schema. Correggi i termini storpiati solo se il contesto non lascia dubbi; altrimenti scrivi la forma sentita seguita da [?]."}`;

    // ══════════════════════════════════════════════════════════════
    //  API CALLS — passano per il proxy Flask locale (niente CORS)
    // ══════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════
    //  MODELLI GEMINI PER LIVELLO DI LAVORO
    //  Si usano gli alias di Google ("latest"), che puntano sempre all'ultima versione disponibile.
    //  heavy: lavori impegnativi (appunti, unione dei segmenti, correzione)
    //  light: lavori lunghi ma semplici (trascrizione audio, riassunti dei segmenti)
    //  Le versioni 2.5 restano come ultimo ripiego se gli alias non sono disponibili per la chiave.
    // ══════════════════════════════════════════════════════════════
    const GEM_TIERS = {
      heavy: ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
      light: ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash']
    };
    let _geminiModelsCache = null;   // Set dei modelli disponibili per la chiave
    let _lastModel = '';             // modello che ha prodotto l'ultima risposta (salvato nella lezione)

    async function discoverGeminiModels() {
      if (_geminiModelsCache) return _geminiModelsCache;
      try {
        const res = await fetch('/api/gemini-models', { headers: { 'X-Api-Key': apiKey }, signal: genSignal() });
        if (res.ok) {
          const data = await res.json();
          const names = (data.models || [])
            .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
          if (names.length) { _geminiModelsCache = new Set(names); return _geminiModelsCache; }
        }
      } catch (e) { if (isAbort(e)) throw e; console.warn('[Gemini models]', e); }
      return null;   // elenco non disponibile: si provano comunque i modelli del livello
    }

    // Modelli da provare per un livello: disponibili per la chiave e non esauriti per oggi
    async function geminiCandidates(tier) {
      const avail = await discoverGeminiModels();
      let list = GEM_TIERS[tier] || GEM_TIERS.heavy;
      if (avail) { const ok = list.filter(m => avail.has(m)); if (ok.length) list = ok; }
      const blocked = gemBlocked();
      const open = list.filter(m => !blocked[m]);
      return open.length ? open : list;   // se oggi sono tutti esauriti si riprova comunque
    }

    // ── Modelli esauriti per oggi (limite giornaliero o non inclusi nel piano) ──
    // I limiti giornalieri di Google si azzerano a mezzanotte, ora del Pacifico.
    const GEM_BLOCK_KEY = 'lai_gem_blocked';
    function nextPacificMidnight() {
      try {
        const now = Date.now();
        const p = {};
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles', year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23'
        }).formatToParts(new Date(now)).forEach(x => { if (x.type !== 'literal') p[x.type] = +x.value; });
        const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - now;
        return Date.UTC(p.year, p.month - 1, p.day + 1, 0, 0, 0) - offset;
      } catch (e) { return Date.now() + 24 * 3600 * 1000; }
    }
    function gemResetTime() {
      return new Date(nextPacificMidnight()).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }
    function gemBlocked() {
      let o = {};
      try { o = JSON.parse(safeGet(GEM_BLOCK_KEY) || '{}') || {}; } catch (e) { o = {}; }
      const now = Date.now();
      let changed = false;
      for (const k of Object.keys(o)) if (!(o[k] > now)) { delete o[k]; changed = true; }
      if (changed) safeSet(GEM_BLOCK_KEY, JSON.stringify(o));
      return o;
    }
    function gemBlock(model) {
      const o = gemBlocked();
      o[model] = nextPacificMidnight();
      safeSet(GEM_BLOCK_KEY, JSON.stringify(o));
    }

    // ── Annullamento della generazione ──
    let _genAbort = null;
    function genSignal() { return _genAbort ? _genAbort.signal : undefined; }
    function isAbort(e) { return !!e && (e.name === 'AbortError' || e.message === 'ANNULLATO'); }
    function throwIfAborted() {
      if (_genAbort && _genAbort.signal.aborted) { const e = new Error('ANNULLATO'); e.name = 'AbortError'; throw e; }
    }

    // ── Registro delle chiamate (visibile nelle Impostazioni) ──
    const API_LOG_KEY = 'lai_api_log';
    const API_LOG_MAX = 300;
    function readApiLog() {
      try { const a = JSON.parse(safeGet(API_LOG_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
    }
    function apiLog(entry) {
      let arr = readApiLog();
      arr.push(Object.assign({ t: Date.now(), step: Prog.currentLabel() }, entry));
      if (arr.length > API_LOG_MAX) arr = arr.slice(-API_LOG_MAX);
      safeSet(API_LOG_KEY, JSON.stringify(arr));
      const box = document.getElementById('apiLogBox');
      if (box && box.closest('details') && box.closest('details').open) renderApiLog();
    }

    const GEM_RETRYABLE = new Set([429, 500, 502, 503, 504]);
    const GEM_MAX_RETRIES_PER_MODEL = 2;   // nuovi tentativi sullo stesso modello, poi si passa al successivo
    const GEM_MAX_PASSES = 2;
    const GEM_MAX_WAIT_MS = 60000;
    function isOverloadMsg(m) { return /overload|UNAVAILABLE|sovraccaric/i.test(m || ''); }

    // Attesa suggerita da Gemini nella risposta 429 (RetryInfo.retryDelay, es. "37s"), in millisecondi
    function geminiRetryDelayMs(j) {
      const det = (j && j.error && j.error.details) || [];
      for (const d of det) {
        const s = d && d.retryDelay;
        if (typeof s === 'string') { const n = parseFloat(s); if (!isNaN(n)) return Math.round(n * 1000); }
      }
      const m = String((j && j.error && j.error.message) || '').match(/retry in ([\d.]+)\s*s/i);
      return m ? Math.round(parseFloat(m[1]) * 1000) : 0;
    }
    // Quota giornaliera esaurita: inutile aspettare, si passa subito al modello successivo
    function geminiDailyQuota(j) {
      const det = (j && j.error && j.error.details) || [];
      return det.some(d => (d.violations || []).some(v => /PerDay/i.test(v.quotaId || '')))
        || /per\s*day|PerDay/i.test(String((j && j.error && j.error.message) || ''));
    }
    async function waitWithCountdown(ms, label) {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        throwIfAborted();
        const s = Math.ceil((end - Date.now()) / 1000);
        setOv(`⏳ ${label} — nuovo tentativo tra ${s}s`);
        Prog.note(`⏳ ${label} — nuovo tentativo tra ${s}s`);
        await new Promise(r => setTimeout(r, Math.min(1000, end - Date.now())));
      }
      throwIfAborted();
      Prog.note('');
    }

    // Avviso quando si passa automaticamente a un altro modello
    function gemSwitchNotice(from, to, reason) {
      const msg = `${from}: ${reason}. Continuo con ${to}.`;
      toast('⚠ ' + msg, 'err');
      Prog.note('⚠ ' + msg);
      apiLog({ model: from, outcome: 'cambio', msg: reason + ' → ' + to });
    }

    // Esegue una richiesta Gemini provando i modelli del livello, con attese e cambi automatici.
    //   send(model, opts) → Promise<Response>      extract(json, model) → risultato (lancia se vuoto)
    async function geminiRun(tier, send, extract) {
      const models = await geminiCandidates(tier);
      let lastErr = null, failed = null, reason = '';

      for (let pass = 1; pass <= GEM_MAX_PASSES; pass++) {
        let onlyOverload = true;
        for (const model of models) {
          if (failed && failed !== model) gemSwitchNotice(failed, model, reason);
          failed = null;
          const opts = { thinking: true };
          for (let attempt = 0; attempt <= GEM_MAX_RETRIES_PER_MODEL; attempt++) {
            throwIfAborted();
            Prog.model(model);
            const t0 = Date.now();
            let res;
            try { res = await send(model, opts); }
            catch (e) {
              if (isAbort(e)) throw e;
              lastErr = new Error(model + ': connessione non riuscita (' + e.message + ')');
              apiLog({ model, outcome: 'errore', msg: lastErr.message, ms: Date.now() - t0 });
              failed = model; reason = 'connessione non riuscita'; onlyOverload = false;
              break;
            }
            const ms = Date.now() - t0;
            const j = await res.json().catch(() => ({}));

            if (res.ok) {
              try {
                const out = extract(j, model);
                const u = j.usageMetadata || {};
                apiLog({ model, ver: j.modelVersion || '', outcome: 'ok', http: res.status, ms,
                  tin: u.promptTokenCount || 0, tout: u.candidatesTokenCount || 0, tthink: u.thoughtsTokenCount || 0 });
                _lastModel = model + (j.modelVersion && j.modelVersion !== model ? ' (' + j.modelVersion + ')' : '');
                return out;
              } catch (e) {
                lastErr = new Error(model + ': ' + e.message);
                apiLog({ model, ver: j.modelVersion || '', outcome: 'errore', http: res.status, msg: e.message, ms });
                failed = model; reason = 'risposta vuota'; onlyOverload = false;
                break;
              }
            }

            const msg = (j.error && j.error.message) || ('HTTP ' + res.status);
            apiLog({ model, outcome: 'errore', http: res.status, msg: msg.slice(0, 300), ms });
            lastErr = new Error(model + ': ' + msg);
            if (res.status === 401 || res.status === 403 || /API key not valid|API_KEY_INVALID/i.test(msg)) {
              throw new Error('Chiave Gemini non valida.');
            }
            // Il modello non accetta il budget di ragionamento: stesso modello, senza
            if (res.status === 400 && opts.thinking && /think/i.test(msg)) { opts.thinking = false; attempt--; continue; }
            if (res.status === 404 || /not found|not supported/i.test(msg)) {
              failed = model; reason = 'modello non disponibile per questa chiave'; onlyOverload = false; break;
            }
            if (res.status === 429) {
              onlyOverload = false;
              const zero = /limit:\s*0\b/.test(msg);
              if (zero || geminiDailyQuota(j)) {
                gemBlock(model);
                failed = model; reason = zero ? 'non incluso nel piano di questa chiave' : 'limite giornaliero raggiunto';
                break;
              }
              if (attempt < GEM_MAX_RETRIES_PER_MODEL) {
                await waitWithCountdown(Math.min(geminiRetryDelayMs(j) || 20000, GEM_MAX_WAIT_MS) + Math.random() * 800,
                  `Limite di richieste al minuto su ${model}`);
                continue;
              }
              failed = model; reason = 'limite di richieste al minuto'; break;
            }
            // Timeout del nostro server: la risposta era troppo lenta, si prova un altro modello
            if (res.status === 504 && /Timeout: il server Gemini/i.test(msg)) {
              onlyOverload = false; failed = model; reason = 'risposta troppo lenta'; break;
            }
            if (GEM_RETRYABLE.has(res.status)) {
              if (attempt < GEM_MAX_RETRIES_PER_MODEL) {
                await waitWithCountdown(5000 * Math.pow(2, attempt) + Math.random() * 800, `${model} sovraccarico`);
                continue;
              }
              failed = model; reason = 'sovraccarico'; break;
            }
            // Altri errori (es. 400): si prova comunque il modello successivo
            onlyOverload = false; failed = model; reason = 'richiesta rifiutata (' + res.status + ')'; break;
          }
        }
        // Un secondo giro solo se i modelli erano tutti sovraccarichi (non per i limiti di quota)
        if (pass < GEM_MAX_PASSES && onlyOverload) {
          await waitWithCountdown(10000, 'Tutti i modelli Gemini sono sovraccarichi');
        } else break;
      }
      _geminiModelsCache = null;
      const m = lastErr ? lastErr.message : '';
      if (/quota|limit|429|RESOURCE_EXHAUSTED/i.test(m)) {
        throw new Error('Limite di richieste Gemini raggiunto su tutti i modelli. I limiti giornalieri si azzerano alle '
          + gemResetTime() + '. Dettagli nel registro delle Impostazioni.');
      }
      if (m && !isOverloadMsg(m)) throw new Error('Errore Gemini: ' + m);
      throw new Error('Gemini è sovraccarico al momento. Riprova tra qualche minuto oppure passa su Anthropic Claude dal menu in alto. ' + m);
    }

    async function callGemini(userMsg, sysOverride, opts) {
      const sys = sysOverride || getSys();
      const tier = (opts && opts.tier) || 'heavy';
      return geminiRun(tier, (model, o) => {
        const body = {
          systemInstruction: { parts: [{ text: sys }] },
          contents: [{ role: 'user', parts: [{ text: userMsg || '' }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 65536, responseMimeType: 'application/json' }
        };
        // Il modello leggero 2.5 non ragiona di default: un piccolo budget lo aiuta a seguire le istruzioni
        if (o.thinking && /2\.5-flash-lite/i.test(model)) body.generationConfig.thinkingConfig = { thinkingBudget: 2048 };
        return fetch(`/api/gemini/${model}:generateContent`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
          body: JSON.stringify(body), signal: genSignal()
        });
      }, data => {
        const raw = (data.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('');
        if (!raw) throw new Error('risposta vuota');
        if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
          _lastTruncated = true;
          console.warn('[Gemini] risposta troncata per MAX_TOKENS');
        }
        return raw;
      });
    }

    const ANTHROPIC_MODEL = 'claude-opus-4-5';
    const ANT_RETRYABLE = new Set([429, 500, 502, 503, 529]);
    const ANT_MAX_RETRIES = 3;

    async function callAnthropic(userMsg, sysOverride, retryCount) {
      retryCount = retryCount || 0;
      const sys = sysOverride || getSys();
      throwIfAborted();
      Prog.model(ANTHROPIC_MODEL);
      const t0 = Date.now();
      const res = await fetch('/api/anthropic/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 16000, system: sys, messages: [{ role: 'user', content: userMsg }] }),
        signal: genSignal()
      });
      if (!res.ok) {
        let e = 'Errore Anthropic (' + res.status + ')';
        try { const j = await res.json(); e = j.error?.message || e; } catch (x) { }
        apiLog({ model: ANTHROPIC_MODEL, outcome: 'errore', http: res.status, msg: e.slice(0, 300), ms: Date.now() - t0 });
        if (ANT_RETRYABLE.has(res.status) && retryCount < ANT_MAX_RETRIES) {
          const wait = Math.min(3000 * Math.pow(2, retryCount), 15000) + Math.random() * 800;
          const label = res.status === 529 ? 'Claude sovraccarico' : 'Limite richieste raggiunto';
          await waitWithCountdown(wait, label);
          return callAnthropic(userMsg, sysOverride, retryCount + 1);
        }
        throw new Error(e + (res.status === 529 ? ' — Claude è sovraccarico, riprova tra qualche minuto.' : ''));
      }
      const data = await res.json();
      const au = data.usage || {};
      apiLog({ model: ANTHROPIC_MODEL, ver: data.model || '', outcome: 'ok', http: res.status, ms: Date.now() - t0,
        tin: au.input_tokens || 0, tout: au.output_tokens || 0 });
      if (data.stop_reason === 'max_tokens') {
        _lastTruncated = true;
        console.warn('[Anthropic] risposta troncata per max_tokens');
      }
      return data.content.map(i => i.text || '').join('');
    }

    // opts.tier: 'heavy' (appunti, unione, correzione) o 'light' (riassunti dei segmenti); vale per Gemini
    async function callAI(msg, sysOverride, opts) {
      if (provider === 'gemini') return callGemini(msg, sysOverride, opts);
      if (provider === 'anthropic') return callAnthropic(msg, sysOverride);
      return callDeepSeek(msg, sysOverride);
    }

    // ══════════════════════════════════════════════════════════════
    //  DEEPSEEK — API compatibile OpenAI
    // ══════════════════════════════════════════════════════════════
    const DS_RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);
    const DS_MAX_RETRIES = 3;

    async function callDeepSeek(userMsg, sysOverride, retryCount) {
      retryCount = retryCount || 0;
      const sys = sysOverride || getSys();
      const body = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userMsg || '' }
        ],
        temperature: 0.4,
        max_tokens: 8192,
        response_format: { type: 'json_object' }
      };

      throwIfAborted();
      Prog.model('deepseek-chat');
      const t0 = Date.now();
      const res = await fetch('/api/deepseek/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        body: JSON.stringify(body),
        signal: genSignal()
      });

      if (!res.ok) {
        let e = 'Errore DeepSeek (' + res.status + ')';
        try { const j = await res.json(); e = j.error?.message || e; } catch (x) { }
        apiLog({ model: 'deepseek-chat', outcome: 'errore', http: res.status, msg: e.slice(0, 300), ms: Date.now() - t0 });
        if (DS_RETRYABLE.has(res.status) && retryCount < DS_MAX_RETRIES) {
          const wait = Math.min(3000 * Math.pow(2, retryCount), 15000) + Math.random() * 800;
          const label = res.status === 529 ? 'DeepSeek sovraccarico' : 'Limite richieste raggiunto';
          await waitWithCountdown(wait, label);
          return callDeepSeek(userMsg, sysOverride, retryCount + 1);
        }
        throw new Error(e + (res.status === 529 ? ' — DeepSeek è sovraccarico, riprova tra qualche minuto.' : ''));
      }

      const data = await res.json();
      const du = data.usage || {};
      apiLog({ model: 'deepseek-chat', outcome: 'ok', http: res.status, ms: Date.now() - t0,
        tin: du.prompt_tokens || 0, tout: du.completion_tokens || 0 });
      const choice = data.choices?.[0];
      if (choice?.finish_reason === 'length') {
        _lastTruncated = true;
        console.warn('[DeepSeek] risposta troncata per limite di token');
      }
      const raw = choice?.message?.content || '';
      if (!raw) throw new Error('DeepSeek ha restituito risposta vuota.');
      return raw;
    }

    // ══════════════════════════════════════════════════════════════
    //  JSON PARSING
    // ══════════════════════════════════════════════════════════════
    function parseJSON(raw) {
      let s = raw.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```\s*$/, '').trim();
      const fb = s.indexOf('{'), lb = s.lastIndexOf('}');
      if (fb === -1) throw new Error('Risposta AI non contiene JSON valido.');
      s = lb > fb ? s.slice(fb, lb + 1) : s.slice(fb);
      let f = fixJsonEscapes(s);
      try { return restoreLatex(JSON.parse(f)); } catch (_) { }
      f = f.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      try { return restoreLatex(JSON.parse(f)); } catch (_) { }
      try {
        const repaired = repairTruncatedJson(f).replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        const out = restoreLatex(JSON.parse(repaired));
        console.warn('[parseJSON] JSON riparato da una risposta troncata — alcuni contenuti potrebbero mancare.');
        _lastTruncated = true;
        return out;
      } catch (e) {
        console.error('[parseJSON] risposta non leggibile, inizio:', raw.slice(0, 1200));
        throw new Error('Impossibile interpretare la risposta AI' + (_lastTruncated ? ' (sembra troncata per limite di lunghezza — riprova, o accorcia il materiale)' : '') + '.');
      }
    }

    function restoreLatex(obj) {
      if (typeof obj === 'string') return obj.replace(/\\\\([a-zA-Z\(\)\[\]\{\}|,;\.!_^*+\-=<>\/])/g, '\\$1');
      if (Array.isArray(obj)) return obj.map(restoreLatex);
      if (obj && typeof obj === 'object') { const out = {}; for (const k of Object.keys(obj)) out[k] = restoreLatex(obj[k]); return out; }
      return obj;
    }

    function repairTruncatedJson(s) {
      function scan(str, upto) {
        const stack = []; let inStr = false, esc = false, lastSafe = -1;
        for (let i = 0; i < upto; i++) {
          const c = str[i];
          if (inStr) {
            if (esc) { esc = false; }
            else if (c === '\\') { esc = true; }
            else if (c === '"') { inStr = false; lastSafe = i; }
            continue;
          }
          if (c === '"') { inStr = true; continue; }
          if (c === '{' || c === '[') { stack.push(c); }
          else if (c === '}') { if (stack[stack.length - 1] === '{') { stack.pop(); lastSafe = i; } }
          else if (c === ']') { if (stack[stack.length - 1] === '[') { stack.pop(); lastSafe = i; } }
        }
        return { stack, inStr, lastSafe };
      }
      const full = scan(s, s.length);
      let attempt = s;
      if (full.inStr) attempt += '"';
      attempt = attempt.replace(/,\s*$/, '');
      for (let i = full.stack.length - 1; i >= 0; i--)attempt += full.stack[i] === '{' ? '}' : ']';
      try { JSON.parse(attempt); return attempt; } catch (_) { }

      if (full.lastSafe >= 0) {
        const cut = scan(s, full.lastSafe + 1);
        let attempt2 = s.slice(0, full.lastSafe + 1).replace(/,\s*$/, '');
        for (let i = cut.stack.length - 1; i >= 0; i--)attempt2 += cut.stack[i] === '{' ? '}' : ']';
        try { JSON.parse(attempt2); return attempt2; } catch (_) { }
      }
      return s;
    }

    // Comandi LaTeX che iniziano con b, f, n, r, t: senza raddoppiare il backslash
    // JSON li leggerebbe come \b, \f, \n, \r, \t e corromperebbe la formula.
    const LATEX_CMD_BFNRT = new Set(['beta', 'bar', 'bf', 'binom', 'frac', 'dfrac', 'tfrac', 'nabla', 'nu', 'neq', 'ni',
      'rho', 'right', 'rightarrow', 'text', 'times', 'tan', 'theta', 'tau', 'tilde', 'to', 'therefore', 'tt', 'bigl', 'bigr', 'cdot', 'rm', 'bmod', 'bigm']);

    function fixJsonEscapes(s) {
      let out = '', inStr = false, i = 0;
      // Una virgoletta chiude la stringa solo se è seguita da , } ] : (o fine testo)
      const closesString = (pos) => {
        let j = pos + 1;
        while (j < s.length && /\s/.test(s[j])) j++;
        return j >= s.length || ',}]:'.includes(s[j]);
      };
      while (i < s.length) {
        const ch = s[i];
        if (!inStr) { if (ch === '"') { inStr = true; out += ch; i++; continue; } out += ch; i++; continue; }
        if (ch === '\\') {
          const nx = s[i + 1];
          const word = (s.slice(i + 1).match(/^[a-zA-Z]+/) || [''])[0];
          const isLatex = !!nx && 'bfnrt'.includes(nx) && LATEX_CMD_BFNRT.has(word);
          if (!isLatex && nx && '"\\\\/bfnrt'.includes(nx)) { out += ch + nx; i += 2; continue; }
          if (nx === 'u' && /[0-9a-fA-F]{4}/.test(s.slice(i + 2, i + 6))) { out += s.slice(i, i + 6); i += 6; continue; }
          out += '\\\\'; i++; continue;
        }
        if (ch === '"') {
          if (closesString(i)) { inStr = false; out += ch; i++; continue; }
          // Virgoletta interna non escapata (es. class="callout"): la escapo
          out += '\\"'; i++; continue;
        }
        if (ch === '\n') { out += '\\n'; i++; continue; }
        if (ch === '\r') { out += '\\r'; i++; continue; }
        if (ch === '\t') { out += '\\t'; i++; continue; }
        out += ch; i++;
      }
      return out;
    }

    // ══════════════════════════════════════════════════════════════
    //  TRASCRIZIONE AUDIO LUNGO (Gemini File API)
    // ══════════════════════════════════════════════════════════════
    
    // La richiesta a Gemini può essere al massimo 20 MB e il Base64 aumenta il file di un terzo:
    // fino a 14 MB l'audio passa dal server (/api/transcribe), oltre si carica con la File API.
    const INLINE_AUDIO_MAX = 14 * 1024 * 1024;
    const TRANSCRIBE_PROMPT = 'Trascrivi fedelmente questo audio. Restituisci SOLO il testo trascritto, niente commenti.';

    function transcriptFromResponse(d) {
      const t = d && d.text !== undefined ? d.text
        : (d.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('');
      if (!String(t || '').trim()) throw new Error('trascrizione vuota');
      return String(t).trim();
    }

    // Trascrizione di un file audio con il modello leggero (con cambio automatico se serve)
    async function transcribeAudioFile(file) {
      if (file.size <= INLINE_AUDIO_MAX) {
        return geminiRun('light', model => {
          const fd = new FormData();
          fd.append('audio', file, file.name);
          fd.append('key', apiKey);
          fd.append('model', model);
          return fetch('/api/transcribe', { method: 'POST', body: fd, signal: genSignal() });
        }, transcriptFromResponse);
      }
      Prog.note('Caricamento del file su Gemini (può richiedere qualche minuto)...');
      const fileUri = await uploadAudioToGemini(file);
      Prog.note('');
      const mimeType = file.type || 'audio/mp4';
      return geminiRun('light', model => fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: TRANSCRIBE_PROMPT }, { fileData: { mimeType, fileUri } }] }],
          generationConfig: { temperature: 0.2 }
        }),
        signal: genSignal()
      }), transcriptFromResponse);
    }

    async function uploadAudioToGemini(file) {
      throwIfAborted();
      const initRes = await fetch('https://generativelanguage.googleapis.com/upload/v1beta/files', {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(file.size),
          'X-Goog-Upload-Header-Content-Type': file.type || 'audio/mp4',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: file.name } }),
        signal: genSignal()
      });

      if (!initRes.ok) {
        const err = await initRes.text();
        apiLog({ model: 'File API', outcome: 'errore', http: initRes.status, msg: err.slice(0, 300) });
        if (/API key not valid|API_KEY_INVALID|UNAUTHENTICATED/i.test(err)) throw new Error('Chiave Gemini non valida: incolla la chiave nel campo in alto e premi Salva.');
        throw new Error('Inizializzazione upload fallita: ' + err.slice(0, 200));
      }

      const uploadUrl = initRes.headers.get('X-Goog-Upload-URL');
      if (!uploadUrl) throw new Error('URL di upload non ricevuto da Gemini');

      const t0 = Date.now();
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'X-Goog-Upload-Command': 'upload, finalize',
          'X-Goog-Upload-Offset': '0',
          'Content-Length': String(file.size),
          'Content-Type': file.type || 'audio/mp4'
        },
        body: file,
        signal: genSignal()
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        apiLog({ model: 'File API', outcome: 'errore', http: uploadRes.status, msg: err.slice(0, 300), ms: Date.now() - t0 });
        throw new Error('Upload file fallito: ' + err.slice(0, 200));
      }

      const uploadData = await uploadRes.json();
      apiLog({ model: 'File API', outcome: 'ok', http: uploadRes.status, ms: Date.now() - t0,
        msg: 'caricato ' + (file.size / 1048576).toFixed(1) + ' MB' });
      return uploadData.file.uri;
    }

    // ══════════════════════════════════════════════════════════════
    //  GENERATE
    // ══════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════
    //  APPUNTI PERSONALI — non devono andare persi
    //  1) vengono passati al modello come obbligatori
    //  2) dopo la risposta, ogni punto non presente viene aggiunto in fondo
    // ══════════════════════════════════════════════════════════════
    function userNoteItems(text) {
      return String(text || '').split(/\r?\n/)
        .map(l => l.trim().replace(/^[-*•]\s+/, '').trim())
        .filter(Boolean);
    }

    function normForMatch(s) {
      return String(s || '').replace(/<[^>]+>/g, ' ').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function noteTokens(s) {
      return normForMatch(s).match(/[a-z0-9\/]+/g) || [];
    }

    // Parole comuni che non dicono nulla del contenuto: non contano nel confronto
    const NOTE_STOPWORDS = new Set(('per che con del della dello delle degli dei nel nella nelle negli sul sulla sui '
      + 'una uno gli non come anche piu molto molta molti poco fare fatto essere avere sono era stato questo questa '
      + 'quello quella questi quelli cosa tutto tutti ogni dove quando quindi cioe allora pero oppure sempre gia '
      + 'mai solo tra fra dal dalla dai alle agli alla allo').split(' '));

    // Un punto è "coperto" se almeno il 70% delle sue parole significative compare nel testo generato
    function noteIsCovered(item, outputHtml) {
      const words = noteTokens(item).filter(t => (t.length >= 3 || t.startsWith('/')) && !NOTE_STOPWORDS.has(t));
      if (!words.length) return true;
      const present = new Set(noteTokens(outputHtml));
      const hits = words.filter(w => present.has(w)).length;
      return hits / words.length >= 0.7;
    }

    // Istruzione per il modello: formattare e integrare gli appunti, senza perdere informazioni
    function notesBlock(items) {
      const rule = 'ISTRUZIONE OBBLIGATORIA: il testo dell\'utente contiene appunti personali. '
        + 'Ogni informazione (nomi, comandi, sigle, numeri, link, esempi) deve comparire negli appunti, '
        + 'nella sezione pertinente. Puoi riformularli e formattarli (grassetto, elenchi, titoli), '
        + 'ma non eliminare, non fondere e non generalizzare nessun punto.\n';
      const total = items.reduce((a, i) => a + i.length, 0);
      // Se il testo è lungo, la lista è già nella trascrizione: basta la regola
      if (total > 4000) return rule + '\n';
      return rule + items.map(i => '- ' + i).join('\n') + '\n\n';
    }

    function ensureUserNotes(parsed, items) {
      if (!items.length) return parsed;
      const isMd = typeof parsed.notes_md === 'string' && parsed.notes_md.trim() !== '';
      const text = isMd ? parsed.notes_md : (parsed.notes_html || '');
      const missing = items.filter(it => !noteIsCovered(it, text));
      if (!missing.length) return parsed;
      if (isMd) {
        // La sezione va prima dei tag finali (#materia/argomento), che devono restare in fondo
        const md = parsed.notes_md.trimEnd();
        const tagLine = md.match(/\n((?:#[\p{L}\p{N}_\/-]+[ \t]*)+)$/u);
        const body = tagLine ? md.slice(0, tagLine.index).trimEnd() : md;
        parsed.notes_md = body + '\n\n## 📝 I tuoi appunti\n\n'
          + missing.map(m => '- ' + m).join('\n') + '\n'
          + (tagLine ? '\n' + tagLine[1].trim() + '\n' : '');
      } else {
        parsed.notes_html = text + '<h2>📝 I tuoi appunti</h2><ul>'
          + missing.map(m => '<li>' + escHtml(m) + '</li>').join('') + '</ul>';
      }
      console.warn('[LectureAI] appunti utente aggiunti in fondo:', missing.length);
      return parsed;
    }

    // ══════════════════════════════════════════════════════════════
    //  CONTROLLI DI QUALITÀ sugli appunti (evidenze, titoli, elenchi, schemi)
    //  Restituiscono frasi già pronte da mandare al modello come correzioni.
    // ══════════════════════════════════════════════════════════════
    const HL_EMOJI = '🔴|🟠|🟡|🟢|🔵|🟣';
    const HL_RE = new RegExp('==(' + HL_EMOJI + ')([^=\\n]+?)==', 'gu');
    const GENERIC_TITLE = /^(introduzione|panoramica|concetti chiave|principi|strategie|strumenti|approfondimenti|conclusioni|riepilogo)$/;
    const MERMAID_KEYWORDS = /^(flowchart|graph|subgraph|end|direction|TD|TB|LR|RL|BT|class|classDef|style|click|linkStyle)$/;

    const stripCode = md => md.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    const normText = s => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
    const mermaidBlocks = md => [...String(md || '').matchAll(/```mermaid\s*\n([\s\S]*?)```/g)].map(m => m[1]);

    function notesQualityIssues(md, title) {
      const raw = String(md || '');
      const t = stripCode(raw);
      const words = (t.match(/\S+/g) || []).length;
      const issues = [];

      // ── Evidenze ──
      const hls = [...t.matchAll(HL_RE)].map(m => m[2].trim());
      const plain = t.replace(HL_RE, '').match(/==[^=\n]+?==/g) || [];
      if (plain.length) {
        issues.push('queste evidenze non hanno il colore: ' + plain.slice(0, 5).join(', ') + '. Aggiungi l\'emoji giusta subito dopo == oppure togli l\'evidenza');
      }
      if (words >= 300) {
        const min = Math.max(2, Math.floor(words / 400));
        const max = Math.ceil(words / 120);
        if (hls.length < min) issues.push(`ci sono ${hls.length} evidenze colorate, ne servono almeno ${min}: mettile su definizioni (🟢) o su cose da ricordare per l'esame (🟡)`);
        if (hls.length > max) issues.push(`ci sono ${hls.length} evidenze, il massimo è ${max}: tieni solo le più importanti`);
      }
      const badHl = hls.filter(x => {
        const w = x.split(/\s+/);
        const tuttiNomiPropri = w.every(p => /^[\p{Lu}\d]/u.test(p));
        return w.length < 2 || w.length > 14 || tuttiNomiPropri;
      });
      if (badHl.length) {
        issues.push('evidenze su una parola sola, su un nome proprio o troppo lunghe: «' + badHl.slice(0, 5).join('», «') + '». Spostale su una frase di 2-12 parole che spiega il concetto, oppure toglile');
      }
      const crowded = t.split(/\n\s*\n/).filter(p => (p.match(HL_RE) || []).length > 1).length;
      if (crowded) issues.push(`${crowded} paragrafi hanno più di un'evidenza: lasciane una per paragrafo`);

      // ── Titoli ──
      const h2 = [...t.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());
      const heads = [...t.matchAll(/^#{2,3}\s+(.+)$/gm)].map(m => normText(m[1]));
      if (title && h2.length && normText(h2[0]) === normText(String(title))) {
        issues.push('il primo titolo ## ripete il titolo della lezione: sostituiscilo con l\'idea della prima sezione');
      }
      const generic = h2.filter(h => GENERIC_TITLE.test(normText(h)));
      if (generic.length) issues.push('titoli troppo generici: ' + generic.join(', ') + '. Ogni titolo deve dire l\'idea della sezione');
      const dup = [...new Set(heads.filter((h, i) => heads.indexOf(h) !== i))];
      if (dup.length) issues.push('titoli ripetuti: ' + dup.join(', '));

      // ── Elenchi ──
      const bare = (t.match(/^\s*[-*+]\s+\*\*[^*\n]+\*\*:?\s*$/gm) || []).length;
      if (bare) issues.push(`${bare} voci di elenco hanno solo il termine in grassetto: aggiungi la spiegazione data a lezione oppure trasforma l'elenco in una frase`);

      // ── Tabelle: i callout non funzionano nelle celle ──
      const tableCallouts = (t.match(/^\s*\|.*>\s*\[!\w+\]/gm) || []).length;
      if (tableCallouts) issues.push(`${tableCallouts} righe di tabella contengono un callout, che nelle celle non funziona: scrivi l'avvertenza come testo nella cella oppure in un callout sotto la tabella`);

      // ── Schemi ──
      const blocks = mermaidBlocks(raw);
      if (skillSchemiOn && words >= 600 && !blocks.length) {
        issues.push('aggiungi uno schema mermaid nella sezione con un processo o una progressione (se non c\'è, una mindmap della lezione)');
      }
      blocks.forEach((b, i) => {
        const n = i + 1;
        if (!/^\s*(flowchart|graph)\b/.test(b)) return;
        const righe = b.split('\n').filter(r => r.trim() && !/^\s*(classDef|class|style|linkStyle|%%)/.test(r));
        const ids = new Set();
        righe.slice(1).forEach(r => {
          for (const m of r.matchAll(/(?:^|[\s>|;&-])([A-Za-z]\w*)(?=\s*[\[\(\{]|\s*(?:-->|==>|-\.->|---|--\s|$))/g)) {
            if (!MERMAID_KEYWORDS.test(m[1])) ids.add(m[1]);
          }
        });
        if (ids.size > 8) issues.push(`lo schema ${n} ha ${ids.size} nodi: riducilo a 6 o dividilo in due schemi`);
        const rombi = [...b.matchAll(/(?<!\{)\{\s*"?([^{}"]+?)"?\s*\}(?!\})/g)].map(m => m[1].trim());
        const rombiLunghi = rombi.filter(x => x.split(/\s+/).length > 3 || x.length > 28);
        if (rombiLunghi.length) issues.push(`nello schema ${n} il rombo contiene una frase: «${rombiLunghi[0]}». Il rombo serve solo per una domanda di massimo 3 parole; trasforma l'azione in un rettangolo`);
        if (/[\[\(\{]\s*"?\d+\.\s/.test(b)) issues.push(`nello schema ${n} un'etichetta inizia con "numero e punto": scrivi "L1 ·" o "Fase 1"`);
        if (/[\[\(]\s*"?end"?\s*[\]\)]/.test(b)) issues.push(`nello schema ${n} c'è un nodo "end" minuscolo: scrivi "Fine"`);
      });

      return issues;
    }

    // Validità della sintassi degli schemi con il parser di Mermaid
    async function mermaidSyntaxIssues(md) {
      if (typeof mermaid === 'undefined' || !mermaid.parse) return [];
      const out = [];
      const blocks = mermaidBlocks(md);
      for (let i = 0; i < blocks.length; i++) {
        let ok = false;
        try { ok = await mermaid.parse(blocks[i], { suppressErrors: true }); } catch (e) { ok = false; }
        if (!ok) out.push(`lo schema ${i + 1} ha un errore di sintassi o un tipo che il sito non disegna: riscrivilo con un tipo stabile (flowchart, mindmap, sequenceDiagram, timeline...) ed etichette tra doppi apici`);
      }
      return out;
    }

    async function allNotesIssues(md, title) {
      return [...notesQualityIssues(md, title), ...(await mermaidSyntaxIssues(md))];
    }

    // Correzione mirata: il modello riceve solo gli appunti e restituisce solo notes_md
    function getSysFix() {
      return 'Sei un correttore di formato per appunti universitari in Markdown Obsidian. '
        + 'Correggi SOLO i problemi elencati nel messaggio. Non togliere, non aggiungere e non riassumere contenuti. '
        + 'Rispondi solo con JSON valido nella forma {"notes_md": "..."}. Nel JSON ogni backslash va raddoppiato.'
        + getSkillsBlock();
    }

    function qualityRetryMsg(notesMd, issues) {
      return 'Problemi da correggere:\n- ' + issues.join('\n- ')
        + '\n\nCambia solo le evidenze, i titoli, gli elenchi e gli schemi indicati. Tutto il resto deve restare identico.'
        + '\n\nAPPUNTI:\n' + notesMd;
    }

    // La correzione viene accettata solo se non toglie contenuto e riduce i problemi
    async function acceptFix(oldMd, newMd, oldIssueCount, title) {
      const count = (s, re) => (s.match(re) || []).length;
      if (newMd.trim().length < oldMd.trim().length * 0.9) return false;            // ha tagliato contenuto
      if (count(newMd, /^##\s/gm) < count(oldMd, /^##\s/gm)) return false;          // ha tolto sezioni
      if (count(newMd, /```mermaid/g) < count(oldMd, /```mermaid/g)) return false;  // ha tolto schemi
      return (await allNotesIssues(newMd, title)).length < oldIssueCount;           // deve migliorare
    }

    async function generate() {
      if (_genAbort) return;   // una generazione è già in corso
      // Conta la chiave scritta nel campo: una salvata in precedenza potrebbe essere vecchia
      const key = cleanKey(document.getElementById('apiInput').value) || apiKey;
      if (!key) { toast('Inserisci la API key e premi Salva.', 'err'); return; }
      apiKey = key;

      const audioFiles = uploadedFiles.filter(f => f.isAudio);
      if (audioFiles.length > 0 && provider !== 'gemini') {
        toast('La trascrizione dei file audio è supportata solo con Google Gemini. Cambia provider dal menu in alto.', 'err');
        return;
      }

      _genAbort = new AbortController();
      _lastTruncated = false;
      _lastModel = '';
      Prog.start(audioFiles.length ? [['audio', 'Trascrizione audio']] : []);
      setOv('Preparazione...');
      try {
        // 1) Trascrizione dei file audio (modello leggero)
        if (audioFiles.length) {
          Prog.begin('audio');
          for (let i = 0; i < audioFiles.length; i++) {
            const af = audioFiles[i];
            Prog.label('audio', 'Trascrizione audio' + (audioFiles.length > 1 ? ` (${i + 1}/${audioFiles.length})` : '') + ': ' + af.name);
            setOv('Trascrizione audio in corso... (non chiudere la pagina)');
            let text;
            try { text = await transcribeAudioFile(af.file); }
            catch (err) {
              if (isAbort(err)) throw err;
              throw new Error('trascrizione di ' + af.name + ' non riuscita: ' + err.message);
            }
            if (text) {
              if (tmode === 'text') {
                pastedTr += (pastedTr ? '\n\n' : '') + text + ' ';
                const tp = document.getElementById('tpaste');
                if (tp) tp.value = pastedTr;
                onPasteInput();
              } else {
                finalTr += (finalTr ? '\n\n' : '') + text + ' ';
                renderTbox();
              }
            }
            // Il file già trascritto non va rifatto se la generazione viene annullata o fallisce dopo
            uploadedFiles = uploadedFiles.filter(f => f !== af);
            renderFileList();
          }
          Prog.done('audio');
        }

        // 2) Testo da elaborare: esattamente ciò che è visibile nelle due caselle
        syncTranscriptFromUI();
        const liveTr = (finalTr + ' ' + interimTr).trim();
        const textTr = pastedTr.trim();
        const rawTr = [liveTr, textTr].filter(Boolean).join('\n\n');
        const hasTr = rawTr.length > 15, hasPdf = uploadedFiles.length > 0;
        const wordCount = rawTr.split(/\s+/).filter(Boolean).length;
        // Una riga della casella di testo = un punto che non deve andare perso
        const notesItems = textTr ? userNoteItems(textTr) : [];
        // Oltre 120.000 caratteri (2-3 ore di lezione) si lavora a blocchi, senza tagli silenziosi
        const isLong = hasTr && normMath(compressTranscript(rawTr)).length > LONG_TRANSCRIPT_CHARS;
        if (!hasTr && !hasPdf && !notesItems.length) { toast('Nessun contenuto da elaborare.', 'err'); return; }

        await skillsReady;
        Prog.append(isLong
          ? [['segmenti', 'Riassunto dei segmenti'], ['unione', 'Unione degli appunti']]
          : [['appunti', 'Scrittura degli appunti']]);
        Prog.append([['controllo', 'Controllo qualità'], ['correzione', 'Correzione'], ['salvataggio', 'Salvataggio']]);

        // 3) Appunti (modello migliore)
        let parsed;
        if (isLong) {
          toast(`Elaborazione a blocchi (${wordCount.toLocaleString()} parole)...`, 'ok');
          parsed = await generateChunked(rawTr, hasPdf, notesItems);
        } else {
          const docChars = uploadedFiles.reduce((a, f) => a + (f.txt ? f.txt.length : 0), 0);
          if (docChars > 36000) toast('Materiale molto lungo: una parte dei documenti non verrà letta.', 'err');
          Prog.begin('appunti');
          setOv('Il modello sta scrivendo gli appunti: con una lezione lunga può servire qualche minuto.');
          parsed = parseJSON(await callAI(buildDirectMsg(rawTr, hasTr, hasPdf, notesItems), null, { tier: 'heavy' }));
          Prog.done('appunti');
        }
        parsed = ensureUserNotes(parsed, notesItems);
        const genModel = _lastModel;   // prima della correzione, che può usare un altro modello

        // 4) Controllo qualità e, se serve, una sola correzione mirata
        Prog.begin('controllo');
        setOv('Controllo di evidenze, titoli e schemi...');
        const issues = await allNotesIssues(parsed.notes_md, parsed.title);
        Prog.done('controllo', issues.length ? issues.length + ' punti da sistemare' : 'tutto a posto');
        if (issues.length && String(parsed.notes_md || '').trim()) {
          console.warn('[qualità] da correggere:', issues.join('; '));
          Prog.begin('correzione');
          setOv('Sistemo evidenze, titoli e schemi...');
          try {
            const fixed = parseJSON(await callAI(qualityRetryMsg(parsed.notes_md, issues), getSysFix(), { tier: 'heavy' }));
            const newMd = String(fixed.notes_md || '');
            if (newMd && await acceptFix(parsed.notes_md, newMd, issues.length, parsed.title)) {
              parsed.notes_md = newMd;                       // cambia solo notes_md
              parsed = ensureUserNotes(parsed, notesItems);
              parsed.quality_fix = 'accettata';
              Prog.done('correzione', 'applicata');
            } else {
              parsed.quality_fix = 'scartata';
              console.warn('[qualità] correzione scartata: peggiora o toglie contenuto');
              Prog.done('correzione', 'scartata: avrebbe tolto contenuto');
            }
          } catch (e) {
            if (isAbort(e)) throw e;
            parsed.quality_fix = 'fallita';
            console.warn('[qualità] correzione fallita:', e.message);
            Prog.fail('correzione', 'non riuscita: tengo la prima versione');
          }
          const left = notesQualityIssues(parsed.notes_md, parsed.title);
          if (left.length) console.warn('[qualità] ancora da migliorare:', left.join('; '));
          if (skillSchemiOn && !/```mermaid/.test(String(parsed.notes_md || ''))) {
            toast('⚠ La AI non ha inserito schemi: riprova la generazione.', 'err');
          }
        } else {
          Prog.skip('correzione', 'non necessaria');
        }

        // Modello che ha prodotto gli appunti (utile per capire un risultato scarso)
        parsed.model = provider === 'gemini' ? (genModel || 'gemini') : provider === 'anthropic' ? ANTHROPIC_MODEL : 'deepseek-chat';
        console.log('[LectureAI] Risposta AI parsata:', parsed);
        if (!String(parsed.notes_md || parsed.notes_html || '').trim()) {
          console.warn('[LectureAI] ⚠️ notes_md vuoto o mancante!');
        }

        // 5) Salvataggio
        throwIfAborted();
        Prog.begin('salvataggio');
        setOv('Salvataggio e impaginazione...');
        lastData = parsed;
        safeRemove(TRANS_BACKUP_KEY);
        await renderAll(parsed);
        const saved = saveHist(true);
        Prog.done('salvataggio');
        hideOv();
        document.getElementById('xbar').style.display = 'flex';
        if (saved) toast('✓ Appunti generati e salvati!', 'ok');
        goToNotes();
        if (_lastTruncated) {
          setTimeout(() => toast('⚠️ Una risposta AI è arrivata troncata per limite di lunghezza: alcuni contenuti potrebbero essere incompleti. Ho recuperato quello che potevo.', 'err'), 3500);
        }
      } catch (err) {
        if (isAbort(err)) {
          apiLog({ outcome: 'annullata', msg: 'generazione annullata dall\'utente' });
          toast('Generazione annullata: trascrizione e appunti sono rimasti dove erano.', 'ok');
        } else {
          console.error('[LectureAI]', err);
          toast('Errore: ' + err.message, 'err');
        }
      } finally {
        _genAbort = null;
        Prog.stop();
        hideOv();
      }
    }

    function buildDirectMsg(rawTr, hasTr, hasPdf, notesItems) {
      // Nessun taglio qui: la trascrizione è già sotto la soglia di elaborazione a blocchi
      const trTrunc = hasTr ? normMath(compressTranscript(rawTr)) : '';
      const notes = notesItems && notesItems.length ? notesBlock(notesItems) : '';
      let combinedDocs = '';
      if (hasPdf) {
        const budget = Math.floor(36000 / uploadedFiles.length);
        combinedDocs = uploadedFiles.map((f, i) => {
          const txt = f.txt.length > budget ? f.txt.slice(0, budget) + '\n[...troncato...]' : f.txt;
          return '### Documento ' + (i + 1) + ': ' + f.name + '\n' + txt;
        }).join('\n\n---\n\n');
      }
      if (hasTr && hasPdf) return 'Integra queste fonti in appunti universitari completi:\n\n' + notes + '## TRASCRIZIONE:\n' + trTrunc + '\n\n## MATERIALE:\n' + combinedDocs;
      if (hasTr) return 'Trascrizione lezione:\n\n' + notes + trTrunc;
      if (hasPdf) return 'Genera appunti universitari da questo materiale:\n\n' + notes + combinedDocs;
      return 'Genera appunti universitari dagli appunti dell\'utente:\n\n' + notes;
    }

    async function generateChunked(rawTr, hasPdf, notesItems) {
      const compressed = normMath(compressTranscript(rawTr));
      const chunks = splitChunks(compressed);
      const tot = chunks.length;
      const segs = [];
      Prog.begin('segmenti');
      for (let i = 0; i < chunks.length; i++) {
        Prog.label('segmenti', `Riassunto dei segmenti (${i + 1}/${tot})`);
        setOv(`Riassunto del segmento ${i + 1} di ${tot}...`);
        const sys = SYS_CHUNK.replace(/\{N\}/g, String(i + 1)).replace(/\{TOT\}/g, String(tot));
        // Riassunti dei segmenti: lavoro semplice, modello leggero (attese e cambi gestiti da callAI)
        const raw = await callAI(`Segmento ${i + 1} di ${tot}:\n\n${chunks[i]}`, sys, { tier: 'light' });
        try { segs.push(parseJSON(raw)); } catch { segs.push({ segment: i + 1, summary_text: raw.slice(0, 800), key_points: [], topics_covered: [], formulas_or_code: [] }); }
        if (i < chunks.length - 1) await sleepAbortable(1200);
      }
      Prog.done('segmenti', tot + ' segmenti');
      Prog.begin('unione');
      setOv('Unione degli appunti dei segmenti...');
      const pdfSec = hasPdf ? '\n\n## MATERIALE:\n' + uploadedFiles.map(f => f.name + ':\n' + f.txt.slice(0, 20000)).join('\n\n---\n\n') : '';
      const mergeMsg = `Riassunti di ${tot} segmenti (lezione ~${Math.round(rawTr.split(/\s+/).length)} parole):\n\n`
        + segs.map((s, i) => `### Segmento ${i + 1}:\n${(s.topics_covered || []).join(', ')}\n${(s.key_points || []).join(' | ')}\n${s.summary_text || ''}`).join('\n\n')
        + pdfSec
        + (notesItems && notesItems.length ? '\n\n' + notesBlock(notesItems) : '');
      const merged = parseJSON(await callAI(mergeMsg, getSysMerge(), { tier: 'heavy' }));
      Prog.done('unione');
      return merged;
    }

    // ══════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════
    function rK(el) {
      try { renderMathInElement(el, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); }
      catch (e) { console.warn('KaTeX', e); }
    }

    // Svuota le schede prima di un nuovo render, così non restano contenuti della lezione precedente
    function resetPanes() {
      ['notesEl', 'diagEl', 'summEl', 'flashEl'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.innerHTML = ''; el.style.display = 'none'; }
      });
      ['e-notes', 'e-diagrams', 'e-summary', 'e-flash'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
      });
    }

    async function renderAll(d) {
      resetPanes();
      renderNotes(d);
      await renderDiags(d.diagrams || []);
      renderSumm(d.summary, d);
      renderFlash(d.flashcards || []);
      goTab('notes');
    }

    // ══════════════════════════════════════════════════════════════
    //  MARKDOWN → HTML per gli appunti (marked + DOMPurify da cdnjs)
    //  Se le librerie non sono caricate, mostra il testo senza rompere la pagina.
    // ══════════════════════════════════════════════════════════════
    function mdEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    const HL_COLOR = { '🔴': 'red', '🟠': 'orange', '🟡': 'yellow', '🟢': 'green', '🔵': 'blue', '🟣': 'purple' };

    // Sintassi Obsidian → HTML per il sito (il Markdown salvato e l'esportazione restano invariati).
    // Applicata solo al testo: i blocchi di codice vengono lasciati intatti (vedi mdToHtml).
    function obsidianToWeb(t) {
      return t
        .replace(/%%[\s\S]*?%%/g, '')                                                   // commenti: nascosti, come in Obsidian
        // video di YouTube (link ![](url)) → player incorporato
        .replace(/!\[[^\]]*\]\(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,20})[^)]*\)/g, (_, id) => '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '" width="560" height="315" allowfullscreen></iframe>')
        .replace(/!\[[^\]]*\]\(https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,20})[^)]*\)/g, (_, id) => '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '" width="560" height="315" allowfullscreen></iframe>')
        .replace(/!\[\[([^\]\n]+)\]\]/g, (_, n) => '<span class="ob-embed">📎 ' + mdEsc(n) + '</span>')
        .replace(/\[\[([^\]\n|]+)\|([^\]\n]+)\]\]/g, (_, a, b) => '<span class="ob-link">' + mdEsc(b) + '</span>')
        .replace(/\[\[([^\]\n]+)\]\]/g, (_, a) => '<span class="ob-link">' + mdEsc(a) + '</span>')
        .replace(/==(🔴|🟠|🟡|🟢|🔵|🟣)([^=\n]+?)==/gu, (_, e, x) => '<mark class="hl-' + HL_COLOR[e] + '">' + x + '</mark>')
        .replace(/==([^=\n]+?)==/g, (_, x) => '<mark>' + x + '</mark>')
        // #tag: deve avere almeno una lettera, così #1 e i titoli "# Titolo" non vengono toccati
        .replace(/(^|\s)#(?=[^\s#]*[A-Za-zÀ-ÿ])([A-Za-z0-9_\-\/À-ÿ]+)/gm, (_, p, tag) => p + '<span class="ob-tag">#' + mdEsc(tag) + '</span>');
    }

    // Note a piè di pagina [^id]: le definizioni vengono tolte dal testo e messe in fondo, in ordine di comparsa
    function extractFootnotes(src) {
      const defs = {};
      const out = [];
      const lines = src.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^\[\^([^\]\s]+)\]:\s?(.*)$/);
        if (!m) { out.push(lines[i]); continue; }
        let text = m[2];
        while (i + 1 < lines.length && /^ {2,}\S/.test(lines[i + 1])) { text += ' ' + lines[i + 1].trim(); i++; }
        defs[m[1]] = text;
      }
      return { body: out.join('\n'), defs };
    }

    // Iframe consentiti solo verso player video noti; tutto il resto viene tolto
    const MD_IFRAME_OK = /^https:\/\/(www\.youtube-nocookie\.com|www\.youtube\.com|player\.vimeo\.com)\//;
    let _mdHookSet = false;
    function mdSanitize(html) {
      if (!_mdHookSet) {
        DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
          if (node.nodeName === 'IFRAME' && data.attrName === 'src' && !MD_IFRAME_OK.test(data.attrValue)) data.keepAttr = false;
        });
        _mdHookSet = true;
      }
      return DOMPurify.sanitize(html, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allowfullscreen', 'frameborder', 'allow', 'width', 'height'] });
    }

    function mdToHtml(md) {
      const src = String(md || '');
      if (typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
        return '<pre style="white-space:pre-wrap">' + mdEsc(src) + '</pre>';
      }
      // Le formule non devono essere toccate da marked (_ e * dentro $...$)
      const maths = [];
      const pipeText = seg => obsidianToWeb(seg).replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, m => {
        maths.push(m);
        return 'MATHPH' + (maths.length - 1) + 'X';
      });
      const fn = extractFootnotes(src);
      const order = [];
      const refNum = id => { let k = order.indexOf(id); if (k < 0) { order.push(id); k = order.length - 1; } return k + 1; };
      // Codice (blocchi e inline) intatto; nel resto: sintassi Obsidian, note e formule
      const pieces = fn.body.split(/(```[\s\S]*?```|`[^`\n]+`)/); // indici dispari = codice
      let inl = 0;
      let protectedSrc = pieces.map((seg, i) => {
        if (i % 2 === 1) return seg;
        // Note inline ^[testo] → stessa resa delle note [^id] (le formule non vengono toccate)
        seg = seg.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/).map((part, k) => k % 2 === 1 ? part
          : part.replace(/\^\[([^\]\n]+)\]/g, (_, text) => { const id = '__inl' + (inl++); fn.defs[id] = text; return '[^' + id + ']'; })
        ).join('');
        const withRefs = seg.replace(/\[\^([^\]\s]+)\](?!:)/g, (m, id) => (
          Object.prototype.hasOwnProperty.call(fn.defs, id)
            ? '<sup><a href="#fn-' + refNum(id) + '">' + refNum(id) + '</a></sup>'
            : m));
        return pipeText(withRefs);
      }).join('');
      if (order.length) {
        protectedSrc += '\n\n---\n\n' + order.map((id, i) => (i + 1) + '. <a id="fn-' + (i + 1) + '"></a>' + pipeText(fn.defs[id])).join('\n') + '\n';
      }
      // Markdown → HTML
      const html = marked.parse(protectedSrc);
      // Callout in stile Obsidian: > [!tipo][+-] titolo → div.callout.callout-tipo
      const doc = new DOMParser().parseFromString('<div id="root">' + html + '</div>', 'text/html');
      doc.querySelectorAll('blockquote').forEach(bq => {
        const first = bq.firstElementChild;
        const m = first && first.textContent.match(/^\s*\[!(\w+)\][+-]?/);
        if (!m) return;
        const type = m[1].toLowerCase();
        const node = first.firstChild;
        if (node && node.nodeType === 3) node.textContent = node.textContent.replace(/^\s*\[!\w+\][+-]?\s*/, '');
        const div = doc.createElement('div');
        div.className = 'callout callout-' + type;
        div.innerHTML = bq.innerHTML;
        bq.replaceWith(div);
      });
      // Blocchi ```mermaid → contenitori che disegneremo con Mermaid
      doc.querySelectorAll('pre > code.language-mermaid').forEach(code => {
        const s = code.textContent;
        const div = doc.createElement('div');
        div.className = 'mermaid';
        div.dataset.src = s;
        div.textContent = s;
        code.parentElement.replaceWith(div);
      });
      let out = doc.getElementById('root').innerHTML;
      // Ripristino le formule, escapate: KaTeX le legge dal testo della pagina
      out = out.replace(/MATHPH(\d+)X/g, (_, i) => mdEsc(maths[+i]));
      return mdSanitize(out);
    }

    // Disegna i blocchi Mermaid; se uno non è valido, mostra il codice sorgente
    async function renderMermaidIn(el) {
      if (typeof mermaid === 'undefined') return;
      const nodes = el.querySelectorAll('div.mermaid');
      if (!nodes.length) return;
      const dark = document.body.classList.contains('dark-mode') || document.body.classList.contains('theme-dark');
      mermaid.initialize({
        startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'default',
        flowchart: { useMaxWidth: true, nodeSpacing: 40, rankSpacing: 45, padding: 10 },
        themeVariables: { fontSize: '14px' }
      });
      for (const n of nodes) {
        try { await mermaid.run({ nodes: [n] }); }
        catch (e) {
          const pre = document.createElement('pre');
          pre.textContent = n.dataset.src || '';
          n.replaceWith(pre);
          console.warn('[mermaid] schema non disegnabile:', e && e.message);
        }
      }
    }

    // Termini corretti dalla trascrizione e termini da verificare (da lecture_outline)
    function transcriptTerms(d) {
      const o = (d && d.lecture_outline) || {};
      const fixed = (Array.isArray(o.termini_corretti) ? o.termini_corretti : [])
        .filter(t => t && t.sentito && t.corretto && String(t.sentito).trim() !== String(t.corretto).trim());
      const doubts = (Array.isArray(o.dubbi) ? o.dubbi : []).filter(x => String(x || '').trim());
      return { fixed, doubts };
    }
    function transcriptTermsHtml(d) {
      const { fixed, doubts } = transcriptTerms(d);
      if (!fixed.length && !doubts.length) return '';
      let h = '<div class="callout callout-note"><strong>🔎 Dalla trascrizione</strong>';
      if (fixed.length) h += '<p>Termini corretti: ' + fixed.map(t => escHtml(t.sentito) + ' → <strong>' + escHtml(t.corretto) + '</strong>').join(', ') + '</p>';
      if (doubts.length) h += '<p>Da verificare: ' + doubts.map(x => escHtml(x)).join(', ') + '</p>';
      return h + '</div>';
    }

    function renderNotes(d) {
      document.getElementById('e-notes').style.display = 'none';
      const el = document.getElementById('notesEl'); el.style.display = 'block';
      const pdfB = d.pdf_alignment ? '<div class="pdf-ref">📄 ' + escHtml(d.pdf_alignment) + '</div>' : '';

      const sbTitle = document.getElementById('notesSidebarTitle');
      const sbSubj = document.getElementById('notesSidebarSubject');
      const sbDate = document.getElementById('notesSidebarDate');
      if (sbTitle) sbTitle.textContent = d.title || 'Appunti della lezione';
      if (sbSubj) sbSubj.textContent = d.subject || '—';
      if (sbDate) sbDate.textContent = new Date().toLocaleDateString('it-IT');

      // Appunti in Markdown (nuovo formato); notes_html resta per le lezioni salvate prima
      let body = (typeof d.notes_md === 'string' && d.notes_md.trim()) ? mdToHtml(d.notes_md) : (d.notes_html || '');

      if (!body.trim()) {
        const s = d.summary || {};
        const kps = (s.key_points || []).map(k => '<li>' + escHtml(k) + '</li>').join('');
        const defs = (s.definitions || []).map(x => '<li><strong>' + escHtml(x.term || '') + ':</strong> ' + escHtml(x.def || '') + '</li>').join('');
        const tops = (d.key_topics || []).map(t => '<span class="key-concept">' + escHtml(t) + '</span>').join(' ');
        let fb = '<div class="callout">'
          + '<strong>⚠️ Il modello non ha restituito il campo <code>notes_md</code>.</strong><br>'
          + 'Mostro qui sotto quello che era disponibile. Riprova la generazione per ottenere gli appunti completi.</div>';
        if (tops) fb += '<h2>Argomenti</h2><p>' + tops + '</p>';
        if (s.overview) fb += '<h2>Panoramica</h2><p>' + escHtml(s.overview) + '</p>';
        if (kps) fb += '<h2>Punti chiave</h2><ul>' + kps + '</ul>';
        if (defs) fb += '<h2>Definizioni</h2><ul>' + defs + '</ul>';
        if ((d.flashcards || []).length) {
          fb += '<h2>Flashcard</h2><ul>'
            + d.flashcards.map((c, i) => '<li><strong>Q' + (i + 1) + '.</strong> ' + escHtml(c.question || '') + '<br><em>→ ' + escHtml(c.answer || '') + '</em></li>').join('')
            + '</ul>';
        }
        body = fb;
      }

      el.innerHTML = '<h1>' + escHtml(d.title || 'Appunti') + '</h1>'
        + '<div class="sub">' + escHtml(d.subject || '') + ' · ' + new Date().toLocaleDateString('it-IT')
        + (d.model ? ' · ' + escHtml(d.model) : '') + '</div>'
        + pdfB + body + transcriptTermsHtml(d);
      rK(el);
      renderMermaidIn(el);
    }

    // ── SVG DIAGRAMS ──────────────────────────────────────────────
    async function renderDiags(diags) {
      if (!diags || !diags.length) return;
      document.getElementById('e-diagrams').style.display = 'none';
      const el = document.getElementById('diagEl'); el.style.display = 'grid'; el.innerHTML = '';
      for (let i = 0; i < diags.length; i++) {
        const d = diags[i];
        const card = document.createElement('div'); card.className = 'dcard';
        card.innerHTML = '<div class="dcard-h">' + escHtml(d.title || 'Diagramma ' + (i + 1)) + '</div><div class="dcard-b" id="dcb' + i + '"></div>';
        el.appendChild(card);
        const box = document.getElementById('dcb' + i);
        try { box.innerHTML = d.type === 'mindmap' ? renderMindmapSVG(d) : renderFlowchartSVG(d); }
        catch (e) { box.innerHTML = '<div style="padding:10px;font-size:.75rem;color:var(--muted)">Schema non renderizzabile</div>'; }
      }
    }

    function tw(s, fs) { return (s || '').length * (fs || 12) * 0.58; }
    function svgTL(lines, cx, cy, fs, fill, bold) {
      const lh = fs * 1.35, totalH = lines.length * lh, startY = cy - totalH / 2 + lh * 0.75;
      const fw = bold ? 'font-weight="600"' : '';
      return lines.map((l, i) => `<text x="${cx}" y="${startY + i * lh}" text-anchor="middle" dominant-baseline="auto" font-size="${fs}" fill="${fill}" font-family="Inter,sans-serif" ${fw}>${escHtml(l)}</text>`).join('');
    }
    function wrapPx(text, maxPx, fs) {
      const words = String(text || '').split(' '); const lines = []; let cur = '';
      words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (tw(t, fs) > maxPx && cur) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur); return lines.length ? lines : [text];
    }
    function r(n) { return Math.round(n * 10) / 10; }

    function renderFlowchartSVG(d) {
      const nodes = d.nodes || [], edges = d.edges || [];
      if (!nodes.length) return '<div style="padding:16px;color:var(--muted);font-size:.75rem">Nessun nodo</div>';
      const FS = 12, HP = 18, VP = 12, HG = 36, VG = 56, PAD = 28;
      const ns = {};
      nodes.forEach(n => {
        const lbl = n.label || n.id, mW = 160;
        const lines = wrapPx(lbl, mW - HP * 2, FS);
        const w = Math.max(80, Math.min(mW, Math.max(...lines.map(l => tw(l, FS))) + HP * 2));
        const h = lines.length * FS * 1.35 + VP * 2;
        ns[n.id] = { w: Math.round(n.shape === 'diamond' ? w * 1.3 : w), h: Math.round(n.shape === 'diamond' ? h * 1.4 : h), lines };
      });
      const adj = {}, inDeg = {};
      nodes.forEach(n => { adj[n.id] = []; inDeg[n.id] = 0; });
      edges.forEach(e => { if (adj[e.from]) adj[e.from].push(e.to); if (inDeg[e.to] !== undefined) inDeg[e.to]++; });
      const level = {};
      const q = nodes.filter(n => inDeg[n.id] === 0).map(n => n.id);
      if (!q.length) q.push(nodes[0].id);
      q.forEach(id => { level[id] = 0; });
      let qi = 0; while (qi < q.length) { const cur = q[qi++]; (adj[cur] || []).forEach(nxt => { if (level[nxt] === undefined) { level[nxt] = (level[cur] || 0) + 1; q.push(nxt); } }); }
      nodes.forEach(n => { if (level[n.id] === undefined) level[n.id] = 0; });
      const byLv = {}; nodes.forEach(n => { const lv = level[n.id] || 0; if (!byLv[lv]) byLv[lv] = []; byLv[lv].push(n); });
      const maxLv = Math.max(...Object.keys(byLv).map(Number));
      const lvH = {}; for (let lv = 0; lv <= maxLv; lv++)lvH[lv] = Math.max(...(byLv[lv] || [{ id: '_' }]).map(n => ns[n.id]?.h || 40));
      const lvY = {}; let yOff = PAD;
      for (let lv = 0; lv <= maxLv; lv++) { lvY[lv] = yOff + lvH[lv] / 2; yOff += lvH[lv] + VG; }
      const pos = {};
      for (let lv = 0; lv <= maxLv; lv++) {
        const row = byLv[lv] || [];
        const totW = row.reduce((a, n) => a + ns[n.id].w, 0) + (row.length - 1) * HG;
        let xOff = PAD + Math.max(0, (Math.max(...Object.values(byLv).map(rw => rw.reduce((a, n) => a + ns[n.id].w, 0) + (rw.length - 1) * HG)) - totW) / 2);
        row.forEach(n => { const sz = ns[n.id]; pos[n.id] = { x: xOff, y: lvY[lv] - sz.h / 2, cx: xOff + sz.w / 2, cy: lvY[lv], w: sz.w, h: sz.h }; xOff += sz.w + HG; });
      }
      const svgW = Math.max(...Object.values(pos).map(p => p.x + p.w)) + PAD;
      const svgH = yOff - VG + PAD;
      const PAL = { rect: { fill: '#EEF2FF', stroke: '#4F46E5', text: '#1E293B' }, diamond: { fill: '#F8FAFC', stroke: '#64748B', text: '#1E293B' }, circle: { fill: '#F1F5F9', stroke: '#475569', text: '#1E293B' } };
      let svgN = '', svgE = '';
      nodes.forEach(n => {
        const p = pos[n.id]; if (!p) return;
        const sz = ns[n.id], pal = PAL[n.shape || 'rect'] || PAL.rect;
        if (n.shape === 'diamond') { const hw = sz.w / 2, hh = sz.h / 2; svgN += `<polygon points="${r(p.cx)},${r(p.cy - hh)} ${r(p.cx + hw)},${r(p.cy)} ${r(p.cx)},${r(p.cy + hh)} ${r(p.cx - hw)},${r(p.cy)}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`; svgN += svgTL(sz.lines, p.cx, p.cy, FS, pal.text, true); }
        else if (n.shape === 'circle') { const rad = Math.max(sz.w, sz.h) / 2; svgN += `<circle cx="${r(p.cx)}" cy="${r(p.cy)}" r="${r(rad)}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`; svgN += svgTL(sz.lines, p.cx, p.cy, FS, pal.text, false); }
        else { svgN += `<rect x="${r(p.x)}" y="${r(p.y)}" width="${r(sz.w)}" height="${r(sz.h)}" rx="8" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`; svgN += svgTL(sz.lines, p.cx, p.cy, FS, pal.text, false); }
      });
      edges.forEach((e, ei) => {
        const fp = pos[e.from], tp = pos[e.to]; if (!fp || !tp) return;
        const x1 = r(fp.cx), y1 = r(fp.cy + (fp.h || 40) / 2 + 2), x2 = r(tp.cx), y2 = r(tp.cy - (tp.h || 40) / 2 - 2);
        const cp1y = r(y1 + (y2 - y1) * 0.45), cp2y = r(y1 + (y2 - y1) * 0.55);
        svgE += `<path d="M${x1},${y1} C${x1},${cp1y} ${x2},${cp2y} ${x2},${y2}" fill="none" stroke="#64748B" stroke-width="1.8" stroke-opacity="0.7" marker-end="url(#arw${ei})"/>`;
        if (e.label) { const lx = r((x1 + x2) / 2), ly = r((y1 + y2) / 2), lw = tw(e.label, 10) + 16; svgE += `<rect x="${r(lx - lw / 2)}" y="${r(ly - 9)}" width="${r(lw)}" height="17" rx="4" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/><text x="${lx}" y="${r(ly + 4)}" text-anchor="middle" font-size="10" fill="#64748B" font-family="Inter,sans-serif">${escHtml(e.label)}</text>`; }
      });
      const markers = edges.map((_, i) => `<marker id="arw${i}" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><polygon points="0 0,9 3.5,0 7" fill="#64748B"/></marker>`).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(svgW)} ${r(svgH)}" style="width:100%;max-width:${r(svgW)}px;height:auto;display:block"><defs>${markers}</defs>${svgE}${svgN}</svg>`;
    }

    function renderMindmapSVG(d) {
      const rootLabel = d.root || 'Root', children = d.children || [];
      const FS = 12, FSS = 11, HG = 50, VG = 14;
      const COLS = ['#4F46E5', '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B'];
      function nSz(label, fs, mW) { const lines = wrapPx(label, mW, fs); const w = Math.max(60, Math.min(mW, Math.max(...lines.map(l => tw(l, fs))) + 24)); const h = lines.length * fs * 1.35 + 16; return { w: Math.round(w), h: Math.round(h), lines }; }
      const childData = children.map((c, ci) => {
        const cSz = nSz(c.label || '', FS, 140);
        const gcs = (c.children || []).map(gc => ({ label: gc.label || '', sz: nSz(gc.label || '', FSS, 130) }));
        const gcH = gcs.length ? gcs.reduce((a, gc) => a + gc.sz.h, 0) + (gcs.length - 1) * VG : 0;
        return { label: c.label || '', sz: cSz, gcs, blockH: Math.max(cSz.h, gcH), col: COLS[ci % COLS.length] };
      });
      const PAD = 24, rootSz = nSz(rootLabel, 13, 150);
      const c0 = PAD, c1 = c0 + rootSz.w + HG;
      const c2 = childData.some(c => c.gcs.length) ? c1 + Math.max(...childData.map(c => c.sz.w), 80) + HG : 0;
      let totH = 0; childData.forEach(c => { totH += c.blockH + VG; }); totH -= VG;
      const svgH = Math.max(rootSz.h + PAD * 2, totH + PAD * 2);
      const svgW = c2 ? c2 + Math.max(...childData.flatMap(c => c.gcs.map(gc => gc.sz.w)), 60) + PAD : c1 + Math.max(...childData.map(c => c.sz.w), 80) + PAD;
      let curY = PAD + (svgH - PAD * 2 - totH) / 2;
      const rCX = c0 + rootSz.w / 2, rCY = svgH / 2;
      let el = `<rect x="${c0}" y="${r(rCY - rootSz.h / 2)}" width="${rootSz.w}" height="${rootSz.h}" rx="${rootSz.h / 2}" fill="#4F46E5" filter="url(#sh)"/>`;
      el += svgTL(rootSz.lines, rCX, rCY, 13, '#fff', true);
      childData.forEach(c => {
        const bCY = curY + c.blockH / 2, cCX = c1 + c.sz.w / 2;
        el += `<path d="M${r(c0 + rootSz.w)},${r(rCY)} C${r(c0 + rootSz.w + HG * 0.6)},${r(rCY)} ${r(c1 - HG * 0.6)},${r(bCY)} ${r(c1)},${r(bCY)}" fill="none" stroke="${c.col}" stroke-width="2" stroke-opacity="0.55"/>`;
        el += `<rect x="${c1}" y="${r(bCY - c.sz.h / 2)}" width="${c.sz.w}" height="${c.sz.h}" rx="${c.sz.h / 2}" fill="${c.col}"/>`;
        el += svgTL(c.sz.lines, cCX, bCY, FS, '#fff', true);
        if (c.gcs.length && c2) {
          const gcTH = c.gcs.reduce((a, gc) => a + gc.sz.h, 0) + (c.gcs.length - 1) * VG; let gcY = bCY - gcTH / 2;
          c.gcs.forEach(gc => {
            const gCY = gcY + gc.sz.h / 2, gCX = c2 + gc.sz.w / 2;
            el += `<path d="M${r(c1 + c.sz.w)},${r(bCY)} C${r(c1 + c.sz.w + HG * 0.5)},${r(bCY)} ${r(c2 - HG * 0.5)},${r(gCY)} ${r(c2)},${r(gCY)}" fill="none" stroke="${c.col}" stroke-width="1.5" stroke-opacity="0.35"/>`;
            el += `<rect x="${c2}" y="${r(gCY - gc.sz.h / 2)}" width="${gc.sz.w}" height="${gc.sz.h}" rx="${gc.sz.h / 2}" fill="${c.col}" fill-opacity="0.15" stroke="${c.col}" stroke-width="1.5"/>`;
            el += svgTL(gc.sz.lines, gCX, gCY, FSS, c.col, false);
            gcY += gc.sz.h + VG;
          });
        }
        curY += c.blockH + VG;
      });
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(svgW)} ${r(svgH)}" style="width:100%;max-width:${r(svgW)}px;height:auto;display:block"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/></filter></defs>${el}</svg>`;
    }

    function renderSumm(s, d) {
      if (!s) return;
      document.getElementById('e-summary').style.display = 'none';
      const el = document.getElementById('summEl'); el.style.display = 'block';
      const kps = (s.key_points || []).map(k => '<li>' + escHtml(k) + '</li>').join('');
      const defs = (s.definitions || []).map(x => '<div style="padding:8px 0;border-bottom:1px solid var(--border)"><strong style="color:var(--accent);font-family:\'JetBrains Mono\',monospace">' + escHtml(x.term || '') + '</strong><p style="margin:2px 0 0;font-size:.84rem;color:var(--ink)">' + escHtml(x.def || '') + '</p></div>').join('');
      const tops = (d.key_topics || []).map(t => '<span style="display:inline-block;background:var(--accent-soft);color:var(--accent);font-weight:600;padding:4px 12px;border-radius:20px;font-size:.75rem;margin:3px">' + escHtml(t) + '</span>').join('');
      const miss = s.missing_from_lecture ? '<div class="callout"><strong>Nel PDF ma non trattato:</strong><br>' + escHtml(s.missing_from_lecture) + '</div>' : '';
      el.innerHTML = '<h1 style="font-size:1.6rem;font-weight:700;margin-bottom:18px">' + escHtml(d.title || 'Sommario') + '</h1>'
        + '<div class="sgrid"><div class="scard"><div class="scard-l">Difficoltà</div><div class="big">' + escHtml(s.difficulty || '—') + '</div></div>'
        + '<div class="scard"><div class="scard-l">Materia</div><div style="font-size:.95rem;font-weight:600;color:var(--ink);padding-top:3px">' + escHtml(d.subject || '—') + '</div></div></div>'
        + '<div style="margin-bottom:18px"><div class="lbl" style="margin-bottom:7px">Argomenti</div>' + tops + '</div>'
        + '<div class="callout"><strong>Panoramica:</strong> ' + escHtml(s.overview || '') + '</div>' + miss
        + '<h2 style="font-size:1.1rem;font-weight:700;margin:20px 0 9px;border-bottom:1px solid var(--border);padding-bottom:6px">Punti chiave</h2>'
        + '<ul style="padding-left:18px;line-height:1.9;color:var(--ink)">' + kps + '</ul>'
        + (defs ? '<h2 style="font-size:1.1rem;font-weight:700;margin:20px 0 9px;border-bottom:1px solid var(--border);padding-bottom:6px">Definizioni</h2>' + defs : '');
      rK(el);
    }

    function renderFlash(cards) {
      if (!cards.length) return;
      document.getElementById('e-flash').style.display = 'none';
      const el = document.getElementById('flashEl'); el.style.display = 'block';
      el.innerHTML = '<h1 style="font-size:1.6rem;font-weight:700;margin-bottom:6px">Flashcard</h1>'
        + '<p style="color:var(--muted);font-size:.82rem;margin-bottom:22px">' + cards.length + ' carte · Clicca per girare</p>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:14px">'
        + cards.map((c, i) => '<div onclick="flip(this)" style="cursor:pointer;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:18px;min-height:130px;display:flex;flex-direction:column;justify-content:space-between;transition:all .15s">'
          + '<div class="lbl" style="margin-bottom:7px">Q' + (i + 1) + '</div>'
          + '<div style="font-size:.86rem;line-height:1.6;color:var(--ink);font-weight:600">' + escHtml(c.question || '') + '</div>'
          + '<div class="fa" style="display:none;font-size:.84rem;line-height:1.7;color:var(--accent);margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">' + escHtml(c.answer || '') + '</div>'
          + '<div style="font-size:.68rem;color:var(--muted);margin-top:8px;font-family:\'JetBrains Mono\',monospace">tap per risposta</div>'
          + '</div>').join('') + '</div>';
      rK(el);
    }
    function flip(c) {
      const a = c.querySelector('.fa'), h = c.lastElementChild, s = a.style.display === 'none';
      a.style.display = s ? 'block' : 'none';
      c.style.borderColor = s ? 'var(--accent)' : 'var(--border)';
      if (h) h.textContent = s ? 'tap per nascondere' : 'tap per risposta';
    }

    // ══════════════════════════════════════════════════════════════
    //  AVANZAMENTO DELLA GENERAZIONE: elenco dei passi nell'overlay
    // ══════════════════════════════════════════════════════════════
    const Prog = {
      steps: [], timer: null,
      _mk(id, label) { return { id, label, state: 'todo', t0: 0, ms: 0, model: '', note: '' }; },
      start(list) {
        this.steps = (list || []).map(([id, label]) => this._mk(id, label));
        clearInterval(this.timer);
        this.timer = setInterval(() => this.render(), 1000);
        const c = document.getElementById('ovCancel');
        if (c) { c.style.display = ''; c.disabled = false; c.textContent = 'Annulla'; }
        this.render();
      },
      append(list) { (list || []).forEach(([id, label]) => this.steps.push(this._mk(id, label))); this.render(); },
      get(id) { return this.steps.find(s => s.id === id); },
      active() { return this.steps.find(s => s.state === 'active'); },
      begin(id) {
        const cur = this.active();
        if (cur && cur.id !== id) this.done(cur.id);
        const s = this.get(id); if (!s) return;
        s.state = 'active'; s.t0 = Date.now(); s.note = ''; this.render();
      },
      _end(id, state, note) {
        const s = this.get(id); if (!s) return;
        if (s.state === 'active') s.ms = Date.now() - s.t0;
        s.state = state; if (note !== undefined) s.note = note; this.render();
      },
      done(id, note) { this._end(id, 'done', note); },
      skip(id, note) { this._end(id, 'skip', note); },
      fail(id, note) { this._end(id, 'fail', note); },
      label(id, text) { const s = this.get(id); if (s) { s.label = text; this.render(); } },
      model(m) { const s = this.active(); if (s && s.model !== m) { s.model = m; this.render(); } },
      note(t) { const s = this.active(); if (s) { s.note = t || ''; this.render(); } },
      currentLabel() { const s = this.active(); return s ? s.label : ''; },
      stop() {
        clearInterval(this.timer); this.timer = null;
        const a = this.active(); if (a) this.fail(a.id);
        const c = document.getElementById('ovCancel'); if (c) c.style.display = 'none';
      },
      render() {
        const el = document.getElementById('ovSteps');
        if (!el) return;
        if (!this.steps.length) { el.innerHTML = ''; return; }
        const icon = { todo: '○', active: '◐', done: '✓', skip: '–', fail: '✕' };
        const sec = ms => { const s = Math.round(ms / 1000); return s >= 60 ? Math.floor(s / 60) + 'm ' + (s % 60) + 's' : s + 's'; };
        el.innerHTML = this.steps.map(s => {
          const t = s.state === 'active' ? sec(Date.now() - s.t0) : (s.ms ? sec(s.ms) : '');
          const det = [s.model, s.note].filter(Boolean).join(' · ');
          return '<li class="ovst ovst-' + s.state + '"><span class="ovst-i">' + icon[s.state] + '</span>'
            + '<span class="ovst-l">' + escHtml(s.label) + '</span><span class="ovst-t">' + t + '</span>'
            + (det ? '<div class="ovst-d">' + escHtml(det) + '</div>' : '') + '</li>';
        }).join('');
        // Barra: passi conclusi più metà di quello in corso
        const n = this.steps.length;
        const fin = this.steps.filter(s => s.state === 'done' || s.state === 'skip').length + (this.active() ? 0.5 : 0);
        const bar = document.getElementById('bar');
        if (bar) bar.style.width = Math.round(100 * fin / n) + '%';
      }
    };

    async function sleepAbortable(ms) {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        throwIfAborted();
        await new Promise(r => setTimeout(r, Math.min(250, end - Date.now())));
      }
      throwIfAborted();
    }

    function cancelGeneration() {
      if (!_genAbort) return;
      _genAbort.abort();
      const c = document.getElementById('ovCancel');
      if (c) { c.disabled = true; c.textContent = 'Annullamento...'; }
      setOv('Annullamento in corso...');
    }

    // ══════════════════════════════════════════════════════════════
    //  REGISTRO DELLE CHIAMATE (Impostazioni → per esperti)
    // ══════════════════════════════════════════════════════════════
    function renderApiLog() {
      const box = document.getElementById('apiLogBox');
      const sum = document.getElementById('apiLogSummary');
      if (!box || !sum) return;
      const log = readApiLog();
      const today = new Date().toDateString();
      const per = {};
      log.filter(e => new Date(e.t).toDateString() === today && e.model).forEach(e => {
        const p = per[e.model] || (per[e.model] = { ok: 0, err: 0, tin: 0, tout: 0, tthink: 0 });
        if (e.outcome === 'ok') p.ok++; else if (e.outcome === 'errore') p.err++;
        p.tin += e.tin || 0; p.tout += e.tout || 0; p.tthink += e.tthink || 0;
      });
      const fmt = n => (n || 0).toLocaleString('it-IT');
      const blocked = gemBlocked();
      const rows = Object.keys(per).map(m => '<tr><td>' + escHtml(m) + '</td><td>' + per[m].ok + '</td><td>' + per[m].err + '</td><td>'
        + fmt(per[m].tin) + '</td><td>' + fmt(per[m].tout) + '</td><td>' + fmt(per[m].tthink) + '</td></tr>').join('');
      const bl = Object.keys(blocked).map(m => escHtml(m) + ' (fino alle ' + new Date(blocked[m]).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + ')');
      sum.innerHTML = '<div class="apiLogTitle">Oggi</div>'
        + (rows ? '<table class="apiLogTable"><tr><th>Modello</th><th>OK</th><th>Errori</th><th>Token in</th><th>Token out</th><th>Ragion.</th></tr>' + rows + '</table>'
          : '<div class="setHint">Nessuna chiamata oggi.</div>')
        + '<div class="setHint">Livelli: lavori impegnativi → ' + GEM_TIERS.heavy[0] + ', lavori leggeri → ' + GEM_TIERS.light[0]
        + '. I limiti giornalieri di Google si azzerano alle ' + gemResetTime() + '.</div>'
        + (bl.length ? '<div class="setHint">Modelli saltati per oggi: ' + bl.join(', ') + '</div>' : '');
      const icon = { ok: '✓', errore: '✕', cambio: '↪', annullata: '⏹', verifica: '🔎' };
      box.innerHTML = log.length ? '<table class="apiLogTable"><tr><th>Ora</th><th>Passo</th><th>Modello</th><th></th><th>HTTP</th><th>Durata</th><th>Token</th><th>Dettagli</th></tr>'
        + log.slice(-80).reverse().map(e => '<tr class="apiLog-' + escHtml(e.outcome || '') + '"><td>'
          + new Date(e.t).toLocaleTimeString('it-IT') + '</td><td>' + escHtml(e.step || '') + '</td><td>'
          + escHtml(e.model || '') + (e.ver && e.ver !== e.model ? '<br><small>' + escHtml(e.ver) + '</small>' : '') + '</td><td>'
          + (icon[e.outcome] || '') + '</td><td>' + (e.http || '') + '</td><td>' + (e.ms ? (e.ms / 1000).toFixed(1) + 's' : '') + '</td><td>'
          + (e.tin || e.tout ? fmt(e.tin) + ' / ' + fmt(e.tout) + (e.tthink ? ' / ' + fmt(e.tthink) : '') : '') + '</td><td>'
          + escHtml(e.msg || '') + '</td></tr>').join('') + '</table>'
        : '<div class="setHint">Il registro è vuoto.</div>';
    }

    function clearApiLog() {
      safeRemove(API_LOG_KEY);
      safeRemove(GEM_BLOCK_KEY);
      renderApiLog();
      toast('Registro svuotato.', 'ok');
    }

    function copyApiLog() {
      const text = JSON.stringify(readApiLog(), null, 1);
      navigator.clipboard.writeText(text).then(() => toast('✓ Registro copiato.', 'ok'))
        .catch(() => toast('Impossibile copiare il registro.', 'err'));
    }

    // Prova ogni modello dei livelli con una richiesta minima (usa 1 richiesta per modello)
    async function checkGeminiModels() {
      const key = cleanKey(document.getElementById('apiInput').value) || apiKey;
      if (provider !== 'gemini' || !key) { toast('Seleziona Google Gemini e inserisci la chiave.', 'err'); return; }
      apiKey = key;
      _geminiModelsCache = null;
      const avail = await discoverGeminiModels();
      const models = [...new Set([...GEM_TIERS.heavy, ...GEM_TIERS.light])];
      toast('Verifica dei modelli in corso...', 'ok');
      for (const model of models) {
        if (avail && !avail.has(model)) { apiLog({ step: 'Verifica modelli', model, outcome: 'verifica', msg: 'non presente nell\'elenco della chiave' }); continue; }
        const t0 = Date.now();
        try {
          const res = await fetch(`/api/gemini/${model}:generateContent`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Rispondi solo: ok' }] }] })
          });
          const j = await res.json().catch(() => ({}));
          const u = j.usageMetadata || {};
          apiLog({ step: 'Verifica modelli', model, ver: j.modelVersion || '', outcome: res.ok ? 'ok' : 'errore', http: res.status,
            ms: Date.now() - t0, tin: u.promptTokenCount || 0, tout: u.candidatesTokenCount || 0, tthink: u.thoughtsTokenCount || 0,
            msg: res.ok ? 'disponibile' : String(j.error?.message || '').slice(0, 300) });
        } catch (e) {
          apiLog({ step: 'Verifica modelli', model, outcome: 'errore', msg: e.message, ms: Date.now() - t0 });
        }
      }
      renderApiLog();
      toast('✓ Verifica completata: risultati nel registro.', 'ok');
    }

    // ══════════════════════════════════════════════════════════════
    //  LOADING / TOAST
    // ══════════════════════════════════════════════════════════════
    function setOv(msg, pct) {
      document.getElementById('ov').classList.add('on');
      document.getElementById('ovS').textContent = msg || '';
      if (pct !== undefined) document.getElementById('bar').style.width = pct + '%';
    }
    function hideOv() { document.getElementById('ov').classList.remove('on'); document.getElementById('bar').style.width = '0%'; }
    function toast(msg, type) {
      const t = document.getElementById('toast');
      t.textContent = msg; t.className = 'toast ' + (type || 'ok') + ' on';
      clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 7000);
    }

    // ══════════════════════════════════════════════════════════════
    //  EXPORT
    // ══════════════════════════════════════════════════════════════
    function texMd(s) { return (s || '').replace(/\\\(\s*/g, '$').replace(/\s*\\\)/g, '$').replace(/\\\[\s*/g, '$$').replace(/\s*\\\]/g, '$$'); }

    function htmlToMd(html) {
      if (!html) return '';
      const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
      const root = doc.body.firstChild;
      let secNum = 0;
      function inline(node) {
        let out = '';
        node.childNodes.forEach(n => {
          if (n.nodeType === 3) { out += texMd(n.textContent); }
          else if (n.nodeType === 1) {
            const tag = n.tagName.toLowerCase();
            const cls = n.className || '';
            if (tag === 'strong' || tag === 'b') out += '**' + inline(n).trim() + '**';
            else if (tag === 'em' || tag === 'i') out += '*' + inline(n).trim() + '*';
            else if (tag === 'code') out += '`' + n.textContent + '`';
            else if (tag === 'br') out += '\n';
            else if (cls.includes('key-concept')) out += '**' + inline(n).trim() + '**';
            else out += inline(n);
          }
        });
        return out;
      }
      function block(node) {
        let out = '';
        node.childNodes.forEach(n => {
          if (n.nodeType !== 1) {
            const t = n.textContent.trim();
            if (t) out += texMd(t) + '\n\n';
            return;
          }
          const tag = n.tagName.toLowerCase();
          const cls = n.className || '';
          if (tag === 'h1') out += '# ' + inline(n).trim() + '\n\n';
          else if (tag === 'h2') { secNum++; out += '## ' + secNum + '. ' + inline(n).trim() + '\n\n'; }
          else if (tag === 'h3') out += '### ' + inline(n).trim() + '\n\n';
          else if (tag === 'p') out += inline(n).trim() + '\n\n';
          else if (tag === 'ul') {
            n.querySelectorAll(':scope > li').forEach(li => { out += '* ' + inline(li).trim() + '\n'; });
            out += '\n';
          }
          else if (tag === 'ol') {
            let i = 0;
            n.querySelectorAll(':scope > li').forEach(li => { i++; out += i + '. ' + inline(li).trim() + '\n'; });
            out += '\n';
          }
          else if (tag === 'pre') {
            const code = n.querySelector('code');
            const txt = (code ? code.textContent : n.textContent).replace(/\n+$/, '');
            out += '```\n' + txt + '\n```\n\n';
          }
          else if (cls.includes('callout')) {
            out += '> [!note]\n> ' + inline(n).trim().replace(/\n+/g, '\n> ') + '\n\n';
          }
          else if (cls.includes('pdf-ref')) {
            out += '> ' + inline(n).trim() + '\n\n';
          }
          else {
            out += block(n);
          }
        });
        return out;
      }
      return block(root).replace(/\n{3,}/g, '\n\n').trim();
    }

    function dataCreazione() {
      return new Date().toLocaleDateString('it-IT', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    }

    function buildObsidianMd() {
      if (!lastData) return '';
      const d = lastData;

      let md = '';
      if (typeof d.notes_md === 'string' && d.notes_md.trim()) {
        // Formato Obsidian: frontmatter YAML + Markdown degli appunti così come generato
        const q = v => '"' + String(v || '').replace(/"/g, '\\"') + '"';
        md += '---\n';
        md += 'title: ' + q(d.title || 'Appunti') + '\n';
        if (d.subject) md += 'subject: ' + q(d.subject) + '\n';
        md += 'date: ' + new Date().toISOString().slice(0, 10) + '\n';
        md += 'source: LectureAI\n';
        md += 'tags: [lectureai]\n';
        md += '---\n\n';
        md += '# ' + (d.title || 'Appunti') + '\n\n';
        md += d.notes_md.trim() + '\n\n';
        const tt = transcriptTerms(d);
        if (tt.fixed.length || tt.doubts.length) {
          md += '> [!note]- 🔎 Dalla trascrizione\n';
          if (tt.fixed.length) md += '> Termini corretti: ' + tt.fixed.map(t => t.sentito + ' → **' + t.corretto + '**').join(', ') + '\n';
          if (tt.fixed.length && tt.doubts.length) md += '>\n';
          if (tt.doubts.length) md += '> Da verificare: ' + tt.doubts.join(', ') + '\n';
          md += '\n';
        }
      } else {
        md += '# ' + (d.title || 'Appunti') + '\n\n';
        const meta = [];
        if (d.subject) meta.push('**Materia:** ' + d.subject);
        meta.push('**Data:** ' + dataCreazione());
        meta.push('**Fonte:** LectureAI');
        md += meta.join('  \n') + '\n\n---\n\n';
        if (d.notes_html) md += htmlToMd(d.notes_html) + '\n\n';
      }

      const s = d.summary;
      if (s && (s.overview || (s.key_points || []).length || (s.definitions || []).length)) {
        md += '---\n\n## Sommario\n\n';
        if (s.overview) md += texMd(s.overview) + '\n\n';
        if ((s.key_points || []).length) md += s.key_points.map(k => '* ' + texMd(k)).join('\n') + '\n\n';
        if ((s.definitions || []).length) md += s.definitions.map(x => '* **' + x.term + '**: ' + texMd(x.def)).join('\n') + '\n\n';
      }

      if ((d.flashcards || []).length) {
        md += '---\n\n## Flashcard\n\n';
        md += d.flashcards.map((f, i) => '**Q' + (i + 1) + '.** ' + texMd(f.question) + '\n**A:** ' + texMd(f.answer)).join('\n\n') + '\n\n';
      }

      return md.replace(/\n{3,}/g, '\n\n').trim();
    }

    // ══════════════════════════════════════════════════════════════
    //  IMPOSTAZIONI — Gestione preset del prompt e Tema
    // ══════════════════════════════════════════════════════════════
    const PRESET_LABELS = {
      informatica: 'Informatica / Ingegneria / Scienze informatiche',
      medicina: 'Medicina / Biologia / Scienze della salute',
      giurisprudenza: 'Giurisprudenza / Diritto',
      economia: 'Economia / Management / Finanza',
      umanistiche: 'Lettere / Filosofia / Storia / Lingue',
      scienze: 'Fisica / Chimica / Matematica / Scienze naturali',
      generale: 'Generale — Riunioni / Seminari / Corsi professionali'
    };

    function openSettings() {
      const sel = document.getElementById('presetSel');
      if (!sel.options.length) {
        Object.keys(PRESET_LABELS).forEach(k => {
          const o = document.createElement('option');
          o.value = k; o.textContent = PRESET_LABELS[k];
          sel.appendChild(o);
        });
      }
      sel.value = activePreset;
      document.getElementById('presetEdit').value = getPanel();
      loadAppTheme();
      document.getElementById('settingsOv').classList.add('on');
    }
    function closeSettings() {
      document.getElementById('settingsOv').classList.remove('on');
    }
    function onPresetChange() {
      const sel = document.getElementById('presetSel');
      activePreset = sel.value;
      customPanel = safeGet(getCustomKey(activePreset)) || null;
      document.getElementById('presetEdit').value = getPanel();
    }
    function resetPresetEdit() {
      const def = PRESET_PANELS[activePreset] || '';
      document.getElementById('presetEdit').value = def;
      safeRemove(getCustomKey(activePreset));
      customPanel = null;
      toast('Preset ripristinato (non ancora salvato)', 'ok');
    }
    function savePreset() {
      const val = document.getElementById('presetEdit').value.trim();
      const def = PRESET_PANELS[activePreset] || '';
      if (val === def.trim()) {
        safeRemove(getCustomKey(activePreset));
        customPanel = null;
      } else {
        safeSet(getCustomKey(activePreset), val);
        customPanel = val;
      }
      safeSet('lai_preset', activePreset);
      toast('✓ Impostazioni salvate', 'ok');
      closeSettings();
    }

    function showMdModal() {
      if (!lastData) { toast('Prima genera degli appunti.', 'err'); return; }
      const md = buildObsidianMd();
      let modal = document.getElementById('mdModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mdModal';
        modal.className = 'mdOv';
        modal.innerHTML = '<div class="mdBoxWrap"><div class="mdBoxHead"><span>Markdown per Obsidian</span><button class="mdClose" onclick="closeMdModal()">✕</button></div><pre class="mdBox" id="mdBoxTxt"></pre><div class="mdBoxFoot"><button class="xbtn" onclick="copyMdModal()">Copia tutto</button></div></div>';
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) closeMdModal(); });
      }
      document.getElementById('mdBoxTxt').textContent = md;
      modal.classList.add('on');
    }
    function closeMdModal() { const m = document.getElementById('mdModal'); if (m) m.classList.remove('on'); }
    function copyMdModal() {
      const txt = document.getElementById('mdBoxTxt').textContent;
      navigator.clipboard.writeText(txt).then(() => toast('✓ Markdown copiato! Incollalo in Obsidian.', 'ok'));
    }

    function exportMd() {
      if (!lastData) return;
      const d = lastData;
      const md = buildObsidianMd();
      dl(md, (d.title || 'appunti').replace(/[^\w\-àèéìòù ]/gi, '').trim() + '.md', 'text/markdown');
    }

    function exportHtml() {
      if (!lastData) return;
      const c = document.getElementById('notesEl').innerHTML;
      const html = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>' + (lastData.title || 'Appunti') + '</title>'
        + '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">'
        + '<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"><\/script>'
        + '<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"><\/script>'
        + '<style>body{font-family:Inter,sans-serif;max-width:820px;margin:40px auto;padding:24px;color:#1E293B;line-height:1.7}'
        + 'h1{font-size:2rem}h2{border-bottom:1px solid #E2E8F0;padding-bottom:4px;margin:24px 0 10px}'
        + 'pre{background:#0F172A;color:#E2E8F0;padding:14px;border-radius:8px;overflow-x:auto}'
        + '.callout{border-left:4px solid #4F46E5;padding:10px 16px;background:#EEF2FF;margin:12px 0}'
        + '.key-concept{background:#EEF2FF;border:1px solid rgba(79,70,229,.3);border-radius:4px;padding:2px 6px;font-weight:600;color:#4F46E5}'
        + '</style></head><body>' + c
        + '<script>renderMathInElement(document.body,{delimiters:[{left:"\\\\[",right:"\\\\]",display:true},{left:"\\\\(",right:"\\\\)",display:false}],throwOnError:false});<\/script>'
        + '</body></html>';
      dl(html, 'appunti.html', 'text/html');
    }

    function copyTxt() {
      const el = document.getElementById('notesEl'); if (!el) return;
      navigator.clipboard.writeText(el.innerText).then(() => toast('✓ Testo copiato!', 'ok'));
    }

    function dl(content, name, type) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([content], { type }));
      a.download = name; a.click();
    }

    function printAll() {
      if (!lastData) return;
      const d = lastData;
      const notesHtml = document.getElementById('notesEl')?.innerHTML || '';
      const summHtml = document.getElementById('summEl')?.innerHTML || '';
      let diagsHtml = '';
      document.getElementById('diagEl')?.querySelectorAll('.dcard').forEach(card => {
        const title = card.querySelector('.dcard-h')?.textContent || '';
        const svg = card.querySelector('svg');
        diagsHtml += '<div style="page-break-inside:avoid;margin:16px 0;text-align:center"><h3 style="font-size:10pt;font-family:monospace;color:#64748B;margin-bottom:6px">' + escHtml(title) + '</h3>' + (svg ? svg.outerHTML : '') + '</div>';
      });
      const flashHtml = d.flashcards?.length ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
        + d.flashcards.map((c, i) => `<div style="border:1px solid #E2E8F0;border-radius:8px;padding:12px;page-break-inside:avoid"><div style="font-weight:600;font-size:10pt;margin-bottom:6px">Q${i + 1}. ${escHtml(c.question || '')}</div><div style="color:#4F46E5;font-size:9.5pt;border-top:1px solid #E2E8F0;padding-top:6px;margin-top:6px">${escHtml(c.answer || '')}</div></div>`).join('') + '</div>' : '';
      const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${escHtml(d.title || 'Appunti')}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"><\/script>
<style>@page{margin:18mm 16mm}body{font-family:Inter,sans-serif;color:#1E293B;line-height:1.75;font-size:11pt}h1{font-size:22pt;margin:0 0 4px}h2{font-size:14pt;border-bottom:1px solid #E2E8F0;padding-bottom:3px;margin:24px 0 10px}h3{font-size:11pt;color:#4F46E5}pre{background:#0F172A;color:#E2E8F0;padding:12px;border-radius:8px;font-size:9pt;white-space:pre-wrap;page-break-inside:avoid}.callout{border-left:4px solid #4F46E5;padding:9px 14px;background:#EEF2FF;margin:10px 0;page-break-inside:avoid}.key-concept{background:#EEF2FF;border:1px solid rgba(79,70,229,.3);border-radius:4px;padding:1px 5px;font-weight:600;color:#4F46E5}.doc-header{border-bottom:2px solid #4F46E5;padding-bottom:14px;margin-bottom:24px}.doc-sub{font-family:monospace;font-size:8.5pt;color:#64748B;margin-top:4px}.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}.scard{border:1px solid #E2E8F0;border-radius:8px;padding:12px;page-break-inside:avoid}.scard-l{font-size:7pt;text-transform:uppercase;letter-spacing:2px;color:#64748B;margin-bottom:4px;font-family:monospace}.big{font-size:18pt;font-weight:700}</style>
</head><body>
<div class="doc-header"><h1>${escHtml(d.title || 'Appunti')}</h1><div class="doc-sub">${escHtml(d.subject || '')} · ${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · LectureAI</div></div>
<h2>Appunti</h2>${notesHtml}
${diagsHtml ? '<h2>Schemi</h2>' + diagsHtml : ''}
${summHtml ? '<h2>Sommario</h2>' + summHtml : ''}
${flashHtml ? '<h2>Flashcard</h2>' + flashHtml : ''}
<script>renderMathInElement(document.body,{delimiters:[{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false}],throwOnError:false});setTimeout(()=>window.print(),800);<\/script>
</body></html>`;
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) { toast('Popup bloccato!', 'err'); return; }
      win.document.write(html); win.document.close();
    }
