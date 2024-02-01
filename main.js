
/*
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const DEG_TO_RAD = Math.PI / 180;
let scene, camera;

function main() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 250);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x222222));
    renderer.shadowMap.enabled = true;

    var ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.4;

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 100, 100);
    directionalLight.lookAt(scene.position);
    directionalLight.intensity = 0.7;
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 2;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;

    scene.add(ambientLight);
    scene.add(directionalLight);

    var floorGeometry = new THREE.PlaneGeometry(200, 200);
    var floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.4,
        metalness: 0.0
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -90 * DEG_TO_RAD;
    floor.receiveShadow = true;
    scene.add(floor);

    let controls = new OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);

    var curve = new THREE.ParametricBufferGeometry(function (u, v, target) {
        var x = Math.cos(u) * 50;
        var y = v * 50;
        var z = Math.sin(u) * 50;
        target.set(x, y, z);
    }, 100, 10);

    var curveMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    var curveMesh = new THREE.Mesh(curve, curveMaterial);
    scene.add(curveMesh);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

window.onload = main;
*/

//Tiles


import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import {GUI} from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/libs/dat.gui.module.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 0, 20).setLength(15);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.PointLight();
//scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));


let params ={
	bendDepth: 5
}

let geom = new THREE.PlaneGeometry(10, 10, 10, 10);
planeCurve(geom, params.bendDepth);
let mat = new THREE.MeshBasicMaterial({
	wireframe: true,
});
let o = new THREE.Mesh(geom, mat);
scene.add(o)

let gui = new GUI();
gui.add(mat, "wireframe");
gui.add(params, "bendDepth", 1, 20).name("bend depth").onChange(v => {
	planeCurve(geom, v);
})

renderer.setAnimationLoop( _ => {
	renderer.render(scene, camera);
})

function planeCurve(g, z){
	
  let p = g.parameters;
  let hw = p.width * 0.5;
  
  let a = new THREE.Vector2(-hw, 0);
  let b = new THREE.Vector2(0, z);
  let c = new THREE.Vector2(hw, 0);
  
  let ab = new THREE.Vector2().subVectors(a, b);
  let bc = new THREE.Vector2().subVectors(b, c);
  let ac = new THREE.Vector2().subVectors(a, c);
  
  let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
  
  let center = new THREE.Vector2(0, z - r);
  let baseV = new THREE.Vector2().subVectors(a, center);
  let baseAngle = baseV.angle() - (Math.PI * 0.8);
  let arc = baseAngle * 2;
  
  let uv = g.attributes.uv;
  let pos = g.attributes.position;
  let mainV = new THREE.Vector2();
  for (let i = 0; i < uv.count; i++){
  	let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, (arc * uvRatio));
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }
  
  pos.needsUpdate = true;
  
}


/*
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { ImprovedNoise } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/math/ImprovedNoise.js';

console.clear();

let perlin = new ImprovedNoise();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 1, 1000);
camera.position.set(10, 10, 10).setLength(100);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 0.75);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.25));

let g = new THREE.PlaneGeometry(100, 100, 100, 100);
g.rotateX(-Math.PI * 0.5);
let v2 = new THREE.Vector2();
for(let i = 0; i < g.attributes.position.count;i++){
  v2.fromBufferAttribute(g.attributes.uv, i).multiplyScalar(5);
  let y = perlin.noise(v2.x, v2.y, 2.7) * 10;
  g.attributes.position.setY(i, y)
}
g.computeVertexNormals();

let gu = {
  mouse: {value: new THREE.Vector3().setScalar(-9999)}
}
let m = new THREE.MeshLambertMaterial({
  color: 0xFACE8D,
  onBeforeCompile: shader => {
    shader.uniforms.mouse = gu.mouse;
    shader.vertexShader = `
      varying vec3 vPos;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
        vPos = position;
      `
    );
    //console.log(shader.vertexShader);
    shader.fragmentShader = `
      #define ss(a, b, c) smoothstep(a, b, c)
      uniform vec3 mouse;
      varying vec3 vPos;
      ${shader.fragmentShader}
    `.replace(
      `#include <dithering_fragment>`,
      `#include <dithering_fragment>
      
      // https://madebyevan.com/shaders/grid/
        float cellSize = 10.;
        vec2 coord = vPos.xz / cellSize;
        
        vec2 mouseCell = floor(mouse.xz / cellSize) + 0.5;
        vec2 rect = abs(coord - mouseCell);
        
        float mf = float(abs(max(rect.x,rect.y)) < 0.5);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0, 1, 1), mf);

        vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
        float line = min(grid.x, grid.y);

        float color = 1.0 - min(line, 1.0);
        
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0, 0), color);
        
      `
    );
    console.log(shader.fragmentShader);
  }
})



let o = new THREE.Mesh(g, m);
scene.add(o);



renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
*/





