const workflowStages = {
  discover: {
    number: "01",
    label: "DISCOVER",
    title: "先扩展信息面，\n不预设答案。",
    summary: "解析任务边界、生成关键词组合，并记录每条线索的来源与时间。",
    image: "./assets/research-desk.jpg",
    alt: "研究桌上的电脑、书籍与资料",
    caption: "PUBLIC SOURCES / TRACEABLE LINKS",
  },
  verify: {
    number: "02",
    label: "VERIFY",
    title: "先找到原文，\n再判断真假。",
    summary: "区分官方事实、权威报道、厂商自述、单源信息和待补查线索。",
    image: "./assets/researcher.jpg",
    alt: "研究人员正在核对资料",
    caption: "PRIMARY FIRST / CROSS CHECK",
  },
  decide: {
    number: "03",
    label: "DECIDE",
    title: "合并重复事件，\n再判断内容价值。",
    summary: "按相关性、时效性、重要性、可生产性和差异化价值给出排序建议。",
    image: "./assets/architecture.jpg",
    alt: "结构清晰的蓝色企业建筑",
    caption: "MERGE / SCORE / SHORTLIST",
  },
  research: {
    number: "04",
    label: "RESEARCH",
    title: "确定采用之后，\n才进入深度研究。",
    summary: "围绕研究问题补齐证据、案例、数据与争议，并持续回填研究资料。",
    image: "./assets/researcher.jpg",
    alt: "研究人员进行深度资料研究",
    caption: "EVIDENCE / CASES / OPEN QUESTIONS",
  },
};

const finishIntro = () => document.body.classList.add("intro-complete");
window.addEventListener("load", () => window.setTimeout(finishIntro, 1050), { once: true });
window.setTimeout(finishIntro, 2200);

const scenarios = {
  enterprise: {
    count: "12,864",
    summary: "328 个候选 · 146 个进入研究",
    topics: [
      ["HIGH / 01", "企业 AI 从“助手”走向“工作重塑”", "官方资料 + 第三方数据"],
      ["HIGH / 02", "企业 Agent 进入规模化部署窗口", "案例 + 工程实践"],
      ["MID / 03", "AI 工作平台与协作工具加速融合", "产品发布 + 场景验证"],
    ],
  },
  agent: {
    count: "9,742",
    summary: "264 个候选 · 128 个建议采用",
    topics: [
      ["HIGH / 01", "Agent 竞争从模型转向工作流", "多源趋势信号"],
      ["MID / 02", "连接器正在降低企业部署门槛", "官方发布 + 用户案例"],
      ["MID / 03", "可观测性成为规模化前提", "工程社区 + 研究机构"],
    ],
  },
  governance: {
    count: "6,318",
    summary: "188 个候选 · 112 个进入复核",
    topics: [
      ["HIGH / 01", "企业 AI 治理进入审计阶段", "监管原文 + 专业解读"],
      ["MID / 02", "风险控制从模型走向业务流程", "研究机构 + 企业案例"],
      ["WATCH / 03", "零数据保留成为采购条件", "厂商自述 · 待交叉核验"],
    ],
  },
};

const rules = {
  must: ["MUST", "事实、数字和时间必须能回到原始来源；证据不足时明确标注待核验。"],
  should: ["SHOULD", "优先读取官方或原始资料，再使用权威报道补充背景和影响。"],
  may: ["MAY", "信息不足时可按收益逐步扩展时间范围、关键词和次级渠道。"],
  stop: ["STOP", "涉及高风险、不可逆写入或严重来源冲突时停止，并交由人工处理。"],
};

const workflowDisplay = document.querySelector("#workflowDisplay");
const workflowCopy = workflowDisplay?.querySelector(".workflow-copy");
const workflowImage = workflowDisplay?.querySelector("img");
const workflowCaption = workflowDisplay?.querySelector("figcaption");

