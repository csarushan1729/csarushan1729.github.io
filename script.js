/* Contained skill orbit — nodes stay inside the stage box */

const skills = [
  { name: "Python", level: "core" },
  { name: "Django", level: "core" },
  { name: "PyTorch", level: "core" },
  { name: "TypeScript", level: "core" },
  { name: "Next.js", level: "core" },
  { name: "Agentic systems", level: "core" },
  { name: "Flask", level: "strong" },
  { name: "PostgreSQL", level: "strong" },
  { name: "Scikit-learn", level: "strong" },
  { name: "XGBoost", level: "strong" },
  { name: "JavaScript", level: "strong" },
  { name: "Gemini / Claude", level: "strong" },
  { name: "C++", level: "strong" },
  { name: "Local RAG", level: "strong" },
  { name: "Node.js", level: "strong" },
  { name: "Git", level: "strong" },
  { name: "LightGBM", level: "working" },
  { name: "MongoDB", level: "working" },
  { name: "ROCm", level: "working" },
  { name: "Docker", level: "working" },
  { name: "MCP", level: "working" },
  { name: "NSGA-II", level: "working" },
  { name: "SQL", level: "working" },
  { name: "Chrome Ext", level: "working" },
  { name: "Linux", level: "working" },
  { name: "Streamlit", level: "working" },
];

const stage = document.getElementById("orbitStage");
const orbit = document.getElementById("orbit");

if (stage && orbit) {
  const nodes = [];
  const N = skills.length;
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Place on a unit sphere via Fibonacci
  skills.forEach((s, i) => {
    const y = 1 - (i / Math.max(N - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    const el = document.createElement("div");
    el.className = `orb-node ${s.level}`;
    el.textContent = s.name;
    orbit.appendChild(el);

    nodes.push({
      el,
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
    });
  });

  // Radius relative to stage size
  function getRadius() {
    return Math.min(stage.clientWidth, stage.clientHeight) * 0.36;
  }

  let rotX = -18;
  let rotY = 20;
  let tRotX = rotX;
  let tRotY = rotY;
  let dragging = false;
  let lx = 0, ly = 0;
  let auto = true;

  function render() {
    const R = getRadius();
    const rx = (rotX * Math.PI) / 180;
    const ry = (rotY * Math.PI) / 180;
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);

    const list = nodes.map((n) => {
      // rotate Y then X
      let x1 = n.x * cosY - n.z * sinY;
      let z1 = n.x * sinY + n.z * cosY;
      let y1 = n.y * cosX - z1 * sinX;
      let z2 = n.y * sinX + z1 * cosX;
      return { el: n.el, x: x1, y: y1, z: z2 };
    });

    list.sort((a, b) => a.z - b.z);

    list.forEach((p) => {
      const depth = (p.z + 1) / 2; // 0..1
      const scale = 0.65 + depth * 0.45;
      const opacity = 0.4 + depth * 0.6;
      p.el.style.transform = `translate(calc(-50% + ${p.x * R}px), calc(-50% + ${p.y * R}px)) scale(${scale})`;
      p.el.style.opacity = String(opacity);
      p.el.style.zIndex = String(Math.round(depth * 100));
    });
  }

  function tick() {
    if (auto && !dragging) tRotY += 0.18;
    rotX += (tRotX - rotX) * 0.1;
    rotY += (tRotY - rotY) * 0.1;
    render();
    requestAnimationFrame(tick);
  }

  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    auto = false;
    lx = e.clientX;
    ly = e.clientY;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    tRotY += (e.clientX - lx) * 0.45;
    tRotX -= (e.clientY - ly) * 0.45;
    tRotX = Math.max(-75, Math.min(75, tRotX));
    lx = e.clientX;
    ly = e.clientY;
  });

  const endDrag = () => {
    dragging = false;
    setTimeout(() => { auto = true; }, 2000);
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", render);

  render();
  tick();
}
