/**
 * pages/mockups.js — Wrapper SPA pour Mockups UI
 */
window.PAGE_MOCKUPS = {
  render() {
    return `<div id="tool-mock-wrap" style="height:calc(100vh - var(--nav-h));overflow-y:auto;"></div>`;
  },

  init() {
    const wrap = document.getElementById('tool-mock-wrap');
    if (!wrap) return;

    if (!document.getElementById('style-tool-mock')) {
      const st = document.createElement('style');
      st.id = 'style-tool-mock';
      st.textContent = MOCK_SCOPED_CSS;
      document.head.appendChild(st);
    }

    wrap.innerHTML = `<div id="tool-mock">${MOCK_BODY_HTML}</div>`;

    const old = document.getElementById('script-tool-mock');
    if (old) old.remove();
    const s = document.createElement('script');
    s.id = 'script-tool-mock';
    s.src = 'pages/mockups-logic.js';
    document.body.appendChild(s);
  }
};
