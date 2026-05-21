// content.js – ИТД Кастомизатор v7.1

// ============ 1. Меню (RShift) ============
let menuVisible = false;
let menuElement = null;
let gameWindow = null;

const THEMES = {
    default: {
        name: 'По умолчанию',
        css: ''
    },
    vk_new: {
        name: 'VK',
        css: `
      /* 1. Глобальный светлый фон */
      html, body {
        background: #f5f6f8 !important;
      }
      
      /* 2. ТЯЖЕЛАЯ АРТИЛЛЕРИЯ: Перекрашиваем ВСЕ блоки Nouka (посты, уведомления, карточки) */
      body :is(div, article, aside, main, section, li, ul, form, [class*="Styled"]) {
        background-color: #ffffff !important;
        background: #ffffff !important;
        border-color: #e7e8ec !important;
        box-shadow: none !important;
      }
      
      /* 3. ТОТАЛЬНЫЙ ФИКС ТЕКСТА: заставляем абсолютно все буквы на сайте стать черными */
      body *:not(#itd-custom-menu):not(#itd-game-window):not(#itd-game-window *) {
        color: #1c1d1f !important;
        -webkit-text-fill-color: #1c1d1f !important;
        text-shadow: none !important;
      }
      
      /* 4. СПАСАЕМ АКТИВНЫЕ (ТЕМНЫЕ) ПЛАШКИ МЕНЮ (чтобы текст не сливался) */
      /* Если у элемента в оригинале был прописан инлайн-стиль фона, оставляем текст белым */
      body [style*="background"] *, [class*="active"] * {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
      }
      
      /* Иконки в боковом меню */
      aside svg {
          fill: #1c1d1f !important;
          color: #1c1d1f !important;
      }
      aside [style*="background"] svg, [class*="active"] svg {
          fill: #ffffff !important;
          color: #ffffff !important;
      }
      
      /* 5. ПОЛЯ ВВОДА ("Что нового?") */
      [contenteditable="true"], textarea, input {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #1c1d1f !important;
          -webkit-text-fill-color: #1c1d1f !important;
          border: 1px solid #d0d0d0 !important;
      }
      
      /* 6. КНОПКИ */
      button:not(#itd-custom-menu *):not(#itd-game-window *), .button {
          border-color: #4a76a8 !important;
          color: #4a76a8 !important;
      }
      button[class*="Primary"], .button.primary, button[type="submit"], [style*="background-color: rgb(255"] {
          background-color: #4a76a8 !important;
          background: #4a76a8 !important;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          border: none !important;
      }
      
      /* 7. ИЗОЛЯЦИЯ ЗМЕЙКИ И НАШЕГО МЕНЮ (не трогать!) */
      #itd-custom-menu, #itd-game-window {
        background: #ffffff !important;
        border: 1px solid #e7e8ec !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
      }
      #itd-custom-menu *, #itd-game-window *, #itd-game-window canvas {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif !important;
        background: transparent !important;
      }
      #itd-custom-menu button, #itd-game-window button {
        background: #4a76a8 !important;
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
      }
    `
    },
    discord: {
        name: 'Discord',
        css: `
      html, body {
        height: 100%;
        margin: 0;
        background: #36393f !important;
      }
    `
    },
    telegram: {
        name: 'Telegram',
        css: `
      html, body {
        background: #eef2f5 !important;
      }
      body :is(div, article, aside, main, section, li, ul, [class*="Styled"]) {
        background-color: #ffffff !important;
        background: #ffffff !important;
        border-color: #e4e9f2 !important;
      }
      body *:not(#itd-custom-menu):not(#itd-game-window):not(#itd-game-window *) {
        color: #222222 !important;
        -webkit-text-fill-color: #222222 !important;
      }
      body [style*="background"] *, [class*="active"] * {
          color: #ffffff !important;
      }
      [contenteditable="true"], textarea, input {
          background-color: #ffffff !important;
          color: #222222 !important;
          border: 1px solid #e4e9f2 !important;
      }
      button:not(#itd-custom-menu *):not(#itd-game-window *), button[class*="Primary"] {
        background: #2481cc !important;
        color: #ffffff !important;
      }
      #itd-custom-menu, #itd-game-window {
        background: #ffffff !important;
        border: 1px solid #e4e9f2 !important;
      }
    `
    },
    itd_2024: {
        name: 'ИТД 2024',
        css: `
      html, body {
        background: #c0c0c0 !important;
      }
      body :is(div, article, main, section, li, ul, [class*="Styled"]) {
        background-color: #d4d4d4 !important;
        border: 2px inset #ffffff !important;
      }
      body *:not(#itd-custom-menu):not(#itd-game-window):not(#itd-game-window *) {
        font-family: 'Courier New', monospace !important;
        font-weight: 900 !important;
        color: #000000 !important;
      }
      [contenteditable="true"], textarea, input {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-family: 'Courier New', monospace !important;
          border: 2px inset #ffffff !important;
      }
      #itd-custom-menu, #itd-game-window {
        background: #d4d4d4 !important;
        border: 3px outset #ffffff !important;
        border-radius: 0px !important;
      }
    `
    },
    custom: {
        name: 'Пользовательская',
        css: ''
    }
};

