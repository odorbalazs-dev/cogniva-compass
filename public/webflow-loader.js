(function () {
  "use strict";

  if (window.COGNIVA_COMPASS_WEBFLOW_LOADED) return;
  window.COGNIVA_COMPASS_WEBFLOW_LOADED = true;

  const VERSION = "20260724-loader-v1";
  const BASE_URL = "https://cogniva-compass-production.up.railway.app";
  const loaderScript = document.currentScript;

  function addStylesheet(href, id) {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function mount() {
    if (document.getElementById("cognivaCompassRoot")) return;

    addStylesheet(
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap",
      "cogniva-compass-fonts"
    );
    addStylesheet(`${BASE_URL}/styles.css?v=${VERSION}`, "cogniva-compass-styles");

    const root = document.createElement("div");
    root.id = "cognivaCompassRoot";
    root.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#" aria-label="Cogniva Compass home">
          <span class="mark" aria-hidden="true">C</span>
          <span>Cogniva <b>Compass</b></span>
        </a>
        <label class="language">
          <span id="languageLabel">Language</span>
          <select id="languageSelect" aria-label="Language"></select>
        </label>
      </header>
      <main id="app" tabindex="-1"></main>
      <footer id="footer"></footer>
    `;

    const mountPoint = loaderScript && loaderScript.parentElement;
    (mountPoint || document.body).appendChild(root);

    const runtime = document.createElement("script");
    runtime.src = `${BASE_URL}/app.js?v=${VERSION}`;
    runtime.async = true;
    runtime.onerror = function () {
      root.innerHTML = "<p role='alert'>Cogniva Compass could not be loaded. Please refresh the page.</p>";
    };
    document.body.appendChild(runtime);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
