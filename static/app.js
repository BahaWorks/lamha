// Lamha · small progressive enhancements. Every page works without this script.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Remember language choice for the root redirect.
  $$("[data-setlang]").forEach(function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("lamha-lang", a.getAttribute("data-setlang")); } catch (e) {} });
  });
  try { localStorage.setItem("lamha-lang", document.body.getAttribute("data-lang")); } catch (e) {}

  var feed = $("#feed");
  var rows = feed ? $$(".row", feed) : [];
  var state = { topic: "all", src: "all", q: "", issuer: "all", team: "all" };

  function apply() {
    var shown = 0;
    rows.forEach(function (r) {
      var ok = true;
      if (state.topic !== "all") ok = ok && r.getAttribute("data-topic") === state.topic;
      if (state.src !== "all") ok = ok && (" " + r.getAttribute("data-srcs") + " ").indexOf(" " + state.src + " ") > -1;
      if (state.issuer !== "all") ok = ok && (" " + r.getAttribute("data-issuer") + " ").indexOf(" " + state.issuer + " ") > -1;
      if (state.team !== "all") ok = ok && (" " + r.getAttribute("data-teams") + " ").indexOf(" " + state.team + " ") > -1;
      if (state.q) ok = ok && r.textContent.toLowerCase().indexOf(state.q) > -1;
      r.hidden = !ok; if (ok) shown++;
    });
    // Hide day labels with nothing under them.
    $$(".group-l", feed).forEach(function (g) {
      var n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains("group-l")) { if (n.classList.contains("row") && !n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    var nm = $("#noMatch"); if (nm) nm.hidden = shown > 0 || !rows.length;
    var cn = $("#countNote"); if (cn) cn.textContent = cn.getAttribute("data-tpl").replace("{n}", shown);
  }

  function chips(attr, key) {
    $$("[data-" + attr + "]").forEach(function (b) {
      if (b.classList.contains("row")) return;
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-" + attr);
        if (attr === "team") v = state.team === v ? "all" : v;
        state[key] = v;
        $$("button[data-" + attr + "]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-" + attr) === v)); });
        apply();
      });
    });
  }
  chips("topic", "topic"); chips("issuer", "issuer"); chips("team", "team");
  var sel = $("#srcSel"); if (sel) sel.addEventListener("change", function () { state.src = sel.value; apply(); });
  var q = $("#q"); if (q) q.addEventListener("input", function () { state.q = q.value.trim().toLowerCase(); apply(); });

  // Copy phone numbers.
  var toast = $("#toast"), tt;
  function say(m) { if (!toast) return; toast.textContent = m; toast.hidden = false; clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 1800); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(function () { say(window.LAMHA.copied); }, function () { location.href = "tel:" + v.replace(/\s/g, ""); });
      else location.href = "tel:" + v.replace(/\s/g, "");
    });
  });
})();
