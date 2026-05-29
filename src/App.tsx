import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnalogStaticNoise } from './effects/analogStatic';
import { MatrixGridWave } from './effects/matrixGrid';
import {
  PLANET_DATA, NEARBY_STARS, GALAXIES_NEBULAE, DEEP_SPACE_STRUCTURES,
  getScaleLevel, getScaleInfo, getTypeLabel, getDistanceDisplay, getDecorColor,
  type CelestialBody, type PlanetData, type StarData, type GalaxyNebulaData, type DeepSpaceData
} from './data/celestial';
import './App.css';

// ─── Texture Generation ───────────────────────────────────────────
const TextureGen = {
  glow() {
    const cvs = document.createElement('canvas'); cvs.width = 64; cvs.height = 64;
    const ctx = cvs.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(cvs);
  },
  earthDay() {
    const cvs = document.createElement('canvas'); cvs.width = 512; cvs.height = 256;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = '#0f2b46'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#27ae60';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 15, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(cvs);
  },
  earthNight() {
    const cvs = document.createElement('canvas'); cvs.width = 512; cvs.height = 256;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = '#030308'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#f1c40f';
    for (let i = 0; i < 600; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 1.5, 1.5);
    }
    return new THREE.CanvasTexture(cvs);
  },
  clouds() {
    const cvs = document.createElement('canvas'); cvs.width = 512; cvs.height = 256;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 25 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(cvs);
  }
};

const textures = {
  glow: TextureGen.glow(),
  day: TextureGen.earthDay(),
  night: TextureGen.earthNight(),
  clouds: TextureGen.clouds()
};

// ─── Warp Speed Trails ────────────────────────────────────────────
class WarpSpeedTrails {
  private scene: THREE.Scene;
  private points: THREE.Points | null = null;
  private velocities: THREE.Vector3[] = [];
  private opacities: number[] = [];
  private count: number = 2000;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  activate(camera: THREE.PerspectiveCamera) {
    if (this.points) return;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    for (let i = 0; i < this.count; i++) {
      const spread = 2000;
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      colors[i * 3] = 0.29;
      colors[i * 3 + 1] = 0.69;
      colors[i * 3 + 2] = 1.0;

      this.velocities.push(new THREE.Vector3(
        dir.x * (50 + Math.random() * 100),
        dir.y * (50 + Math.random() * 100),
        dir.z * (50 + Math.random() * 100)
      ));
      this.opacities.push(1.0);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.points = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    }));
    this.scene.add(this.points);
  }

  update(camera: THREE.PerspectiveCamera) {
    if (!this.points) return;
    const posAttr = this.points.geometry.attributes.position as THREE.BufferAttribute;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3;
      posAttr.array[idx] += this.velocities[i].x;
      posAttr.array[idx + 1] += this.velocities[i].y;
      posAttr.array[idx + 2] += this.velocities[i].z;

      const dist = Math.sqrt(
        posAttr.array[idx] ** 2 +
        posAttr.array[idx + 1] ** 2 +
        posAttr.array[idx + 2] ** 2
      );

      if (dist > 3000) {
        const spread = 2000;
        posAttr.array[idx] = camera.position.x + (Math.random() - 0.5) * spread;
        posAttr.array[idx + 1] = camera.position.y + (Math.random() - 0.5) * spread;
        posAttr.array[idx + 2] = camera.position.z + (Math.random() - 0.5) * spread;
      }
    }
    posAttr.needsUpdate = true;
  }

  deactivate() {
    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
      this.points = null;
      this.velocities = [];
      this.opacities = [];
    }
  }

  isActive() {
    return !!this.points;
  }
}

