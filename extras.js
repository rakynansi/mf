/* extras.js – dates, notices, message themes, icons, effects */
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var ar = function () { return document.documentElement.lang === "ar"; };
  var T = function (a, b) { return ar() ? b : a; };
  var lsGet = function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  /* ---------- icons ---------- */
  var svg = function (inner) { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>'; };
  window.MIC_SVG = svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>');
  window.STOP_SVG = svg('<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>');
  if ($("voiceRecordButton")) $("voiceRecordButton").innerHTML = window.MIC_SVG;

  /* ---------- notifications: everything is stored here ---------- */
  var NK = "ourWorldNotices";
  function locals() { try { return JSON.parse(lsGet(NK, "[]")); } catch (e) { return []; } }
  window.pushNotice = function (title, msg) {
    var a = locals();
    if (a[0] && a[0].title === title && a[0].message === msg && Date.now() - a[0].t < 5000) return;
    a.unshift({ id: "l" + Date.now() + Math.random(), t: Date.now(), title: title, message: msg, created_at: new Date().toISOString(), is_read: false });
    lsSet(NK, JSON.stringify(a.slice(0, 100)));
    if (window.loadNotifications) window.loadNotifications();
  };
  window.loadNotifications = async function () {
    var rows = [];
    try {
      var u = await getCurrentUser();
      if (u) { var r = await supabaseClient.from("notifications").select("*").eq("user_id", u.id).order("created_at", { ascending: false }); if (!r.error && r.data) rows = r.data; }
    } catch (e) {}
    var all = rows.concat(locals()).sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    var list = $("notificationsList"), badge = $("notificationBadge"); if (!list) return;
    list.innerHTML = "";
    if (!all.length) { list.innerHTML = '<p class="notifications-empty"></p>'; list.firstChild.textContent = T("No notifications yet 💗", "لا توجد إشعارات بعد 💗"); if (badge) badge.classList.add("hidden"); return; }
    var unread = all.filter(function (n) { return !n.is_read; }).length;
    if (badge) { badge.textContent = unread > 99 ? "99+" : unread; badge.classList.toggle("hidden", !unread); }
    all.forEach(function (n) {
      var d = document.createElement("div"); d.className = "notification-item" + (n.is_read ? "" : " unread");
      var a = document.createElement("div"); a.className = "notification-title"; a.textContent = n.title || "";
      var b = document.createElement("div"); b.className = "notification-message"; b.textContent = n.message || "";
      var c = document.createElement("small"); c.className = "notice-time"; c.textContent = new Date(n.created_at).toLocaleString(ar() ? "ar-u-nu-latn" : undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      d.append(a, b, c); list.appendChild(d);
    });
  };
  async function markRead() {
    var a = locals(); a.forEach(function (n) { n.is_read = true; }); lsSet(NK, JSON.stringify(a));
    try { var u = await getCurrentUser(); if (u) await supabaseClient.from("notifications").update({ is_read: true }).eq("user_id", u.id).eq("is_read", false); } catch (e) {}
    window.loadNotifications();
  }
  if ($("notificationsButton")) $("notificationsButton").addEventListener("click", function () {
    if (!$("notificationsPanel").classList.contains("hidden")) setTimeout(markRead, 1800);
  });
  window.noticeMessages = function (data, my) {
    if (!data.length) return;
    var latest = data[data.length - 1].created_at, last = lsGet("ourWorldLastMsg", null);
    lsSet("ourWorldLastMsg", latest);
    if (!last) return;
    data.filter(function (m) { return m.created_at > last && m.sender !== my; }).forEach(function (m) {
      window.pushNotice("💌 " + (m.sender || ""), m.message_type === "voice" ? "🎙️" : m.message_type === "image" ? "📷 " + (m.message || "") : m.message);
    });
  };
  setTimeout(function () { if (window.loadNotifications) window.loadNotifications(); }, 1500);

  /* ---------- effects ---------- */
  function burst(list) {
    for (var i = 0; i < 46; i++) (function (i) {
      setTimeout(function () {
        var s = document.createElement("span"); s.className = "fx-piece";
        s.textContent = list[Math.random() * list.length | 0];
        s.style.left = Math.random() * 100 + "%"; s.style.fontSize = 28 + Math.random() * 32 + "px";
        s.style.animationDuration = 3 + Math.random() * 3 + "s"; document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 6500);
      }, i * 70);
    })(i);
  }
  document.addEventListener("pointerdown", function (e) {
    var s = document.createElement("span"); s.className = "tap-heart";
    s.textContent = ["💗", "💖", "💕", "🩷"][Math.random() * 4 | 0];
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    document.body.appendChild(s); setTimeout(function () { s.remove(); }, 900);
  }, { passive: true });

  /* ---------- dates ---------- */
  var K = "ourWorldDates";
  var BD = [
    { id: "bd-me", m: 4, d: 4, title: ["My birthday", "عيد ميلادي"], fx: ["🎂", "🎉", "🎈", "💗"] },
    { id: "bd-him", m: 11, d: 16, title: ["His birthday", "عيد ميلاده"], fx: ["🎂", "🎉", "🎈", "💙"] }
  ];
  function load() { try { var o = JSON.parse(lsGet(K, "{}")); o.events = o.events || []; o.msgs = o.msgs || {}; o.done = o.done || {}; return o; } catch (e) { return { events: [], msgs: {}, done: {} }; } }
  function save(o) { lsSet(K, JSON.stringify(o)); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function daysLeft(date) { return Math.round((new Date(date + "T00:00:00") - new Date(iso(new Date()) + "T00:00:00")) / 86400000); }
  function items() {
    var s = load(), now = new Date(), today = iso(now), list = [];
    BD.forEach(function (b) {
      var d = new Date(now.getFullYear(), b.m - 1, b.d); if (iso(d) < today) d = new Date(now.getFullYear() + 1, b.m - 1, b.d);
      list.push({ id: b.id, title: T(b.title[0], b.title[1]), date: iso(d), fx: b.fx, birthday: true, msg: s.msgs[b.id] || "" });
    });
    s.events.forEach(function (e) { list.push({ id: e.id, title: e.title, date: e.date, fx: ["💗", "✨", "💞", "🌸"], msg: e.msg || "" }); });
    return list.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  }
  function letter(it, m) {
    var o = document.createElement("div"); o.className = "letter-ov";
    o.innerHTML = '<div class="letter"><div class="letter-seal"></div><h3></h3><p></p><button type="button" class="primary-btn">💗</button></div>';
    o.querySelector(".letter-seal").textContent = it.birthday ? "🎂" : "💌";
    o.querySelector("h3").textContent = it.title; o.querySelector("p").textContent = m;
    o.onclick = function (e) { if (e.target === o || e.target.tagName === "BUTTON") o.remove(); };
    document.body.appendChild(o); burst(it.fx);
  }
  var sec = document.createElement("section");
  sec.id = "datesSection"; sec.className = "view hidden"; $("mainPage").appendChild(sec);

  window.renderDates = function () {
    var list = items(), next = list.filter(function (i) { return daysLeft(i.date) >= 0; })[0];
    sec.innerHTML = '<button type="button" class="back-button" data-action="back"><span class="arrow">‹</span> ' + T("Back", "رجوع") + '</button>' +
      '<header class="view-head"><h2>' + T("Our Dates", "تواريخنا") + ' 📅</h2><p>' + T("Special days, reminders and secret messages", "أيام مميزة وتنبيهات ورسائل سرية") + '</p></header>' +
      '<div class="dates-hero"></div>' +
      '<div class="dates-form"><h3>' + T("✨ New special date", "✨ تاريخ مميز جديد") + '</h3><input id="dTitle" maxlength="40" placeholder="' + T("Name this date…", "سمِّ هذا التاريخ…") + '"><input type="date" id="dDate">' +
      '<textarea id="dMsg" rows="2" placeholder="' + T("A secret message (opens only on that day) 💌", "رسالة سرية (تُفتح في ذلك اليوم فقط) 💌") + '"></textarea>' +
      '<button type="button" class="primary-btn full" id="dAdd">' + T("＋ Add date & alert", "＋ إضافة التاريخ والتنبيه") + '</button></div><div id="dList" class="dates-list"></div>';
    var hero = sec.querySelector(".dates-hero");
    if (next) { var n = daysLeft(next.date); hero.innerHTML = '<small></small><h3></h3><div class="hero-count"><b></b><span></span></div>'; hero.querySelector("small").textContent = T("Next special day", "أقرب مناسبة"); hero.querySelector("h3").textContent = next.title; hero.querySelector("b").textContent = n; hero.querySelector("span").textContent = n === 0 ? T("Today 🎉", "اليوم 🎉") : T("days to go", "يوم متبقٍ"); } else hero.classList.add("hidden");
    var box = $("dList");
    list.forEach(function (it) {
      var left = daysLeft(it.date), open = left <= 0 && (!it.birthday || left === 0);
      var c = document.createElement("article"); c.className = "date-card" + (left === 0 ? " today" : "") + (it.birthday ? " bday" : "");
      c.innerHTML = '<div class="date-top"><div class="date-ico"></div><div class="date-info"><h3></h3><div class="date-meta"></div></div><div class="date-left"><b></b><small></small></div></div><textarea rows="2" class="date-msg"></textarea><div class="row-buttons"></div>';
      c.querySelector(".date-ico").textContent = it.birthday ? "🎂" : "💗";
      c.querySelector("h3").textContent = it.title;
      c.querySelector(".date-meta").textContent = new Date(it.date + "T00:00:00").toLocaleDateString(ar() ? "ar-u-nu-latn" : undefined, { day: "numeric", month: "long", year: "numeric" });
      c.querySelector(".date-left b").textContent = left; c.querySelector(".date-left small").textContent = T("days", "يوم");
      var ta = c.querySelector("textarea"), row = c.querySelector(".row-buttons");
      ta.placeholder = T("Write a message…", "اكتب رسالة…"); ta.value = it.msg;
      var sv = document.createElement("button"); sv.type = "button"; sv.className = "ghost-btn small"; sv.textContent = T("💾 Save", "💾 حفظ");
      sv.onclick = function () { var st = load(); if (it.birthday) st.msgs[it.id] = ta.value; else st.events.forEach(function (e) { if (e.id === it.id) e.msg = ta.value; }); save(st); sv.textContent = "✓"; };
      var op = document.createElement("button"); op.type = "button"; op.className = "primary-btn small";
      op.textContent = open ? T("💌 Open message", "💌 افتح الرسالة") : T("🔒 Opens on the day", "🔒 تُفتح في اليوم"); op.disabled = !open;
      op.onclick = function () { letter(it, ta.value || T("Happy day my love 💗", "يوم سعيد يا حبي 💗")); };
      row.append(sv, op);
      if (!it.birthday) { var del = document.createElement("button"); del.type = "button"; del.className = "danger-btn small"; del.textContent = "🗑️"; del.onclick = function () { var st = load(); st.events = st.events.filter(function (e) { return e.id !== it.id; }); save(st); window.renderDates(); }; row.appendChild(del); }
      box.appendChild(c);
    });
    $("dAdd").onclick = function () {
      var t = $("dTitle").value.trim(), d = $("dDate").value; if (!t || !d) return;
      var st = load(); st.events.push({ id: "e" + Date.now(), title: t, date: d, msg: $("dMsg").value }); save(st);
      window.pushNotice("📅 " + t, T("Reminder set for ", "تم ضبط تنبيه ليوم ") + d);
      if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
      window.renderDates();
    };
  };
  function check() {
    var s = load(), today = iso(new Date());
    items().forEach(function (it) {
      var key = it.id + today;
      if (it.date === today && !s.done[key]) {
        s.done[key] = 1; save(s); burst(it.fx);
        window.pushNotice("🎉 " + it.title, T("Today is the day! 💗", "اليوم هو الموعد! 💗"));
        if ("Notification" in window && Notification.permission === "granted") try { new Notification("Our World 💗", { body: it.title }); } catch (e) {}
      }
    });
  }
  setTimeout(check, 3000); setInterval(check, 60000);

  /* ---------- message themes (Messages page only) ---------- */
  var MT = { classic: "⚪", rose: "💗", ocean: "🌊", midnight: "🌙", lavender: "💜", sunset: "🌅", forest: "🌿" };
  var ms = $("messagesSection");
  if (ms) {
    var bar = document.createElement("div"); bar.className = "mt-chips";
    var apply = function (n) { Object.keys(MT).forEach(function (k) { ms.classList.remove("mt-" + k); }); ms.classList.add("mt-" + n); lsSet("ourWorldMsgTheme", n); bar.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === n); }); };
    Object.keys(MT).forEach(function (k) { var b = document.createElement("button"); b.type = "button"; b.dataset.t = k; b.textContent = MT[k]; b.onclick = function () { apply(k); }; bar.appendChild(b); });
    ms.querySelector(".view-head").after(bar); apply(lsGet("ourWorldMsgTheme", "classic"));
  }

  /* ---------- decorations: floating hearts + footer ---------- */
  (function () {
    if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var amb = document.createElement("div"); amb.id = "ambient"; amb.setAttribute("aria-hidden", "true");
      var em = ["💗", "✦", "🌸", "♡", "✨", "💕", "🤍"];
      for (var i = 0; i < 16; i++) {
        var p = document.createElement("span");
        p.textContent = em[i % em.length];
        p.style.left = (Math.random() * 96) + "%";
        p.style.fontSize = (12 + Math.random() * 16) + "px";
        p.style.animationDuration = (14 + Math.random() * 16) + "s";
        p.style.animationDelay = (-Math.random() * 24) + "s";
        amb.appendChild(p);
      }
      document.body.appendChild(amb);
    }
    var f = document.createElement("footer"); f.className = "site-footer";
    var setF = function () { f.textContent = T("Made with 💗 just for you", "صُنع بـ 💗 لأجلك فقط"); };
    setF(); $("mainPage").appendChild(f);
    new MutationObserver(setF).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  })();
})();
