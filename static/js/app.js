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
      try { localStorage.setItem(k, v); }
      catch (e) {
        if (!_storageBlocked) {
          _storageBlocked = true;
          console.warn('[LectureAI] localStorage bloccato (Safari ITP?)');
        }
      }
    }
    function safeRemove(k) {
      try { localStorage.removeItem(k); }
      catch (e) { /* silenzioso */ }
    }

    // ══════════════════════════════════════════════════════════════
    //  SISTEMA DI TEMI (lai_theme: light, blue, green, dark)
    // ══════════════════════════════════════════════════════════════
    const THEME_KEY = 'lai_theme';
    const DARK_KEY = 'lai_darkmode';

    function loadAppTheme() {
      let savedTheme = safeGet(THEME_KEY);
      if (!savedTheme) {
        savedTheme = safeGet(DARK_KEY) === 'true' ? 'dark' : 'light';
      }
      applyThemeClasses(savedTheme);
    }

    function applyThemeClasses(theme) {
      const valid = ['light', 'blue', 'green', 'dark'].includes(theme) ? theme : 'light';
      document.body.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-dark', 'dark-mode');
      document.body.classList.add('theme-' + valid);
      if (valid === 'dark') {
        document.body.classList.add('dark-mode');
      }
      document.querySelectorAll('#themeSelectorGrid .theme-option-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === valid);
      });
    }

    function setAppTheme(theme) {
      applyThemeClasses(theme);
      safeSet(THEME_KEY, theme);
      safeSet(DARK_KEY, theme === 'dark' ? 'true' : 'false');
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
        provider === 'gemini' ? 'AIzaSy... (aistudio.google.com)'
          : provider === 'anthropic' ? 'sk-ant-... (console.anthropic.com)'
            : 'sk-... (platform.deepseek.com)';
      try { renderFolders(); } catch (e) { console.warn('[LectureAI] renderFolders fallito:', e); }
      try { loadHistList(); } catch (e) { console.warn('[LectureAI] loadHistList fallito:', e); }
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
        provider === 'gemini' ? 'AIzaSy... (aistudio.google.com)'
          : provider === 'anthropic' ? 'sk-ant-... (console.anthropic.com)'
            : 'sk-... (platform.deepseek.com)';
      setAok(k ? 'ok' : '');
    }
    function onKeyInput() {
      const v = document.getElementById('apiInput').value.trim();
      let ok;
      if (provider === 'gemini') ok = v.startsWith('AIza');
      else if (provider === 'anthropic') ok = v.startsWith('sk-ant-');
      else ok = v.startsWith('sk-');
      setAok(v.length > 8 ? (ok ? 'ok' : 'warn') : '');
    }
    function saveKey() {
      const v = document.getElementById('apiInput').value.trim();
      let ok, hint;
      if (provider === 'gemini') { ok = v.startsWith('AIza'); hint = 'Chiave Gemini: deve iniziare con AIza'; }
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

    function chkBtn() {
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
      safeSet(HIST_KEY, JSON.stringify(hist));
      loadHistList();
      const lbl = document.getElementById('histDropdownLabel');
      if (lbl) lbl.textContent = entry.title;
      if (!silent) toast('✓ Sessione salvata in cronologia!', 'ok');
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
      if (entry.transcript) { finalTr = entry.transcript; renderTbox(); }
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

    const BASE_SYS = `Sei un assistente accademico universitario MULTIDISCIPLINARE.
Genera appunti universitari completi e precisi ma sintetici, ADATTANDO il formato
alla disciplina della lezione. Rispondi ESCLUSIVAMENTE con JSON valido.
ZERO testo fuori dal JSON. ZERO backtick markdown.

Schema JSON:
{
  "title": "Titolo lezione",
  "subject": "Materia (disciplina accademica riconoscibile)",
  "key_topics": ["t1","t2","t3"],
  "pdf_alignment": "posizione nel PDF se presente, stringa vuota altrimenti",
  "notes_html": "HTML con h2 (UNA sezione per ogni concetto/argomento distinto — anche 8-12 sezioni se servono, mai un blocco unico), h3 per sotto-punti, p per spiegazioni discorsive. Per elenchi di concetti/casi/esempi/intuizioni usa SEMPRE <ul><li><strong>Nome o Caso:</strong> spiegazione concisa.</li></ul> (grassetto sul termine prima dei due punti, stile glossario). Usa <em> per termini tecnici/gergali/citazioni. Formule matematiche in LaTeX SOLO se la disciplina le usa (\\( inline \\) e \\[ display \\]). Codice in <pre class='code-block'><code>...</code></pre> SOLO per materie tecniche. Note: <div class='callout'>. Concetti chiave isolati: <span class='key-concept'>. PDF ref: <div class='pdf-ref'>📄 p.X: ...</div>.",
  "diagrams": [
    {"type":"flowchart","title":"Titolo","nodes":[{"id":"A","label":"Passo A","shape":"rect"},{"id":"B","label":"Condizione?","shape":"diamond"}],"edges":[{"from":"A","to":"B","label":""}]},
    {"type":"mindmap","title":"Mappa","root":"Argomento","children":[{"label":"Concetto A","children":[{"label":"Dettaglio 1"}]},{"label":"Concetto B","children":[]}]}
  ],
  "summary": {
    "overview": "3-4 frasi",
    "key_points": ["p1","p2","p3","p4","p5"],
    "definitions": [{"term":"termine","def":"definizione"}],
    "difficulty": "Base|Intermedio|Avanzato",
    "missing_from_lecture": "parti PDF non trattate, stringa vuota se no PDF"
  },
  "flashcards": [{"question":"q","answer":"a"}]
}

═══ ISTRUZIONI SPECIFICHE PER QUESTA DISCIPLINA ═══
{DISCIPLINE_PANEL}

═══ REGOLE UNIVERSALI ═══
- Min 2 diagrammi. Min 7 flashcard. Tutto in italiano.
- Organizza SEMPRE in sezioni tematiche separate (un h2 per argomento), mai testo indistinto.

PROCEDURA MENTALE OBBLIGATORIA prima di scrivere notes_html:
  1) Elenca mentalmente TUTTI i concetti/argomenti distinti della lezione.
  2) Per OGNI concetto, individua i RIFERIMENTI SPECIFICI che il professore ha citato:
     nomi propri (persone, autori, aziende, istituzioni), titoli di opere o progetti,
     date, numeri, sigle tecniche, casi-studio, esempi concreti, aneddoti didattici.
  3) Scrivi il testo includendo SEMPRE (2). Un concetto senza il suo riferimento
     specifico è considerato INCOMPLETO.

REGOLE SUI RIFERIMENTI (universali):
- MANTIENI i riferimenti specifici che il professore cita a supporto di un concetto.
  Adatta il tipo di riferimento alla disciplina (vedi pannello sopra).
- NON sostituire MAI un riferimento specifico con una formula astratta tipo
  "esistono casi in cui..." o "alcuni autori sostengono...".
- Se il prof cita un NOME PROPRIO, una DATA, un TITOLO, una SIGLA → riportali
  ESATTAMENTE come pronunciati. Non parafrasare, non generalizzare.
- Se il prof racconta un'esperienza personale come esempio didattico,
  riportala in 1-2 frasi: serve a fissare il concetto.

REGOLA SUI NUMERI (CRITICA):
- Se la lezione elenca N livelli / N fasi / N tipologie / N modelli / N autori /
  N correnti / N principi → riportali TUTTI. Non fermarti ai primi due.
  Non accorpare due elementi in uno.
- Esempio: 4 livelli → 4 livelli distinti. 3 fasi → 3 fasi distinte.
- Se nella tua risposta N_non coincide con N della lezione → è un errore.

DISTINGUI CONTENUTO da RUMORE:
- CONTENUTO (da tenere): concetti, definizioni, esempi, aneddoti didattici,
  nomi propri, dati, citazioni, riferimenti bibliografici/culturali/scientifici.
- RUMORE (da omettere): comunicazioni organizzative (avvisi, scadenze, logistica
  di viaggi, iscrizioni a eventi), battute, commenti personali non legati
  all'argomento, divagazioni su temi non inerenti alla lezione.`;

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
Formato: NIENTE LaTeX. Uso di <em> per i termini latini (es. <em>pacta sunt servanda</em>).
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
Uso frequente di <em> per titoli di opere (in stile italiano).
Diagrammi: mindmap per mappe concettuali/autori; flowchart per sequenze storiche
o genealogie di pensiero.
Riporta SEMPRE le date con anno, i nomi completi, i titoli nella lingua originale
se il prof li ha usati (es. "Die Welt als Wille und Vorstellung").`,

      scienze: `DISCIPLINA: Fisica / Chimica / Matematica / Scienze naturali / Geologia.
Riferimenti tipici: leggi fisiche (Newton, Ohm, Coulomb), costanti universali
(g, h, c, N_A), reazioni chimiche, teoremi, dimostrazioni, esperimenti storici
(Michelson-Morley, Rutherford), simboli matematici.
Formato: LaTeX SEMPRE per formule, dimostrazioni, reazioni chimiche.
Blocchi <pre> solo per pseudocodice di calcolo numerico.
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

    function getPanel() {
      return customPanel || PRESET_PANELS[activePreset] || PRESET_PANELS[DEFAULT_PRESET];
    }
    function getSys() {
      return BASE_SYS.replace('{DISCIPLINE_PANEL}', getPanel());
    }
    function getSysMerge() {
      return getSys() + `

────────────────────────────────
CONTESTO SPECIFICO: stai UNENDO i riassunti di più segmenti di una lezione lunga.
Dall'insieme dei segmenti devi produrre UN UNICO documento che rispetti ESATTAMENTE
lo schema JSON descritto sopra. Regole aggiuntive:

- Il campo "notes_html" è OBBLIGATORIO e deve contenere gli appunti COMPLETI e ORGANICI.
  Non lasciarlo vuoto, non ometterlo, non metterci un riassunto breve: è il corpo principale.

- Min 2 diagrammi, min 10 flashcard.

- Organizza il contenuto in <h2> separati per argomento (anche 10-14 sezioni).

- ⚠️ REGOLA DI NON-PERDITA:
  Ogni ESEMPIO CONCRETO, NOME PROPRIO, NUMERO, SIGLA, ANEDDOTO DIDATTICO che
  compare in UNO QUALSIASI dei segmenti DEVE rimanere negli appunti finali.
  Se due segmenti trattano lo stesso argomento, UNISCI ma NON perdere esempi
  specifici di nessuno dei due.

- ⚠️ REGOLA SUI NUMERI:
  Se i segmenti descrivono N livelli / N fasi / N tipologie / N autori / N correnti,
  la somma negli appunti finali DEVE essere N. Non accorpare, non tagliare.

- Tutto in italiano.`;
    }
    // ══════════════════════════════════════════════════════════════
    //  PROMPT SEGMENTO (usato per il chunking di trascrizioni lunghe)
    // ══════════════════════════════════════════════════════════════
    const SYS_CHUNK = `Sei un assistente accademico universitario multidisciplinare.
Stai analizzando il segmento {N} di {TOT} di una trascrizione di lezione.
Rispondi SOLO con JSON valido, senza testo fuori dal JSON:
{"segment":{N},"topics_covered":["argomento 1","argomento 2"],"key_points":["punto 1","punto 2"],"formulas_or_code":["formula o frammento di codice se presente"],
"summary_text":"150-200 parole che riassumono il contenuto di questo segmento, mantenendo nomi propri, date, esempi e riferimenti specifici citati dal professore."}`;

    // ══════════════════════════════════════════════════════════════
    //  API CALLS — passano per il proxy Flask locale (niente CORS)
    // ══════════════════════════════════════════════════════════════
    let _geminiModelsCache = null;

    async function discoverGeminiModels() {
      if (_geminiModelsCache) return _geminiModelsCache;
      try {
        const res = await fetch(`/api/gemini-models?key=${apiKey}`);
        if (!res.ok) return ['gemini-2.5-flash', 'gemini-2.0-flash'];
        const data = await res.json();
        const valid = (data.models || [])
          .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
          .filter(m => /gemini-[23]/i.test(m.name))
          .map(m => m.name.replace('models/', ''))
          .sort((a, b) => {
            const sc = s => { let v = 0; if (s.includes('2.5')) v += 100; else if (s.includes('2.0')) v += 50; if (s.includes('lite')) v += 10; else if (!s.includes('pro')) v += 5; return v; };
            return sc(b) - sc(a);
          });
        if (valid.length) { _geminiModelsCache = valid; return valid; }
      } catch (e) { console.warn('[Gemini models]', e); }
      return ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
    }

    const GEM_RETRYABLE = new Set([429, 500, 502, 503, 504]);
    const GEM_MAX_RETRIES_PER_MODEL = 3;
    const GEM_MAX_PASSES = 2;
    function isOverloadMsg(m) { return /overload|UNAVAILABLE|RESOURCE_EXHAUSTED|sovraccaric/i.test(m || ''); }

    async function callGemini(userMsg, sysOverride) {
      const sys = sysOverride || getSys();
      let lastErr = null;
      const models = await discoverGeminiModels();

      for (let pass = 1; pass <= GEM_MAX_PASSES; pass++) {
        for (const model of models) {
          const body = {
            systemInstruction: { parts: [{ text: sys }] },
            contents: [{ role: 'user', parts: [{ text: userMsg || '' }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 65536, responseMimeType: 'application/json' }
          };
          for (let attempt = 0; attempt <= GEM_MAX_RETRIES_PER_MODEL; attempt++) {
            try {
              const res = await fetch(`/api/gemini/${model}:generateContent?key=${apiKey}`,
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

              if (res.status === 404 || res.status === 400) {
                const j = await res.json().catch(() => ({}));
                const msg = j.error?.message || '';
                if (msg.includes('not found') || msg.includes('not supported') || res.status === 404) { lastErr = new Error(model + ': ' + msg); break; }
                throw new Error('Errore Gemini: ' + (msg || 'richiesta non valida'));
              }
              if (res.status === 401 || res.status === 403) throw new Error('Chiave Gemini non valida.');

              if (GEM_RETRYABLE.has(res.status)) {
                const j = await res.json().catch(() => ({}));
                const msg = j.error?.message || ('Errore ' + res.status);
                lastErr = new Error(model + ': ' + msg);
                if (attempt < GEM_MAX_RETRIES_PER_MODEL) {
                  const wait = Math.min(3000 * Math.pow(2, attempt), 15000) + Math.random() * 800;
                  const overloaded = res.status === 503 || isOverloadMsg(msg);
                  const label = overloaded ? `${model} sovraccarico` : `Limite richieste su ${model}`;
                  setOv(`⏳ ${label} — nuovo tentativo tra ${Math.round(wait / 1000)}s (${attempt + 1}/${GEM_MAX_RETRIES_PER_MODEL})`, 20);
                  await new Promise(r => setTimeout(r, wait));
                  continue;
                }
                break;
              }

              if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error?.message || 'Errore Gemini (' + res.status + ')'); }

              const data = await res.json();
              const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (!raw) throw new Error('Gemini ha restituito risposta vuota.');
              if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
                _lastTruncated = true;
                console.warn('[Gemini] risposta troncata per MAX_TOKENS');
              }
              console.log('[Gemini] ✓', model, 'pass', pass, 'tentativo', attempt);
              return raw;

            } catch (err) {
              if (err.message.includes('not found') || err.message.includes('not supported')) { lastErr = err; break; }
              if (err.message === 'Chiave Gemini non valida.') throw err;
              lastErr = err; break;
            }
          }
        }
        if (pass < GEM_MAX_PASSES) {
          setOv('⏳ Tutti i modelli Gemini sono sovraccarichi — nuovo giro tra 10s...', 20);
          await new Promise(r => setTimeout(r, 10000));
        }
      }
      _geminiModelsCache = null;
      throw new Error('Gemini è sovraccarico al momento. Riprova tra qualche minuto oppure passa su Anthropic Claude dal menu in alto. ' + (lastErr?.message || ''));
    }

    const ANT_RETRYABLE = new Set([429, 500, 502, 503, 529]);
    const ANT_MAX_RETRIES = 3;

    async function callAnthropic(userMsg, sysOverride, retryCount) {
      retryCount = retryCount || 0;
      const sys = sysOverride || getSys();
      const res = await fetch('/api/anthropic/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
        body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 16000, system: sys, messages: [{ role: 'user', content: userMsg }] })
      });
      if (!res.ok) {
        let e = 'Errore Anthropic (' + res.status + ')';
        try { const j = await res.json(); e = j.error?.message || e; } catch (x) { }
        if (ANT_RETRYABLE.has(res.status) && retryCount < ANT_MAX_RETRIES) {
          const wait = Math.min(3000 * Math.pow(2, retryCount), 15000) + Math.random() * 800;
          const label = res.status === 529 ? 'Claude sovraccarico' : 'Limite richieste raggiunto';
          setOv(`⏳ ${label} — nuovo tentativo tra ${Math.round(wait / 1000)}s (${retryCount + 1}/${ANT_MAX_RETRIES})`, 20);
          await new Promise(r => setTimeout(r, wait));
          return callAnthropic(userMsg, sysOverride, retryCount + 1);
        }
        throw new Error(e + (res.status === 529 ? ' — Claude è sovraccarico, riprova tra qualche minuto.' : ''));
      }
      const data = await res.json();
      if (data.stop_reason === 'max_tokens') {
        _lastTruncated = true;
        console.warn('[Anthropic] risposta troncata per max_tokens');
      }
      return data.content.map(i => i.text || '').join('');
    }

    async function callAI(msg, sysOverride) {
      if (provider === 'gemini') return callGemini(msg, sysOverride);
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

      const res = await fetch('/api/deepseek/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        let e = 'Errore DeepSeek (' + res.status + ')';
        try { const j = await res.json(); e = j.error?.message || e; } catch (x) { }
        if (DS_RETRYABLE.has(res.status) && retryCount < DS_MAX_RETRIES) {
          const wait = Math.min(3000 * Math.pow(2, retryCount), 15000) + Math.random() * 800;
          const label = res.status === 529 ? 'DeepSeek sovraccarico' : 'Limite richieste raggiunto';
          setOv(`⏳ ${label} — nuovo tentativo tra ${Math.round(wait / 1000)}s (${retryCount + 1}/${DS_MAX_RETRIES})`, 20);
          await new Promise(r => setTimeout(r, wait));
          return callDeepSeek(userMsg, sysOverride, retryCount + 1);
        }
        throw new Error(e + (res.status === 529 ? ' — DeepSeek è sovraccarico, riprova tra qualche minuto.' : ''));
      }

      const data = await res.json();
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
      try { return restoreLatex(JSON.parse(s)); } catch (_) { }
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

    function fixJsonEscapes(s) {
      let out = '', inStr = false, i = 0;
      while (i < s.length) {
        const ch = s[i];
        if (!inStr) { if (ch === '"') { inStr = true; out += ch; i++; continue; } out += ch; i++; continue; }
        if (ch === '\\') {
          const nx = s[i + 1];
          if (nx && '"\\\\/bfnrt'.includes(nx)) { out += ch + nx; i += 2; continue; }
          if (nx === 'u' && /[0-9a-fA-F]{4}/.test(s.slice(i + 2, i + 6))) { out += s.slice(i, i + 6); i += 6; continue; }
          out += '\\\\'; i++; continue;
        }
        if (ch === '"') { inStr = false; out += ch; i++; continue; }
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
    
    async function uploadAudioToGemini(file, apiKey) {
      const initRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(file.size),
          'X-Goog-Upload-Header-Content-Type': file.type || 'audio/mp4',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: file.name } })
      });
      
      if (!initRes.ok) {
        const err = await initRes.text();
        throw new Error('Inizializzazione upload fallita: ' + err.slice(0, 200));
      }
      
      const uploadUrl = initRes.headers.get('X-Goog-Upload-URL');
      if (!uploadUrl) throw new Error('URL di upload non ricevuto da Gemini');
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'X-Goog-Upload-Command': 'upload, finalize',
          'X-Goog-Upload-Offset': '0',
          'Content-Length': String(file.size),
          'Content-Type': file.type || 'audio/mp4'
        },
        body: file
      });
      
      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error('Upload file fallito: ' + err.slice(0, 200));
      }
      
      const uploadData = await uploadRes.json();
      return uploadData.file.uri;
    }

    async function transcribeAudioWithGemini(fileUri, mimeType, apiKey) {
      const body = {
        contents: [{
          role: 'user',
          parts: [
            { text: 'Trascrivi fedelmente questo audio. Restituisci SOLO il testo trascritto, niente commenti.' },
            { fileData: { mimeType: mimeType, fileUri: fileUri } }
          ]
        }],
        generationConfig: { temperature: 0.2 }
      };
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        const err = await res.text();
        throw new Error('Trascrizione fallita: ' + err.slice(0, 200));
      }
      
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text.trim();
    }

    // ══════════════════════════════════════════════════════════════
    //  GENERATE
    // ══════════════════════════════════════════════════════════════
    async function generate() {
      const key = apiKey || document.getElementById('apiInput').value.trim();
      if (!key) { toast('Inserisci la API key e premi Salva.', 'err'); return; }
      apiKey = key;

      const audioFiles = uploadedFiles.filter(f => f.isAudio);
      if (audioFiles.length > 0) {
        if (provider !== 'gemini') {
          hideOv();
          toast('La trascrizione dei file audio è supportata solo con Google Gemini. Cambia provider dal menu in alto.', 'err');
          return;
        }
        for (const af of audioFiles) {
          try {
            setOv('Caricamento audio su Gemini... (potrebbe richiedere qualche minuto per file grandi)', 5);
            const mimeType = af.file.type || 'audio/mp4';
            const fileUri = await uploadAudioToGemini(af.file, apiKey);
            setOv('Trascrizione audio in corso... (non chiudere la pagina)', 15);
            const text = await transcribeAudioWithGemini(fileUri, mimeType, apiKey);
            if (text) {
              finalTr += (finalTr ? '\n\n' : '') + text + ' ';
              renderTbox();
            }
          } catch (err) {
            hideOv();
            toast('Errore trascrizione ' + af.name + ': ' + err.message, 'err');
            return;
          }
        }
        uploadedFiles = uploadedFiles.filter(f => !f.isAudio);
        renderFileList();
      }

      const rawTr = (tmode === 'text' ? pastedTr : (finalTr + ' ' + interimTr)).trim();
      const hasTr = rawTr.length > 15, hasPdf = uploadedFiles.length > 0;
      const wordCount = rawTr.split(/\s+/).filter(Boolean).length;
      const isLong = wordCount > 9000;

      _lastTruncated = false;
      setOv('Preparando...', 5);
      try {
        let parsed;
        if (isLong && hasTr) {
          toast(`Elaborazione a blocchi (${wordCount.toLocaleString()} parole)...`, 'ok');
          parsed = await generateChunked(rawTr, hasPdf);
        } else {
          setOv(
            provider === 'gemini' ? 'Chiamata Gemini...'
              : provider === 'anthropic' ? 'Chiamata Anthropic...'
                : 'Chiamata DeepSeek...', 20);
          parsed = parseJSON(await callAI(buildDirectMsg(rawTr, hasTr, hasPdf)));
        }
        console.log('[LectureAI] Risposta AI parsata:', parsed);
        console.log('[LectureAI] Campi presenti:', Object.keys(parsed || {}).join(', '));
        if (!parsed.notes_html || !String(parsed.notes_html).trim()) {
          console.warn('[LectureAI] ⚠️ notes_html vuoto o mancante!');
        }

        lastData = parsed;
        setOv('Renderizzando...', 94);

        await renderAll(parsed);
        saveHist(true);
        hideOv();
        document.getElementById('xbar').style.display = 'flex';
        toast('✓ Appunti generati e salvati!', 'ok');
        goToNotes();
        if (_lastTruncated) {
          setTimeout(() => toast('⚠️ Una risposta AI è arrivata troncata per limite di lunghezza: alcuni contenuti potrebbero essere incompleti. Ho recuperato quello che potevo.', 'err'), 3500);
        }
      } catch (err) {
        hideOv();
        console.error('[LectureAI]', err);
        toast('Errore: ' + err.message, 'err');
      }
    }

    function buildDirectMsg(rawTr, hasTr, hasPdf) {
      const procTr = hasTr ? normMath(compressTranscript(rawTr)) : '';
      const trTrunc = procTr.length > 20000 ? procTr.slice(0, 20000) + '\n[...troncata...]' : procTr;
      let combinedDocs = '';
      if (hasPdf) {
        const budget = Math.floor(36000 / uploadedFiles.length);
        combinedDocs = uploadedFiles.map((f, i) => {
          const txt = f.txt.length > budget ? f.txt.slice(0, budget) + '\n[...troncato...]' : f.txt;
          return '### Documento ' + (i + 1) + ': ' + f.name + '\n' + txt;
        }).join('\n\n---\n\n');
      }
      if (hasTr && hasPdf) return 'Integra queste fonti in appunti universitari completi:\n\n## TRASCRIZIONE:\n' + trTrunc + '\n\n## MATERIALE:\n' + combinedDocs;
      if (hasTr) return 'Trascrizione lezione:\n\n' + trTrunc;
      return 'Genera appunti universitari da questo materiale:\n\n' + combinedDocs;
    }

    async function generateChunked(rawTr, hasPdf) {
      const compressed = normMath(compressTranscript(rawTr));
      const chunks = splitChunks(compressed);
      const tot = chunks.length;
      const segs = [];
      for (let i = 0; i < chunks.length; i++) {
        setOv(`Analisi segmento ${i + 1}/${tot}...`, Math.round(10 + (i / chunks.length) * 55));
        const sys = SYS_CHUNK.replace(/\{N\}/g, String(i + 1)).replace(/\{TOT\}/g, String(tot));
        let raw;
        try { raw = await callAI(`Segmento ${i + 1} di ${tot}:\n\n${chunks[i]}`, sys); }
        catch (e) {
          if (/429|503|529|sovraccaric|overload/i.test(e.message)) {
            setOv(`⏳ Sovraccarico sul segmento ${i + 1}/${tot} — nuovo tentativo tra 8s...`, Math.round(10 + (i / chunks.length) * 55));
            await new Promise(r => setTimeout(r, 8000));
            raw = await callAI(`Segmento ${i + 1} di ${tot}:\n\n${chunks[i]}`, sys);
          } else throw e;
        }
        try { segs.push(parseJSON(raw)); } catch { segs.push({ segment: i + 1, summary_text: raw.slice(0, 800), key_points: [], topics_covered: [], formulas_or_code: [] }); }
        if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 1200));
      }
      setOv('Fusione appunti...', 72);
      const pdfSec = hasPdf ? '\n\n## MATERIALE:\n' + uploadedFiles.map(f => f.name + ':\n' + f.txt.slice(0, 20000)).join('\n\n---\n\n') : '';
      const mergeMsg = `Riassunti di ${tot} segmenti (lezione ~${Math.round(rawTr.split(/\s+/).length)} parole):\n\n`
        + segs.map((s, i) => `### Segmento ${i + 1}:\n${(s.topics_covered || []).join(', ')}\n${(s.key_points || []).join(' | ')}\n${s.summary_text || ''}`).join('\n\n')
        + pdfSec;
      return parseJSON(await callAI(mergeMsg, getSysMerge()));
    }

    // ══════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════
    function rK(el) {
      try { renderMathInElement(el, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); }
      catch (e) { console.warn('KaTeX', e); }
    }

    async function renderAll(d) {
      renderNotes(d);
      await renderDiags(d.diagrams || []);
      renderSumm(d.summary, d);
      renderFlash(d.flashcards || []);
      goTab('notes');
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

      let body = d.notes_html || '';

      if (!body.trim()) {
        const s = d.summary || {};
        const kps = (s.key_points || []).map(k => '<li>' + escHtml(k) + '</li>').join('');
        const defs = (s.definitions || []).map(x => '<li><strong>' + escHtml(x.term || '') + ':</strong> ' + escHtml(x.def || '') + '</li>').join('');
        const tops = (d.key_topics || []).map(t => '<span class="key-concept">' + escHtml(t) + '</span>').join(' ');
        let fb = '<div class="callout">'
          + '<strong>⚠️ Il modello non ha restituito il campo <code>notes_html</code>.</strong><br>'
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
        + '<div class="sub">' + escHtml(d.subject || '') + ' · ' + new Date().toLocaleDateString('it-IT') + '</div>'
        + pdfB + body;
      rK(el);
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
    //  LOADING / TOAST
    // ══════════════════════════════════════════════════════════════
    function setOv(msg, pct) {
      document.getElementById('ov').classList.add('on');
      document.getElementById('ovS').textContent = msg || '';
      document.getElementById('bar').style.width = (pct || 0) + '%';
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

      let md = '# ' + (d.title || 'Appunti') + '\n\n';
      const meta = [];
      if (d.subject) meta.push('**Materia:** ' + d.subject);
      meta.push('**Data:** ' + dataCreazione());
      meta.push('**Fonte:** LectureAI');
      md += meta.join('  \n') + '\n\n---\n\n';

      if (d.notes_html) md += htmlToMd(d.notes_html) + '\n\n';

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
