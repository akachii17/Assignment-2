import * as THREE from 'three';
import { NURBSSurface, Vector4, ParametricGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(50, 50, 100);

const scene = new Scene();

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const knots1 = [0, 0, 1, 1];
const knots2 = [0, 0, 1, 1];
const controlPoints = [
  [
    new Vector4(-10, 0, 10, 1),
    new Vector4(-10, 0, 0, 1),
    new Vector4(-10, 0, -10, 1),
  ],
  [
    new Vector4(0, 10, 10, 1),
    new Vector4(0, 10, 0, 1),
    new Vector4(0, 10, -10, 1),
  ],
  [
    new Vector4(10, 0, 10, 1),
    new Vector4(10, 0, 0, 1),
    new Vector4(10, 0, -10, 1),
  ],
];

const nurbsSurface = new NURBSSurface(2, 2, knots1, knots2, controlPoints);

const geometry = new ParametricGeometry((u, v, target) => nurbsSurface.getPoint(u, v, target), 20, 20);

const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

const mesh = new Mesh(geometry, material);
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();















/*

// IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// Create a material for the visible surface
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
scene.add(surface);

// Set camera position
camera.position.z = 8;
camera.position.y = 2;

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

// Start animation
animate();

*/












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

// ... (vorheriger Code)

// GUI controls for midpoint position
const midpointFolder = gui.addFolder('Midpoint Position');
const midpointPosition = { x: 0, y: 0, z: 0 };

midpointFolder.add(midpointPosition, 'x', -10, 10).step(0.1).onChange(() => {
    updateSurfaceMidpoint();
});

midpointFolder.add(midpointPosition, 'y', -10, 10).step(0.1).onChange(() => {
    updateSurfaceMidpoint();
});

midpointFolder.add(midpointPosition, 'z', -10, 10).step(0.1).onChange(() => {
    updateSurfaceMidpoint();
});

// Function to update surface midpoint position
function updateSurfaceMidpoint() {
    const deltaX = midpointPosition.x - surface.position.x;
    const deltaY = midpointPosition.y - surface.position.y;
    const deltaZ = midpointPosition.z - surface.position.z;

    surface.position.set(midpointPosition.x, midpointPosition.y, midpointPosition.z);

    // Verschiebe die gesamte Szene um die Differenz, um den Eindruck zu erwecken,
    // dass der Mittelpunkt verschoben wird, während die Eckpunkte an ihrer relativen Position bleiben.
    scene.position.x -= deltaX;
    scene.position.y -= deltaY;
    scene.position.z -= deltaZ;
}

// ... (nachfolgender Code)

// Animation function
const animate = function () {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

// Start animation
animate();

*/














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

// Import dat.gui
import * as dat from 'dat.gui';

// Create GUI
const gui = new dat.GUI();

// GUI controls
const surfaceFolder = gui.addFolder('Surface Dimensions');

const surfaceParams = {
    width: surfaceWidth,
    height: surfaceHeight,
    widthSegments: widthSegments,
    heightSegments: heightSegments
};

surfaceFolder.add(surfaceParams, 'width', 1, 10).step(1).onChange((value) => {
    surfaceWidth = value;
    updateSurfaceGeometry();
});

surfaceFolder.add(surfaceParams, 'height', 1, 10).step(1).onChange((value) => {
    surfaceHeight = value;
    updateSurfaceGeometry();
});

surfaceFolder.add(surfaceParams, 'widthSegments', 1, 20).step(1).onChange((value) => {
    widthSegments = value;
    updateSurfaceGeometry();
});

surfaceFolder.add(surfaceParams, 'heightSegments', 1, 20).step(1).onChange((value) => {
    heightSegments = value;
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

*/



















/*

import * as THREE from 'three';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const surfaceGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
scene.add(surface);

let gridHelper = new THREE.GridHelper(5, 10, 0xdeb887, 0xdeb887);
scene.add(gridHelper);

camera.position.z = 8;

const gui = new dat.GUI();
const surfaceParams = {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10
};

const surfaceFolder = gui.addFolder('Surface Dimensions');
const widthControl = surfaceFolder.add(surfaceParams, 'width').min(1).max(10).step(1);
widthControl.onChange(updateSurfaceGeometry);

const heightControl = surfaceFolder.add(surfaceParams, 'height').min(1).max(10).step(1);
heightControl.onChange(updateSurfaceGeometry);

const widthSegmentsControl = surfaceFolder.add(surfaceParams, 'widthSegments').min(1).max(20).step(1);
widthSegmentsControl.onChange(updateSurfaceGeometry);

const heightSegmentsControl = surfaceFolder.add(surfaceParams, 'heightSegments').min(1).max(20).step(1);
heightSegmentsControl.onChange(updateSurfaceGeometry);

function updateSurfaceGeometry() {
    scene.remove(surface);
    scene.remove(gridHelper);

    surface.geometry.dispose();
    surface.material.dispose();

    surface.geometry = new THREE.PlaneGeometry(surfaceParams.width, surfaceParams.height, surfaceParams.widthSegments, surfaceParams.heightSegments);
    scene.add(surface);

    gridHelper.geometry.dispose();
    gridHelper.material.dispose();

    gridHelper = new THREE.GridHelper(surfaceParams.width, surfaceParams.widthSegments, 0xdeb887, 0xdeb887);
    scene.add(gridHelper);
}

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
 */


