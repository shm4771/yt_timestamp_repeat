const video = document.querySelector('video');

if (video) {
    const getTimestamp = (e) => {
        const rect = video.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const duration = video.duration;
        const timestamp = (clickX / rect.width) * duration;

        document.removeEventListener('click', getTimestamp);

        chrome.runtime.sendMessage({
            action: document.activeElement.id === 'setStart' ? 'setStartTimestamp' : 'setEndTimestamp',
            timestamp
        });
    };

    document.addEventListener('click', getTimestamp);
} else {
    alert('No video element found on the page.');
}