// src/utils/parser.js

export const CONFIG = {
  SHEETS: {
    SCHEDULE: "討伐隊時間",
    SURVEY: "[New] 討伐時間調查結果",
    PETS: "聖光、幻獸清單",
  },
  ROLES: ["輸出", "巫師", "流氓", "技師"],
};

export const Utils = {
  getCellValue(row, col) {
    if (!row || !row.c || !row.c[col]) return "";
    return row.c[col].f || row.c[col].v || "";
  },
  cleanDay(raw) {
    return (raw || "").replace(/[()（）]/g, "");
  },
  splitClean(str) {
    if (!str || str === "-" || str === "null") return [];
    return str
      .split(/[\n,，、]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  },
};

export class DataStore {
  constructor() {
    this.roles = {};
    this.elements = {};
  }
  buildRoles(rows) {
    if (!rows) return;
    for (let i = 1; i < rows.length; i++) {
      let n = Utils.getCellValue(rows[i], 0).trim();
      let r = Utils.getCellValue(rows[i], 50).trim();
      if (n) this.roles[n] = r;
    }
  }
  buildElements(rows) {
    if (!rows) return;
    for (let i = 1; i < rows.length; i++) {
      let n = Utils.getCellValue(rows[i], 1).trim();
      let a = Utils.getCellValue(rows[i], 2).trim();
      if (n) this.elements[n] = a;
    }
  }
  getRole(n) {
    return this.roles[n.trim()] || null;
  }
  getAttr(i) {
    return this.elements[i] || "";
  }
}

export class ScheduleParser {
  static extract(rows) {
    const matches = [];
    for (let i = 0; i < rows.length; i++) {
      if (Utils.getCellValue(rows[i], 1).includes("第一隊")) {
        let s = i > 0 ? i - 1 : i;
        let e = rows.length;
        for (let j = i + 1; j < rows.length; j++) {
          if (Utils.getCellValue(rows[j], 1).includes("第一隊")) {
            e = j - 1;
            break;
          }
        }
        matches.push(rows.slice(s, e));
        i = e - 1;
      }
    }
    return matches;
  }
  static parseTeam(block, teamIdx) {
    const colBase = 1 + teamIdx * 4;
    let idx = { 輸出: 2, 巫師: 4, 流氓: 10, 技師: 16 };
    for (let r = 1; r < block.length; r++) {
      let a = Utils.getCellValue(block[r], 0);
      CONFIG.ROLES.forEach((role) => {
        if (a.includes(role)) idx[role] = r;
      });
    }
    const ranges = {
      輸出: { s: idx["輸出"], e: idx["巫師"] },
      巫師: { s: idx["巫師"], e: idx["流氓"] },
      流氓: { s: idx["流氓"], e: idx["技師"] },
      技師: { s: idx["技師"], e: block.length },
    };
    const teamData = {};
    CONFIG.ROLES.forEach((rk) => {
      teamData[rk] = this.parseMembers(block, ranges[rk], colBase);
    });
    return teamData;
  }
  static parseMembers(block, range, colBase) {
    const mems = [];
    if (!range) return mems;
    let cur = null;
    for (let r = range.s; r < range.e; r++) {
      const n = Utils.getCellValue(block[r], colBase);
      if (n && n !== "-" && n !== cur?.name) {
        cur = {
          name: n,
          status: Utils.getCellValue(block[r], colBase + 1),
          holies: [],
          pets: [],
        };
        mems.push(cur);
      }
      if (cur) {
        cur.holies.push(
          ...Utils.splitClean(Utils.getCellValue(block[r], colBase + 2))
        );
        cur.pets.push(
          ...Utils.splitClean(Utils.getCellValue(block[r], colBase + 3))
        );
      }
    }
    mems.forEach((m) => {
      m.holies = [...new Set(m.holies)];
      m.pets = [...new Set(m.pets)];
    });
    return mems;
  }
}