// Игры (встроенные)
const GAMES = {
    minesweeper: { name: '💣 Сапёр', init: initMinesweeper },
    snake: { name: '🐍 Змейка', init: initSnake },
    dino: { name: '🦖 Динозаврик', init: initDino },
    tetris: { name: '🧱 Тетрис', init: initTetris },
    tictactoe: { name: '❌⭕ Крестики-нолики', init: initTicTacToe }
};

let currentSettings = {
    wallpaperUrl: null,
    blur: 0,
    brightness: 1,
    theme: 'default',
    customCSS: '',
    notificationSound: null
};

let themeStyleElement = null;

function createMenu() {
    if (menuElement) return;
    menuElement = document.createElement('div');
    menuElement.id = 'itd-custom-menu';
    menuElement.innerHTML = `
    <div class="menu-header">
      <h2>🎨 Настройки оформления</h2>
      <button id="itd-menu-close" class="menu-close-btn">✕</button>
    </div>
    <div class="menu-content">
      <div class="setting-group">
        <label>🖼️ Фоновое изображение</label>
        <input type="text" id="itd-wallpaper-url" placeholder="Вставьте URL или выберите файл">
        <div class="file-row">
          <input type="file" id="itd-wallpaper-file" accept="image/*">
          <button id="itd-apply-wallpaper" class="btn">Применить</button>
          <button id="itd-reset-wallpaper" class="btn btn-reset">Сбросить</button>
        </div>
      </div>
      <div class="setting-group">
        <label>🌀 Размытие фона: <span id="itd-blur-value">0px</span></label>
        <input type="range" id="itd-blur-range" min="0" max="20" value="0" step="1">
      </div>
      <div class="setting-group">
        <label>💡 Яркость фона: <span id="itd-brightness-value">1</span></label>
        <input type="range" id="itd-brightness-range" min="0.3" max="3" value="1" step="0.1">
      </div>
      <div class="setting-group">
        <label>🎨 Тема оформления</label>
        <select id="itd-theme-select">
          ${Object.entries(THEMES).map(([key, t]) => `<option value="${key}">${t.name}</option>`).join('')}
        </select>
        <button id="itd-apply-theme" class="btn btn-sm" style="margin-top:6px;">Применить тему</button>
        <div id="itd-custom-css-block" style="display:none; margin-top:8px;">
          <textarea id="itd-custom-css" rows="6" placeholder="Введите свой CSS..."></textarea>
          <button id="itd-apply-custom-css" class="btn btn-sm">Применить CSS</button>
        </div>
        <div style="margin-top:8px;">
          <button id="itd-load-theme-sound" class="btn btn-sm">🔊 Загрузить звук для темы</button>
          <input type="file" id="itd-theme-sound-file" accept="audio/*" style="display:none">
        </div>
      </div>
      <div class="setting-group" style="text-align:center;">
        <button id="itd-open-games" class="btn" style="font-size:1.2rem;">🎮 Игры</button>
      </div>
    </div>
  `;
    document.body.appendChild(menuElement);

    const style = document.createElement('style');
    style.textContent = `
    #itd-custom-menu {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95);
      width: 420px; max-height: 85vh; overflow-y: auto;
      background: rgba(20, 20, 30, 0.85) !important; backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6); color: #eee !important;
      font-family: 'Segoe UI', system-ui, sans-serif !important; z-index: 99999;
      padding: 20px; transition: opacity 0.2s, transform 0.2s;
      opacity: 0; pointer-events: none;
    }
    #itd-custom-menu.visible { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%) scale(1); }
    #itd-custom-menu * { color: #eee !important; font-family: 'Segoe UI', system-ui, sans-serif !important; }
    .menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .menu-header h2 { margin: 0; font-size: 1.4rem; }
    .menu-close-btn { background: transparent; border: none; color: #aaa !important; font-size: 1.5rem; cursor: pointer; }
    .menu-close-btn:hover { color: white !important; }
    .setting-group { margin-bottom: 20px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 14px; }
    .setting-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #ccc !important; }
    .setting-group input[type="text"], .setting-group input[type="file"] {
      width: 100%; padding: 8px 10px; margin-bottom: 8px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white !important;
    }
    .setting-group input[type="range"] { width: 100%; accent-color: #6c63ff; }
    .file-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .btn { padding: 8px 16px; border: none; border-radius: 8px; background: #6c63ff; color: white !important; cursor: pointer; }
    .btn:hover { background: #5a52d5; }
    .btn-reset { background: #444; }
    .btn-sm { padding: 4px 10px; font-size: 0.8rem; }
    select#itd-theme-select {
      width: 100%; padding: 8px 10px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.5); color: white !important;
      font-size: 0.9rem; cursor: pointer;
      appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z"/></svg>');
      background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
    }
    select#itd-theme-select option { background: #1e1e2e; color: white !important; }
    textarea#itd-custom-css {
      width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.5); color: white !important; font-family: monospace !important; font-size: 0.85rem;
    }
    #itd-game-window {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 500px; max-height: 80vh; overflow-y: auto;
      background: #1e1e2e !important; color: white !important; border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8); z-index: 100000;
      padding: 20px; font-family: 'Segoe UI', sans-serif !important;
    }
    #itd-game-window * { color: white !important; font-family: 'Segoe UI', sans-serif !important; }
    #itd-game-window .game-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    #itd-game-window .game-close { background: transparent; border: none; color: #aaa !important; font-size: 1.5rem; cursor: pointer; }
    #itd-game-window .game-close:hover { color: white !important; }
    #itd-game-window canvas { display: block; margin: 0 auto; border: 1px solid #555; }
  `;
    document.head.appendChild(style);

    document.getElementById('itd-menu-close').addEventListener('click', hideMenu);
    menuElement.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
        if (menuVisible && !menuElement.contains(e.target)) hideMenu();
    });

    document.getElementById('itd-apply-wallpaper').addEventListener('click', applyWallpaperFromMenu);
    document.getElementById('itd-reset-wallpaper').addEventListener('click', resetWallpaperFromMenu);
    document.getElementById('itd-wallpaper-file').addEventListener('change', handleFileWallpaper);
    document.getElementById('itd-blur-range').addEventListener('input', updateBlur);
    document.getElementById('itd-brightness-range').addEventListener('input', updateBrightness);
    document.getElementById('itd-theme-select').addEventListener('change', onThemeSelectChange);
    document.getElementById('itd-apply-theme').addEventListener('click', applySelectedTheme);
    document.getElementById('itd-apply-custom-css').addEventListener('click', applyCustomCSS);
    document.getElementById('itd-load-theme-sound').addEventListener('click', () => {
        document.getElementById('itd-theme-sound-file').click();
    });
    document.getElementById('itd-theme-sound-file').addEventListener('change', handleThemeSoundUpload);
    document.getElementById('itd-open-games').addEventListener('click', openGamesList);
}

