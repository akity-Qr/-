// background.js

// Маппинг тем на иконки (если есть)
const iconPaths = {
    default: 'icons/icon_default.png',
    vk_new: 'icons/icon_vk_new.png',
    discord: 'icons/icon_discord.png',
    telegram: 'icons/icon_telegram.png',
    old_school: 'icons/icon_old_school.png',
    custom: 'icons/icon_custom.png'
};

// Убедимся, что оффскрин-документ создан
async function ensureOffscreen() {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    if (existingContexts.length > 0) return;

    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play custom notification sounds'
    });
}

// Проигрывание звука (основной способ)
async function playCustomSound(soundUrl) {
    try {
        await ensureOffscreen();
        chrome.runtime.sendMessage({
            action: 'playAudio',
            url: soundUrl
        });
    } catch (err) {
        console.warn('Could not play sound, using notification fallback', err);
        // fallback: показать уведомление (системный звук)
        chrome.notifications.create('', {
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Уведомление',
            message: 'Звук воспроизведён (системный)',
            priority: 2
        });
    }
}

// Обработка сообщений
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'playSound') {
        // Используем сохранённый звук текущей темы или загруженный вручную
        chrome.storage.local.get('notificationSound', async (data) => {
            if (data.notificationSound) {
                await playCustomSound(data.notificationSound);
            } else {
                // Пробуем стандартный файл
                const url = chrome.runtime.getURL('sounds/notification.mp3');
                await playCustomSound(url);
            }
            sendResponse({ status: 'Sound triggered' });
        });
        return true;
    } else if (message.action === 'showNotification') {
        // Простое уведомление (без кастомного звука)
        chrome.notifications.create('', {
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: message.title || 'Уведомление',
            message: message.content || '',
            priority: 2
        });
        sendResponse({ status: 'Notification shown' });
    } else if (message.action === 'setIcon') {
        const theme = message.theme || 'default';
        const iconFile = iconPaths[theme] || iconPaths.default;
        chrome.action.setIcon({
            path: {
                16: iconFile,
                48: iconFile,
                128: iconFile
            }
        }).catch(err => {
            // Если нет нужной иконки, используем дефолт
            chrome.action.setIcon({
                path: {
                    16: 'icons/icon_default.png',
                    48: 'icons/icon_default.png',
                    128: 'icons/icon_default.png'
                }
            });
        });
        sendResponse({ status: 'Icon updated' });
    }
    return true;
});