function selectWorkflowStage(key) {
  const stage = workflowStages[key];
  if (!stage || !workflowCopy || !workflowImage || !workflowCaption) return;
  workflowDisplay.classList.remove("is-changing");
  void workflowDisplay.offsetWidth;
  workflowDisplay.classList.add("is-changing");

  const label = workflowCopy.querySelector("p");
  const title = workflowCopy.querySelector("h3");
  const summary = workflowCopy.querySelector("span");
  label.textContent = `${stage.number} / ${stage.label}`;
  title.textContent = stage.title;
  summary.textContent = stage.summary;
  workflowImage.src = stage.image;
  workflowImage.alt = stage.alt;
  workflowCaption.textContent = stage.caption;

  document.querySelectorAll(".workflow-tab").forEach((tab) => {
    const active = tab.dataset.stage === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

document.querySelectorAll(".workflow-tab").forEach((tab) => {
  tab.addEventListener("click", () => selectWorkflowStage(tab.dataset.stage));
});

let activeScenario = "enterprise";
let demoTimer;
const runButton = document.querySelector("#runDemo");
const scanStatus = document.querySelector("#scanStatus");
const scanCount = document.querySelector("#scanCount");
const scanRing = document.querySelector(".scan-ring");
const resultArea = document.querySelector("#resultArea");

document.querySelectorAll(".scenario").forEach((button) => {
  button.addEventListener("click", () => {
    activeScenario = button.dataset.scenario;
    document.querySelectorAll(".scenario").forEach((item) => item.classList.toggle("active", item === button));
  });
});

function buildResults(scenario) {
  const list = document.createElement("div");
  list.className = "result-list";
  const head = document.createElement("div");
  head.className = "result-head";
  const label = document.createElement("span");
  label.textContent = "SHORTLIST / VERIFIED";
  const summary = document.createElement("strong");
  summary.textContent = scenario.summary;
  head.append(label, summary);
  list.append(head);

  scenario.topics.forEach(([priority, title, source], index) => {
    const card = document.createElement("article");
    card.className = "topic-result";
    const badge = document.createElement("span");
    badge.textContent = priority;
    const heading = document.createElement("p");
    heading.textContent = title;
    const note = document.createElement("small");
    note.textContent = source;
    const arrow = document.createElement("i");
    arrow.textContent = `0${index + 1}`;
    card.append(badge, heading, note, arrow);
    list.append(card);
  });
  resultArea.replaceChildren(list);
}

function runDemo() {
  if (!runButton || !scanStatus || !scanCount || !scanRing || !resultArea) return;
  window.clearInterval(demoTimer);
  const scenario = scenarios[activeScenario];
  const target = Number(scenario.count.replace(",", ""));
  const steps = [...document.querySelectorAll("#scanSteps span")];
  let tick = 0;
  runButton.disabled = true;
  runButton.firstChild.textContent = "正在模拟 ";
  scanStatus.textContent = "SCANNING";
  scanRing.classList.add("running");
  resultArea.replaceChildren();
  const placeholder = document.createElement("div");
  placeholder.className = "result-placeholder";
  const icon = document.createElement("i");
  icon.textContent = "···";
  const text = document.createElement("p");
  text.textContent = "正在发现并核验公开信号";
  placeholder.append(icon, text);
  resultArea.append(placeholder);

  demoTimer = window.setInterval(() => {
    tick += 1;
    const progress = Math.min(tick / 14, 1);
    scanCount.textContent = Math.round(target * progress).toLocaleString("zh-CN");
    const activeStep = Math.min(Math.floor(progress * 4), 3);
    steps.forEach((step, index) => step.classList.toggle("active", index <= activeStep));
    if (progress === 1) {
      window.clearInterval(demoTimer);
      scanStatus.textContent = "VERIFIED";
      scanRing.classList.remove("running");
      runButton.disabled = false;
      runButton.firstChild.textContent = "再次模拟 ";
      buildResults(scenario);
    }
  }, 90);
}

runButton?.addEventListener("click", runDemo);

const ruleDetail = document.querySelector("#ruleDetail");
document.querySelectorAll(".rule-card").forEach((card) => {
  card.addEventListener("click", () => {
    const [label, copy] = rules[card.dataset.rule];
    document.querySelectorAll(".rule-card").forEach((item) => item.classList.toggle("active", item === card));
    ruleDetail.querySelector("span").textContent = label;
    ruleDetail.querySelector("p").textContent = copy;
  });
});

const progressBar = document.querySelector(".scroll-progress i");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  document.body.classList.add("motion-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

  const numberTargets = [...document.querySelectorAll("[data-count]")];
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const started = performance.now();
      const duration = 1400;
      function updateNumber(now) {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = `${Math.round(target * eased).toLocaleString("zh-CN")}${suffix}`;
        if (progress < 1) requestAnimationFrame(updateNumber);
      }
      requestAnimationFrame(updateNumber);
      numberObserver.unobserve(element);
    });
  }, { threshold: 0.6 });
  numberTargets.forEach((target) => numberObserver.observe(target));

  document.querySelectorAll(".primary-cta, .run-demo").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const box = button.getBoundingClientRect();
      button.style.translate = `${(event.clientX - box.left - box.width / 2) * 0.08}px ${(event.clientY - box.top - box.height / 2) * 0.12}px`;
    });
    button.addEventListener("pointerleave", () => { button.style.translate = "0 0"; });
  });

  const zone = document.querySelector("[data-parallax-zone]");
  const cards = zone ? [...zone.querySelectorAll("[data-parallax-card]")] : [];
  const cursorOrb = zone?.querySelector(".cursor-orb");
  zone?.addEventListener("pointermove", (event) => {
    const box = zone.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    if (cursorOrb) {
      cursorOrb.style.left = `${event.clientX - box.left}px`;
      cursorOrb.style.top = `${event.clientY - box.top}px`;
    }
    cards.forEach((card, index) => {
      const depth = (index % 3 + 1) * 3;
      card.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  zone?.addEventListener("pointerleave", () => cards.forEach((card) => { card.style.translate = "0 0"; }));
} else {
  document.body.classList.add("intro-complete");
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
}
