// popup.js

async function sendToContent(action, data) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true, url: '*://xn--d1ah4a.com/*' });
    if (!tab) {
        alert('Ошибка: откройте сайт xn--d1ah4a.com, чтобы применить настройки.');
        return;
    }
    return await chrome.tabs.sendMessage(tab.id, { action, ...data });
}

// --- Обои ---
document.getElementById('applyWallpaperBtn').addEventListener('click', async () => {
    const url = document.getElementById('wallpaperUrl').value.trim();
    if (url) {
        await sendToContent('setWallpaper', { url });
    }
});
document.getElementById('resetWallpaperBtn').addEventListener('click', async () => {
    await sendToContent('resetWallpaper');
});
document.getElementById('wallpaperFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        const dataUrl = ev.target.result;
        await sendToContent('setWallpaper', { url: dataUrl });
    };
    reader.readAsDataURL(file);
});

// --- Звук ---
document.getElementById('notificationSound').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        await chrome.storage.local.set({ notificationSound: ev.target.result });
        alert('Звук сохранён!');
    };
    reader.readAsDataURL(file);
});
document.getElementById('testSoundBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'playSound' });
});
document.getElementById('resetSoundBtn').addEventListener('click', async () => {
    await chrome.storage.local.remove('notificationSound');
    alert('Звук сброшен.');
});

// --- Кнопки ---
document.getElementById('addButtonBtn').addEventListener('click', async () => {
    const name = document.getElementById('newButtonName').value.trim();
    const text = document.getElementById('newButtonText').value.trim();
    if (!name || !text) return alert('Заполните оба поля.');
    const { customButtons } = await chrome.storage.local.get('customButtons') || { customButtons: [] };
    customButtons.push({ name, text });
    await chrome.storage.local.set({ customButtons });
    await sendToContent('updateButtons', { buttons: customButtons });
    document.getElementById('newButtonName').value = '';
    document.getElementById('newButtonText').value = '';
});
document.getElementById('resetButtonsBtn').addEventListener('click', async () => {
    await chrome.storage.local.set({ customButtons: [] });
    await sendToContent('updateButtons', { buttons: [] });
});

// Загрузка сохранённого URL обоев для отображения
(async () => {
    const { itdSettings } = await chrome.storage.local.get('itdSettings');
    if (itdSettings && itdSettings.wallpaperUrl) {
        document.getElementById('wallpaperUrl').value = itdSettings.wallpaperUrl || '';
    }
})();