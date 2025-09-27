
// 📂 Menu toggle
const menuBar = document.getElementById("menu-bar");
const menuToggle = document.getElementById("menu-toggle");
let menuVisible = true;

menuToggle.addEventListener("click", () => {
  menuVisible = !menuVisible;
  menuBar.classList.toggle("hidden", !menuVisible);
});

// ⛶ Fullscreen toggle
document.getElementById("fullscreen-btn").addEventListener("click", () => {
  const iframe = document.getElementById("game-frame");
  if (iframe.requestFullscreen) iframe.requestFullscreen();
  else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
  else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
});

// 📤 Share button
document.getElementById("share-btn").addEventListener("click", async () => {
  try {
    await navigator.share({
      title: document.title,
      url: window.location.href
    });
  } catch (e) {
    alert("Sharing not supported on this device.");
  }
});

// 🔊 Mute toggle (icon only, doesn’t mute cross-origin iframes)
const volumeBtn = document.getElementById("volume-btn");
let isMuted = false;

volumeBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  volumeBtn.src = isMuted ? "../assets/images/icons/mute.png" : "../assets/images/icons/volume.png";

  // Optional: post message to iframe if your games support mute events
  // document.getElementById("game-frame").contentWindow.postMessage({ type: "TOGGLE_MUTE", muted: isMuted }, "*");
});

// 🪟 Open in new about:blank tab
document.getElementById("popup-btn").addEventListener("click", () => {
  const currentUrl = window.location.href;
  const sitePref = localStorage.getItem("french_sitepref") || "../index.html";

  const win = window.open("about:blank");
  win.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>about:blank</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background: #000;
        }
        iframe {
          border: none;
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <iframe src="${currentUrl}"></iframe>
    </body>
    </html>
  `);
  win.document.close();

  // Redirect current tab to preferred page
  window.location.href = sitePref;
});
