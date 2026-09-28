(function () {
  var colorPicker = document.getElementById("base-color");
  var colorText = document.getElementById("base-color-text");
  var schemeSelect = document.getElementById("scheme-select");
  var palette = document.getElementById("palette");
  var status = document.getElementById("status");

  var HEX_RE = /^#?([0-9a-fA-F]{6})$/;

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "status-message" + (type ? " " + type : "");
  }

  function hexToRgb(hex) {
    var match = HEX_RE.exec(hex);
    if (!match) {
      return null;
    }
    var value = match[1];
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  function rgbToHex(rgb) {
    function toHex(component) {
      return Math.round(component).toString(16).padStart(2, "0");
    }
    return "#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
  }

  function rgbToHsl(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
      }
      h *= 60;
    }

    return { h: h, s: s * 100, l: l * 100 };
  }

  function hslToRgb(hsl) {
    var h = ((hsl.h % 360) + 360) % 360;
    var s = hsl.s / 100;
    var l = hsl.l / 100;

    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      var gray = l * 255;
      return { r: gray, g: gray, b: gray };
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    var hNorm = h / 360;

    return {
      r: hueToRgb(p, q, hNorm + 1 / 3) * 255,
      g: hueToRgb(p, q, hNorm) * 255,
      b: hueToRgb(p, q, hNorm - 1 / 3) * 255,
    };
  }

  function clampLightness(l) {
    return Math.min(95, Math.max(5, l));
  }

  function buildScheme(baseHsl, scheme) {
    switch (scheme) {
      case "complementary":
        return [
          baseHsl,
          { h: baseHsl.h + 180, s: baseHsl.s, l: baseHsl.l },
        ];
      case "analogous":
        return [-30, 0, 30].map(function (offset) {
          return { h: baseHsl.h + offset, s: baseHsl.s, l: baseHsl.l };
        });
      case "monochromatic":
        return [20, 35, 50, 65, 80].map(function (l) {
          return { h: baseHsl.h, s: baseHsl.s, l: clampLightness(l) };
        });
      default:
        return [baseHsl];
    }
  }

  function renderPalette(baseHex) {
    var rgb = hexToRgb(baseHex);
    if (!rgb) {
      setStatus("Enter a valid hex color (e.g. #3B5BDB).", "error");
      return;
    }
    setStatus("", "");

    var baseHsl = rgbToHsl(rgb);
    var colors = buildScheme(baseHsl, schemeSelect.value);

    palette.innerHTML = "";
    colors.forEach(function (hsl) {
      var colorRgb = hslToRgb(hsl);
      var hex = rgbToHex(colorRgb);
      var rgbRounded = {
        r: Math.round(colorRgb.r),
        g: Math.round(colorRgb.g),
        b: Math.round(colorRgb.b),
      };

      var swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "swatch";
      swatch.title = "Click to copy " + hex;

      var colorBlock = document.createElement("div");
      colorBlock.className = "swatch__color";
      colorBlock.style.backgroundColor = hex;

      var info = document.createElement("div");
      info.className = "swatch__info";
      info.innerHTML =
        '<div class="swatch__hex">' + hex.toUpperCase() + "</div>" +
        "<div>rgb(" + rgbRounded.r + ", " + rgbRounded.g + ", " + rgbRounded.b + ")</div>" +
        "<div>hsl(" + Math.round(hsl.h % 360) + "°, " + Math.round(hsl.s) + "%, " + Math.round(hsl.l) + "%)</div>";

      swatch.appendChild(colorBlock);
      swatch.appendChild(info);

      swatch.addEventListener("click", function () {
        navigator.clipboard.writeText(hex.toUpperCase()).then(
          function () {
            setStatus("Copied " + hex.toUpperCase() + " to clipboard.", "success");
          },
          function () {
            setStatus("Copy failed — select and copy manually.", "error");
          }
        );
      });

      palette.appendChild(swatch);
    });
  }

  function syncFromPicker() {
    colorText.value = colorPicker.value.toUpperCase();
    renderPalette(colorPicker.value);
  }

  function syncFromText() {
    var value = colorText.value.trim();
    if (!HEX_RE.test(value)) {
      setStatus("Enter a valid hex color (e.g. #3B5BDB).", "error");
      return;
    }
    var normalized = value.startsWith("#") ? value : "#" + value;
    colorPicker.value = normalized;
    renderPalette(normalized);
  }

  colorPicker.addEventListener("input", syncFromPicker);
  colorText.addEventListener("change", syncFromText);
  schemeSelect.addEventListener("change", function () {
    renderPalette(colorPicker.value);
  });

  renderPalette(colorPicker.value);
})();
