/* ================================================================
   VANTA Creative Agency — hero3d.js
   Three.js r128 · Floating wireframe geometries + particle field
   ================================================================ */

'use strict';

(function initHero3D() {

  if (typeof THREE === 'undefined') { console.warn('[hero3d] Three.js not loaded.'); return; }
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  /* ══════════════════════════════════════════════════════════════
     RENDERER
  ══════════════════════════════════════════════════════════════ */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ══════════════════════════════════════════════════════════════
     SCENE · CAMERA · RIG
  ══════════════════════════════════════════════════════════════ */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 120);
  camera.position.set(0, 0, 10);

  const camRig = new THREE.Group();
  camRig.add(camera);
  scene.add(camRig);

  /* ══════════════════════════════════════════════════════════════
     RESIZE
  ══════════════════════════════════════════════════════════════ */
  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);
  onResize();

  /* ══════════════════════════════════════════════════════════════
     LIGHTING
  ══════════════════════════════════════════════════════════════ */
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));

  const sunLight = new THREE.DirectionalLight(0xff6644, 1.4);
  sunLight.position.set(6, 8, 6);
  scene.add(sunLight);

  const accentPt = new THREE.PointLight(0xff4b26, 3.5, 22);
  accentPt.position.set(-2, 3, 5);
  scene.add(accentPt);

  const coolPt = new THREE.PointLight(0xc8d4f0, 1.2, 18);
  coolPt.position.set(5, -3, 4);
  scene.add(coolPt);

  scene.add(Object.assign(new THREE.PointLight(0xff4b26, 0.6, 14), { position: new THREE.Vector3(0, 0, -4) }));

  /* ══════════════════════════════════════════════════════════════
     MATERIAL HELPERS
  ══════════════════════════════════════════════════════════════ */
  const ACCENT_HEX = 0xff4b26;
  const WHITE_HEX  = 0xf0ece7;

  function edgeMat(hex, opacity) {
    return new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false });
  }
  function ghostMat(hex, opacity) {
    return new THREE.MeshPhongMaterial({ color: hex, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  }

  /* ══════════════════════════════════════════════════════════════
     BUILD WIRE OBJECT
  ══════════════════════════════════════════════════════════════ */
  function makeWireObj({ geo, hex, edgeOp, ghostOp, position, rotSpeed, scale }) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geo, ghostMat(hex, ghostOp)));
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat(hex, edgeOp)));
    group.position.copy(position);
    group.scale.setScalar(0);
    scene.add(group);
    return { group, rotSpeed, targetScale: scale };
  }

  /* ══════════════════════════════════════════════════════════════
     OBJECT LAYOUT  —  13 objects, two accent colors, varied depths
  ══════════════════════════════════════════════════════════════ */
  const V = THREE.Vector3;
  const objects = [

    makeWireObj({ geo: new THREE.IcosahedronGeometry(1.4, 1),          hex: ACCENT_HEX, edgeOp: 0.28, ghostOp: 0.028, position: new V(-0.6,  0.4, -3.5), rotSpeed: { x:.0020, y:.0030, z:.0012 }, scale: 1.00 }),
    makeWireObj({ geo: new THREE.IcosahedronGeometry(0.85, 0),         hex: ACCENT_HEX, edgeOp: 0.75, ghostOp: 0.055, position: new V(-3.9,  1.5, -0.8), rotSpeed: { x:.0032, y:.0068, z:.0018 }, scale: 0.88 }),
    makeWireObj({ geo: new THREE.IcosahedronGeometry(0.55, 0),         hex: WHITE_HEX,  edgeOp: 0.48, ghostOp: 0.035, position: new V( 3.4,  2.1, -0.6), rotSpeed: { x:.0058, y:.0025, z:.0072 }, scale: 0.72 }),
    makeWireObj({ geo: new THREE.IcosahedronGeometry(1.2,  1),         hex: WHITE_HEX,  edgeOp: 0.18, ghostOp: 0.015, position: new V( 1.0,  3.2, -2.2), rotSpeed: { x:.0015, y:.0042, z:.0028 }, scale: 1.00 }),
    makeWireObj({ geo: new THREE.IcosahedronGeometry(0.40, 0),         hex: ACCENT_HEX, edgeOp: 0.58, ghostOp: 0.044, position: new V(-5.3,  0.8, -0.5), rotSpeed: { x:.0050, y:.0100, z:.0030 }, scale: 0.58 }),

    makeWireObj({ geo: new THREE.OctahedronGeometry(0.75, 0),          hex: WHITE_HEX,  edgeOp: 0.52, ghostOp: 0.042, position: new V( 2.8,  1.6, -1.0), rotSpeed: { x:.0075, y:.0038, z:.0055 }, scale: 0.78 }),
    makeWireObj({ geo: new THREE.OctahedronGeometry(0.55, 0),          hex: ACCENT_HEX, edgeOp: 0.62, ghostOp: 0.048, position: new V(-4.4, -1.6, -0.4), rotSpeed: { x:.0048, y:.0085, z:.0038 }, scale: 0.65 }),
    makeWireObj({ geo: new THREE.OctahedronGeometry(0.38, 0),          hex: WHITE_HEX,  edgeOp: 0.65, ghostOp: 0.050, position: new V( 5.1, -2.0, -1.2), rotSpeed: { x:.0100, y:.0060, z:.0110 }, scale: 0.55 }),

    makeWireObj({ geo: new THREE.TetrahedronGeometry(0.70, 0),         hex: ACCENT_HEX, edgeOp: 0.70, ghostOp: 0.055, position: new V(-2.4,  2.8, -0.6), rotSpeed: { x:.0088, y:.0045, z:.0062 }, scale: 0.70 }),
    makeWireObj({ geo: new THREE.TetrahedronGeometry(1.00, 0),         hex: WHITE_HEX,  edgeOp: 0.32, ghostOp: 0.022, position: new V(-2.0, -2.2, -2.8), rotSpeed: { x:.0038, y:.0075, z:.0025 }, scale: 0.85 }),
    makeWireObj({ geo: new THREE.TetrahedronGeometry(0.50, 0),         hex: ACCENT_HEX, edgeOp: 0.60, ghostOp: 0.045, position: new V( 1.6, -2.6, -0.9), rotSpeed: { x:.0100, y:.0060, z:.0090 }, scale: 0.60 }),

    makeWireObj({ geo: new THREE.TorusGeometry(0.72, 0.11, 6, 14),     hex: ACCENT_HEX, edgeOp: 0.60, ghostOp: 0.042, position: new V( 4.3,  0.2, -0.8), rotSpeed: { x:.0060, y:.0030, z:.0080 }, scale: 0.80 }),
    makeWireObj({ geo: new THREE.TorusGeometry(1.05, 0.085, 6, 16),    hex: WHITE_HEX,  edgeOp: 0.25, ghostOp: 0.016, position: new V(-1.4,  3.6, -2.5), rotSpeed: { x:.0030, y:.0070, z:.0040 }, scale: 0.95 }),

  ];

  /* ══════════════════════════════════════════════════════════════
     PARTICLE FIELD
  ══════════════════════════════════════════════════════════════ */
  const PT   = 340;
  const pPos = new Float32Array(PT * 3);
  const pCol = new Float32Array(PT * 3);
  const ca   = new THREE.Color(ACCENT_HEX);
  const cw   = new THREE.Color(WHITE_HEX);

  for (let i = 0; i < PT; i++) {
    pPos[i*3]   = (Math.random() - .5) * 22;
    pPos[i*3+1] = (Math.random() - .5) * 14;
    pPos[i*3+2] = (Math.random() - .5) *  8 - 2;
    const c = Math.random() > .72 ? ca : cw;
    pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  ptGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
  const ptCloud = new THREE.Points(ptGeo, new THREE.PointsMaterial({
    size: .032, vertexColors: true, transparent: true, opacity: .58,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(ptCloud);

  /* ══════════════════════════════════════════════════════════════
     CONSTELLATION LINES  (sparse — between close particles)
  ══════════════════════════════════════════════════════════════ */
  const lineVerts = [];
  for (let i = 0; i < PT && lineVerts.length < 900; i++) {
    for (let j = i + 1; j < PT && lineVerts.length < 900; j++) {
      const dx = pPos[i*3]-pPos[j*3], dy = pPos[i*3+1]-pPos[j*3+1], dz = pPos[i*3+2]-pPos[j*3+2];
      if (dx*dx + dy*dy + dz*dz < 5.76) { // threshold 2.4^2
        lineVerts.push(pPos[i*3],pPos[i*3+1],pPos[i*3+2], pPos[j*3],pPos[j*3+1],pPos[j*3+2]);
      }
    }
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    color: 0xf0ece7, transparent: true, opacity: .055,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));

  /* ══════════════════════════════════════════════════════════════
     MOUSE PARALLAX
  ══════════════════════════════════════════════════════════════ */
  const mouse  = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };

  const onMM = e => { mouse.x = e.clientX/innerWidth  - .5; mouse.y = e.clientY/innerHeight - .5; };
  const onDO = e => {
    if (e.beta == null) return;
    mouse.x = THREE.MathUtils.clamp(e.gamma / 45, -.5, .5);
    mouse.y = THREE.MathUtils.clamp(e.beta  / 45, -.5, .5);
  };
  window.addEventListener('mousemove',         onMM, { passive: true });
  window.addEventListener('deviceorientation', onDO, { passive: true });

  /* ══════════════════════════════════════════════════════════════
     EASING
  ══════════════════════════════════════════════════════════════ */
  const easeOutBack = t => { const c1=1.70158, c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); };

  /* ══════════════════════════════════════════════════════════════
     RENDER LOOP
  ══════════════════════════════════════════════════════════════ */
  const BIRTH     = performance.now();
  const ENTER_DUR = 1800;
  const STAGGER   = 130;
  const FS        = 0.00055; // float speed

  function animate(now) {
    requestAnimationFrame(animate);
    onResize();

    const elapsed = now - BIRTH;

    /* Camera parallax */
    smooth.x += (mouse.x - smooth.x) * .035;
    smooth.y += (mouse.y - smooth.y) * .035;
    camRig.rotation.y =  smooth.x * .22;
    camRig.rotation.x = -smooth.y * .13;

    /* Objects */
    objects.forEach((obj, i) => {
      const t     = Math.min(Math.max((elapsed - i * STAGGER) / ENTER_DUR, 0), 1);
      obj.group.scale.setScalar(Math.max(0, easeOutBack(t)) * obj.targetScale);
      obj.group.rotation.x += obj.rotSpeed.x;
      obj.group.rotation.y += obj.rotSpeed.y;
      obj.group.rotation.z += obj.rotSpeed.z;
      /* Float */
      obj.group.position.y += Math.sin(now * FS   + i * .95) * .0012;
      obj.group.position.x += Math.cos(now * FS*.7 + i * 1.3) * .0006;
      /* Soft clamp */
      if (Math.abs(obj.group.position.x) > 6.5) obj.group.position.x *= .998;
      if (Math.abs(obj.group.position.y) > 4.5) obj.group.position.y *= .998;
    });

    /* Particle drift */
    ptCloud.rotation.y += .00018;
    ptCloud.rotation.x += .00009;

    /* Pulsing accent light */
    accentPt.intensity  = 3.5 + Math.sin(now * .0009) * 1.2;
    accentPt.position.x = -2  + Math.sin(now * .00045) * 1.5;
    accentPt.position.y =  3  + Math.cos(now * .00060) * 1.0;

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);

  /* Cleanup */
  window.addEventListener('beforeunload', () => {
    ro.disconnect();
    renderer.dispose();
    window.removeEventListener('mousemove',         onMM);
    window.removeEventListener('deviceorientation', onDO);
  });

})();
