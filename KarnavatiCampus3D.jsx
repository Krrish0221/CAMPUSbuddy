import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Campus Data ─────────────────────────────────────────────────────────────
const BUILDINGS = [
  {
    id: "uid", name: "UID – United Institute of Design", short: "UID",
    floors: 6, rooms: 30, type: "academic", color: "#E8A87C", roofColor: "#C47A52",
    x: -10, z: -60, w: 38, d: 28,
    description: "6 floors · 30 design studios & classrooms · Architecture, Fashion, Product Design",
  },
  {
    id: "uit", name: "UIT – United Institute of Technology", short: "UIT",
    floors: 5, rooms: 15, type: "academic", color: "#7EB8D4", roofColor: "#4A90B8",
    x: 52, z: -48, w: 42, d: 32,
    description: "5 floors · 15 classrooms · Engineering & Technology",
  },
  {
    id: "uwsl", name: "UWSL – United World School of Law", short: "UWSL",
    floors: 4, rooms: 20, type: "academic", color: "#9B8DC4", roofColor: "#6B5A9E",
    x: 52, z: 10, w: 40, d: 24,
    description: "4 floors · 20 classrooms · Law School",
  },
  {
    id: "ksd", name: "KSD – Karnavati School of Dentistry", short: "KSD",
    floors: 4, rooms: 25, type: "academic", color: "#72C8A0", roofColor: "#3E9E72",
    x: 68, z: -82, w: 36, d: 24,
    description: "4 floors · 25 labs & classrooms · Dental Sciences",
  },
  {
    id: "dome", name: "Dome Auditorium", short: "Dome",
    floors: 2, rooms: 1, type: "special", color: "#C0C8D8", roofColor: "#8090B0",
    x: 18, z: -55, w: 22, d: 22, isDome: true,
    description: "Iconic dome auditorium · 1200 seat capacity",
  },
  {
    id: "mess", name: "Mess / Cafeteria", short: "Mess",
    floors: 2, rooms: 3, type: "facility", color: "#F0C87A", roofColor: "#C8A030",
    x: -8, z: -28, w: 22, d: 18,
    description: "2 floors · Cafeteria & Dining Hall",
  },
  {
    id: "h3", name: "H-3 Hostel", short: "H-3",
    floors: 4, rooms: 60, type: "hostel", color: "#F4A6A0", roofColor: "#D06060",
    x: -2, z: -70, w: 14, d: 12,
    description: "4 floors · 60 rooms · Student Hostel",
  },
  {
    id: "h4", name: "H-4 Hostel", short: "H-4",
    floors: 4, rooms: 60, type: "hostel", color: "#F4A6A0", roofColor: "#D06060",
    x: 22, z: 90, w: 18, d: 12,
    description: "4 floors · 60 rooms · Student Hostel",
  },
  {
    id: "h5", name: "H-5 Hostel", short: "H-5",
    floors: 4, rooms: 60, type: "hostel", color: "#F4A6A0", roofColor: "#D06060",
    x: 22, z: 108, w: 18, d: 12,
    description: "4 floors · 60 rooms · Student Hostel",
  },
  {
    id: "h6", name: "H-6 Hostel", short: "H-6",
    floors: 4, rooms: 60, type: "hostel", color: "#F4B8A0", roofColor: "#C06040",
    x: -4, z: 100, w: 16, d: 12, rotation: 0.3,
    description: "4 floors · 60 rooms · Student Hostel",
  },
  {
    id: "h7", name: "H-7 Hostel", short: "H-7",
    floors: 4, rooms: 60, type: "hostel", color: "#F4A6A0", roofColor: "#D06060",
    x: -4, z: 62, w: 20, d: 12,
    description: "4 floors · 60 rooms · Student Hostel",
  },
  {
    id: "gym", name: "Gymnasium", short: "GYM",
    floors: 2, rooms: 4, type: "sports", color: "#A8D8A0", roofColor: "#60A858",
    x: 16, z: 62, w: 16, d: 14,
    description: "2 floors · Fully equipped gymnasium",
  },
  {
    id: "fblock", name: "F-Block Workshops", short: "F-Block",
    floors: 3, rooms: 12, type: "workshop", color: "#B8A878", roofColor: "#8A7848",
    x: -52, z: -18, w: 28, d: 22,
    description: "3 floors · 12 workshop bays · Fabrication & Making",
  },
  {
    id: "openws", name: "Open Workshops", short: "Open WS",
    floors: 1, rooms: 6, type: "workshop", color: "#C8B888", roofColor: "#988858",
    x: -52, z: 18, w: 34, d: 20,
    description: "1 floor · Open-air fabrication workshops",
  },
  {
    id: "media", name: "Media Workshops", short: "Media",
    floors: 2, rooms: 8, type: "workshop", color: "#B8A878", roofColor: "#887848",
    x: 10, z: 128, w: 16, d: 10,
    description: "2 floors · Photography, Video & Media studios",
  },
];

