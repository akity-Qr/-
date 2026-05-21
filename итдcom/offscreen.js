chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'playAudio' && msg.url) {
        const audio = new Audio(msg.url);
        audio.volume = msg.volume || 1;
        audio.play().catch(e => console.warn('Offscreen audio play failed', e));
    }
});