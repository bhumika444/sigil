(async () => {
  function clickNavigate(destId) {
    return {
      trigger: { type: "ON_CLICK" },
      actions: [{ type: "NODE", destinationId: destId, navigation: "NAVIGATE", transition: null }],
    };
  }

  const page = figma.currentPage;
  const titles = {
    dashboard: "01 / Dashboard",
    agents: "02 / Agents",
    agentDetail: "03 / Agent detail",
    credentials: "04 / Credentials",
    transactions: "05 / Transactions",
    audit: "06 / Audit log",
    settings: "07 / Settings",
  };

  const ids = {};
  for (const [key, title] of Object.entries(titles)) {
    const f = page.findOne((n) => n.type === "FRAME" && n.name === title);
    if (f) ids[key] = f.id;
  }

  const labelToKey = {
    Dashboard: "dashboard",
    Agents: "agents",
    Credentials: "credentials",
    Transactions: "transactions",
    "Audit Log": "audit",
    Settings: "settings",
  };

  for (const root of page.children) {
    if (root.type !== "FRAME") continue;
    const sb = root.findOne((n) => n.name === "Sidebar");
    if (!sb) continue;
    for (const row of sb.findAll((n) => n.name.startsWith("Nav /"))) {
      const label = row.name.replace(/^Nav \/ /, "");
      const key = labelToKey[label];
      if (key && ids[key]) {
        await row.setReactionsAsync([clickNavigate(ids[key])]);
      }
    }
  }

  const agentsRoot = page.findOne((n) => n.name === titles.agents);
  if (agentsRoot && ids.agentDetail) {
    const row = agentsRoot.findOne((n) => n.name === "Row → Agent detail");
    if (row) await row.setReactionsAsync([clickNavigate(ids.agentDetail)]);
  }

  const detailRoot = page.findOne((n) => n.name === titles.agentDetail);
  if (detailRoot && ids.agents) {
    const back = detailRoot.findOne((n) => n.name === "Back → Agents");
    if (back) await back.setReactionsAsync([clickNavigate(ids.agents)]);
  }
})();
