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

// Set background color to gray
renderer.setClearColor(0x808080);

// Initial dimensions of the surface
let surfaceWidth = 5;
let surfaceHeight = 5;

// Create a surface (PlaneGeometry) and material
const surfaceGeometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, 10, 10); // width, height, widthSegments, heightSegments
const surfaceMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0xdeb887) } // Beige color
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      // Exclude diagonals
      if (mod(floor(vUv.x * 10.0), 2.0) == 0.0 || mod(floor(vUv.y * 10.0), 2.0) == 0.0) {
        discard;
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  side: THREE.DoubleSide
});

// Create a material for the visible surface
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
scene.add(surface);

// Set camera position
camera.position.z = 8; // Update camera position
camera.position.y = 2; // Adjust camera height

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);
scene.add(camera);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI; // Allow rotation beyond the zenith

// Create GUI
const gui = new GUI();

// GUI controls
const surfaceFolder = gui.addFolder('Surface Dimensions');
surfaceFolder.add(surfaceGeometry.parameters, 'width', 1, 10).step(1).onChange((value) => {
    surfaceWidth = value;
    updateSurfaceGeometry();
});

surfaceFolder.add(surfaceGeometry.parameters, 'height', 1, 10).step(1).onChange((value) => {
    surfaceHeight = value;
    updateSurfaceGeometry();
});

// Update surface geometry function
function updateSurfaceGeometry() {
    surfaceGeometry.dispose();
    surface.material.dispose();

    surface.geometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, 10, 10);
    surface.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xdeb887) } // Beige color
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          // Exclude diagonals
          if (mod(floor(vUv.x * 10.0), 2.0) == 0.0 || mod(floor(vUv.y * 10.0), 2.0) == 0.0) {
            discard;
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
}

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

// Start animation
animate();