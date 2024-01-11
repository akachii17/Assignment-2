// IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Initialize Three.js components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set render dimensions and append to the browser window
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a surface (PlaneGeometry) and material
const surfaceGeometry = new THREE.PlaneGeometry(5, 5, 10, 10); // width, height, widthSegments, heightSegments
const surfaceMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true, side: THREE.DoubleSide });
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

// Add the surface to the scene
scene.add(surface);

// Set camera position
camera.position.z = 5;

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);
scene.add(camera);

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the surface
    surface.rotation.x += 0.005;
    surface.rotation.y += 0.005;

    renderer.render(scene, camera);
};

// Start animation
animate();