document.addEventListener("DOMContentLoaded", () => {
  const freeFilter = document.getElementById("free-filter");
  const searchInput = document.getElementById("search"); // your input bar
  let allGames = [];

  function renderGames(filterValue, searchValue) {
    const container = document.getElementById("game-container");
    container.innerHTML = "";
    allGames.forEach(game => {
      // Filter by free/paid
      if (filterValue !== "all" && game.free !== filterValue) return;
      // Filter by working
      if (game.working !== "yes") return;
      // Filter by search text
      if (searchValue && !game.name.toLowerCase().includes(searchValue.toLowerCase())) return;

      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <a href="${game.link}">
          <img src="${game.img}" alt="${game.name}">
        </a>
        <div class="game-overlay">
          <img src="assets/images/icons/share.png" alt="Share" class="share-btn">
          <img src="assets/images/icons/tab.png" alt="Launch" class="launch-btn">
        </div>
      `;

      // Share button
      card.querySelector(".share-btn").addEventListener("click", (e) => {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({
            title: game.name,
            text: game.desc,
            url: window.location.origin + "/" + game.link
          }).catch(err => console.log("Share canceled", err));
        } else {
          alert("Sharing not supported in this browser.");
        }
      });

      // Launch button
      card.querySelector(".launch-btn").addEventListener("click", (e) => {
        e.preventDefault();
        const newTab = window.open("about:blank", "_blank");
        if (newTab) {
          newTab.document.write(`<body style="margin:0;padding:0;"><iframe src="${game.link}" style="border:0;width:100vw;height:100vh;"></iframe></body>`);
        } else {
          alert("Popup blocked! Please allow popups for this site.");
        }
      });

      container.appendChild(card);
    });
  }

  fetch("games/game-list.csv")
    .then(res => res.text())
    .then(data => {
      const rows = data.split("\n").slice(1); // skip header
      allGames = rows
        .map(row => row.split(",").map(x => x.trim()))
        .filter(cols => cols.length >= 7 && cols[0]); // ensure enough columns and not empty
      allGames = allGames.map(cols => ({
        name: cols[0],
        link: cols[1],
        img: cols[2],
        iframeSrc: cols[3],
        desc: cols[4],
        working: cols[5],
        free: cols[6]
      }));

      // Initial render
      renderGames(freeFilter.value, searchInput.value);

      // Free filter
      freeFilter.addEventListener("change", () => {
        renderGames(freeFilter.value, searchInput.value);
      });

      // Search filter
      searchInput.addEventListener("input", () => {
        renderGames(freeFilter.value, searchInput.value);
      });
    })
    .catch(err => console.error("Error loading game list:", err));
});
