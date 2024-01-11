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

// Define a function to create points on the surface
function createPointsOnSurface(surfaceGeometry) {
    const points = [];

    // Use surface.geometry.attributes.position.array instead of surfaceGeometry.vertices
    const positions = surface.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        points.push(vertex);
    }

    return points;
}

// Create points on the surface
const points = createPointsOnSurface(surfaceGeometry);

// Define a function to connect points opposite to each other
function connectOppositePoints(points) {
    const lines = [];

    const widthSegments = surfaceGeometry.parameters.widthSegments;
    const heightSegments = surfaceGeometry.parameters.heightSegments;

    for (let i = 0; i <= heightSegments; i++) {
        for (let j = 0; j <= widthSegments; j++) {
            const currentIndex = i * (widthSegments + 1) + j;
            const oppositeIndex = (i + Math.floor(heightSegments / 2)) % (heightSegments + 1) * (widthSegments + 1) + (widthSegments - j);

            if (oppositeIndex < points.length) {
                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                vertices.push(points[currentIndex].x, points[currentIndex].y, points[currentIndex].z);
                vertices.push(points[oppositeIndex].x, points[oppositeIndex].y, points[oppositeIndex].z);
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
                const line = new THREE.Line(geometry, lineMaterial);

                lines.push(line);
            }
        }
    }

    return lines;
}

// Create lines connecting opposite points
const lines = connectOppositePoints(points);

// Add lines to the scene
lines.forEach(line => {
    scene.add(line);
});

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