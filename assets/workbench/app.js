const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

let state = {version: 1, sessions: []};
let loading = false;

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || "") : new Intl.DateTimeFormat("zh-CN", {month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"}).format(date);
}

function latestTargets(items) {
  const latest = new Map();
  for (const session of items) {
    for (const target of session.targets || []) {
      const key = target.expression?.trim();
      if (key && !latest.has(key)) latest.set(key, target);
    }
  }
  return [...latest.values()];
}

function recentRepairs(items, limit = 3) {
  const seen = new Set();
  const repairs = [];
  for (const session of items) {
    for (const repair of session.repairs || []) {
      const key = `${repair.learner || ""}\u0000${repair.natural || ""}`;
      if (!seen.has(key) && (repair.learner || repair.natural)) {
        seen.add(key);
        repairs.push(repair);
        if (repairs.length === limit) return repairs;
      }
    }
  }
  return repairs;
}

function firstNonEmpty(items, field) {
  for (const item of items) {
    const value = item[field];
    if (Array.isArray(value) && value.length) return value.filter(Boolean).slice(0, 3);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return Array.isArray(items[0]?.[field]) ? [] : "";
}

function targetTag(target) {
  const classes = target.status === "needs_review" ? "review" : target.status === "developing" ? "developing" : target.status === "not_observed" ? "unobserved" : "";
  const labels = {mastered: "已掌握", developing: "形成中", needs_review: "待复习", not_observed: "未观察"};
  const support = {independent: "独立表达", intent_hint: "中文提示后", keyword_hint: "关键词提示后", model: "模仿示范", none: "未观察"};
  return `<span class="target-tag ${classes}" title="${escapeHtml(target.evidence || "")}"><span lang="ja">${escapeHtml(target.expression)}</span>${target.reading ? `<small lang="ja" class="reading">${escapeHtml(target.reading)}</small>` : ""}${target.meaning_zh ? `<small>${escapeHtml(target.meaning_zh)}</small>` : ""}<small>${escapeHtml(labels[target.status] || "")} · ${escapeHtml(support[target.support] || "未观察")}</small></span>`;
}

function repairHtml(repairs) {
  if (!repairs.length) return "";
  return `<section class="review-detail"><h3>表达复盘</h3><div class="repair-list">${repairs.map(repair => `
    <div class="repair-item">
      <p><span>原表达</span>${escapeHtml(repair.learner || "本次表达摘要")}</p>
      <p class="natural" lang="ja"><span>${escapeHtml(({keep: "保留", alternative: "可选说法", repair: "纠正"})[repair.kind] || "纠正")}</span>${escapeHtml(repair.natural || "")}</p>
      ${repair.natural_reading ? `<p class="reading" lang="ja"><span>读音</span>${escapeHtml(repair.natural_reading)}</p>` : ""}
      ${repair.reason_zh ? `<small>${escapeHtml(repair.reason_zh)}</small>` : ""}
    </div>`).join("")}</div></section>`;
}

function renderReview() {
  const sessions = [...(state.sessions || [])].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const currentTargets = latestTargets(sessions);
  const mastered = currentTargets.filter(target => target.status === "mastered").length;
  const due = currentTargets.filter(target => ["developing", "needs_review"].includes(target.status)).length;
  $("#stat-sessions").textContent = sessions.length;
  $("#stat-mastered").textContent = mastered;
  $("#stat-review").textContent = due;
  $("#session-count").textContent = sessions.length ? `已经开口 ${sessions.length} 次` : "从第 1 次开始";
  $("#empty-review").classList.toggle("hidden", sessions.length > 0);

  const grouped = sessions.reduce((result, session) => {
    const key = session.topic?.id || "other";
    (result[key] ||= []).push(session);
    return result;
  }, {});

  $("#review-list").innerHTML = Object.values(grouped).map(items => {
    const latest = items[0];
    const targets = latestTargets(items);
    const done = targets.filter(target => target.status === "mastered").length;
    const percent = targets.length ? Math.round(done / targets.length * 100) : 0;
    const repairs = recentRepairs(items);
    const focus = firstNonEmpty(items, "focus_next");
    const drill = firstNonEmpty(items, "next_drill");
    const mission = latest.mission_completed === false ? "任务未完成" : latest.mission_completed === true ? "任务已完成" : "已归档";
    return `<article class="review-topic paper-card">
      <div class="review-topic-header"><h2>${escapeHtml(latest.topic?.emoji || "💬")} ${escapeHtml(latest.topic?.label || "口语练习")}</h2><div class="progress" title="掌握 ${percent}%"><i style="width:${percent}%"></i></div></div>
      <p class="review-meta">练过 ${items.length} 次 · ${mission} · 已掌握 ${done}/${targets.length} · 最近 ${escapeHtml(formatDate(latest.created_at))}</p>
      <section class="review-detail"><h3>表达状态</h3><div class="target-tags">${targets.map(targetTag).join("") || "<span class='target-tag developing'>等待表达记录</span>"}</div></section>
      ${repairHtml(repairs)}
      ${focus.length ? `<section class="review-detail"><h3>下次重点</h3><div class="focus-list">${focus.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>` : ""}
      ${drill ? `<section class="next-drill"><b>迁移练习</b><p>${escapeHtml(drill)}</p></section>` : ""}
    </article>`;
  }).join("");
}

async function loadState() {
  if (loading) return;
  loading = true;
  $("#refresh-data").disabled = true;
  try {
    const response = await fetch("/api/state", {cache: "no-store", signal: AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error("not connected");
    state = await response.json();
    renderReview();
    $(".status-pill").dataset.state = "ready";
    $("#save-status").textContent = `本地存档已同步 · ${new Date().toLocaleTimeString("zh-CN", {hour:"2-digit", minute:"2-digit"})}`;
  } catch {
    $(".status-pill").dataset.state = "error";
    $("#save-status").textContent = "存档连接中断，请确认复习台服务已启动后刷新";
  } finally {
    loading = false;
    $("#refresh-data").disabled = false;
  }
}

$("#refresh-data").addEventListener("click", loadState);
document.addEventListener("visibilitychange", () => { if (!document.hidden) loadState(); });
loadState();
setInterval(loadState, 8000);

let quoteDateKey = "";
let midnightTimer;
function updateDailyQuote() {
  const now = new Date();
  const daily = JpDailyQuotes.getForDate(now);
  if (daily.dateKey !== quoteDateKey) {
    quoteDateKey = daily.dateKey;
    const quote = daily.quote;
    $("#quote-text").textContent = quote.text;
    $("#quote-translation").textContent = quote.translation;
    $("#quote-author").textContent = quote.author;
    $("#quote-work").textContent = `《${quote.work}》`;
    $("#quote-source").href = quote.source;
    $("#quote-reading").textContent = quote.reading;
    $("#quote-context").textContent = `文中语境：${quote.context}`;
    $("#quote-prompt").textContent = `开口练一句：${quote.prompt}`;
    $("#quote-date").dateTime = daily.dateKey;
    $("#quote-date").textContent = new Intl.DateTimeFormat("zh-CN", {year:"numeric", month:"2-digit", day:"2-digit", weekday:"short"}).format(now);
    $(".quote-study").open = false;
  }
  $("#quote-clock-note").textContent = `本机日期 · 每日更新 · ${JpDailyQuotes.quotes.length} 句轮读`;
  clearTimeout(midnightTimer);
  midnightTimer = setTimeout(updateDailyQuote, JpDailyQuotes.millisecondsToNextDay(now));
}
updateDailyQuote();
// Recheck after sleep, tab throttling, or a change to the system clock/time zone.
setInterval(updateDailyQuote, 30000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) updateDailyQuote(); });
window.addEventListener("focus", updateDailyQuote);
window.addEventListener("pageshow", updateDailyQuote);

$("#copy-start").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($(".start-example code").textContent);
    $("#copy-status").textContent = "已复制，回到 Codex 粘贴即可。";
  } catch {
    $("#copy-status").textContent = "无法自动复制，请选中上方指令手动复制。";
  }
});
