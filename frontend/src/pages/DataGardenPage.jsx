import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

// --- Mock Data ---
const mockDatasets = [
  { id: 1, name: 'Global Climate Patterns', size: 150, category: 'Environment', lastUpdated: '2023-10-26', records: 12500000 },
  { id: 2, name: 'Human Genome Sequencing', size: 250, category: 'Biology', lastUpdated: '2023-10-22', records: 3100000000 },
  { id: 3, name: 'Stellar Cartography DB', size: 180, category: 'Astronomy', lastUpdated: '2023-09-15', records: 58000000 },
  { id: 4, name: 'Quantum Entanglement Sims', size: 120, category: 'Physics', lastUpdated: '2023-10-28', records: 950000 },
  { id: 5, name: 'Ancient Civilization Texts', size: 90, category: 'History', lastUpdated: '2023-08-01', records: 45000 },
  { id: 6, name: 'Oceanic Microbiome Atlas', size: 210, category: 'Biology', lastUpdated: '2023-10-11', records: 8700000 },
  { id: 7, name: 'Exoplanet Atmospheric Data', size: 165, category: 'Astronomy', lastUpdated: '2023-10-19', records: 3200000 },
  { id: 8, name: 'Particle Accelerator Logs', size: 280, category: 'Physics', lastUpdated: '2023-10-30', records: 150000000 },
  { id: 9, name: 'Deforestation Satellite Imagery', size: 175, category: 'Environment', lastUpdated: '2023-09-25', records: 45000000 },
];

const categoryColors = {
  'Environment': new THREE.Color(0x4CAF50), // Green
  'Biology': new THREE.Color(0xE91E63),     // Pink
  'Astronomy': new THREE.Color(0x3F51B5),   // Indigo
  'Physics': new THREE.Color(0xFFC107),     // Amber
  'History': new THREE.Color(0x795548),     // Brown
};

// --- Helper Functions ---
const createFlower = (dataset) => {
  const flowerGroup = new THREE.Group();
  flowerGroup.userData = dataset;

  const stemHeight = dataset.size / 50 + 1;
  const petalCount = 5 + Math.floor(dataset.records / 100000000);

  // Stem
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.8 });
  const stemGeometry = new THREE.CylinderGeometry(0.05, 0.1, stemHeight, 8);
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.position.y = stemHeight / 2;
  flowerGroup.add(stem);

  // Petals
  const petalColor = categoryColors[dataset.category] || new THREE.Color(0xffffff);
  const petalMaterial = new THREE.MeshStandardMaterial({
    color: petalColor,
    emissive: petalColor,
    emissiveIntensity: 0.3,
    roughness: 0.5,
    metalness: 0.1,
  });
  const petalGeometry = new THREE.SphereGeometry(0.5, 16, 8);
  petalGeometry.scale(1, 0.4, 1.5); // Flatten and elongate the sphere

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    petal.position.set(Math.cos(angle) * 0.6, stemHeight, Math.sin(angle) * 0.6);
    petal.rotation.y = -angle;
    petal.rotation.z = Math.PI / 6;
    flowerGroup.add(petal);
  }

  // Center (Pistil)
  const pistilMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.8,
  });
  const pistilGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const pistil = new THREE.Mesh(pistilGeometry, pistilMaterial);
  pistil.position.y = stemHeight;
  flowerGroup.add(pistil);

  // Point Light inside the flower
  const light = new THREE.PointLight(petalColor, 1, 5);
  light.position.y = stemHeight;
  flowerGroup.add(light);

  flowerGroup.scale.set(0.01, 0.01, 0.01); // Start small for animation
  return flowerGroup;
};

// --- React Components ---
const Tooltip = ({ data, position }) => {
  if (!data) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -110%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 100,
        backdropFilter: 'blur(5px)',
      }}
    >
      <h3 style={{ margin: '0 0 5px 0', color: `#${categoryColors[data.category].getHexString()}` }}>{data.name}</h3>
      <p style={{ margin: 0 }}>Category: {data.category}</p>
      <p style={{ margin: 0 }}>Records: {data.records.toLocaleString()}</p>
      <p style={{ margin: 0 }}>Last Updated: {data.lastUpdated}</p>
    </div>
  );
};

const DataGardenPage = () => {
  const mountRef = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    let animationFrameId;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(10, 20, 5);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x102010, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Stars/Particles
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = Math.random() * 100;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create and place flowers
    const flowers = [];
    mockDatasets.forEach((dataset, index) => {
      const flower = createFlower(dataset);
      const angle = (index / mockDatasets.length) * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      flower.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      flower.rotation.y = Math.random() * Math.PI * 2;
      scene.add(flower);
      flowers.push(flower);

      // Animate growth
      new TWEEN.Tween(flower.scale)
        .to({ x: 1, y: 1, z: 1 }, 2000 + Math.random() * 2000)
        .easing(TWEEN.Easing.Elastic.Out)
        .delay(500 + index * 100)
        .start();
    });

    // Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);
      TWEEN.update(time);
      controls.update();

      // Raycasting for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(flowers, true);

      if (intersects.length > 0) {
        const newIntersected = intersects[0].object.parent; // Get the flower group
        if (intersectedObject !== newIntersected) {
          // De-emphasize old object
          if (intersectedObject) {
            const light = intersectedObject.children.find(c => c.isPointLight);
            if (light) new TWEEN.Tween(light).to({ intensity: 1 }, 300).start();
          }
          
          intersectedObject = newIntersected;
          setHoveredData(intersectedObject.userData);
          
          // Emphasize new object
          const light = intersectedObject.children.find(c => c.isPointLight);
          if (light) new TWEEN.Tween(light).to({ intensity: 3 }, 300).start();
        }
      } else {
        if (intersectedObject) {
          const light = intersectedObject.children.find(c => c.isPointLight);
          if (light) new TWEEN.Tween(light).to({ intensity: 1 }, 300).start();
        }
        intersectedObject = null;
        setHoveredData(null);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      // Dispose of Three.js objects to prevent memory leaks
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
      });
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#050510' }}>
      <Tooltip data={hoveredData} position={tooltipPosition} />
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'sans-serif',
        textShadow: '0 0 5px black',
        pointerEvents: 'none',
      }}>
        <h1 style={{ margin: 0, fontWeight: 300, fontSize: '2.5rem' }}>The Data Garden</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem', maxWidth: '400px' }}>
          A living visualization of the Foundation's knowledge base. Each flower represents a dataset.
        </p>
      </div>
    </div>
  );
};

export default DataGardenPage;