/*

// Hinzufügen von OrbitControls für die Mausinteraktion
const controls = new OrbitControls(camera, renderer.domElement);
*/

//NURBS Curve

/*
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

let container, stats;
let camera, scene, renderer;
let group;
let targetRotation = 0;
let targetRotationOnPointerDown = 0;
let pointerX = 0;
let pointerXOnPointerDown = 0;
let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {
  
  // Erstellen des Containers für die WebGL-Ausgabe
  container = document.createElement('div');
  document.body.appendChild(container);

  // Kamera-Setup
  camera = new THREE.PerspectiveCamera(800, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-50, 100, 750);

  //Szenen-Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  //Hinzufügen einer Umgebungslichtquelle zur Szene
  scene.add(new THREE.AmbientLight(0xffffff));

  //Hinzufügen einer gerichteten Lichtquelle zur Szene
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1);
  scene.add(light);

  //Gruppe für das 3D-Objekt
  group = new THREE.Group();
  group.position.x = 0;
  group.position.y = 0;
  group.position.z = 0;
  scene.add(group);

  // NURBS Oberfläche
  const nsControlPoints = [
    [
      new THREE.Vector4(-200, -200, 100, 1),
      new THREE.Vector4(-200, -100, -200, 1),
      new THREE.Vector4(-200, 100, 250, 1),
      new THREE.Vector4(-200, 200, -100, 1),
    ],
    [
      new THREE.Vector4(0, -200, 0, 1),
      new THREE.Vector4(0, -100, -100, 5),
      new THREE.Vector4(0, 100, 150, 5),
      new THREE.Vector4(0, 200, 0, 1),
    ],
    [
      new THREE.Vector4(200, -200, -100, 1),
      new THREE.Vector4(200, -100, 200, 1),
      new THREE.Vector4(200, 100, -250, 1),
      new THREE.Vector4(200, 200, 100, 1),
    ],
  ];
  const degree1 = 2;
  const degree2 = 3;
  const knots1 = [0, 0, 0, 1, 1, 1];
  const knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
  const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);


//Funktion zur Berechnung der Oberflächenpunkte
  function getSurfacePoint(u, v, target) {
    return nurbsSurface.getPoint(u, v, target);
  }

  const geometry = new ParametricGeometry(getSurfacePoint, 10, 10);

  //Material für die Oberfläche
const material = new THREE.MeshLambertMaterial({ 
  color: 0x0000ff, 
  side: THREE.DoubleSide
});
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

//Erstellen der 3D-Objektes und des Drahtgitterobjekts
const object = new THREE.Mesh(geometry, material);
const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

//Position und Skalierung des 3D-Objektes
object.position.set(-200, 100, 0);
object.scale.multiplyScalar(1);

//Position und Skalierung des Drahtgitterobjekts
wireframe.position.set(-200, 100, 0);
wireframe.scale.multiplyScalar(1);

//Hinzufügen von 3D-Objekt und Drahtgiitter zur Gruppe
group.add(object);
group.add(wireframe);

/*

//Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  container.style.touchAction = 'none';
  container.addEventListener('pointerdown', onPointerDown);

  window.addEventListener('resize', onWindowResize);
}


//OrbitControls für die Interaktion mit der Kamera
const controls = new OrbitControls(camera, renderer.domElement);

//Ereignislistener für Fenstergrößenänderungen
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
  if (event.isPrimary === false) return;
  pointerXOnPointerDown = event.clientX - windowHalfX;
  targetRotationOnPointerDown = targetRotation;
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
  if (event.isPrimary === false) return;
  pointerX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
}

function onPointerUp() {
  if (event.isPrimary === false) return;
  document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  group.rotation.y += (targetRotation - group.rotation.y) * 1;
  renderer.render(scene, camera);
}

animate();





//NURBs Curve


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


