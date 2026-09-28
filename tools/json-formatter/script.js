(function () {
  var input = document.getElementById("json-input");
  var output = document.getElementById("json-output");
  var status = document.getElementById("status");

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "status-message" + (type ? " " + type : "");
  }

  // Chrome/Firefox/Safari all include a character position in
  // SyntaxError messages (e.g. "Unexpected token } in JSON at position 42").
  // Convert that into a 1-based line/column so the message is actionable.
  function describeParseError(error, text) {
    var match = /position (\d+)/.exec(error.message);
    if (!match) {
      return error.message;
    }
    var position = Number(match[1]);
    var before = text.slice(0, position);
    var line = before.split("\n").length;
    var column = position - before.lastIndexOf("\n");
    return error.message + " (line " + line + ", column " + column + ")";
  }

  function parseInput() {
    var text = input.value.trim();
    if (!text) {
      throw new Error("Input is empty.");
    }
    return JSON.parse(text);
  }

  document.getElementById("beautify-btn").addEventListener("click", function () {
    try {
      var data = parseInput();
      output.value = JSON.stringify(data, null, 2);
      setStatus("Beautified successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(describeParseError(error, input.value), "error");
    }
  });

  document.getElementById("minify-btn").addEventListener("click", function () {
    try {
      var data = parseInput();
      output.value = JSON.stringify(data);
      setStatus("Minified successfully.", "success");
    } catch (error) {
      output.value = "";
      setStatus(describeParseError(error, input.value), "error");
    }
  });

  document.getElementById("validate-btn").addEventListener("click", function () {
    try {
      parseInput();
      setStatus("Valid JSON.", "success");
    } catch (error) {
      setStatus(describeParseError(error, input.value), "error");
    }
  });

  document.getElementById("copy-btn").addEventListener("click", function () {
    if (!output.value) {
      setStatus("Nothing to copy yet.", "error");
      return;
    }
    navigator.clipboard.writeText(output.value).then(
      function () {
        setStatus("Copied to clipboard.", "success");
      },
      function () {
        setStatus("Copy failed — select and copy manually.", "error");
      }
    );
  });
})();