function showMenu() {
    if (!menuElement) createMenu();
    menuElement.classList.add('visible');
    menuVisible = true;
    loadSettingsToMenu();
}
function hideMenu() {
    if (!menuElement) return;
    menuElement.classList.remove('visible');
    menuVisible = false;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftRight' && !e.repeat) {
        e.preventDefault();
        menuVisible ? hideMenu() : showMenu();
    }
});

// ============ 2. Эффекты и обои ============
function applyAllEffects() {
    const { wallpaperUrl, blur, brightness } = currentSettings;
    let wd = document.getElementById('custom-wallpaper');
    if (wallpaperUrl) {
        if (!wd) {
            wd = document.createElement('div');
            wd.id = 'custom-wallpaper';
            wd.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:-2; background-size:cover; background-position:center; background-repeat:no-repeat;';
            document.body.prepend(wd);
        }
        wd.style.backgroundImage = `url(${wallpaperUrl})`;
        wd.style.filter = `blur(${blur}px) brightness(${brightness})`;
    } else if (wd) {
        wd.remove();
    }
}

function setWallpaper(url) { currentSettings.wallpaperUrl = url; applyAllEffects(); saveSettings(); }
function resetWallpaper() { currentSettings.wallpaperUrl = null; applyAllEffects(); saveSettings(); }
function updateBlur(e) { currentSettings.blur = parseInt(e.target.value); document.getElementById('itd-blur-value').textContent = currentSettings.blur + 'px'; applyAllEffects(); saveSettings(); }
function updateBrightness(e) { currentSettings.brightness = parseFloat(e.target.value); document.getElementById('itd-brightness-value').textContent = currentSettings.brightness; applyAllEffects(); saveSettings(); }
function applyWallpaperFromMenu() { const url = document.getElementById('itd-wallpaper-url').value.trim(); if (url) setWallpaper(url); }
function resetWallpaperFromMenu() { resetWallpaper(); document.getElementById('itd-wallpaper-url').value = ''; }
function handleFileWallpaper(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setWallpaper(ev.target.result); document.getElementById('itd-wallpaper-url').value = ev.target.result; };
    reader.readAsDataURL(file);
}

