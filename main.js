//IMPORT MODULES
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
const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

// Add the surface to the scene
scene.add(surface);

// Define a function to create points on the surface
function createPointsOnSurface(surfaceGeometry) {
    const points = [];

    surfaceGeometry.vertices.forEach(vertex => {
        points.push(vertex.clone()); // Clone the vertex to avoid modifying the original geometry
    });

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
                const geometry = new THREE.Geometry();
                geometry.vertices.push(points[currentIndex], points[oppositeIndex]);

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