const TYPE_META = {
  academic:  { color: "#7EB8D4", label: "Academic" },
  hostel:    { color: "#F4A6A0", label: "Hostel" },
  facility:  { color: "#F0C87A", label: "Facility" },
  sports:    { color: "#A8D8A0", label: "Sports" },
  workshop:  { color: "#B8A878", label: "Workshop" },
  special:   { color: "#C0C8D8", label: "Special" },
};

const FH = 4.2; // floor height metres

// ─── Interior builder ─────────────────────────────────────────────────────────
function buildInteriorFloor(scene, building, floor, interiorRef) {
  if (interiorRef.current) scene.remove(interiorRef.current);
  const b = building;
  const group = new THREE.Group();
  const fy = (floor - 1) * FH;

  // Floor
  const flMesh = new THREE.Mesh(
    new THREE.BoxGeometry(b.w - 0.6, 0.18, b.d - 0.6),
    new THREE.MeshLambertMaterial({ color: "#F2EEE0" })
  );
  flMesh.position.y = fy + 0.09;
  group.add(flMesh);

  // Ceiling
  const clMesh = new THREE.Mesh(
    new THREE.BoxGeometry(b.w - 0.6, 0.18, b.d - 0.6),
    new THREE.MeshLambertMaterial({ color: "#FAFAF8" })
  );
  clMesh.position.y = fy + FH - 0.3;
  group.add(clMesh);

  // Central corridor
  const corrMesh = new THREE.Mesh(
    new THREE.BoxGeometry(b.w - 0.8, 0.05, 3.5),
    new THREE.MeshLambertMaterial({ color: "#D5CCB8" })
  );
  corrMesh.position.y = fy + 0.2;
  group.add(corrMesh);

  // Corridor lights
  const lightCols = Math.floor(b.w / 8);
  for (let lc = 0; lc < lightCols; lc++) {
    const lx = -b.w / 2 + 5 + lc * (b.w / lightCols);
    const lgMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 0.4),
      new THREE.MeshLambertMaterial({ color: "#FFFFF0", emissive: "#FFFFC0", emissiveIntensity: 0.6 })
    );
    lgMesh.position.set(lx, fy + FH - 0.35, 0);
    group.add(lgMesh);
  }

  // Rooms on both sides of corridor
  const roomsPerSide = Math.ceil(b.rooms / 2);
  const roomW = Math.max(4, (b.w - 2) / Math.min(roomsPerSide, 6));
  const roomD = (b.d / 2) - 2;
  const roomPalette = ["#FFF6EC","#EBF5FF","#F0FFF0","#FFF0F8","#F5F0FF","#FFFBEB"];
  const wallMat = new THREE.MeshLambertMaterial({ color: "#D8D0C0", transparent: true, opacity: 0.55 });

  for (let side = 0; side < 2; side++) {
    const roomCount = Math.min(roomsPerSide, Math.floor(b.w / roomW));
    for (let i = 0; i < roomCount; i++) {
      const idx = side * roomsPerSide + i;
      if (idx >= b.rooms) break;
      const rx = -b.w / 2 + roomW * i + roomW / 2 + 1;
      const rz = side === 0 ? -(roomD / 2 + 2) : (roomD / 2 + 2);

      // Room floor tile
      const rfMesh = new THREE.Mesh(
        new THREE.BoxGeometry(roomW - 0.4, 0.06, roomD - 0.4),
        new THREE.MeshLambertMaterial({ color: roomPalette[idx % roomPalette.length] })
      );
      rfMesh.position.set(rx, fy + 0.22, rz);
      group.add(rfMesh);

      // Side walls
      for (const xOff of [-roomW / 2, roomW / 2]) {
        const wm = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, FH - 0.8, roomD),
          wallMat
        );
        wm.position.set(rx + xOff, fy + (FH - 0.8) / 2, rz);
        group.add(wm);
      }

      // Back wall
      const bwDir = side === 0 ? -1 : 1;
      const bwm = new THREE.Mesh(
        new THREE.BoxGeometry(roomW, FH - 0.8, 0.12),
        wallMat
      );
      bwm.position.set(rx, fy + (FH - 0.8) / 2, rz + bwDir * roomD / 2);
      group.add(bwm);

      // Whiteboard on back wall
      const wbMesh = new THREE.Mesh(
        new THREE.BoxGeometry(Math.min(roomW - 1, 4.5), 1.6, 0.1),
        new THREE.MeshLambertMaterial({ color: "#F0FFF0" })
      );
      wbMesh.position.set(rx, fy + 2.2, rz + bwDir * (roomD / 2 - 0.15));
      group.add(wbMesh);

      // Desks + chairs
      const deskCols = Math.max(1, Math.floor((roomW - 2) / 2.8));
      const deskRows = Math.max(1, Math.floor((roomD - 2) / 2.5));
      for (let dc = 0; dc < deskCols; dc++) {
        for (let dr = 0; dr < deskRows; dr++) {
          const dx = rx - roomW / 2 + 1.5 + dc * 2.8;
          const dz = rz - roomD / 2 + 1.5 + dr * 2.5;

          const desk = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.08, 0.7),
            new THREE.MeshLambertMaterial({ color: "#8B6020" })
          );
          desk.position.set(dx, fy + 0.75, dz);
          group.add(desk);

          // Desk legs
          for (const [lx2, lz2] of [[-0.7, -0.3],[0.7,-0.3],[-0.7,0.3],[0.7,0.3]]) {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.04, 0.04, 0.73, 4),
              new THREE.MeshLambertMaterial({ color: "#5A3A10" })
            );
            leg.position.set(dx + lx2, fy + 0.375, dz + lz2);
            group.add(leg);
          }

          // Chair seat
          const chair = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.06, 0.55),
            new THREE.MeshLambertMaterial({ color: "#2A5098" })
          );
          chair.position.set(dx, fy + 0.45, dz + 0.65);
          group.add(chair);

          // Chair back
          const cback = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.5, 0.05),
            new THREE.MeshLambertMaterial({ color: "#2A5098" })
          );
          cback.position.set(dx, fy + 0.72, dz + 0.9);
          group.add(cback);
        }
      }

      // Projector screen
      const ps = new THREE.Mesh(
        new THREE.BoxGeometry(Math.min(roomW - 1.5, 3.5), 2, 0.06),
        new THREE.MeshLambertMaterial({ color: "#EEF4FF" })
      );
      ps.position.set(rx, fy + 2.8, rz + bwDir * (roomD / 2 - 0.2));
      group.add(ps);

      // Room number label sprite
      const lc2 = document.createElement("canvas");
      lc2.width = 80; lc2.height = 40;
      const lx2 = lc2.getContext("2d");
      lx2.fillStyle = "#1A3A7A";
      lx2.font = "bold 22px sans-serif";
      lx2.textAlign = "center";
      lx2.fillText(`R${idx + 1}`, 40, 28);
      const ls = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(lc2), transparent: true }));
      ls.position.set(rx, fy + FH - 0.6, rz);
      ls.scale.set(3.5, 1.8, 1);
      group.add(ls);
    }
  }

  // Stairwell
  const stairMat = new THREE.MeshLambertMaterial({ color: "#C0B898" });
  for (let s = 0; s < 10; s++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.18, 0.75), stairMat);
    st.position.set(b.w / 2 - 3, fy + s * 0.36, b.d / 2 - 2 - s * 0.75);
    group.add(st);
  }
  // Stair railing
  const railMat = new THREE.MeshLambertMaterial({ color: "#888070" });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.5, 8), railMat);
  rail.position.set(b.w / 2 - 1.5, fy + 1.75, b.d / 2 - 6);
  group.add(rail);

  group.position.set(b.x, 0, b.z);
  if (building.rotation) group.rotation.y = building.rotation;
  interiorRef.current = group;
  scene.add(group);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KarnavatiCampus3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const meshGroups = useRef([]);
  const interiorRef = useRef(null);
  const orbitRef = useRef({ theta: -0.5, phi: 0.9, radius: 260 });
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const dragging = useRef(false);
  const prevMouse2 = useRef({ x: 0, y: 0 });

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [interiorFloor, setInteriorFloor] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  function updateCamera() {
    const { theta, phi, radius } = orbitRef.current;
    const t = targetRef.current;
    const cam = cameraRef.current;
    if (!cam) return;
    cam.position.set(
      t.x + radius * Math.sin(phi) * Math.sin(theta),
      t.y + radius * Math.cos(phi),
      t.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cam.lookAt(t);
  }

  useEffect(() => {
    const mount = mountRef.current;
    const W = mount.clientWidth, H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#C8DFF5");
    scene.fog = new THREE.FogExp2("#C0D8F0", 0.0025);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.5, 2000);
    cameraRef.current = camera;
    updateCamera();

    // Lights
    scene.add(new THREE.AmbientLight(0xfff8e8, 0.75));
    const sun = new THREE.DirectionalLight(0xfffaec, 2.0);
    sun.position.set(100, 180, 80);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -220, right: 220, top: 220, bottom: -220, far: 700 });
    sun.shadow.bias = -0.001;
    scene.add(sun);
    scene.add(Object.assign(new THREE.DirectionalLight(0xc0d8ff, 0.45), { position: new THREE.Vector3(-80, 60, -80) }));

    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 700),
      new THREE.MeshLambertMaterial({ color: "#BDD0A0" })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads
    function road(x1, z1, x2, z2, w = 7) {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.25, len),
        new THREE.MeshLambertMaterial({ color: "#8A9EAE" })
      );
      m.position.set((x1 + x2) / 2, 0.12, (z1 + z2) / 2);
      m.rotation.y = Math.atan2(dx, dz);
      m.receiveShadow = true;
      scene.add(m);

      // Road markings
      const steps = Math.floor(len / 12);
      for (let s = 0; s < steps; s++) {
        const t = (s + 0.5) / steps;
        const mx = x1 + dx * t, mz = z1 + dz * t;
        const mark = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.05, 2.5),
          new THREE.MeshLambertMaterial({ color: "#FFFFFF" })
        );
        mark.position.set(mx, 0.26, mz);
        mark.rotation.y = Math.atan2(dx, dz);
        scene.add(mark);
      }
    }

    road(-130, -130, 110, 20, 9);
    road(0, -150, 0, 150, 8);
    road(-65, 0, 135, 0, 7);
    road(92, -150, 92, 85, 8);
    road(-25, 45, 105, 45, 6);
    road(0, 82, 55, 145, 6);
    road(-65, -65, -20, 25, 5);
    road(20, 45, 20, 135, 5);

    // Footpaths
    function path(x1, z1, x2, z2) {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.15, len),
        new THREE.MeshLambertMaterial({ color: "#D8CEBC" })
      );
      m.position.set((x1 + x2) / 2, 0.07, (z1 + z2) / 2);
      m.rotation.y = Math.atan2(dx, dz);
      scene.add(m);
    }
    path(-10, -46, -10, -20); path(52, -32, 52, -2); path(0, -55, 18, -55);
    path(-10, -60, 0, -48); path(60, 10, 60, 45);

    // Sports ground
    const sg = new THREE.Mesh(
      new THREE.BoxGeometry(74, 0.4, 70),
      new THREE.MeshLambertMaterial({ color: "#4EAA44" })
    );
    sg.position.set(62, 0.2, 42);
    sg.receiveShadow = true;
    scene.add(sg);
    // Ground lines
    const lm2 = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    [[62, 42, 65, 0.3],[62, 42, 0.3, 62]].forEach(([cx, cz, lw, ld]) => {
      const lmesh = new THREE.Mesh(new THREE.BoxGeometry(lw, 0.08, ld), lm2);
      lmesh.position.set(cx, 0.42, cz);
      scene.add(lmesh);
    });

    // Canvas label helper
    function makeLabel(text, sub) {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 90;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(255,255,255,0.93)";
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 82, 14);
      ctx.fill();
      ctx.fillStyle = "#1A2A4A";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, 128, 44);
      if (sub) {
        ctx.font = "15px sans-serif";
        ctx.fillStyle = "#5A7A9A";
        ctx.fillText(sub, 128, 68);
      }
      return new THREE.CanvasTexture(c);
    }

    // Trees
    function tree(x, z, h = 5, r = 3) {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.55, h * 0.6, 7),
        new THREE.MeshLambertMaterial({ color: "#6A4820" })
      );
      trunk.position.set(x, h * 0.3, z);
      trunk.castShadow = true;
      scene.add(trunk);
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(r, 8, 6),
        new THREE.MeshLambertMaterial({ color: "#2E8828" })
      );
      foliage.position.set(x, h * 0.6 + r * 0.6, z);
      foliage.castShadow = true;
      scene.add(foliage);
    }
    [[-80,-85],[-70,-62],[-90,-42],[-102,2],[-88,32],[-78,60],[-92,80],
     [22,-102],[44,-102],[62,-122],[82,-122],[112,-80],[122,-42],[117,2],
     [112,60],[102,90],[82,122],[52,122],[22,122],[-22,102],[-42,82],
     [-62,42],[-82,22],[-102,-22],[132,-62],[132,42],[-32,-122],[12,-122],
     [38,-8],[42,20],[30,-90],[85,-10],[88,50]
    ].forEach(([x, z]) => tree(x, z));

    // Lampposts
    function lamp(x, z) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 6, 6), new THREE.MeshLambertMaterial({ color: "#6A7A8A" }));
      pole.position.set(x, 3, z);
      scene.add(pole);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshLambertMaterial({ color: "#FFFFC0", emissive: "#FFFF80", emissiveIntensity: 0.5 }));
      head.position.set(x, 6.2, z);
      scene.add(head);
    }
    [[-5,-40],[20,-40],[50,-30],[50,5],[30,-75],[80,-60],[80,0],[60,45],[20,50],[20,80],[0,100]].forEach(([x, z]) => lamp(x, z));

    // Buildings
    meshGroups.current = [];

    BUILDINGS.forEach((b) => {
      const group = new THREE.Group();
      group.userData.building = b;

      if (b.isDome) {
        const baseH = FH * 1.8;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(b.w / 2, b.w / 2 + 0.5, baseH, 32), new THREE.MeshLambertMaterial({ color: b.color }));
        base.position.y = baseH / 2;
        base.castShadow = true;
        group.add(base);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(b.w / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: b.roofColor }));
        dome.position.y = baseH;
        dome.castShadow = true;
        group.add(dome);

        // Dome ribs
        for (let ri = 0; ri < 8; ri++) {
          const angle = (ri / 8) * Math.PI * 2;
          const rib = new THREE.Mesh(new THREE.BoxGeometry(0.3, b.w / 2 + 0.5, 0.3), new THREE.MeshLambertMaterial({ color: "#A0A8C0" }));
          rib.position.set(Math.cos(angle) * b.w / 4, baseH + b.w / 4, Math.sin(angle) * b.w / 4);
          rib.rotation.z = angle;
          group.add(rib);
        }

        // Windows
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.18), new THREE.MeshLambertMaterial({ color: "#A8D8F8", transparent: true, opacity: 0.8 }));
          win.position.set(Math.cos(angle) * (b.w / 2 - 0.2), baseH * 0.55, Math.sin(angle) * (b.w / 2 - 0.2));
          win.rotation.y = angle;
          group.add(win);
        }

        // Entrance steps
        for (let s = 0; s < 4; s++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(6 - s, 0.35, 0.9), new THREE.MeshLambertMaterial({ color: "#D0C8B0" }));
          step.position.set(0, s * 0.35, b.w / 2 + (4 - s) * 0.9);
          group.add(step);
        }
      } else {
        const totalH = b.floors * FH;

        for (let f = 0; f < b.floors; f++) {
          const fh = FH - 0.35;
          const isTop = f === b.floors - 1;

          // Floor body
          const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, fh, b.d), new THREE.MeshLambertMaterial({ color: isTop ? new THREE.Color(b.color).multiplyScalar(0.85).getHexString().replace("", "#") : b.color }));
          body.position.y = f * FH + fh / 2;
          body.castShadow = true;
          body.receiveShadow = true;
          group.add(body);

          // Floor slab
          const slab = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.5, 0.35, b.d + 0.5), new THREE.MeshLambertMaterial({ color: "#C8C0B0" }));
          slab.position.y = f * FH + fh;
          group.add(slab);

          if (f < b.floors - 1) {
            // Front/back windows
            const wCols = Math.max(2, Math.floor(b.w / 4.5));
            for (const side of [-1, 1]) {
              for (let c = 0; c < wCols; c++) {
                const wx = -b.w / 2 + (b.w / (wCols + 1)) * (c + 1);
                const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.9, 0.18), new THREE.MeshLambertMaterial({ color: "#A0CCF0", transparent: true, opacity: 0.82 }));
                win.position.set(wx, f * FH + fh * 0.54, side * (b.d / 2 + 0.05));
                group.add(win);
                // Window frame
                const frame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 2.05, 0.14), new THREE.MeshLambertMaterial({ color: "#E0D8C8" }));
                frame.position.set(wx, f * FH + fh * 0.54, side * (b.d / 2 + 0.02));
                group.add(frame);
              }
            }
            // Side windows
            const sCols = Math.max(2, Math.floor(b.d / 4.5));
            for (const side of [-1, 1]) {
              for (let c = 0; c < sCols; c++) {
                const wz = -b.d / 2 + (b.d / (sCols + 1)) * (c + 1);
                const win = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.9, 2.0), new THREE.MeshLambertMaterial({ color: "#A0CCF0", transparent: true, opacity: 0.82 }));
                win.position.set(side * (b.w / 2 + 0.05), f * FH + fh * 0.54, wz);
                group.add(win);
              }
            }
          }
        }

        // Roof parapet
        const par = new THREE.Mesh(new THREE.BoxGeometry(b.w + 1, 1.2, b.d + 1), new THREE.MeshLambertMaterial({ color: b.roofColor }));
        par.position.y = totalH + 0.6;
        group.add(par);

        // Solar panels (academic)
        if (b.type === "academic") {
          const pRows = Math.floor(b.d / 7), pCols = Math.floor(b.w / 5.5);
          for (let pr = 0; pr < pRows; pr++) for (let pc = 0; pc < pCols; pc++) {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 5.5), new THREE.MeshLambertMaterial({ color: "#1A2858" }));
            panel.position.set(-b.w / 2 + 3 + pc * 5.5, totalH + 1.5, -b.d / 2 + 3.5 + pr * 7);
            panel.rotation.x = -0.28;
            group.add(panel);
          }
        }

        // Entrance canopy + pillars
        const cw = Math.min(12, b.w * 0.42);
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.4, 4.5), new THREE.MeshLambertMaterial({ color: b.roofColor }));
        canopy.position.set(0, FH * 0.85, b.d / 2 + 2.2);
        group.add(canopy);
        for (const side of [-1, 1]) {
          const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, FH * 0.85, 8), new THREE.MeshLambertMaterial({ color: "#D0C8B8" }));
          pil.position.set(side * (cw / 2 - 1), FH * 0.425, b.d / 2 + 4.2);
          group.add(pil);
        }
        // Steps
        for (let s = 0; s < 3; s++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(cw - s * 1.5, 0.3, 0.85), new THREE.MeshLambertMaterial({ color: "#D0C8B0" }));
          step.position.set(0, s * 0.3, b.d / 2 + 4.8 - s * 0.85);
          group.add(step);
        }
      }

      group.position.set(b.x, 0, b.z);
      if (b.rotation) group.rotation.y = b.rotation;
      scene.add(group);
      meshGroups.current.push(group);

      // Label
      const tex = makeLabel(b.short, `${b.floors}F · ${b.rooms > 0 ? b.rooms + " rooms" : "ground"}`);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      const labelH = b.isDome ? 16 : b.floors * FH + 9;
      sprite.position.set(b.x, labelH, b.z);
      sprite.scale.set(20, 6.5, 1);
      sprite.userData.isLabel = true;
      scene.add(sprite);
    });

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Events
    const el = renderer.domElement;
    el.addEventListener("mousedown", e => { dragging.current = true; prevMouse2.current = { x: e.clientX, y: e.clientY }; });
    window.addEventListener("mouseup", () => { dragging.current = false; });

    el.addEventListener("mousemove", e => {
      const rect = mount.getBoundingClientRect();
      mouse.current.set(((e.clientX - rect.left) / W) * 2 - 1, -((e.clientY - rect.top) / H) * 2 + 1);
      if (dragging.current) {
        const dx = e.clientX - prevMouse2.current.x;
        const dy = e.clientY - prevMouse2.current.y;
        orbitRef.current.theta -= dx * 0.005;
        orbitRef.current.phi = Math.max(0.12, Math.min(1.48, orbitRef.current.phi + dy * 0.005));
        prevMouse2.current = { x: e.clientX, y: e.clientY };
        updateCamera();
      } else {
        raycaster.current.setFromCamera(mouse.current, camera);
        const hits = raycaster.current.intersectObjects(meshGroups.current.flatMap(g => g.children), true);
        if (hits.length) {
          let g = hits[0].object;
          while (g.parent && !g.userData?.building) g = g.parent;
          if (g.userData?.building) { setHovered(g.userData.building.id); el.style.cursor = "pointer"; return; }
        }
        setHovered(null); el.style.cursor = "grab";
      }
    });

    el.addEventListener("click", () => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(meshGroups.current.flatMap(g => g.children), true);
      if (hits.length) {
        let g = hits[0].object;
        while (g.parent && !g.userData?.building) g = g.parent;
        if (g.userData?.building) { setSelected(g.userData.building); setInteriorFloor(null); return; }
      }
      setSelected(null);
    });

    el.addEventListener("wheel", e => {
      e.preventDefault();
      orbitRef.current.radius = Math.max(35, Math.min(520, orbitRef.current.radius + e.deltaY * 0.28));
      updateCamera();
    }, { passive: false });

    let lastT = null;
    el.addEventListener("touchstart", e => { lastT = e.touches[0]; });
    el.addEventListener("touchmove", e => {
      e.preventDefault();
      if (!lastT) return;
      const t = e.touches[0];
      orbitRef.current.theta -= (t.clientX - lastT.clientX) * 0.005;
      orbitRef.current.phi = Math.max(0.12, Math.min(1.48, orbitRef.current.phi + (t.clientY - lastT.clientY) * 0.005));
      lastT = t; updateCamera();
    }, { passive: false });

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", () => {});
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  function handleFloor(f) {
    setInteriorFloor(f);
    buildInteriorFloor(sceneRef.current, selected, f, interiorRef);
  }

  function resetView() {
    orbitRef.current = { theta: -0.5, phi: 0.9, radius: 260 };
    targetRef.current.set(0, 0, 0);
    updateCamera();
    if (interiorRef.current) { sceneRef.current?.remove(interiorRef.current); interiorRef.current = null; }
    setSelected(null); setInteriorFloor(null);
  }

  const selBuilding = selected;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", background: "#08141E", fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(180deg,rgba(8,20,30,0.96) 0%,transparent 100%)", padding: "18px 24px 40px", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#38C8FF", boxShadow: "0 0 10px #38C8FF" }} />
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>Karnavati University</span>
          <span style={{ color: "#5A9AC0", fontSize: 14 }}>· 3D Campus</span>
        </div>
        <div style={{ color: "#4A7A9A", fontSize: 12, marginTop: 5, paddingLeft: 22 }}>
          Drag to orbit · Scroll to zoom · Click a building to explore interior
        </div>
      </div>

      {/* Reset */}
      <button onClick={resetView} style={{ position: "absolute", top: 18, right: 18, background: "rgba(56,200,255,0.1)", border: "1px solid rgba(56,200,255,0.3)", color: "#38C8FF", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, backdropFilter: "blur(6px)" }}>
        ↺ Reset
      </button>

      {/* Legend */}
      <div style={{ position: "absolute", top: 80, right: 18, background: "rgba(8,20,30,0.88)", border: "1px solid rgba(56,200,255,0.15)", borderRadius: 12, padding: "12px 16px", backdropFilter: "blur(8px)", minWidth: 140 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ color: "#6AAAC0", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>LEGEND</span>
          <button onClick={() => setShowLegend(v => !v)} style={{ background: "none", border: "none", color: "#4A8AAA", cursor: "pointer", fontSize: 11 }}>{showLegend ? "▲" : "▼"}</button>
        </div>
        {showLegend && Object.entries(TYPE_META).map(([type, { color, label }]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ color: "#B0CCE0", fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hovered && !selBuilding && (
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", background: "rgba(8,20,30,0.9)", border: "1px solid rgba(56,200,255,0.3)", color: "#38C8FF", padding: "8px 20px", borderRadius: 20, fontSize: 14, pointerEvents: "none", backdropFilter: "blur(6px)", whiteSpace: "nowrap" }}>
          {BUILDINGS.find(b => b.id === hovered)?.name} — click to explore
        </div>
      )}

      {/* Info panel */}
      {selBuilding && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(8,20,30,0.96)", borderTop: "1px solid rgba(56,200,255,0.25)", backdropFilter: "blur(16px)", padding: "20px 28px", display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: TYPE_META[selBuilding.type]?.color || "#888" }} />
              <span style={{ color: "#38C8FF", fontSize: 17, fontWeight: 700 }}>{selBuilding.name}</span>
            </div>
            <div style={{ color: "#6A9AB8", fontSize: 13, lineHeight: 1.6 }}>{selBuilding.description}</div>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {[["Floors", selBuilding.floors], ["Rooms", selBuilding.rooms], ["Type", TYPE_META[selBuilding.type]?.label]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: "#38C8FF", fontSize: 22, fontWeight: 700 }}>{v}</div>
                <div style={{ color: "#4A7A9A", fontSize: 11, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {selBuilding.floors > 0 && !selBuilding.isDome && (
            <div>
              <div style={{ color: "#6AAAC0", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>EXPLORE FLOOR</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 220 }}>
                {Array.from({ length: selBuilding.floors }, (_, i) => i + 1).map(f => (
                  <button key={f} onClick={() => handleFloor(f)} style={{ background: interiorFloor === f ? "#38C8FF" : "rgba(56,200,255,0.1)", border: `1px solid ${interiorFloor === f ? "#38C8FF" : "rgba(56,200,255,0.3)"}`, color: interiorFloor === f ? "#08141E" : "#38C8FF", padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
                    F{f}
                  </button>
                ))}
              </div>
              {interiorFloor && <div style={{ color: "#3A8AAA", fontSize: 11, marginTop: 8 }}>Viewing interior · Floor {interiorFloor}</div>}
            </div>
          )}

          <button onClick={() => { setSelected(null); setInteriorFloor(null); if (interiorRef.current) { sceneRef.current?.remove(interiorRef.current); interiorRef.current = null; } }} style={{ background: "none", border: "none", color: "#4A7A9A", cursor: "pointer", fontSize: 22, alignSelf: "flex-start", lineHeight: 1 }}>✕</button>
        </div>
      )}
    </div>
  );
}
