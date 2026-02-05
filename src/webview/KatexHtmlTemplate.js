export const generateKatexHtml = ({
  latex = '',
  displayMode = false,
  backgroundColor = '#ffffff',
  fontSize = 18,
}) => {
  const escapedLatex = latex
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      min-height: 100%;
      background-color: ${backgroundColor};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: ${fontSize}px;
      line-height: 1.5;
      overflow-x: auto;
      overflow-y: hidden;
    }
    #latex-container { padding: 8px; width: 100%; }
    .display-mode { text-align: center; padding: 16px 8px; }
    .inline-mode { display: inline; }
    .error-container {
      padding: 12px;
      background-color: #fff3f3;
      border: 1px solid #ff6b6b;
      border-radius: 4px;
      color: #d32f2f;
      font-family: monospace;
      font-size: 14px;
      word-break: break-word;
    }
    .error-title { font-weight: bold; margin-bottom: 4px; color: #c62828; }
    .error-latex {
      background-color: #ffebee;
      padding: 4px 8px;
      border-radius: 2px;
      margin-top: 8px;
      font-size: 12px;
    }
    .katex { font-size: 1em; }
    .katex-display { margin: 0; padding: 0; }
    .katex-display > .katex { max-width: 100%; overflow-x: auto; overflow-y: hidden; padding: 4px 0; }
  </style>
</head>
<body>
  <div id="latex-container" class="${displayMode ? 'display-mode' : 'inline-mode'}"></div>
  <script>
    (function() {
      var startTime = Date.now();
      var latex = '${escapedLatex}';
      var displayMode = ${displayMode};
      var container = document.getElementById('latex-container');
      
      function sendMessage(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }
      
      function reportHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          container.scrollHeight,
          container.offsetHeight
        );
        sendMessage({ type: 'height', height: height });
      }
      
      function renderLatex() {
        try {
          katex.render(latex, container, {
            displayMode: displayMode,
            throwOnError: true,
            errorColor: '#d32f2f',
            strict: false,
            trust: true,
          });
          
          var renderTime = Date.now() - startTime;
          sendMessage({ type: 'rendered', success: true, renderTime: renderTime });
        } catch (error) {
          container.innerHTML = '<div class="error-container">' +
            '<div class="error-title">LaTeX Parse Error</div>' +
            '<div class="error-message">' + escapeHtml(error.message || 'Unknown error') + '</div>' +
            '<div class="error-latex">Original: ' + escapeHtml(latex) + '</div>' +
            '</div>';
          sendMessage({ type: 'rendered', success: false, error: error.message, renderTime: Date.now() - startTime });
        }
        setTimeout(reportHeight, 50);
      }
      
      function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
      
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(reportHeight).observe(container);
      }
      
      if (typeof katex !== 'undefined') {
        renderLatex();
      } else {
        var checkKatex = setInterval(function() {
          if (typeof katex !== 'undefined') {
            clearInterval(checkKatex);
            renderLatex();
          }
        }, 50);
        setTimeout(function() {
          clearInterval(checkKatex);
          if (typeof katex === 'undefined') {
            container.innerHTML = '<div class="error-container"><div class="error-title">Loading Error</div><div class="error-message">Failed to load KaTeX</div></div>';
            reportHeight();
          }
        }, 5000);
      }
    })();
  </script>
</body>
</html>
  `.trim();
};

export const generateMixedContentHtml = ({
  content = '',
  backgroundColor = '#ffffff',
  fontSize = 18,
}) => {
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      min-height: 100%;
      background-color: ${backgroundColor};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: ${fontSize}px;
      line-height: 1.6;
      color: #333;
    }
    #content-container { padding: 12px; word-wrap: break-word; }
    .katex { font-size: 1em; }
    .katex-display { margin: 12px 0; overflow-x: auto; }
    .error-inline {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <div id="content-container">${content}</div>
  <script>
    (function() {
      var startTime = Date.now();
      var container = document.getElementById('content-container');
      
      function sendMessage(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }
      
      function reportHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          container.scrollHeight,
          container.offsetHeight
        );
        sendMessage({ type: 'height', height: height });
      }
      
      function renderContent() {
        if (typeof renderMathInElement !== 'undefined') {
          try {
            renderMathInElement(container, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
              ],
              throwOnError: false,
            });
            sendMessage({ type: 'rendered', success: true, renderTime: Date.now() - startTime });
          } catch (error) {
            sendMessage({ type: 'rendered', success: false, error: error.message, renderTime: Date.now() - startTime });
          }
        }
        setTimeout(reportHeight, 50);
      }
      
      var checkReady = setInterval(function() {
        if (typeof katex !== 'undefined' && typeof renderMathInElement !== 'undefined') {
          clearInterval(checkReady);
          renderContent();
        }
      }, 50);
      
      setTimeout(function() {
        clearInterval(checkReady);
        reportHeight();
      }, 5000);
      
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(reportHeight).observe(container);
      }
    })();
  </script>
</body>
</html>
  `.trim();
};

export default {
  generateKatexHtml,
  generateMixedContentHtml,
};
