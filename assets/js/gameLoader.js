// gameLoader.js

document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("game-frame");
    const hash = window.location.hash.substring(1); // remove '#'
    const params = new URLSearchParams(hash.replace(/&/g, "&")); // parse like query string

    const gameName = params.get("game");
    const debugMode = params.get("debug-mode") === "true";

    // Debugger panel
    let debugPanel = null;
    function logDebug(message) {
        if (debugMode) {
            if (!debugPanel) {
                debugPanel = document.createElement("div");
                debugPanel.style.position = "fixed";
                debugPanel.style.bottom = "0";
                debugPanel.style.left = "0";
                debugPanel.style.width = "100%";
                debugPanel.style.maxHeight = "200px";
                debugPanel.style.overflowY = "auto";
                debugPanel.style.background = "rgba(0,0,0,0.85)";
                debugPanel.style.color = "#0f0";
                debugPanel.style.fontFamily = "monospace";
                debugPanel.style.fontSize = "14px";
                debugPanel.style.padding = "8px";
                debugPanel.style.zIndex = "9999";
                document.body.appendChild(debugPanel);
            }
            const line = document.createElement("div");
            line.textContent = message;
            debugPanel.appendChild(line);
        }
        console.log(message);
    }

    if (!gameName) {
        logDebug("No game specified in hash. Example: #game=monkey-mart");
        return;
    }

    logDebug(`Loading game: ${gameName}`);

    fetch("game-list.csv")
        .then(response => response.text())
        .then(csvText => {
            logDebug("CSV loaded successfully.");
            const rows = csvText.trim().split("\n").slice(1); // skip header
            let found = false;

            rows.forEach(row => {
                const [name, link, image, iframeSrc, description, working, free] = row.split(",");
                if (name.trim().toLowerCase() === gameName.trim().toLowerCase()) {
                    found = true;
                    logDebug(`Match found: ${name}`);
                    const isWorking = working && working.trim().toLowerCase() === "yes";
                    const isFree = free && free.trim().toLowerCase() === "yes";
                    const loggedIn = localStorage.getItem("french_logged_in") === "Nf9qNFv9wLTHdvWrvgI0Sb89Tyysbj6r";

                    if (!isFree && !loggedIn) {
                        logDebug(`Game "${name}" is not free and user is not logged in. Redirecting to buy.html.`);
                        window.location.href = "../buy.html";
                        return;
                    }

                    if (isWorking) {
                        iframe.src = iframeSrc.trim();
                        logDebug(`Iframe set to: ${iframeSrc}`);
                    } else {
                        logDebug(`Game "${name}" is marked as not working.`);
                    }
                }
            });

            if (!found) {
                logDebug(`Game "${gameName}" not found in CSV.`);
            }
        })
        .catch(err => {
            logDebug("Error loading CSV: " + err);
        });
});
