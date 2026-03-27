/**
 * pages/mockups.js — Intégration mockups_ecrans_v4.html
 * Le contenu est injecté dans un conteneur dédié.
 * Les styles et scripts du fichier original sont encapsulés.
 */
window.PAGE_MOCKUPS = {
  _loaded: false,

  render() {
    return `
<div class="page-enter" style="height:calc(100vh - var(--nav-h));display:flex;flex-direction:column;">
  <div style="
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 20px;background:var(--bg2);border-bottom:1px solid var(--gris2);
    flex-shrink:0;
  ">
    <div style="font-family:var(--font-display);font-size:13px;color:var(--or);letter-spacing:3px;">MOCKUPS UI</div>
    <div style="font-family:var(--font-mono);font-size:8px;color:var(--txt2);letter-spacing:2px;">Écrans — v4</div>
  </div>
  <iframe src="mockups_ecrans_v4.html"
    style="flex:1;border:none;width:100%;display:block;"
    title="Mockups UI — Dethroned"
    loading="lazy">
  </iframe>
</div>`;
  },

  init() {
    // L'iframe se charge toute seule
  }
};