// ============ 3. Темы и звуки ============
function applyTheme(themeId) {
    if (themeStyleElement) { themeStyleElement.remove(); themeStyleElement = null; }
    let css = '';
    if (themeId !== 'custom') css = THEMES[themeId]?.css || '';
    else css = currentSettings.customCSS || '';
    if (css) {
        themeStyleElement = document.createElement('style');
        themeStyleElement.id = 'itd-theme-style';
        themeStyleElement.textContent = css;
        document.head.appendChild(themeStyleElement);
    }
    currentSettings.theme = themeId;
    saveSettings();
    chrome.storage.local.get(`themeSound_${themeId}`, (data) => {
        const sound = data[`themeSound_${themeId}`];
        if (sound) { currentSettings.notificationSound = sound; chrome.storage.local.set({ notificationSound: sound }); }
    });
    chrome.runtime.sendMessage({ action: 'setIcon', theme: themeId }).catch(() => {});
    if (themeId === 'custom') document.getElementById('itd-custom-css').value = currentSettings.customCSS || '';
}

function onThemeSelectChange() { const themeId = document.getElementById('itd-theme-select').value; document.getElementById('itd-custom-css-block').style.display = themeId === 'custom' ? 'block' : 'none'; }
function applySelectedTheme() { const themeId = document.getElementById('itd-theme-select').value; applyTheme(themeId); }
function applyCustomCSS() { const css = document.getElementById('itd-custom-css').value; currentSettings.customCSS = css; applyTheme('custom'); }
function handleThemeSoundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const themeId = document.getElementById('itd-theme-select').value;
        chrome.storage.local.set({ [`themeSound_${themeId}`]: dataUrl }, () => {
            if (currentSettings.theme === themeId) { currentSettings.notificationSound = dataUrl; chrome.storage.local.set({ notificationSound: dataUrl }); alert('Звук сохранён и будет использоваться для этой темы!'); }
            else alert('Звук сохранён. Он применится, когда вы выберете эту тему.');
        });
    };
    reader.readAsDataURL(file);
}

// ============ 4. Сохранение/загрузка ============
function saveSettings() { chrome.storage.local.set({ itdSettings: currentSettings }); }
function loadSettings(callback) {
    chrome.storage.local.get('itdSettings', (data) => {
        if (data.itdSettings) currentSettings = { ...currentSettings, ...data.itdSettings };
        if (callback) callback();
        applyAllEffects();
        applyTheme(currentSettings.theme);
        if (menuVisible) loadSettingsToMenu();
    });
}
function loadSettingsToMenu() {
    if (!menuElement) return;
    document.getElementById('itd-wallpaper-url').value = currentSettings.wallpaperUrl || '';
    document.getElementById('itd-blur-range').value = currentSettings.blur;
    document.getElementById('itd-blur-value').textContent = currentSettings.blur + 'px';
    document.getElementById('itd-brightness-range').value = currentSettings.brightness;
    document.getElementById('itd-brightness-value').textContent = currentSettings.brightness;
    document.getElementById('itd-theme-select').value = currentSettings.theme;
    document.getElementById('itd-custom-css-block').style.display = currentSettings.theme === 'custom' ? 'block' : 'none';
    if (currentSettings.theme === 'custom') document.getElementById('itd-custom-css').value = currentSettings.customCSS || '';
}

