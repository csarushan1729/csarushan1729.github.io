/* ============================================================
   Interactive 3D Skill Sphere
   Skills distributed on a sphere, drag to rotate
   ============================================================ */

const skills = [
  // core
  { name: "Python", level: "core" },
  { name: "Django", level: "core" },
  { name: "PyTorch", level: "core" },
  { name: "TypeScript", level: "core" },
  { name: "Agentic systems", level: "core" },
  { name: "Next.js", level: "core" },
  // strong
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
  // working
  { name: "LightGBM", level: "working" },
  { name: "MongoDB", level: "working" },
  { name: "ROCm", level: "working" },
  { name: "Docker", level: "working" },
  { name: "MCP", level: "working" },
  { name: "NSGA-II", level: "working" },
  { name: "SQL", level: "working" },
  { name: "Chrome Ext", level: "working" },
  { name: "Linux", level: "working" },
  { name: "R", level: "working" },
  { name: "Java", level: "working" },
  { name: "Streamlit", level: "working" },
];

const sphere = document.getElementById("sphere");
const stage = document.getElementById("sphereStage");

if (sphere && stage) {
  const radius = 130;
  const nodes = [];

  // Fibonacci sphere distribution for even spacing
  const N = skills.length;
  const golden = Math.PI * (3 - Math.sqrt(5));

  skills.forEach((skill, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const el = document.createElement("div");
    el.className = `skill-node ${skill.level}`;
    el.textContent = skill.name;
    sphere.appendChild(el);

    nodes.push({ el, x, y, z });
  });

  let rotX = -15;
  let rotY = 25;
  let targetRotX = rotX;
  let targetRotY = rotY;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let autoRotate = true;

  function project() {
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);

    // sort by depth for correct stacking
    const projected = nodes.map((n) => {
      // rotate around Y then X
      let x = n.x;
      let y = n.y;
      let z = n.z;

      // Y rotation
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      // X rotation
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      return { el: n.el, x: x1, y: y1, z: z2 };
    });

    projected.sort((a, b) => a.z - b.z);

    projected.forEach((p) => {
      const scale = 0.55 + (p.z + 1) * 0.35;
      const opacity = 0.35 + (p.z + 1) * 0.4;
      p.el.style.transform = `translate(-50%, -50%) translate3d(${p.x * radius}px, ${p.y * radius}px, ${p.z * radius}px) scale(${scale})`;
      p.el.style.opacity = opacity;
      p.el.style.zIndex = Math.floor((p.z + 1) * 50);
    });
  }

  function animate() {
    if (autoRotate && !dragging) {
      targetRotY += 0.15;
    }
    // smooth lerp
    rotX += (targetRotX - rotX) * 0.12;
    rotY += (targetRotY - rotY) * 0.12;
    project();
    requestAnimationFrame(animate);
  }

  // Pointer events for drag
  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    autoRotate = false;
    lastX = e.clientX;
    lastY = e.clientY;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    targetRotY += dx * 0.4;
    targetRotX -= dy * 0.4;
    // clamp X so it doesn't flip awkwardly
    targetRotX = Math.max(-80, Math.min(80, targetRotX));
    lastX = e.clientX;
    lastY = e.clientY;
  });

  stage.addEventListener("pointerup", () => {
    dragging = false;
    // resume auto-rotate after a pause
    setTimeout(() => { autoRotate = true; }, 2500);
  });

  stage.addEventListener("pointercancel", () => {
    dragging = false;
  });

  // start
  project();
  animate();
}

/* Horizontal scroll hint — optional wheel-to-horizontal on project strip */
const strip = document.getElementById("projectScroll");
if (strip) {
  strip.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}
