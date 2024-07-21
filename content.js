// Create the UI container
const uiContainer = document.createElement('div');
uiContainer.style.position = 'fixed';
uiContainer.style.top = '10px';
uiContainer.style.right = '10px';
uiContainer.style.backgroundColor = 'white';
uiContainer.style.padding = '10px';
uiContainer.style.border = '1px solid black';
uiContainer.style.zIndex = '10000';
uiContainer.style.cursor = 'move'; // Cursor indicates movability

// Initial styles for collapsed state
uiContainer.style.width = '100px'; // Smaller width when collapsed
uiContainer.style.height = '50px'; // Smaller height when collapsed

const toggleButton = document.createElement('button');
toggleButton.innerText = 'Expand';
uiContainer.appendChild(toggleButton);

const contentDiv = document.createElement('div');
contentDiv.style.display = 'none'; // Initially hidden
contentDiv.innerHTML = `
  <h1>YouTube Plugin</h1>
  <button id="setStart">Set Start Timestamp</button>
  <button id="setEnd">Set End Timestamp</button>
  <button id="play">Play</button>
  <button id="repeat">Repeat</button>
  <button id="clearTimestamps">Clear Timestamps</button>
  <p id="startTimestamp">Start: Not set</p>
  <p id="endTimestamp">End: Not set</p>
`;
uiContainer.appendChild(contentDiv);

document.body.appendChild(uiContainer);

toggleButton.onclick = function () {
    if (contentDiv.style.display === 'none') {
        contentDiv.style.display = 'block';
        toggleButton.innerText = 'Collapse';
        uiContainer.style.width = '700px'; // Expanded width
        uiContainer.style.height = 'auto'; // Height adjusts to content
    } else {
        contentDiv.style.display = 'none';
        toggleButton.innerText = 'Expand';
        uiContainer.style.width = '100px'; // Collapsed width
        uiContainer.style.height = 'auto'; // Collapsed height
    }
};

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

dragElement(uiContainer);

// Event listeners and functions related to timestamp and video control
document.getElementById('setStart').addEventListener('click', () => {
    setTimestamp('setStartTimestamp');
});

document.getElementById('setEnd').addEventListener('click', () => {
    setTimestamp('setEndTimestamp');
});

document.getElementById('play').addEventListener('click', () => {
    playOrRepeatVideo('playVideo');
});

document.getElementById('repeat').addEventListener('click', () => {
    playOrRepeatVideo('repeatVideo');
});

document.getElementById('clearTimestamps').addEventListener('click', () => {
    startTimestamp = null;
    endTimestamp = null;
    document.getElementById('startTimestamp').innerText = "Start: Not set";
    document.getElementById('endTimestamp').innerText = "End: Not set";
    chrome.storage.local.set({ startTimestamp: null, endTimestamp: null });
});

function setTimestamp(action) {
    const video = document.querySelector('video');
    if (!video) {
        alert("No video found!");
        return;
    }
    const timestamp = video.currentTime;
    if (action === 'setStartTimestamp') {
        startTimestamp = timestamp;
        document.getElementById('startTimestamp').innerText = `Start: ${timestamp.toFixed(2)}s`;
        chrome.storage.local.set({ startTimestamp: timestamp });
    } else if (action === 'setEndTimestamp') {
        endTimestamp = timestamp;
        document.getElementById('endTimestamp').innerText = `End: ${timestamp.toFixed(2)}s`;
        chrome.storage.local.set({ endTimestamp: timestamp });
    }
}

function playOrRepeatVideo(action) {
    const video = document.querySelector('video');
    if (!video) {
        alert("No video found!");
        return;
    }
    if (startTimestamp !== null && endTimestamp !== null) {
        if (action === 'playVideo') {
            playVideo(startTimestamp, endTimestamp, video);
        } else {
            repeatVideo(startTimestamp, endTimestamp, video);
        }
    } else {
        alert('Please set both start and end timestamps.');
    }
}

function playVideo(start, end, video) {
    video.currentTime = start;
    video.play();
    const stopVideo = () => {
        if (video.currentTime >= end) {
            video.pause();
            video.removeEventListener('timeupdate', stopVideo);
        }
    };
    video.addEventListener('timeupdate', stopVideo);
}

function repeatVideo(start, end, video) {
    if (start === null || end === null || start >= end) {
        alert('Invalid start or end timestamps.');
        return;
    }

    video.currentTime = start;
    video.play();

    const loopVideo = () => {
        if (video.currentTime >= end) {
            video.currentTime = start;
            video.play(); // Ensure the video plays again after resetting time
        }
    };

    video.addEventListener('timeupdate', loopVideo);
}