// ============ 5. Кнопки (старые) ============
function updateButtons(buttonsArray) {
    const old = document.getElementById('custom-buttons-container');
    if (old) old.remove();
    if (!buttonsArray || !buttonsArray.length) return;
    const container = document.createElement('div');
    container.id = 'custom-buttons-container';
    container.style.cssText = 'position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; gap:8px; z-index:10000;';
    buttonsArray.forEach(btn => {
        const b = document.createElement('button');
        b.textContent = btn.name;
        b.className = 'custom-copy-button';
        b.style.cssText = 'padding:8px 16px; background:#4CAF50; color:white !important; border:none; border-radius:4px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2);';
        b.addEventListener('click', () => {
            navigator.clipboard.writeText(btn.text).then(() => showCopyAlert(`✅ "${btn.name}" скопирован!`));
        });
        makeDraggable(b, container);
        container.appendChild(b);
    });
    document.body.appendChild(container);
}
function showCopyAlert(msg) {
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed; top:20px; right:20px; background:#333; color:white !important; padding:10px 20px; border-radius:4px; z-index:10001;';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2500);
}
function makeDraggable(button, container) {
    let isDragging = false, startX, startY, initialX, initialY;
    button.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialX = button.offsetLeft; initialY = button.offsetTop;
        button.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        button.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    window.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; button.style.cursor = 'grab'; }
    });
    button.style.cursor = 'grab';
    button.style.userSelect = 'none';
}

// ============ 6. Сообщения от popup ============
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setWallpaper') { setWallpaper(message.url); sendResponse({ status: 'ok' }); }
    else if (message.action === 'resetWallpaper') { resetWallpaper(); sendResponse({ status: 'ok' }); }
    else if (message.action === 'updateButtons') { updateButtons(message.buttons); sendResponse({ status: 'ok' }); }
    return true;
});

// ============ 7. Игры ============
function openGamesList() {
    hideMenu();
    if (gameWindow) gameWindow.remove();
    gameWindow = document.createElement('div');
    gameWindow.id = 'itd-game-window';
    gameWindow.innerHTML = `
    <div class="game-header"><h2>🎮 Выберите игру</h2><button class="game-close">✕</button></div>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${Object.entries(GAMES).map(([id, g]) => `<button class="btn" data-game="${id}">${g.name}</button>`).join('')}
    </div>`;
    document.body.appendChild(gameWindow);
    gameWindow.querySelector('.game-close').addEventListener('click', () => { gameWindow.remove(); gameWindow = null; });
    gameWindow.querySelectorAll('[data-game]').forEach(btn => {
        btn.addEventListener('click', (e) => { startGame(e.target.dataset.game); });
    });
}

function startGame(gameId) {
    if (gameWindow) gameWindow.remove();
    gameWindow = document.createElement('div');
    gameWindow.id = 'itd-game-window';
    gameWindow.innerHTML = `
    <div class="game-header"><h2>${GAMES[gameId].name}</h2><button class="game-close">✕</button></div>
    <div id="game-container"></div>`;
    document.body.appendChild(gameWindow);
    gameWindow.querySelector('.game-close').addEventListener('click', () => { gameWindow.remove(); gameWindow = null; });
    GAMES[gameId].init(document.getElementById('game-container'));
}

