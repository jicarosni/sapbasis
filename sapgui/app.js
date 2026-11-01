/* SAP GUI-style CV - plain JS, no dependencies, no trackers. */
(function () {
  "use strict";
  var CV = window.CV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
                set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  var state = { tc: "SESSION_MANAGER", hist: [], user: "HRUSOVSKY_J", client: "100", alv: null, tabs: {} };

  /* ---------- transactions ---------- */
  var T = {
    SESSION_MANAGER: { title: "SAP Easy Access", text: "SAP Easy Access", render: renderHome },
    SU01:  { title: "Maintain User: " , text: "User profile (About me)", render: renderSU01 },
    ZPROJ: { title: "Projects - Display List", text: "Projects", render: renderProjects },
    ZEXP:  { title: "Work Experience - Display List", text: "Work experience", render: renderExp },
    ZSKILL:{ title: "Skills Catalog - Display", text: "Skills", render: renderSkills },
    ZCERT: { title: "Certifications and Trainings", text: "Certifications & trainings", render: renderCert },
    ZEDU:  { title: "Education - Display", text: "Education", render: renderEdu },
    ZLANG: { title: "Languages - Display", text: "Languages", render: renderLang },
    ZCONT: { title: "Contact Data - Display", text: "Contact", render: renderContact },
    SM04:  { title: "User List", text: "User list", render: renderSM04 }
  };
  var ALIAS = { S000: "SESSION_MANAGER", SMEN: "SESSION_MANAGER", ZBIO: "SU01", SU3: "SU01", ZABOUT: "SU01", ZCV: "SU01", ZPROJECTS: "ZPROJ", ZSKILLS: "ZSKILL", ZCONTACT: "ZCONT", ZLANGU: "ZLANG" };
  var TREE = [
    { t: "Favorites", fav: true, open: true, kids: [] },
    { t: "SAP menu", open: true, kids: [
      { t: "Career", open: true, kids: [
        { tc: "SU01" }, { tc: "ZEXP" }, { tc: "ZPROJ" } ] },
      { t: "Qualifications", open: true, kids: [
        { tc: "ZSKILL" }, { tc: "ZCERT" }, { tc: "ZEDU" }, { tc: "ZLANG" } ] },
      { t: "Communication", open: false, kids: [ { tc: "ZCONT" } ] },
      { t: "Tools", open: false, kids: [ { tc: "SM04" } ] } ] }
  ];
  var DEFAULT_FAV = ["ZPROJ", "SU01", "ZCONT"];

  /* ---------- status bar ---------- */
  function msg(text, type) {
    var m = $("#st-msg"); m.className = "st-msg " + (type || "");
    $("#st-text").textContent = text || "\u00a0";
  }

  /* ---------- logon ---------- */
  function initLogon() {
    $("#lg-quote").innerHTML = esc(CV.quote.text) + "<br><cite>&mdash; " + esc(CV.quote.by) + "</cite>";
    $("#lg-btn").addEventListener("click", logon);
    $$("#logon input").forEach(function (i) { i.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); logon(); } }); });
    setTimeout(function () { $("#lg-pass").focus(); }, 50);
  }
  function logon() {
    var c = $("#lg-client").value.trim(), u = $("#lg-user").value.trim().toUpperCase();
    var st = $("#logon .st-msg");
    if (!/^\d{3}$/.test(c)) { st.className = "st-msg e"; st.innerHTML = '<span class="st-ico"></span>Client ' + esc(c || "''") + " is not available in this system"; return; }
    if (!u) { st.className = "st-msg e"; st.innerHTML = '<span class="st-ico"></span>Enter a user name'; return; }
    state.user = u; state.client = c;
    startGui(location.hash.replace("#", "").toUpperCase());
  }
  function startGui(first) {
    $("#logon").hidden = true; $("#gui").hidden = false;
    $$(".st-sys span").forEach(function (s) { if (/^JH1/.test(s.textContent)) s.textContent = "JH1 (1) " + state.client; });
    buildTree(); buildFavMenu();
    var tc = resolve(first);
    if (tc && tc !== "SESSION_MANAGER") { call("SESSION_MANAGER", true); call(tc); }
    else { call("SESSION_MANAGER", true); msg("Welcome " + state.user + ", logon to client " + state.client + " successful", "s"); }
    try { sessionStorage.setItem("jh1", JSON.stringify({ u: state.user, c: state.client })); } catch (e) {}
  }
  function logoff() {
    popup("Log Off", '<div class="pp-help"><div>Unsaved data will be lost.<br>Do you want to log off?</div></div>', [
      { t: "Yes", primary: true, fn: function () { try { sessionStorage.removeItem("jh1"); } catch (e) {} history.replaceState(null, "", location.pathname); location.reload(); } },
      { t: "No" } ]);
  }

  /* ---------- command field ---------- */
  function resolve(code) {
    if (!code) return null;
    code = code.toUpperCase().replace(/^\/[NO]/, "");
    if (T[code]) return code;
    if (ALIAS[code]) return ALIAS[code];
    return null;
  }
  function okcode(raw) {
    var c = (raw || "").trim().toUpperCase();
    $("#okcode").value = "";
    if (!c) { msg("", ""); return; }
    if (c === "/N" || c === "/NSESSION_MANAGER") return call("SESSION_MANAGER");
    if (c === "/NEX" || c === "/NEND" || c === "/I") return logoff();
    if (c === "/O" || /^\/O\w+/.test(c)) return msg("Maximum number of GUI sessions reached (this CV runs in 1 session)", "w");
    if (c === "?" || c === "HELP") return tcodeList();
    var tc = resolve(c);
    if (!tc) return msg("Transaction " + c.replace(/^\/N/, "") + " does not exist", "e");
    call(tc);
  }

  /* ---------- navigation ---------- */
  function call(tc, silent, isBack) {
    var t = T[tc]; if (!t) return;
    if (!isBack && state.tc && state.tc !== tc && !silent) state.hist.push(state.tc);
    state.tc = tc; state.alv = null;
    $("#apptoolbar").innerHTML = "";
    var title = tc === "SU01" ? "Maintain User: " + state.user : t.title;
    $("#scr-title").textContent = title;
    $("#win-title").textContent = title;
    document.title = title + " | Jan Hrusovsky - CV";
    $("#st-tc").textContent = tc;
    var c = $("#content"); c.innerHTML = ""; c.scrollTop = 0;
    t.render(c);
    $$("#treeview li>div").forEach(function (d) { d.classList.toggle("active", d.dataset.tc === tc); });
    if (!silent) msg(tc === "SESSION_MANAGER" ? "" : "Transaction " + tc + " started", tc === "SESSION_MANAGER" ? "" : "s");
    var h = tc === "SESSION_MANAGER" ? location.pathname : "#" + tc;
    try { history.replaceState(null, "", h); } catch (e) {}
    closeDrawer();
  }
  function back() {
    if (!$("#popup-mask").hidden) return closePopup();
    if (!state.hist.length) { if (state.tc !== "SESSION_MANAGER") call("SESSION_MANAGER", false, true); else msg("You are already on the initial screen", "w"); return; }
    call(state.hist.pop(), false, true); msg("", "");
  }

  /* ---------- tree ---------- */
  function favs() { return store.get("jh1fav", DEFAULT_FAV).filter(function (x) { return T[x]; }); }
  function buildTree() {
    TREE[0].kids = favs().map(function (tc) { return { tc: tc, fav: true }; });
    var ul = $("#treeview"); ul.innerHTML = "";
    TREE.forEach(function (n) { ul.appendChild(node(n)); });
  }
  function node(n) {
    var li = document.createElement("li"), d = document.createElement("div");
    li.appendChild(d);
    if (n.kids) {
      if (!n.open) li.classList.add("collapsed");
      d.innerHTML = '<span class="tw">' + (n.open ? "\u25BC" : "\u25B6") + '</span><span class="ic folder"></span><span>' + esc(n.t) + "</span>";
      d.setAttribute("role", "treeitem"); d.setAttribute("aria-expanded", !!n.open);
      d.addEventListener("click", function () {
        var col = li.classList.toggle("collapsed"); n.open = !col;
        d.querySelector(".tw").textContent = col ? "\u25B6" : "\u25BC"; d.setAttribute("aria-expanded", !col);
      });
      var ul = document.createElement("ul");
      n.kids.forEach(function (k) { ul.appendChild(node(k)); });
      if (!n.kids.length) { var e = document.createElement("li"); e.innerHTML = '<div style="color:#5a6a7c;cursor:default"><span class="tw"></span>(no entries)</div>'; ul.appendChild(e); }
      li.appendChild(ul);
    } else {
      d.dataset.tc = n.tc;
      d.innerHTML = '<span class="tw"></span><span class="ic ' + (n.fav ? "fav" : "tx") + '"></span><span class="tcode">' + n.tc + ' - </span><span>' + esc(T[n.tc].text) + "</span>";
      d.title = "Transaction " + n.tc;
      d.setAttribute("role", "treeitem");
      d.addEventListener("click", function () { call(n.tc); });
      if (n.tc === state.tc) d.classList.add("active");
    }
    return li;
  }
  function openDrawer() { $("#gui").classList.add("drawer"); }
  function closeDrawer() { $("#gui").classList.remove("drawer"); }

  /* ---------- menus ---------- */
  function buildFavMenu() {
    var ul = $("#fav-list");
    $$("li.f", ul).forEach(function (l) { l.remove(); });
    favs().forEach(function (tc) {
      var li = document.createElement("li"); li.className = "f"; li.dataset.cmd = tc;
      li.innerHTML = esc(T[tc].text) + '<span class="tc">' + tc + "</span>"; ul.appendChild(li);
    });
    if (!favs().length) { var li = document.createElement("li"); li.className = "f empty"; li.textContent = "(no favorites)"; ul.appendChild(li); }
  }
  function initMenus() {
    $$(".menu>button").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation(); var m = b.parentNode, was = m.classList.contains("open");
        closeMenus(); if (!was) m.classList.add("open");
      });
      b.addEventListener("mouseenter", function () { if ($(".menu.open") && !b.parentNode.classList.contains("open")) { closeMenus(); b.parentNode.classList.add("open"); } });
    });
    $("#menubar").addEventListener("click", function (e) {
      var li = e.target.closest("li"); if (!li || li.classList.contains("sep") || li.classList.contains("empty")) return;
      closeMenus();
      if (li.dataset.cmd) okcode(li.dataset.cmd);
      else if (li.dataset.act) action(li.dataset.act);
    });
    document.addEventListener("click", closeMenus);
  }
  function closeMenus() { $$(".menu.open").forEach(function (m) { m.classList.remove("open"); }); }

  function action(a) {
    switch (a) {
      case "selectall": if (state.alv) state.alv.selectAll(true); else msg("Function not possible on this screen", "w"); break;
      case "deselect": if (state.alv) state.alv.selectAll(false); else msg("Function not possible on this screen", "w"); break;
      case "copy":
        var url = location.href.split("#")[0] + (state.tc === "SESSION_MANAGER" ? "" : "#" + state.tc);
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { msg("Link copied to clipboard", "s"); }, function () { msg(url, "s"); });
        else msg(url, "s");
        break;
      case "cancel": back(); break;
      case "addfav":
        if (state.tc === "SESSION_MANAGER") { msg("Select a transaction first", "w"); break; }
        var f = favs(); if (f.indexOf(state.tc) < 0) { f.push(state.tc); store.set("jh1fav", f); }
        buildTree(); buildFavMenu(); msg("Transaction " + state.tc + " added to favorites", "s"); break;
      case "clearfav": store.set("jh1fav", []); buildTree(); buildFavMenu(); msg("All favorites deleted", "s"); break;
      case "tcodes": tcodeList(); break;
      case "toggletc": var on = document.body.classList.toggle("tech"); store.set("jh1tech", on); msg("Technical names " + (on ? "displayed" : "hidden"), "s"); break;
      case "settings":
        popup("Settings", '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="set-tech"' + (document.body.classList.contains("tech") ? " checked" : "") + '> Display technical names (transaction codes) in the menu tree</label>', [
          { t: "\u2714 Continue", primary: true, fn: function () { var on = $("#set-tech").checked; document.body.classList.toggle("tech", on); store.set("jh1tech", on); } }, { t: "Cancel" } ]);
        break;
      case "status": statusPopup(); break;
      case "f1": f1(); break;
      case "about":
        popup("About", '<div class="pp-help"><div><b>Jan Hrusovsky &middot; Cloud Architect and Advisor</b><br>An interactive CV styled after a classic SAP GUI. Plain HTML/CSS/JS, no frameworks, no tracking.<br><br>Not affiliated with or endorsed by SAP SE. "SAP" is a trademark of SAP SE; it is used here only to describe the professional field.</div></div>');
        break;
      case "pdf": downloadPdf(); break;
    }
  }
  function downloadPdf() {
    if (CV.pdfOk === false) return msg("PDF CV is not available online - please request it by e-mail (" + CV.email + ")", "w");
    var a = document.createElement("a"); a.href = CV.pdf; a.download = CV.pdfName; document.body.appendChild(a); a.click(); a.remove();
    msg("Download of " + CV.pdfName + " started", "s");
  }

  /* ---------- popups ---------- */
  var ppCb = null;
  function popup(title, html, buttons) {
    $("#pp-title").textContent = title; $("#pp-body").innerHTML = html;
    var f = $("#pp-foot"); f.innerHTML = "";
    (buttons || [{ t: "\u2714 Continue", primary: true }]).forEach(function (b, i) {
      var el = document.createElement("button"); el.className = "btn" + (b.primary ? " primary" : ""); el.textContent = b.t;
      el.addEventListener("click", function () { closePopup(); if (b.fn) b.fn(); });
      f.appendChild(el); if (i === 0) setTimeout(function () { el.focus(); }, 20);
    });
    $("#popup-mask").hidden = false;
  }
  function closePopup() { $("#popup-mask").hidden = true; }
  function tcodeList() {
    var rows = Object.keys(T).map(function (k) { return '<tr data-tc="' + k + '"><td>' + k + "</td><td>" + esc(T[k].text) + "</td></tr>"; }).join("");
    rows += '<tr data-tc="/n"><td>/n</td><td>Back to SAP Easy Access</td></tr><tr data-tc="/nex"><td>/nex</td><td>Log off</td></tr>';
    popup("Transaction Code (F4 Help)", '<p style="margin:0 0 8px">Click an entry or type it into the command field (with or without <b>/n</b>).</p><table class="f4list">' + rows + "</table>", [{ t: "Cancel" }]);
    $$("#pp-body tr").forEach(function (tr) { tr.addEventListener("click", function () { closePopup(); okcode(tr.dataset.tc); }); });
  }
  var HELP = {
    SESSION_MANAGER: "SAP Easy Access is the start screen. Choose a transaction in the menu tree on the left (on a phone: the \u2630 button), use a tile, or enter a transaction code in the command field.",
    SU01: "User profile of the CV owner: contact data, summary, specialization and personal skills. Switch tabs to see more.",
    ZPROJ: "List of SAP projects (TCS, IBM). Click a column header to sort, double-click (or tap a selected row again) to display details.",
    ZEXP: "Work experience in reverse chronological order. Double-click a row to see all project activities and responsibilities.",
    ZSKILL: "Skills catalog. The Source column shows where the skill comes from (work experience, SAP training, etc.).",
    ZCERT: "SAP and Azure / Google Cloud certifications, and official SAP trainings (course codes).",
    ZEDU: "University education.", ZLANG: "Languages listed in the CV.",
    ZCONT: "Contact data and download of the full PDF CV.", SM04: "Users logged on to system JH1."
  };
  function f1() {
    var a = document.activeElement;
    if (a && a.id === "okcode") return popup("Performance Assistant", '<div class="pp-help"><div><b>Command field</b><br>Enter a transaction code and press Enter. Prefix <b>/n</b> ends the current transaction and starts a new one (e.g. <b>/nZPROJ</b>). <b>/n</b> returns to the start screen, <b>/nex</b> logs off. Press <b>F4</b> or \u25BE for a list of codes.</div></div>');
    popup("Performance Assistant", '<div class="pp-help"><div><b>' + state.tc + " &ndash; " + esc(T[state.tc].text) + "</b><br>" + esc(HELP[state.tc] || "") + "<br><br>Keys: <kbd>Enter</kbd> execute &middot; <kbd>F1</kbd> help &middot; <kbd>F3</kbd> back &middot; <kbd>F4</kbd> transaction list &middot; <kbd>Ctrl+S</kbd> PDF CV</div></div>");
  }
  function statusPopup() {
    var rows = [["System", "JH1"], ["Client", state.client], ["User", state.user], ["Language", "EN"], ["Transaction", state.tc], ["Host", location.host || "local"], ["Repository", "jicarosni/sapbasis"], ["GUI", "HTML/CSS/JS (no build)"]];
    popup("System: Status", rows.map(function (r) { return '<div class="frow"><label>' + r[0] + '</label><div class="val ro">' + esc(r[1]) + "</div></div>"; }).join(""));
  }

  /* ---------- screen helpers ---------- */
  function appButtons(list) {
    var bar = $("#apptoolbar"); bar.innerHTML = "";
    list.forEach(function (b) {
      var el = document.createElement("button"); el.className = "abtn"; el.textContent = b.t; if (b.id) el.id = b.id;
      el.addEventListener("click", b.fn); bar.appendChild(el);
    });
  }
  function field(label, val, html) { return '<div class="frow"><label>' + esc(label) + '</label><div class="val ro">' + (html ? val : esc(val)) + "</div></div>"; }
  function group(title, inner) { return '<div class="group"><div class="gh">' + esc(title) + '</div><div class="gb">' + inner + "</div></div>"; }
  function bullets(a) { return '<ul class="bul">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }

  function tabs(c, key, defs) {
    var cur = state.tabs[key] || 0;
    var w = document.createElement("div");
    w.innerHTML = '<div class="tabs" role="tablist">' + defs.map(function (d, i) { return '<div class="tab' + (i === cur ? " on" : "") + '" role="tab" data-i="' + i + '">' + esc(d.t) + "</div>"; }).join("") + '</div><div class="tabpane"></div>';
    c.appendChild(w);
    function show(i) {
      state.tabs[key] = i;
      $$(".tab", w).forEach(function (t, j) { t.classList.toggle("on", i === j); t.setAttribute("aria-selected", i === j); });
      $(".tabpane", w).innerHTML = defs[i].html;
    }
    $$(".tab", w).forEach(function (t) { t.addEventListener("click", function () { show(+t.dataset.i); }); });
    show(cur);
  }

  /* ALV grid */
  function alv(c, o) {
    var sortK = null, sortD = 1, rows = o.rows.slice();
    var wrap = document.createElement("div");
    c.appendChild(wrap);
    function draw() {
      var html = '<div class="alv-title"><span>' + esc(o.title) + '</span><small>' + rows.length + " entries</small></div>" +
        '<div class="alv-wrap"><table class="alv"><thead><tr><th class="selh" aria-label="select"></th>' +
        o.cols.map(function (cl) { return '<th data-k="' + cl.k + '">' + esc(cl.l) + (sortK === cl.k ? '<span class="so">' + (sortD > 0 ? "\u25B2" : "\u25BC") + "</span>" : "") + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        rows.map(function (r, i) {
          return '<tr data-i="' + i + '"><td class="sel"></td>' + o.cols.map(function (cl) {
            var v = cl.f ? cl.f(r) : esc(r[cl.k]); return '<td class="' + (cl.c || "") + '">' + v + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>" + (o.note ? '<p class="note">' + o.note + "</p>" : "");
      wrap.innerHTML = html;
      $$("th[data-k]", wrap).forEach(function (th) { th.addEventListener("click", function () { sort(th.dataset.k, sortK === th.dataset.k ? -sortD : 1); }); });
      $$("tbody tr", wrap).forEach(function (tr) {
        tr.addEventListener("click", function (e) {
          var was = tr.classList.contains("on");
          if (!(e.ctrlKey || e.metaKey)) $$("tbody tr.on", wrap).forEach(function (x) { x.classList.remove("on"); });
          tr.classList.toggle("on", !(was && (e.ctrlKey || e.metaKey)));
          if (was && !(e.ctrlKey || e.metaKey) && e.detail < 2 && o.open) open(tr);
          else msg(o.selMsg || "Double-click a row to display details", "");
        });
        tr.addEventListener("dblclick", function () { open(tr); });
      });
    }
    function open(tr) { if (o.open) o.open(rows[+tr.dataset.i]); }
    function sort(k, d) {
      sortK = k; sortD = d;
      rows.sort(function (a, b) { var x = String(a[k] == null ? "" : a[k]), y = String(b[k] == null ? "" : b[k]); return x.localeCompare(y, undefined, { numeric: true }) * d; });
      draw(); msg("List sorted by " + o.cols.filter(function (c) { return c.k === k; })[0].l + (d > 0 ? " (ascending)" : " (descending)"), "s");
    }
    function selected() { return $$("tbody tr.on", wrap).map(function (tr) { return rows[+tr.dataset.i]; }); }
    function lastCol() { var th = $("th.on-col", wrap); return th ? th.dataset.k : o.cols[0].k; }
    draw();
    var api = {
      selectAll: function (on) { $$("tbody tr", wrap).forEach(function (t) { t.classList.toggle("on", on); }); msg(on ? rows.length + " rows selected" : "Selection removed", "s"); },
      sort: sort, selected: selected,
      csv: function () {
        var lines = [o.cols.map(function (c) { return c.l; })].concat(rows.map(function (r) { return o.cols.map(function (c) { return r[c.k]; }); }));
        var txt = lines.map(function (l) { return l.map(function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }).join(";"); }).join("\r\n");
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + txt], { type: "text/csv" })); a.download = o.file + ".csv";
        document.body.appendChild(a); a.click(); a.remove(); msg(rows.length + " rows exported to " + o.file + ".csv", "s");
      }
    };
    var btns = [];
    if (o.open) btns.push({ t: "\uD83D\uDD0D Details", fn: function () { var s = selected(); if (!s.length) return msg("Select a row first", "w"); o.open(s[0]); } });
    btns.push({ t: "\u25B2 Sort asc", fn: function () { sort(o.sortKey || o.cols[0].k, 1); } });
    btns.push({ t: "\u25BC Sort desc", fn: function () { sort(o.sortKey || o.cols[0].k, -1); } });
    btns.push({ t: "\u2B07 Export", fn: api.csv });
    appButtons(btns);
    state.alv = api;
    return api;
  }

  /* ---------- screens ---------- */
  function renderHome(c) {
    var tiles = ["SU01", "ZEXP", "ZPROJ", "ZSKILL", "ZCERT", "ZEDU", "ZLANG", "ZCONT"];
    c.innerHTML = '<div class="home"><div class="home-card"><h2>' + esc(CV.name) + '</h2><div class="role">' + esc(CV.title) +
      '</div><blockquote>&ldquo;' + esc(CV.quote.text) + "&rdquo;<br>&mdash; " + esc(CV.quote.by) + '</blockquote><div class="tiles">' +
      tiles.map(function (t) { return '<div class="tile" data-tc="' + t + '" role="button" tabindex="0"><b>' + t + "</b><span>" + esc(T[t].text) + "</span></div>"; }).join("") +
      '</div><p class="hint" style="margin-top:14px">Type a transaction code into the command field (e.g. <b>/nZPROJ</b>) or press <kbd>F4</kbd> for the list.</p></div></div>';
    $$(".tile", c).forEach(function (t) {
      t.addEventListener("click", function () { call(t.dataset.tc); });
      t.addEventListener("keydown", function (e) { if (e.key === "Enter") call(t.dataset.tc); });
    });
    appButtons([{ t: "\u2605 Favorites", fn: function () { openDrawer(); } }, { t: "Other menu", fn: tcodeList }, { t: "\u2B07 CV (PDF)", fn: downloadPdf }]);
  }

  function renderSU01(c) {
    appButtons([{ t: "\u270E Change", fn: function () { msg("You are not authorized to change user " + state.user + " (auth. object S_USER_GRP)", "e"); } },
                { t: "\u2B07 CV (PDF)", fn: downloadPdf }]);
    var hd = document.createElement("div");
    hd.innerHTML = field("User", state.user) + field("Last changed on", "2026 (current CV)");
    c.appendChild(hd);
    tabs(c, "SU01", [
      { t: "Address", html: group("Person", field("Name", CV.name) + field("Function", CV.title)) +
          group("Communication", field("Location", CV.location) + field("E-mail", '<a href="mailto:' + esc(CV.email) + '">' + esc(CV.email) + "</a>", true) +
            field("Website", '<a href="' + esc(CV.website) + '" target="_blank" rel="noopener">' + esc(CV.websiteLabel) + "</a>", true)) },
      { t: "Bio", html: group("Who am I (Summary)", CV.bio.map(function (p) { return '<p class="long">' + esc(p) + "</p>"; }).join("")) },
      { t: "Highlights", html: group("Specialization", bullets(CV.highlights)) },
      { t: "Profile", html: group("Personal skills", '<p class="long">' + esc(CV.profile) + "</p>") }
    ]);
  }

  function renderProjects(c) {
    alv(c, { title: "SAP projects", file: "projects", rows: CV.projects, sortKey: "id",
      cols: [ { k: "id", l: "Project", c: "key" }, { k: "status", l: "Status", c: "nw", f: function (r) { return '<span class="light"></span>' + esc(r.status); } },
              { k: "company", l: "Company", c: "nw" }, { k: "product", l: "SAP product", c: "nw" }, { k: "stack", l: "Platform / scope", c: "nw" }, { k: "type", l: "Project type" } ],
      open: function (r) {
        popup("Project " + r.id, field("Company", r.company) + field("SAP product", r.product) + field("Platform / scope", r.stack) + field("Type", r.type) + field("Status", r.status) + group("Description", '<p class="long">' + esc(r.desc) + "</p>"));
        msg("Project " + r.id + " displayed", "s");
      } });
  }

  function renderExp(c) {
    var rows = CV.experience.map(function (e) { return { id: e.id, period: e.from + " \u2013 " + e.to, position: e.position, company: e.company, location: e.location, n: e.duties.length, e: e }; });
    alv(c, { title: "Employment history", file: "experience", rows: rows, sortKey: "id",
      cols: [ { k: "id", l: "Entry", c: "key" }, { k: "period", l: "Period", c: "nw" }, { k: "position", l: "Position", c: "nw" }, { k: "company", l: "Company", c: "nw" }, { k: "location", l: "Location", c: "nw" }, { k: "n", l: "Activities" } ],
      note: "Double-click (or tap a selected row again) to show all activities.",
      open: function (r) {
        var e = r.e;
        popup(e.company + " \u00b7 " + e.from + " \u2013 " + e.to, field("Position", e.position) + field("Company", e.company) + field("Location", e.location) + field("Period", e.from + " \u2013 " + e.to) + group("Activities", (e.summary && e.summary !== "Activities" && e.summary !== "Responsibilities" ? '<p class="long">' + esc(e.summary) + "</p>" : "") + bullets(e.duties)));
        msg("Entry " + e.id + " displayed", "s");
      } });
  }

  function renderSkills(c) {
    var rows = CV.skills.map(function (s, i) { return { no: ("00" + (i + 1)).slice(-3), cat: s[0], skill: s[1], src: s[2] }; });
    alv(c, { title: "Skills catalog", file: "skills", rows: rows, sortKey: "cat",
      cols: [ { k: "no", l: "No.", c: "key" }, { k: "cat", l: "Area", c: "nw" }, { k: "skill", l: "Skill" }, { k: "src", l: "Source", c: "nw" } ],
      open: function (r) { popup("Skill " + r.no, field("Area", r.cat) + field("Skill", r.skill) + field("Source", r.src)); } });
  }

  function renderCert(c) {
    var b = document.createElement("div"); c.appendChild(b);
    tabs(b, "ZCERT", [ { t: "Certifications", html: "" }, { t: "SAP trainings", html: "" } ]);
    var pane = $(".tabpane", b);
    function fill(i) {
      pane.innerHTML = "";
      if (i === 0) alv(pane, { title: "SAP and Azure / Cloud certifications", file: "certifications", rows: CV.certs.map(function (x, j) { return { no: "C" + (j + 1), type: x[0], name: x[1] }; }),
        cols: [ { k: "no", l: "No.", c: "key" }, { k: "type", l: "Area", c: "nw" }, { k: "name", l: "Certification", f: function (r) { return '<span class="light"></span>' + esc(r.name); } } ] });
      else alv(pane, { title: "SAP trainings (course codes)", file: "trainings", rows: CV.trainings.map(function (x) { return { code: x[0], name: x[1] }; }),
        cols: [ { k: "code", l: "Course", c: "key" }, { k: "name", l: "Title" } ] });
    }
    $$(".tab", b).forEach(function (t) { t.addEventListener("click", function () { fill(+t.dataset.i); }); });
    fill(state.tabs.ZCERT || 0);
  }

  function renderEdu(c) {
    var e = CV.education;
    c.innerHTML = group("University", field("Institution", e.school) + field("Location", e.location) + field("Period", e.period) + field("Degree", e.degree)) +
      group("Content", field("Subjects", e.subjects) + field("Languages", e.languages)) +
      group("Further education", '<p class="long" style="margin:0">Official SAP trainings and certifications: see transaction <a href="#ZCERT" data-go="ZCERT">ZCERT</a>.</p>');
    $$("[data-go]", c).forEach(function (a) { a.addEventListener("click", function (ev) { ev.preventDefault(); call(a.dataset.go); }); });
  }

  function renderLang(c) {
    var rows = CV.languages.map(function (l) { return { lang: l[0], src: l[1] }; });
    alv(c, { title: "Languages", file: "languages", rows: rows,
      cols: [ { k: "lang", l: "Language", c: "nw" }, { k: "src", l: "Source" } ],
      note: "The current CV lists these languages in the education section; no proficiency levels are stated." });
  }

  function renderContact(c) {
    appButtons([{ t: "\u2709 Send e-mail", fn: function () { location.href = "mailto:" + CV.email; } }, { t: "\u2B07 CV (PDF)", fn: downloadPdf }]);
    c.innerHTML = group("Contact data", field("Name", CV.name) + field("E-mail", '<a href="mailto:' + esc(CV.email) + '">' + esc(CV.email) + "</a>", true) +
      field("Location", CV.location) + field("Website", '<a href="' + esc(CV.website) + '" target="_blank" rel="noopener">' + esc(CV.websiteLabel) + "</a>", true) + field("GitHub", '<a href="' + CV.github + '" target="_blank" rel="noopener">github.com/jicarosni</a>', true)) +
      group("Documents", field("Full CV (PDF)", CV.pdfOk === false ? "On request by e-mail" : '<a href="' + esc(CV.pdf) + '" download="' + esc(CV.pdfName) + '">' + esc(CV.pdfName) + "</a>", true) +
      field("Classic CV website", '<a href="../">jicarosni.github.io/sapbasis</a>', true));
  }

  function renderSM04(c) {
    alv(c, { title: "User list - system JH1", file: "sm04", rows: [{ cl: state.client, user: state.user, name: CV.name, tc: "SM04", term: (navigator.platform || "browser"), sess: 1 }],
      cols: [ { k: "cl", l: "Cl.", c: "key" }, { k: "user", l: "User", c: "nw" }, { k: "name", l: "Name", c: "nw" }, { k: "tc", l: "Transaction" }, { k: "term", l: "Terminal" }, { k: "sess", l: "Sessions" } ] });
  }

  /* ---------- keyboard + toolbar ---------- */
  function initGui() {
    var ok = $("#okcode");
    ok.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); okcode(ok.value); ok.blur(); } });
    $("#btn-ok").addEventListener("click", function () { okcode(ok.value); });
    $("#btn-f4").addEventListener("click", tcodeList);
    $("#btn-save").addEventListener("click", downloadPdf);
    $("#btn-back").addEventListener("click", back);
    $("#btn-exit").addEventListener("click", function () { if (state.tc === "SESSION_MANAGER") logoff(); else { state.hist = []; call("SESSION_MANAGER", false, true); } });
    $("#btn-cancel").addEventListener("click", back);
    $("#btn-help").addEventListener("click", f1);
    $("#btn-tree").addEventListener("click", function () { $("#gui").classList.contains("drawer") ? closeDrawer() : openDrawer(); });
    $("#tree-close").addEventListener("click", closeDrawer);
    $("#mask").addEventListener("click", closeDrawer);
    $("#tb-close").addEventListener("click", logoff);
    $("#pp-x").addEventListener("click", closePopup);
    $("#popup-mask").addEventListener("click", function (e) { if (e.target.id === "popup-mask") closePopup(); });
    document.addEventListener("keydown", function (e) {
      if ($("#gui").hidden) return;
      var k = e.key;
      if (k === "F1") { e.preventDefault(); f1(); }
      else if (k === "F4") { e.preventDefault(); tcodeList(); }
      else if (k === "F3" && !e.shiftKey) { e.preventDefault(); back(); }
      else if (k === "F3" && e.shiftKey) { e.preventDefault(); $("#btn-exit").click(); }
      else if (k === "F12" || k === "Escape") { if (!$("#popup-mask").hidden) { e.preventDefault(); closePopup(); } else if ($(".menu.open")) closeMenus(); else if ($("#gui").classList.contains("drawer")) closeDrawer(); else if (k === "F12") { e.preventDefault(); back(); } }
      else if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "S")) { e.preventDefault(); downloadPdf(); }
      else if ((e.ctrlKey || e.metaKey) && k === "/") { e.preventDefault(); ok.focus(); }
      else if (k === "Enter" && !$("#popup-mask").hidden && document.activeElement && document.activeElement.tagName !== "BUTTON") { e.preventDefault(); $("#pp-foot .btn").click(); }
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (store.get("jh1tech", false)) document.body.classList.add("tech");
    initLogon(); initMenus(); initGui();
    /* hide the PDF download gracefully if CV.pdf is not deployed next to index.html */
    try { fetch(CV.pdf, { method: "HEAD" }).then(function (r) { CV.pdfOk = r.ok; if (!r.ok) $$("#content a[download]").forEach(function (a) { a.outerHTML = "On request by e-mail"; }); }, function () {}); } catch (e) {}
    var s = null; try { s = JSON.parse(sessionStorage.getItem("jh1") || "null"); } catch (e) {}
    var deep = resolve(location.hash.replace("#", ""));
    if (s) { state.user = s.u; state.client = s.c; startGui(location.hash.replace("#", "")); }
    else if (deep) { startGui(deep); }
    window.addEventListener("hashchange", function () {
      var tc = resolve(location.hash.replace("#", ""));
      if (!tc || tc === state.tc) return;
      if ($("#gui").hidden) startGui(tc); else call(tc);
    });
  });
})();
