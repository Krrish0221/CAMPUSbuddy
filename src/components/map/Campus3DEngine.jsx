import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { BUILDINGS, TYPE_META } from "@/data/mapData";

const FH = 4.2; // floor height metres

export default function Campus3DEngine({ 
  onBuildingClick, 
  hoveredBuildingId, 
  selectedBuildingId,
  viewInteriorFloor = null 
}) {
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
  const prevMouse = useRef({ x: 0, y: 0 });

  const updateCamera = () => {
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
  };

  const buildInteriorFloor = (building, floor) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (interiorRef.current) scene.remove(interiorRef.current);
    
    if (floor === null) {
      interiorRef.current = null;
      return;
    }

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

    // Rooms + Interior Logic (Simplified for integration)
    const roomPalette = ["#FFF6EC","#EBF5FF","#F0FFF0","#FFF0F8"];
    const wallMat = new THREE.MeshLambertMaterial({ color: "#D8D0C0", transparent: true, opacity: 0.55 });
    
    // Just a few representative rooms for the 3D effect
    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < 3; i++) {
        const rx = -b.w / 2 + 8 * i + 5;
        const rz = side === 0 ? -(b.d / 4) : (b.d / 4);
        
        const rfMesh = new THREE.Mesh(
          new THREE.BoxGeometry(7, 0.06, b.d / 2 - 2),
          new THREE.MeshLambertMaterial({ color: roomPalette[i % 4] })
        );
        rfMesh.position.set(rx, fy + 0.22, rz);
        group.add(rfMesh);

        // Desk
        const desk = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.08, 1),
          new THREE.MeshLambertMaterial({ color: "#8B6020" })
        );
        desk.position.set(rx, fy + 0.8, rz);
        group.add(desk);
      }
    }

    group.position.set(b.x, 0, b.z);
    if (building.rotation) group.rotation.y = building.rotation;
    interiorRef.current = group;
    scene.add(group);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617"); // Darker for UI consistency
    scene.fog = new THREE.FogExp2("#020617", 0.002);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.5, 2000);
    cameraRef.current = camera;
    updateCamera();

    // Lighting
    scene.add(new THREE.AmbientLight(0xfff8e8, 0.5));
    const sun = new THREE.DirectionalLight(0xfffaec, 1.8);
    sun.position.set(100, 180, 80);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    
    // Accent blue light
    const accent = new THREE.PointLight(0x3b82f6, 1.5, 300);
    accent.position.set(0, 50, 0);
    scene.add(accent);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshLambertMaterial({ color: "#111827" })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create Buildings
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
      } else {
        const totalH = (b.floors?.length || 1) * FH;
        for (let f = 0; f < (b.floors?.length || 1); f++) {
          const isTop = f === (b.floors.length - 1);
          const body = new THREE.Mesh(
            new THREE.BoxGeometry(b.w, FH - 0.4, b.d), 
            new THREE.MeshLambertMaterial({ color: isTop ? b.roofColor : b.color })
          );
          body.position.y = f * FH + (FH / 2);
          body.castShadow = true;
          body.receiveShadow = true;
          group.add(body);

          const slab = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.4, 0.2, b.d + 0.4), new THREE.MeshLambertMaterial({ color: "#334155" }));
          slab.position.y = f * FH + FH - 0.2;
          group.add(slab);
        }
      }

      group.position.set(b.x, 0, b.z || 0);
      scene.add(group);
      meshGroups.current.push(group);
    });

    // Helper: Canvas Label
    const makeLabel = (text) => {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 64;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.beginPath();
      ctx.roundRect(0, 0, 128, 64, 12);
      ctx.fill();
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, 64, 40);
      return new THREE.CanvasTexture(c);
    };

    BUILDINGS.forEach(b => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeLabel(b.shortCode), transparent: true }));
      sprite.position.set(b.x, (b.floors?.length || 1) * FH + 6, b.z || 0);
      sprite.scale.set(12, 6, 1);
      scene.add(sprite);
    });

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Interaction
    const handleMouseDown = (e) => { 
      dragging.current = true; 
      prevMouse.current = { x: e.clientX, y: e.clientY }; 
    };
    const handleMouseUp = () => { dragging.current = false; };
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.current.set(((e.clientX - rect.left) / mount.clientWidth) * 2 - 1, -((e.clientY - rect.top) / mount.clientHeight) * 2 + 1);
      
      if (dragging.current) {
        const dx = e.clientX - prevMouse.current.x;
        const dy = e.clientY - prevMouse.current.y;
        orbitRef.current.theta -= dx * 0.005;
        orbitRef.current.phi = Math.max(0.1, Math.min(1.4, orbitRef.current.phi + dy * 0.005));
        prevMouse.current = { x: e.clientX, y: e.clientY };
        updateCamera();
      }
    };

    const handleClick = () => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(meshGroups.current.flatMap(g => g.children), true);
      if (hits.length) {
        let g = hits[0].object;
        while (g.parent && !g.userData?.building) g = g.parent;
        if (g.userData?.building && onBuildingClick) {
          onBuildingClick(g.userData.building);
        }
      }
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    mount.addEventListener("mousemove", handleMouseMove);
    mount.addEventListener("click", handleClick);

    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameRef.current);
      mount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      mount.removeEventListener("mousemove", handleMouseMove);
      mount.removeEventListener("click", handleClick);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Interior on Floor change
  useEffect(() => {
    if (viewInteriorFloor && selectedBuildingId) {
      const b = BUILDINGS.find(bu => bu.id === selectedBuildingId);
      if (b) buildInteriorFloor(b, viewInteriorFloor);
    } else {
      if (interiorRef.current) sceneRef.current?.remove(interiorRef.current);
      interiorRef.current = null;
    }
  }, [viewInteriorFloor, selectedBuildingId]);

  return (
    <div ref={mountRef} className="w-full h-full relative overflow-hidden bg-[#020617]" />
  );
}
