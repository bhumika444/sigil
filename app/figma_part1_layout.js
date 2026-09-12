(async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const C = {
    bg: { r: 0.078, g: 0.051, b: 0.102 },
    sidebar: { r: 0.109, g: 0.094, b: 0.141 },
    card: { r: 0.16, g: 0.14, b: 0.18 },
    border: { r: 0.22, g: 0.18, b: 0.26 },
    white: { r: 0.95, g: 0.94, b: 0.98 },
    muted: { r: 0.75, g: 0.72, b: 0.82 },
    accent: { r: 0.2, g: 0.16, b: 0.28 },
  };

  const W = 1180;
  const H = 720;
  const SW = 220;
  const TH = 52;
  const GAP = 56;

  const page = figma.currentPage;
  page.name = "Interactive prototype";
  for (const n of page.children.slice()) n.remove();

  const navDef = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Agents", key: "agents" },
    { label: "Credentials", key: "credentials" },
    { label: "Transactions", key: "transactions" },
    { label: "Audit Log", key: "audit" },
    { label: "Settings", key: "settings" },
  ];

  const screens = [
    { key: "dashboard", active: "dashboard", title: "01 / Dashboard", h: "Dashboard", sub: "Active agents, credentials, 30d transactions, Sigil score, recent txns, alerts." },
    { key: "agents", active: "agents", title: "02 / Agents", h: "Agents", sub: "Search, register agent, and open a row to view agent detail (tap the highlighted row)." },
    { key: "agentDetail", active: "agents", title: "03 / Agent detail", h: "Agent detail", sub: "KYA profile: identity, Sigil score, credentials — use Back to return to Agents." },
    { key: "credentials", active: "credentials", title: "04 / Credentials", h: "Credentials", sub: "Issued and revoked verifiable credentials for agents." },
    { key: "transactions", active: "transactions", title: "05 / Transactions", h: "Transactions", sub: "Settlement history, amounts, counterparties, and status." },
    { key: "audit", active: "audit", title: "06 / Audit log", h: "Audit log", sub: "Compliance events with severity and timestamps." },
    { key: "settings", active: "settings", title: "07 / Settings", h: "Settings", sub: "Workspace and org preferences." },
  ];

  const roots = {};
  let x = 0;

  for (const s of screens) {
    const root = figma.createFrame();
    root.name = s.title;
    root.x = x;
    root.y = 0;
    root.resize(W, H);
    root.fills = [{ type: "SOLID", color: C.bg }];
    root.clipsContent = true;

    const sb = figma.createFrame();
    sb.name = "Sidebar";
    sb.resize(SW, H);
    sb.x = 0;
    sb.y = 0;
    sb.fills = [{ type: "SOLID", color: C.sidebar }];
    sb.layoutMode = "NONE";

    const logo = figma.createText();
    logo.characters = "sigil";
    logo.fontSize = 16;
    logo.fontName = { family: "Inter", style: "Semi Bold" };
    logo.fills = [{ type: "SOLID", color: C.white }];
    logo.x = 16;
    logo.y = 20;
    sb.appendChild(logo);

    let navY = 52;
    for (const n of navDef) {
      const active = n.key === s.active;
      const row = figma.createFrame();
      row.name = "Nav / " + n.label;
      row.layoutMode = "NONE";
      row.resize(SW - 32, 36);
      row.x = 16;
      row.y = navY;
      navY += 42;
      row.cornerRadius = 6;
      row.fills = active ? [{ type: "SOLID", color: C.accent }] : [{ type: "SOLID", color: C.sidebar }];
      const t = figma.createText();
      t.characters = n.label;
      t.fontSize = 13;
      t.fontName = { family: "Inter", style: active ? "Medium" : "Regular" };
      t.fills = [{ type: "SOLID", color: active ? C.white : C.muted }];
      t.x = 10;
      t.y = 9;
      row.appendChild(t);
      sb.appendChild(row);
    }

    root.appendChild(sb);

    const top = figma.createFrame();
    top.name = "Top bar";
    top.resize(W - SW, TH);
    top.x = SW;
    top.y = 0;
    top.fills = [{ type: "SOLID", color: C.bg }];
    top.strokes = [{ type: "SOLID", color: C.border }];
    top.strokeWeight = 1;

    const topLabel = figma.createText();
    topLabel.characters = "Acme Corp";
    topLabel.fontSize = 13;
    topLabel.fontName = { family: "Inter", style: "Regular" };
    topLabel.fills = [{ type: "SOLID", color: C.muted }];
    topLabel.x = top.width - 100;
    topLabel.y = 17;
    top.appendChild(topLabel);
    root.appendChild(top);

    const main = figma.createFrame();
    main.name = "Main";
    main.resize(W - SW - 48, H - TH - 40);
    main.x = SW + 24;
    main.y = TH + 20;
    main.layoutMode = "VERTICAL";
    main.itemSpacing = 14;
    main.primaryAxisAlignItems = "MIN";
    main.counterAxisAlignItems = "MIN";

    const h1 = figma.createText();
    h1.characters = s.h;
    h1.fontSize = 26;
    h1.fontName = { family: "Inter", style: "Bold" };
    h1.fills = [{ type: "SOLID", color: C.white }];
    main.appendChild(h1);

    const sub = figma.createText();
    sub.characters = s.sub;
    sub.fontSize = 13;
    sub.fontName = { family: "Inter", style: "Regular" };
    sub.fills = [{ type: "SOLID", color: C.muted }];
    sub.layoutAlign = "STRETCH";
    main.appendChild(sub);

    if (s.key === "agentDetail") {
      const back = figma.createFrame();
      back.name = "Back → Agents";
      back.layoutMode = "NONE";
      back.resize(200, 40);
      back.cornerRadius = 6;
      back.fills = [{ type: "SOLID", color: C.accent }];
      const bt = figma.createText();
      bt.characters = "← Back to Agents";
      bt.fontSize = 13;
      bt.fontName = { family: "Inter", style: "Medium" };
      bt.fills = [{ type: "SOLID", color: C.white }];
      bt.x = 12;
      bt.y = 10;
      back.appendChild(bt);
      main.appendChild(back);
    }

    const rowCards = figma.createFrame();
    rowCards.name = "Stat cards";
    rowCards.layoutMode = "HORIZONTAL";
    rowCards.itemSpacing = 12;
    rowCards.fills = [];
    for (let i = 0; i < 4; i++) {
      const c = figma.createFrame();
      c.resize(200, 86);
      c.cornerRadius = 8;
      c.fills = [{ type: "SOLID", color: C.card }];
      c.strokes = [{ type: "SOLID", color: C.border }];
      c.strokeWeight = 1;
      rowCards.appendChild(c);
    }
    main.appendChild(rowCards);

    if (s.key === "agents") {
      const tbl = figma.createFrame();
      tbl.name = "Agents table (tap row)";
      tbl.layoutMode = "NONE";
      tbl.fills = [{ type: "SOLID", color: { r: 0.12, g: 0.1, b: 0.14 } }];
      tbl.strokes = [{ type: "SOLID", color: C.border }];
      tbl.strokeWeight = 1;
      tbl.cornerRadius = 8;
      tbl.resize(main.width, 120);

      const hdr = figma.createText();
      hdr.characters = "Agent ID · Name · Org · Type · Score · Status";
      hdr.fontSize = 11;
      hdr.fontName = { family: "Inter", style: "Medium" };
      hdr.fills = [{ type: "SOLID", color: C.muted }];
      hdr.x = 12;
      hdr.y = 8;
      tbl.appendChild(hdr);

      const r1 = figma.createRectangle();
      r1.name = "Row → Agent detail";
      r1.resize(tbl.width - 16, 44);
      r1.x = 8;
      r1.y = 36;
      r1.cornerRadius = 6;
      r1.fills = [{ type: "SOLID", color: { r: 0.18, g: 0.15, b: 0.24 } }];
      const r1t = figma.createText();
      r1t.characters = "AGT-001 · Treasury Bot · Acme · Payment · 92 · active  (click)";
      r1t.fontSize = 12;
      r1t.fontName = { family: "Inter", style: "Regular" };
      r1t.fills = [{ type: "SOLID", color: C.white }];
      r1t.x = r1.x + 10;
      r1t.y = r1.y + 13;
      tbl.appendChild(r1);
      tbl.appendChild(r1t);
      main.appendChild(tbl);
    }

    root.appendChild(main);
    page.appendChild(root);
    roots[s.key] = root;
    x += W + GAP;
  }

  figma.viewport.scrollAndZoomIntoView([roots.dashboard]);
})();
