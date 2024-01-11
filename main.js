/*

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

// Set background color to a slightly darker gray
renderer.setClearColor(0x808080);

// Initial dimensions and segments of the surface
let surfaceWidth = 5;
let surfaceHeight = 5;
let widthSegments = 10;
let heightSegments = 10;

// Create a surface (PlaneGeometry) and material
const surfaceGeometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, widthSegments, heightSegments);
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
      if (mod(floor(vUv.x * float(${widthSegments})), 2.0) == 0.0 || mod(floor(vUv.y * float(${heightSegments})), 2.0) == 0.0) {
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
camera.position.z = 8;
camera.position.y = 2;

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
controls.maxPolarAngle = Math.PI;

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

// Add controls for width and height segments
surfaceFolder.add(surfaceGeometry.parameters, 'widthSegments', 1, 20).step(1).onChange((value) => {
    widthSegments = value;
    updateSurfaceGeometry();
});

surfaceFolder.add(surfaceGeometry.parameters, 'heightSegments', 1, 20).step(1).onChange((value) => {
    heightSegments = value;
    updateSurfaceGeometry();
});

// Update surface geometry function
function updateSurfaceGeometry() {
    scene.remove(surface);

    surfaceGeometry.dispose();
    surfaceMaterial.dispose();

    surface.geometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, widthSegments, heightSegments);
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
          if (mod(floor(vUv.x * float(${widthSegments})), 2.0) == 0.0 || mod(floor(vUv.y * float(${heightSegments})), 2.0) == 0.0) {
            discard;
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    scene.add(surface);
}

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

// Start animation
animate();

*/

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

// Set background color to a slightly darker gray
renderer.setClearColor(0x808080);

// Initial dimensions and segments of the surface
let surfaceWidth = 5;
let surfaceHeight = 5;
let widthSegments = 10;
let heightSegments = 10;

// Create a surface (PlaneGeometry) and material
let surfaceGeometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, widthSegments, heightSegments);
let surfaceMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Make the surface material invisible

// Create a mesh for the surface
let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
scene.add(surface);

// Create grid lines
let gridHelper = new THREE.GridHelper(surfaceWidth, widthSegments, 0xdeb887, 0xdeb887);
scene.add(gridHelper);

// Set camera position
camera.position.z = 8;
camera.position.y = 2;

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
controls.maxPolarAngle = Math.PI;

// Create GUI
const gui = new GUI();

// GUI controls
const surfaceFolder = gui.addFolder('Surface Dimensions');

// Define an object to hold parameters
const surfaceParams = {
    width: surfaceWidth,
    height: surfaceHeight,
    widthSegments: widthSegments,
    heightSegments: heightSegments
};

const widthControl = surfaceFolder.add(surfaceParams, 'width').min(1).max(10).step(1).listen();
widthControl.onChange(() => {
    surfaceWidth = surfaceParams.width;
    updateSurfaceGeometry();
});

const heightControl = surfaceFolder.add(surfaceParams, 'height').min(1).max(10).step(1).listen();
heightControl.onChange(() => {
    surfaceHeight = surfaceParams.height;
    updateSurfaceGeometry();
});

// Add controls for width and height segments
const widthSegmentsControl = surfaceFolder.add(surfaceParams, 'widthSegments').min(1).max(20).step(1).listen();
widthSegmentsControl.onChange(() => {
    widthSegments = surfaceParams.widthSegments;
    updateSurfaceGeometry();
});

const heightSegmentsControl = surfaceFolder.add(surfaceParams, 'heightSegments').min(1).max(20).step(1).listen();
heightSegmentsControl.onChange(() => {
    heightSegments = surfaceParams.heightSegments;
    updateSurfaceGeometry();
});

// Update surface geometry function
function updateSurfaceGeometry() {
    scene.remove(surface);
    scene.remove(gridHelper);

    surfaceGeometry.dispose();
    surfaceMaterial.dispose();

    surfaceGeometry = new THREE.PlaneGeometry(surfaceWidth, surfaceHeight, widthSegments, heightSegments);
    surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    scene.add(surface);

    // Recreate grid lines
    gridHelper = new THREE.GridHelper(surfaceWidth, widthSegments, 0xdeb887, 0xdeb887);
    scene.add(gridHelper);
}

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

// Start animation
animate();