// --- Реализации игр ---
function initMinesweeper(container) {
    container.innerHTML = '<div id="minesweeper-board" style="margin:auto;"></div><button id="restart-mines">Новая игра</button>';
    const boardSize = 9, minesCount = 10;
    let grid, revealed, flagged, gameOver;

    function initBoard() {
        grid = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
        revealed = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
        flagged = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
        gameOver = false;
        let placed = 0;
        while (placed < minesCount) {
            const r = Math.floor(Math.random() * boardSize), c = Math.floor(Math.random() * boardSize);
            if (grid[r][c] !== 'M') { grid[r][c] = 'M'; placed++; }
        }
        for (let r=0; r<boardSize; r++) {
            for (let c=0; c<boardSize; c++) {
                if (grid[r][c] === 'M') continue;
                let count = 0;
                for (let dr=-1; dr<=1; dr++)
                    for (let dc=-1; dc<=1; dc++) {
                        if (dr===0 && dc===0) continue;
                        const nr = r+dr, nc = c+dc;
                        if (nr>=0 && nr<boardSize && nc>=0 && nc<boardSize && grid[nr][nc]==='M') count++;
                    }
                grid[r][c] = count;
            }
        }
    }

    function render() {
        const board = document.getElementById('minesweeper-board');
        board.innerHTML = '';
        board.style.display = 'grid';
        board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
        for (let r=0; r<boardSize; r++) {
            for (let c=0; c<boardSize; c++) {
                const cell = document.createElement('div');
                cell.style.cssText = 'width:30px; height:30px; border:1px solid #555; text-align:center; line-height:30px; cursor:pointer; color:white !important;';
                cell.dataset.r = r; cell.dataset.c = c;
                if (revealed[r][c]) {
                    cell.style.background = '#ccc';
                    cell.style.color = '#000 !important';
                    cell.textContent = grid[r][c]==='M' ? '💣' : grid[r][c] || '';
                } else {
                    cell.style.background = '#999';
                    if (flagged[r][c]) cell.textContent = '🚩';
                }
                cell.addEventListener('click', () => reveal(r,c));
                cell.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleFlag(r,c); });
                board.appendChild(cell);
            }
        }
    }

    function reveal(r,c) {
        if (gameOver || revealed[r][c] || flagged[r][c]) return;
        revealed[r][c] = true;
        if (grid[r][c] === 'M') {
            gameOver = true;
            alert('Вы проиграли!');
            revealAll();
            return;
        } else if (grid[r][c] === 0) {
            for (let dr=-1; dr<=1; dr++)
                for (let dc=-1; dc<=1; dc++) {
                    const nr = r+dr, nc = c+dc;
                    if (nr>=0 && nr<boardSize && nc>=0 && nc<boardSize) reveal(nr,nc);
                }
        }
        checkWin();
        render();
    }

    function toggleFlag(r,c) {
        if (gameOver || revealed[r][c]) return;
        flagged[r][c] = !flagged[r][c];
        render();
    }

    function checkWin() {
        let allRevealed = true;
        for (let r=0; r<boardSize; r++)
            for (let c=0; c<boardSize; c++)
                if (!revealed[r][c] && grid[r][c] !== 'M') allRevealed = false;
        if (allRevealed) { gameOver = true; alert('Вы выиграли!'); }
    }

    function revealAll() {
        for (let r=0; r<boardSize; r++)
            for (let c=0; c<boardSize; c++)
                revealed[r][c] = true;
        render();
    }

    document.getElementById('restart-mines').addEventListener('click', () => { initBoard(); render(); });
    initBoard();
    render();
}

function initSnake(container) {
    container.innerHTML = '<canvas id="snake-canvas" width="300" height="300"></canvas><button id="restart-snake">Новая игра</button>';
    const canvas = document.getElementById('snake-canvas'), ctx = canvas.getContext('2d');
    let snake = [{x:10,y:10}], food = {}, dir = {x:0,y:0}, gameLoop, score = 0;

    function reset() { snake = [{x:10,y:10}]; dir = {x:0,y:0}; score = 0; placeFood(); }
    function placeFood() { food = { x: Math.floor(Math.random()*30), y: Math.floor(Math.random()*30) }; }
    function step() {
        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
        if (head.x<0 || head.x>=30 || head.y<0 || head.y>=30 || snake.some(s=>s.x===head.x && s.y===head.y)) {
            clearInterval(gameLoop);
            alert(`Игра окончена. Счёт: ${score}`);
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) { score++; placeFood(); }
        else snake.pop();
        draw();
    }
    function draw() {
        ctx.fillStyle = '#111'; ctx.fillRect(0,0,300,300);
        ctx.fillStyle = 'red'; ctx.fillRect(food.x*10, food.y*10, 10, 10);
        ctx.fillStyle = 'lime'; snake.forEach(s => ctx.fillRect(s.x*10, s.y*10, 10, 10));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dir.y===0) dir = {x:0,y:-1};
        if (e.key === 'ArrowDown' && dir.y===0) dir = {x:0,y:1};
        if (e.key === 'ArrowLeft' && dir.x===0) dir = {x:-1,y:0};
        if (e.key === 'ArrowRight' && dir.x===0) dir = {x:1,y:0};
    });

    document.getElementById('restart-snake').addEventListener('click', () => { clearInterval(gameLoop); reset(); gameLoop = setInterval(step, 100); });
    reset();
    gameLoop = setInterval(step, 100);
}

