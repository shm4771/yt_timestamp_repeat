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
  <button id="clearTimestamps">Clear</button>
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
        uiContainer.style.height = '50px'; // Collapsed height
    }
};

dragElement(uiContainer);

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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

let startTimestamp = null;
let endTimestamp = null;

document.getElementById('setStart').addEventListener('click', () => {
    setTimestamp('start');
});

document.getElementById('setEnd').addEventListener('click', () => {
    setTimestamp('end');
});

document.getElementById('play').addEventListener('click', () => {
    playVideo();
});

document.getElementById('repeat').addEventListener('click', () => {
    repeatVideo();
});

document.getElementById('clearTimestamps').addEventListener('click', () => {
    clearTimestamps();
});

function setTimestamp(type) {
    const video = document.querySelector('video');
    const timestamp = video.currentTime;
    if (type === 'start') {
        startTimestamp = timestamp;
        document.getElementById('startTimestamp').innerText = `Start: ${timestamp.toFixed(2)}s`;
    } else {
        endTimestamp = timestamp;
        document.getElementById('endTimestamp').innerText = `End: ${timestamp.toFixed(2)}s`;
    }
}

function playVideo() {
    const video = document.querySelector('video');
    video.currentTime = startTimestamp || 0;
    video.play();
}

function repeatVideo() {
    const video = document.querySelector('video');
    playVideo();
    video.onended = () => {
        if (video.currentTime >= (endTimestamp || video.duration)) {
            video.currentTime = startTimestamp || 0;
            video.play();
        }
    };
}

function clearTimestamps() {
    const video = document.querySelector('video');
    startTimestamp = null;
    endTimestamp = null;
    document.getElementById('startTimestamp').innerText = "Start: Not set";
    document.getElementById('endTimestamp').innerText = "End: Not set";
    video.onended = null; // Remove the onended event handler
    video.pause(); // Pause the video
    video.currentTime = 0; // Reset the video current time
}