// ─── Main App Component ───────────────────────────────────────────
export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    planets: Array<{ mesh: THREE.Object3D; data: PlanetData; angle: number }>;
    earth: THREE.Mesh | null;
    clouds: THREE.Mesh | null;
    comet: THREE.Mesh | null;
    cometTrail: THREE.Line | null;
    ambientStars: THREE.Points | null;
    galaxyParticles: THREE.Points | null;
    solarSystemGroup: THREE.Group;
    starMeshes: THREE.Mesh[];
    galaxyMeshes: THREE.Mesh[];
    deepSpaceMeshes: THREE.Mesh[];
    warpTrails: WarpSpeedTrails;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    time: number;
    animId: number;
  } | null>(null);

  const [selectedObject, setSelectedObject] = useState<CelestialBody | null>(null);
  const [currentScale, setCurrentScale] = useState('solarSystem');
  const [warpSpeed, setWarpSpeed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [labelPositions, setLabelPositions] = useState<Array<{ name: string; x: number; y: number; visible: boolean; enName: string; data: CelestialBody }>>([]);
  const [showLabels, setShowLabels] = useState(true);
  const analogRef = useRef<AnalogStaticNoise | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // ─── Build Earth ──────────────────────────────────────────────
  const buildEarth = useCallback(() => {
    const earthGroup = new THREE.Group();
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({
        map: textures.day,
        emissive: new THREE.Color(0xffe17d),
        emissiveMap: textures.night,
        emissiveIntensity: 0.6,
        roughness: 0.5,
        metalness: 0.1
      })
    );
    earthGroup.add(earth);

    const cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 32, 32),
      new THREE.MeshBasicMaterial({
        map: textures.clouds,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    earthGroup.add(cloudMesh);

    return { earthGroup, earth, cloudMesh };
  }, []);

  // ─── Initialize Scene ─────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050B);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 50000
    );
    camera.position.set(0, 150, 400);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15000;
    controls.minDistance = 3;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;

    // Lights
    scene.add(new THREE.PointLight(0xffffff, 2.2, 8000));
    scene.add(new THREE.AmbientLight(0x222222));

    // ─── Solar System ─────────────────────────────────────────
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(12, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    solarSystemGroup.add(sun);
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: textures.glow,
        color: 0xffaa00,
        transparent: true,
        blending: THREE.AdditiveBlending
      })
    );
    sunGlow.scale.set(70, 70, 1);
    sun.add(sunGlow);

    // Planets
    const planets: Array<{ mesh: THREE.Object3D; data: PlanetData; angle: number }> = [];
    let earthMesh: THREE.Mesh | null = null;
    let cloudMesh: THREE.Mesh | null = null;

    PLANET_DATA.forEach(p => {
      // Orbit line
      const orbitPts: number[] = [];
      for (let i = 0; i <= 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        orbitPts.push(Math.cos(angle) * p.distance, 0, Math.sin(angle) * p.distance);
      }
      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPts, 3));
      const orbitLine = new THREE.Line(
        orbitGeo,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })
      );
      solarSystemGroup.add(orbitLine);

      // Planet mesh
      let mesh: THREE.Object3D;
      if (p.isEarth) {
        const { earthGroup, earth, cloudMesh: cm } = buildEarth();
        mesh = earthGroup;
        earthMesh = earth;
        cloudMesh = cm;
      } else {
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(p.radius, 16, 16),
          new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.6 })
        );
      }

      // Ring for Saturn
      if (p.hasRing) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.3, 32),
          new THREE.MeshBasicMaterial({
            color: p.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
          })
        );
        ring.rotation.x = Math.PI / 2 + 0.2;
        mesh.add(ring);
      }

      mesh.userData = { type: 'planet', data: p };
      solarSystemGroup.add(mesh);
      planets.push({ mesh, data: p, angle: Math.random() * Math.PI * 2 });
    });

    // Comet
    const comet = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    solarSystemGroup.add(comet);

    const tailLen = 20;
    const tailGeo = new THREE.BufferGeometry();
    const tailColors = new Float32Array(tailLen * 3);
    for (let i = 0; i < tailLen; i++) {
      const r = 1 - (i / tailLen);
      tailColors[i * 3] = 0;
      tailColors[i * 3 + 1] = r;
      tailColors[i * 3 + 2] = r;
    }
    tailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tailLen * 3), 3));
    tailGeo.setAttribute('color', new THREE.BufferAttribute(tailColors, 3));
    const cometTrail = new THREE.Line(
      tailGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6 })
    );
    solarSystemGroup.add(cometTrail);

    // ─── Blinking Stars ───────────────────────────────────────
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3500 + Math.random() * 1000;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const ambientStars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 10, map: textures.glow,
      transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(ambientStars);

    // ─── Galaxy ─────────────────────────────────────────────────
    const galaxyCount = 6000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    const colorTheme = [
      new THREE.Color(0x4ab1ff),
      new THREE.Color(0xff9ff3),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < galaxyCount; i++) {
      const r = Math.random() * 10000 + 600;
      const theta = r * 0.0008 + (Math.random() * Math.PI * 0.4);
      const arm = i % 2 === 0 ? 1 : -1;
      galaxyPos[i * 3] = Math.cos(theta) * r * arm + (Math.random() - 0.5) * r * 0.25;
      galaxyPos[i * 3 + 1] = (Math.random() - 0.5) * 250 * (10000 / r);
      galaxyPos[i * 3 + 2] = Math.sin(theta) * r * arm + (Math.random() - 0.5) * r * 0.25;
      const c = colorTheme[Math.floor(Math.random() * colorTheme.length)];
      galaxyColors[i * 3] = c.r;
      galaxyColors[i * 3 + 1] = c.g;
      galaxyColors[i * 3 + 2] = c.b;
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyParticles = new THREE.Points(galaxyGeo, new THREE.PointsMaterial({
      size: 30, map: textures.glow, blending: THREE.AdditiveBlending,
      vertexColors: true, transparent: true, opacity: 0.2, depthWrite: false
    }));
    scene.add(galaxyParticles);

    // ─── Nearby Stars ──────────────────────────────────────────
    const starMeshes: THREE.Mesh[] = [];
    NEARBY_STARS.forEach(s => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.9 })
      );
      // Distribute stars on a large sphere shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = s.scaleDistance;
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.3,
        r * Math.cos(phi)
      );
      mesh.userData = { type: 'star', data: s };
      scene.add(mesh);
      starMeshes.push(mesh);
    });

    // ─── Galaxies & Nebulae ───────────────────────────────────
    const galaxyMeshes: THREE.Mesh[] = [];
    GALAXIES_NEBULAE.forEach(g => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(3, 16, 16),
        new THREE.MeshBasicMaterial({ color: g.color, transparent: true, opacity: 0.8 })
      );
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = g.scaleDistance;
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.2,
        r * Math.cos(phi)
      );
      mesh.userData = { type: 'galaxy', data: g };
      scene.add(mesh);
      galaxyMeshes.push(mesh);
    });

    // ─── Deep Space Structures ────────────────────────────────
    const deepSpaceMeshes: THREE.Mesh[] = [];
    DEEP_SPACE_STRUCTURES.forEach(d => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
      );
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = d.scaleDistance;
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.15,
        r * Math.cos(phi)
      );
      mesh.userData = { type: 'deepSpace', data: d };
      scene.add(mesh);
      deepSpaceMeshes.push(mesh);
    });

    // ─── Warp Speed Trails ────────────────────────────────────
    const warpTrails = new WarpSpeedTrails(scene);

    // ─── Raycaster ────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);

    // Store ref
    sceneRef.current = {
      scene, camera, renderer, controls,
      planets, earth: earthMesh, clouds: cloudMesh,
      comet, cometTrail, ambientStars, galaxyParticles,
      solarSystemGroup, starMeshes, galaxyMeshes, deepSpaceMeshes,
      warpTrails, raycaster, mouse, time: 0, animId: 0
    };

    // ─── Mouse Move ───────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      if (sceneRef.current) {
        sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Click ────────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const s = sceneRef.current;
      s.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      s.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      s.raycaster.setFromCamera(s.mouse, s.camera);

      const allMeshes = [
        ...s.planets.map(p => p.mesh),
        ...s.starMeshes,
        ...s.galaxyMeshes,
        ...s.deepSpaceMeshes
      ];

      const intersects = s.raycaster.intersectObjects(allMeshes, true);
      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !target.userData?.data) {
          target = target.parent;
        }
        if (target.userData?.data) {
          const body = target.userData.data as CelestialBody;
          setSelectedObject(body);
          focusOnObject(target);
        }
      }
    };
    window.addEventListener('click', onClick);

    // ─── Zoom detection ───────────────────────────────────────
    let lastDistance = camera.position.distanceTo(controls.target);
    let zoomTimer: ReturnType<typeof setTimeout>;

    const onWheel = () => {
      if (!sceneRef.current) return;
      const s = sceneRef.current;
      const currentDistance = s.camera.position.distanceTo(s.controls.target);
      const speed = Math.abs(currentDistance - lastDistance);

      if (speed > 2) {
        setWarpSpeed(true);
        s.warpTrails.activate(s.camera);
      }

      clearTimeout(zoomTimer);
      zoomTimer = setTimeout(() => {
        setWarpSpeed(false);
        s.warpTrails.deactivate();
      }, 300);

      lastDistance = currentDistance;
    };
    window.addEventListener('wheel', onWheel);

    // ─── Focus Animation ──────────────────────────────────────
    let focusAnimId: number = 0;

    function focusOnObject(target: THREE.Object3D | null) {
      if (!sceneRef.current) return;
      const s = sceneRef.current;

      if (focusAnimId) cancelAnimationFrame(focusAnimId);

      if (!target) {
        // Reset to overview
        const startPos = s.camera.position.clone();
        const endPos = new THREE.Vector3(0, 150, 400);
        const startTarget = s.controls.target.clone();
        const endTarget = new THREE.Vector3(0, 0, 0);
        let progress = 0;

        const animateReset = () => {
          progress += 0.01;
          if (progress >= 1) progress = 1;
          const eased = 1 - Math.pow(1 - progress, 3);
          s.camera.position.lerpVectors(startPos, endPos, eased);
          s.controls.target.lerpVectors(startTarget, endTarget, eased);
          if (progress < 1) focusAnimId = requestAnimationFrame(animateReset);
        };
        animateReset();
        return;
      }

      const targetPos = new THREE.Vector3();
      target.getWorldPosition(targetPos);

      const body = target.userData?.data as CelestialBody;
      let offset = new THREE.Vector3(0, 2, 8);
      let distance = 20;

      if (body) {
        switch (body.type) {
          case 'planet':
            offset = new THREE.Vector3(0, 2, 5);
            distance = Math.max(10, (body as PlanetData).radius * 8);
            break;
          case 'star':
            offset = new THREE.Vector3(0, 0, 1);
            distance = 50;
            break;
          case 'galaxy':
            offset = new THREE.Vector3(0, 0, 1);
            distance = 80;
            break;
          case 'deepSpace':
            offset = new THREE.Vector3(0, 0, 1);
            distance = 100;
            break;
        }
      }

      const endPos = targetPos.clone().add(offset.normalize().multiplyScalar(distance));
      const startPos = s.camera.position.clone();
      const startTarget = s.controls.target.clone();
      let progress = 0;

      const animateFocus = () => {
        progress += 0.015;
        if (progress >= 1) progress = 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        s.camera.position.lerpVectors(startPos, endPos, eased);
        s.controls.target.lerpVectors(startTarget, targetPos, eased);
        if (progress < 1) focusAnimId = requestAnimationFrame(animateFocus);
      };
      animateFocus();
    }

    // ─── Animation Loop ───────────────────────────────────────
    let time = 0;

    const animate = () => {
      const s = sceneRef.current;
      if (!s) return;

      time += 0.01;
      s.time = time;

      // Planet orbits
      s.planets.forEach(p => {
        p.angle += p.data.speed * 0.3;
        p.mesh.position.x = Math.cos(p.angle) * p.data.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.data.distance;

        if (p.data.isEarth) {
          if (s.earth) s.earth.rotation.y += 0.004;
          if (s.clouds) s.clouds.rotation.y += 0.0055;
        } else {
          p.mesh.rotation.y += 0.015;
        }
      });

      // Galaxy rotation
      if (s.galaxyParticles) {
        s.galaxyParticles.rotation.y = time * 0.01;
      }

      // Ambient stars rotation
      if (s.ambientStars) {
        s.ambientStars.rotation.y = time * 0.001;
      }

      // Comet
      if (s.comet && s.cometTrail) {
        const cometSpeed = time * 0.15;
        const a = 240;
        const b = 100;
        const cx = Math.cos(cometSpeed) * a - 50;
        const cz = Math.sin(cometSpeed) * b;
        s.comet.position.set(cx, 15, cz);

        const posAttr = s.cometTrail.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = posAttr.count - 1; i > 0; i--) {
          posAttr.setXYZ(i,
            posAttr.getX(i - 1),
            posAttr.getY(i - 1),
            posAttr.getZ(i - 1)
          );
        }
        posAttr.setXYZ(0, cx, 15, cz);
        posAttr.needsUpdate = true;
      }

      // Warp trails
      if (s.warpTrails.isActive()) {
        s.warpTrails.update(s.camera);
      }

      // Update scale
      const camDist = s.camera.position.distanceTo(s.controls.target);
      const scale = getScaleLevel(camDist);
      setCurrentScale(scale);

      // Show/hide labels based on distance
      setShowLabels(camDist < 2000);

      // Controls
      s.controls.update();

      // Render
      s.renderer.render(s.scene, s.camera);
      s.animId = requestAnimationFrame(animate);
    };

    animate();

    // ─── Resize ───────────────────────────────────────────────
    const onResize = () => {
      if (!sceneRef.current) return;
      const s = sceneRef.current;
      s.camera.aspect = window.innerWidth / window.innerHeight;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ─── Loading ──────────────────────────────────────────────
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(zoomTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (focusAnimId) cancelAnimationFrame(focusAnimId);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.renderer.domElement.remove();
      }
    };
  }, [buildEarth]);

  // ─── Analog Static Noise ──────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    if (!loading) {
      const noise = new AnalogStaticNoise(mountRef.current);
      noise.start();
      analogRef.current = noise;
      return () => {
        noise.destroy();
      };
    }
  }, [loading]);

  // ─── Loading Screen Matrix Grid ───────────────────────────────
  useEffect(() => {
    if (!loadingRef.current) return;
    const grid = new MatrixGridWave(loadingRef.current);
    grid.start();
    return () => grid.destroy();
  }, []);

  // ─── Label Position Updates ───────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sceneRef.current || !showLabels) {
        setLabelPositions([]);
        return;
      }
      const s = sceneRef.current;
      const labels: Array<{ name: string; x: number; y: number; visible: boolean; enName: string; data: CelestialBody }> = [];

      // Planet labels
      s.planets.forEach(p => {
        const pos = p.mesh.position.clone();
        pos.project(s.camera);
        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
        const visible = pos.z < 1;
        if (visible) {
          labels.push({ name: p.data.name, x, y, visible, enName: p.data.enName, data: p.data });
        }
      });

      // Star labels (only when close enough)
      const camDist = s.camera.position.distanceTo(s.controls.target);
      if (camDist > 1000 && camDist < 6000) {
        s.starMeshes.forEach(mesh => {
          const pos = mesh.position.clone();
          pos.project(s.camera);
          const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
          const visible = pos.z < 1;
          const data = mesh.userData.data as StarData;
          if (visible) {
            labels.push({ name: data.name, x, y, visible, enName: data.enName, data });
          }
        });
      }

      // Galaxy labels (only when zoomed out far)
      if (camDist > 5000) {
        s.galaxyMeshes.forEach(mesh => {
          const pos = mesh.position.clone();
          pos.project(s.camera);
          const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
          const visible = pos.z < 1;
          const data = mesh.userData.data as GalaxyNebulaData;
          if (visible) {
            labels.push({ name: data.name, x, y, visible, enName: data.enName, data });
          }
        });
      }

      // Deep space labels (only when very far)
      if (camDist > 8000) {
        s.deepSpaceMeshes.forEach(mesh => {
          const pos = mesh.position.clone();
          pos.project(s.camera);
          const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
          const visible = pos.z < 1;
          const data = mesh.userData.data as DeepSpaceData;
          if (visible) {
            labels.push({ name: data.name, x, y, visible, enName: data.enName, data });
          }
        });
      }

      setLabelPositions(labels);
    }, 100);

    return () => clearInterval(interval);
  }, [showLabels]);

  // ─── Handle Label Click ───────────────────────────────────────
  const handleLabelClick = useCallback((body: CelestialBody) => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;

    let targetMesh: THREE.Object3D | null = null;

    if (body.type === 'planet') {
      const p = s.planets.find(pl => pl.data.name === body.name);
      if (p) targetMesh = p.mesh;
    } else if (body.type === 'star') {
      targetMesh = s.starMeshes.find(m => m.userData.data.name === body.name) || null;
    } else if (body.type === 'galaxy') {
      targetMesh = s.galaxyMeshes.find(m => m.userData.data.name === body.name) || null;
    } else if (body.type === 'deepSpace') {
      targetMesh = s.deepSpaceMeshes.find(m => m.userData.data.name === body.name) || null;
    }

    if (targetMesh) {
      setSelectedObject(body);
      // Trigger focus animation
      const targetPos = new THREE.Vector3();
      targetMesh.getWorldPosition(targetPos);

      let offset = new THREE.Vector3(0, 2, 8);
      let distance = 20;

      switch (body.type) {
        case 'planet':
          offset = new THREE.Vector3(0, 2, 5);
          distance = Math.max(10, (body as PlanetData).radius * 8);
          break;
        case 'star':
          offset = new THREE.Vector3(0, 0, 1);
          distance = 50;
          break;
        case 'galaxy':
          offset = new THREE.Vector3(0, 0, 1);
          distance = 80;
          break;
        case 'deepSpace':
          offset = new THREE.Vector3(0, 0, 1);
          distance = 100;
          break;
      }

      const endPos = targetPos.clone().add(offset.normalize().multiplyScalar(distance));
      const startPos = s.camera.position.clone();
      const startTarget = s.controls.target.clone();
      let progress = 0;

      const animateFocus = () => {
        progress += 0.015;
        if (progress >= 1) progress = 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        s.camera.position.lerpVectors(startPos, endPos, eased);
        s.controls.target.lerpVectors(startTarget, targetPos, eased);
        if (progress < 1) requestAnimationFrame(animateFocus);
      };
      animateFocus();
    }
  }, []);

  // ─── Back to Galaxy ───────────────────────────────────────────
  const handleBackToGalaxy = useCallback(() => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;
    setSelectedObject(null);

    const startPos = s.camera.position.clone();
    const endPos = new THREE.Vector3(0, 150, 400);
    const startTarget = s.controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0, 0);
    let progress = 0;

    const animateReset = () => {
      progress += 0.01;
      if (progress >= 1) progress = 1;
      const eased = 1 - Math.pow(1 - progress, 3);
      s.camera.position.lerpVectors(startPos, endPos, eased);
      s.controls.target.lerpVectors(startTarget, endTarget, eased);
      if (progress < 1) requestAnimationFrame(animateReset);
    };
    animateReset();
  }, []);

  // ─── Get Info Panel Data ──────────────────────────────────────
  const typeInfo = selectedObject ? getTypeLabel(selectedObject) : null;
  const decorColor = selectedObject ? getDecorColor(selectedObject) : '#4FC3F7';
  const scaleInfo = getScaleInfo(currentScale);

  return (
    <div ref={mountRef} className="cosmic-container">
      {/* 3D Canvas is appended here by Three.js */}

      {/* Scan Light Chase Overlay */}
      <div className="scan-light-chase" />

      {/* ─── Loading Screen ─────────────────────────────────── */}
      {loading && (
        <div ref={loadingRef} className="loading-screen">
          <div className="loading-content">
            <h1 className="loading-title">INITIALIZING COSMOS...</h1>
            <p className="loading-subtitle">迷谳科技初始化...</p>
            <div className="loading-bar-container">
              <div className="loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* ─── Title ──────────────────────────────────────────── */}
      {!loading && (
        <div className="title-area">
          <h1 className="main-title">
            <span className="title-char">迷</span>
            <span className="title-char">谳</span>
            <span className="title-char">科</span>
            <span className="title-char">技</span>
            <span className="title-char">深</span>
            <span className="title-char">空</span>
            <span className="title-char">探</span>
            <span className="title-char">索</span>
          </h1>
          <p className="sub-title">SOLAR SYSTEM &amp; DEEP SPACE</p>
          <div className="title-line" />
        </div>
      )}

      {/* ─── Planet/Star Labels ─────────────────────────────── */}
      {!loading && showLabels && labelPositions.map((label, idx) => (
        <button
          key={`${label.name}-${idx}`}
          className="celestial-label"
          style={{
            left: label.x,
            top: label.y - 20,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleLabelClick(label.data);
          }}
        >
          {label.name}
          <span className="label-en">{label.enName}</span>
        </button>
      ))}

      {/* ─── Info Panel ─────────────────────────────────────── */}
      {!loading && selectedObject && (
        <div className="info-panel" key={selectedObject.name}>
          <div className="info-decor" style={{ backgroundColor: decorColor }} />
          <button
            className="info-close"
            onClick={() => setSelectedObject(null)}
          >
            ×
          </button>
          <h2 className="info-name">{selectedObject.name}</h2>
          <p className="info-en-name">{selectedObject.enName}</p>
          <div className="info-divider" />
          {typeInfo && (
            <span
              className="info-type"
              style={{ backgroundColor: typeInfo.bgColor, color: typeInfo.textColor }}
            >
              {typeInfo.label}
            </span>
          )}
          <div className="info-data-row">
            <span className="info-data-label">距离</span>
            <span className="info-data-value">{getDistanceDisplay(selectedObject)}</span>
          </div>
          {selectedObject.type === 'planet' && (
            <div className="info-data-row">
              <span className="info-data-label">半径</span>
              <span className="info-data-value">{(selectedObject as PlanetData).realRadius}</span>
            </div>
          )}
          <div className="info-divider" />
          <p className="info-description">{selectedObject.description}</p>
        </div>
      )}

      {/* ─── Warp Speed Indicator ───────────────────────────── */}
      {!loading && warpSpeed && (
        <div className="warp-indicator">
          <span>WARP SPEED</span>
          <div className="warp-bar">
            <div className="warp-light" />
          </div>
        </div>
      )}

      {/* ─── Bottom Bar ─────────────────────────────────────── */}
      {!loading && (
        <div className="bottom-bar">
          <p className="scroll-hint">SCROLL TO ZOOM · DRAG TO ROTATE</p>

          {selectedObject && (
            <button className="back-btn" onClick={handleBackToGalaxy}>
              <span className="back-btn-pulse" />
              返回星系
            </button>
          )}

          <div className="scale-indicator">
            <span className="scale-dot" style={{ backgroundColor: scaleInfo.color }} />
            <span>{scaleInfo.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
