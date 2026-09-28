(function () {
  var grid = document.getElementById("tool-grid");

  window.TOOLS.forEach(function (tool, index) {
    var card = document.createElement("a");
    card.className = "tool-card";
    card.href = tool.url;

    var eyebrow = document.createElement("div");
    eyebrow.className = "tool-card__eyebrow";
    eyebrow.textContent = "[ TOOL_" + String(index + 1).padStart(2, "0") + " ]";

    var name = document.createElement("div");
    name.className = "tool-card__name";
    name.textContent = tool.emoji + " " + tool.name;

    var description = document.createElement("div");
    description.className = "tool-card__description";
    description.textContent = tool.description;

    var cta = document.createElement("div");
    cta.className = "tool-card__cta";
    cta.textContent = "run →";

    card.appendChild(eyebrow);
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(cta);
    grid.appendChild(card);
  });
})();
