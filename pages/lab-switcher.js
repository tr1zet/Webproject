(() => {
  const host = document.createElement('div');
  host.setAttribute('data-lab-switcher', '');
  document.body.append(host);

  const root = host.attachShadow({ mode: 'open' });
  const currentPath = window.location.pathname;
  const links = [
    { href: '/Webproject/', label: 'Все работы' },
    { href: '/Webproject/lab-4/', label: '№4 — Sass' },
    { href: '/Webproject/lab-4-tailwind/', label: '№4 — Tailwind' },
    { href: '/Webproject/lab-5/', label: '№5 — Vue' },
    { href: '/Webproject/lab-6/', label: '№6 — To-Do' },
    { href: '/Webproject/lab-7/', label: '№7 — Pinia' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    :host {
      position: fixed;
      right: max(1rem, env(safe-area-inset-right));
      bottom: max(1rem, env(safe-area-inset-bottom));
      z-index: 2147483647;
      color-scheme: dark;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    details { position: relative; }

    summary {
      min-height: 2.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1rem;
      border: 1px solid #475569;
      border-radius: 999px;
      color: #f8fafc;
      background: #111827;
      box-shadow: 0 0.8rem 2rem rgb(0 0 0 / 30%);
      font-size: 0.9rem;
      font-weight: 800;
      cursor: pointer;
      list-style: none;
      user-select: none;
    }

    summary::-webkit-details-marker { display: none; }
    summary::before { content: "☰"; font-size: 1rem; }
    summary:hover { background: #1e293b; }
    summary:focus-visible { outline: 3px solid #c084fc; outline-offset: 3px; }

    nav {
      position: absolute;
      right: 0;
      bottom: calc(100% + 0.65rem);
      width: min(17rem, calc(100vw - 2rem));
      display: grid;
      gap: 0.3rem;
      padding: 0.65rem;
      border: 1px solid #475569;
      border-radius: 1rem;
      background: #0f172a;
      box-shadow: 0 1rem 3rem rgb(0 0 0 / 40%);
    }

    a {
      min-height: 2.6rem;
      display: flex;
      align-items: center;
      padding: 0.55rem 0.75rem;
      border-radius: 0.65rem;
      color: #e2e8f0;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
    }

    a:hover { color: #fff; background: #1e293b; }
    a[aria-current="page"] { color: #fff; background: #3730a3; }
    a:focus-visible { outline: 3px solid #c084fc; outline-offset: 1px; }

    @media (max-width: 30rem) {
      :host {
        right: 0.75rem;
        bottom: 0.75rem;
      }

      summary { padding-inline: 0.85rem; }
    }

    @media (prefers-reduced-motion: no-preference) {
      summary, a { transition: background-color 150ms ease, color 150ms ease; }
    }
  `;

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Лабораторные';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Переход между лабораторными работами');

  for (const item of links) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    if (item.href !== '/Webproject/' && currentPath.startsWith(item.href)) {
      link.setAttribute('aria-current', 'page');
    }
    nav.append(link);
  }

  details.append(summary, nav);
  root.append(style, details);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') details.open = false;
  });

  document.addEventListener('click', (event) => {
    if (details.open && !event.composedPath().includes(host)) details.open = false;
  });
})();