function initDino(container) {
    container.innerHTML = '<canvas id="dino-canvas" width="600" height="200"></canvas><button id="restart-dino">Новая игра</button>';
    const canvas = document.getElementById('dino-canvas'), ctx = canvas.getContext('2d');
    let dino = {y:150, vy:0, jumping:false}, obstacles = [], frame = 0, gameLoop, gameOver = false;

    function reset() { dino = {y:150, vy:0, jumping:false}; obstacles = []; frame = 0; gameOver = false; }
    function step() {
        if (gameOver) return;
        frame++;
        if (dino.jumping) { dino.y += dino.vy; dino.vy += 0.5; if (dino.y >= 150) { dino.y = 150; dino.jumping = false; dino.vy = 0; } }
        if (frame % 60 === 0) obstacles.push({x:600, width:20, height:40});
        obstacles.forEach(o => o.x -= 5);
        obstacles = obstacles.filter(o => o.x > -20);
        const dinoRect = {x:50, y:dino.y, w:20, h:40};
        for (let o of obstacles) {
            if (dinoRect.x < o.x+o.width && dinoRect.x+dinoRect.w > o.x && dinoRect.y < 150+o.height && dinoRect.y+dinoRect.h > 150) {
                gameOver = true;
                alert('Игра окончена');
                clearInterval(gameLoop);
            }
        }
        draw();
    }
    function draw() {
        ctx.fillStyle = '#fff'; ctx.fillRect(0,0,600,200);
        ctx.fillStyle = 'black'; ctx.fillRect(50, dino.y, 20, 40);
        obstacles.forEach(o => ctx.fillRect(o.x, 150, o.width, o.height));
        ctx.fillStyle = '#ccc'; ctx.fillRect(0,190,600,10);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !dino.jumping) { dino.jumping = true; dino.vy = -8; }
    });

    document.getElementById('restart-dino').addEventListener('click', () => { clearInterval(gameLoop); reset(); gameLoop = setInterval(step, 20); });
    reset();
    gameLoop = setInterval(step, 20);
}

