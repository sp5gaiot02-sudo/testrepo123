(function () {
  var grid = document.getElementById("tool-grid");

  window.TOOLS.forEach(function (tool) {
    var card = document.createElement("a");
    card.className = "tool-card";
    card.href = tool.url;

    var icon = document.createElement("div");
    icon.className = "tool-card__icon";
    icon.textContent = tool.emoji;

    var name = document.createElement("div");
    name.className = "tool-card__name";
    name.textContent = tool.name;

    var description = document.createElement("div");
    description.className = "tool-card__description";
    description.textContent = tool.description;

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(description);
    grid.appendChild(card);
  });
})();