function initTetris(container) {
    container.innerHTML = '<canvas id="tetris-canvas" width="240" height="400"></canvas><button id="restart-tetris">Новая игра</button>';
    const canvas = document.getElementById('tetris-canvas'), ctx = canvas.getContext('2d');
    const boardW = 10, boardH = 20;
    let board = [], currentPiece = null, gameLoop, gameOver = false;
    const pieces = [
        [[1,1,1,1]], [[1,1],[1,1]], [[1,1,1],[0,1,0]], [[1,1,1],[1,0,0]], [[1,1,1],[0,0,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]]
    ];

    function newPiece() { const type = Math.floor(Math.random()*pieces.length); currentPiece = { shape: pieces[type], x:3, y:0 }; if (!canMove(0,0)) gameOver = true; }
    function canMove(dx, dy) {
        for (let r=0; r<currentPiece.shape.length; r++)
            for (let c=0; c<currentPiece.shape[0].length; c++)
                if (currentPiece.shape[r][c]) {
                    const nx = currentPiece.x + c + dx, ny = currentPiece.y + r + dy;
                    if (nx<0 || nx>=boardW || ny>=boardH) return false;
                    if (ny>=0 && board[ny][nx]) return false;
                }
        return true;
    }
    function lock() {
        for (let r=0; r<currentPiece.shape.length; r++)
            for (let c=0; c<currentPiece.shape[0].length; c++)
                if (currentPiece.shape[r][c]) { const ny = currentPiece.y + r, nx = currentPiece.x + c; if (ny>=0) board[ny][nx] = 1; }
        for (let y=boardH-1; y>=0; y--) { if (board[y].every(cell=>cell)) { board.splice(y,1); board.unshift(Array(boardW).fill(0)); } }
        newPiece();
    }
    function moveDown() { if (!gameOver && canMove(0,1)) currentPiece.y++; else if (!gameOver) lock(); }
    function draw() {
        ctx.fillStyle = '#222'; ctx.fillRect(0,0,240,400);
        for (let y=0; y<boardH; y++) for (let x=0; x<boardW; x++) if (board[y][x]) { ctx.fillStyle = '#666'; ctx.fillRect(x*24, y*20, 24, 20); }
        if (currentPiece) { ctx.fillStyle = '#f00'; for (let r=0; r<currentPiece.shape.length; r++) for (let c=0; c<currentPiece.shape[0].length; c++) if (currentPiece.shape[r][c]) { ctx.fillRect((currentPiece.x+c)*24, (currentPiece.y+r)*20, 24, 20); } }
        if (gameOver) { ctx.fillStyle = 'white'; ctx.font = '20px sans-serif'; ctx.fillText('Game Over', 50, 200); }
    }
    function step() { if (!gameOver) { moveDown(); draw(); } }

    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft' && canMove(-1,0)) currentPiece.x--;
        if (e.key === 'ArrowRight' && canMove(1,0)) currentPiece.x++;
        if (e.key === 'ArrowDown' && canMove(0,1)) currentPiece.y++;
        if (e.key === 'ArrowUp') { const rotated = currentPiece.shape[0].map((_,i)=>currentPiece.shape.map(row=>row[i]).reverse()); const old = currentPiece.shape; currentPiece.shape = rotated; if (!canMove(0,0)) currentPiece.shape = old; }
        draw();
    });

    document.getElementById('restart-tetris').addEventListener('click', () => { clearInterval(gameLoop); board = Array(boardH).fill().map(()=>Array(boardW).fill(0)); gameOver = false; newPiece(); gameLoop = setInterval(step, 500); });
    board = Array(boardH).fill().map(()=>Array(boardW).fill(0));
    newPiece();
    gameLoop = setInterval(step, 500);
}

function initTicTacToe(container) {
    container.innerHTML = '<div id="ttt-board" style="display:grid; grid-template-columns: repeat(3, 60px); gap:5px;"></div><button id="restart-ttt">Новая игра</button>';
    const boardDiv = document.getElementById('ttt-board');
    let field = Array(3).fill().map(()=>Array(3).fill(null)), currentPlayer = 'X', gameOver = false;

    function render() {
        boardDiv.innerHTML = '';
        for (let r=0; r<3; r++) for (let c=0; c<3; c++) {
            const cell = document.createElement('div');
            cell.style.cssText = 'width:60px; height:60px; border:1px solid white; text-align:center; line-height:60px; font-size:30px; color:white !important;';
            cell.textContent = field[r][c] || '';
            cell.addEventListener('click', () => {
                if (gameOver || field[r][c]) return;
                field[r][c] = currentPlayer;
                if (checkWin(currentPlayer)) { gameOver = true; alert(`Победил ${currentPlayer}`); }
                else if (field.flat().every(c=>c)) { gameOver = true; alert('Ничья'); }
                currentPlayer = currentPlayer==='X'?'O':'X';
                render();
            });
            boardDiv.appendChild(cell);
        }
    }

    function checkWin(p) {
        for (let i=0; i<3; i++) { if (field[i][0]===p && field[i][1]===p && field[i][2]===p) return true; if (field[0][i]===p && field[1][i]===p && field[2][i]===p) return true; }
        if (field[0][0]===p && field[1][1]===p && field[2][2]===p) return true;
        if (field[0][2]===p && field[1][1]===p && field[2][0]===p) return true;
        return false;
    }

    document.getElementById('restart-ttt').addEventListener('click', () => { field = Array(3).fill().map(()=>Array(3).fill(null)); currentPlayer = 'X'; gameOver = false; render(); });
    render();
}

// ============ 8. Инициализация ============
(async () => {
    await new Promise(resolve => loadSettings(resolve));
    const { customButtons } = await chrome.storage.local.get('customButtons') || {};
    if (customButtons && customButtons.length) updateButtons(customButtons);
})();