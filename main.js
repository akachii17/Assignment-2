import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const colors = ['#661D98', '#2CBDFE', '#47DBCD', '#F5B14C', '#960019'];

function koch_line(start, end, factor) {
    const x1 = start[0], y1 = start[1];
    const x2 = end[0], y2 = end[1];
    const l = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

    const a = [x1, y1];
    const b = [x1 + (x2 - x1) / 3., y1 + (y2 - y1) / 3.];
    const c = [b[0] + l / 3. * Math.cos(factor * Math.PI / 3.), b[1] + l / 3. * Math.sin(factor * Math.PI / 3.)];
    const d = [x1 + 2. * (x2 - x1) / 3., y1 + 2. * (y2 - y1) / 3.];
    const e = [x2, y2];

    return { 'a': a, 'b': b, 'c': c, 'd': d, 'e': e, 'factor': factor };
}

function koch_snowflake(degree, s = 5.0) {
    const lines = [];

    const sixty_degrees = Math.PI / 3.;
    const A = [0., 0.];
    const B = [s, 0.];
    const C = [s * Math.cos(sixty_degrees), s * Math.sin(sixty_degrees)];

    if (degree === 0) {
        lines.push(koch_line(A, B, 0));
        lines.push(koch_line(B, C, 2));
        lines.push(koch_line(C, A, 4));
    } else {
        lines.push(koch_line(A, B, 5));
        lines.push(koch_line(B, C, 1));
        lines.push(koch_line(C, A, 3));
    }

    for (let i = 1; i < degree; i++) {
        for (let j = 0; j < 3 * 4**(i - 1); j++) {
            const line = lines.shift();
            const factor = line['factor'];

            lines.push(koch_line(line['a'], line['b'], factor % 6));
            lines.push(koch_line(line['b'], line['c'], (factor - 1) % 6));
            lines.push(koch_line(line['c'], line['d'], (factor + 1) % 6));
            lines.push(koch_line(line['d'], line['e'], factor % 6));
        }
    }

    return lines;
}

const gui = new GUI();
const params = {
    triangleSize: 5.0,
    lineVisibility: {
        a: true,
        b: true,
        c: true,
        d: true,
        e: true
    }
};

gui.add(params, 'triangleSize', 1.0, 10.0).onChange(() => {
    scene.clear();
    drawSnowflake();
});

const visibilityFolder = gui.addFolder('Line Visibility');
visibilityFolder.add(params.lineVisibility, 'a').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'b').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'c').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'd').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'e').onChange(drawSnowflake);

function drawSnowflake() {
  console.log(`Drawing snowflake`);
    const degree = 5;
    const s = params.triangleSize;

    for (let d = 0; d <= degree; d++) {
        const lines = koch_snowflake(d, s);
        const color = colors[d];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const geometry = new THREE.BufferGeometry();
            const vertices = [];

            if (params.lineVisibility.a) {
                vertices.push(line['a'][0], line['a'][1], 0);
            }
            if (params.lineVisibility.b) {
                vertices.push(line['b'][0], line['b'][1], 0);
            }
            if (params.lineVisibility.c) {
                vertices.push(line['c'][0], line['c'][1], 0);
            }
            if (params.lineVisibility.d) {
                vertices.push(line['d'][0], line['d'][1], 0);
            }
            if (params.lineVisibility.e) {
                vertices.push(line['e'][0], line['e'][1], 0);
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            const material = new THREE.LineBasicMaterial({ color: color });
            const lineObject = new THREE.Line(geometry, material);
            scene.add(lineObject);
        }
    }
}

camera.position.z = 10;
drawSnowflake();

function animate() {
  console.log(`Animate...`);
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();


/*
// Schritt 1: Importiere notwendige Bibliotheken
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Schritt 2: Erstelle eine 3D-Szene, Kamera und Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Schritt 3: Füge Orbit-Steuerungen hinzu
const controls = new OrbitControls(camera, renderer.domElement);

// Schritt 4: Definiere Farben und Funktionen für das Koch-Schneeflocken-Fraktal
const colors = ['#661D98', '#2CBDFE', '#47DBCD', '#F5B14C', '#960019'];

function koch_line(start, end, factor) {
    // ... (Funktion zum Generieren von Linien)
}

function koch_snowflake(degree, s = 5.0) {
    // ... (Funktion zum Generieren der Schneeflocke)
}

// Schritt 5: Erstelle ein GUI mit Lil-GUI
const gui = new GUI();
const params = {
    triangleSize: 5.0,
    lineVisibility: {
        a: true,
        b: true,
        c: true,
        d: true,
        e: true
    }
};

// Schritt 6: Füge GUI-Elemente hinzu und verbinde sie mit der Zeichenfunktion
gui.add(params, 'triangleSize', 1.0, 10.0).onChange(() => {
    // Schritt 7: Lösche die Szene und zeichne die Schneeflocke neu
    scene.clear();
    drawSnowflake();
});

const visibilityFolder = gui.addFolder('Line Visibility');
visibilityFolder.add(params.lineVisibility, 'a').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'b').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'c').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'd').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility, 'e').onChange(drawSnowflake);

// Schritt 8: Definiere die Funktion zum Zeichnen der Schneeflocke
function drawSnowflake() {
    console.log(`Drawing snowflake`);
    const degree = 5;
    const s = params.triangleSize;

    // Schritt 9: Iteriere über die Grade und zeichne Linien entsprechend der Sichtbarkeit
    for (let d = 0; d <= degree; d++) {
        const lines = koch_snowflake(d, s);
        const color = colors[d];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const geometry = new THREE.BufferGeometry();
            const vertices = [];

            // Schritt 10: Füge die sichtbaren Linienpunkte zur Geometrie hinzu
            if (params.lineVisibility.a) {
                vertices.push(line['a'][0], line['a'][1], 0);
            }
            if (params.lineVisibility.b) {
                vertices.push(line['b'][0], line['b'][1], 0);
            }
            if (params.lineVisibility.c) {
                vertices.push(line['c'][0], line['c'][1], 0);
            }
            if (params.lineVisibility.d) {
                vertices.push(line['d'][0], line['d'][1], 0);
            }
            if (params.lineVisibility.e) {
                vertices.push(line['e'][0], line['e'][1], 0);
            }

            // Schritt 11: Erstelle ein Linienobjekt und füge es zur Szene hinzu
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            const material = new THREE.LineBasicMaterial({ color: color });
            const lineObject = new THREE.Line(geometry, material);
            scene.add(lineObject);
        }
    }
}

// Schritt 12: Setze die Kameraposition und zeichne die Schneeflocke
camera.position.z = 10;
drawSnowflake();

// Schritt 13: Erstelle die Animationsfunktion
function animate() {
    console.log(`Animate...`);
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Schritt 14: Starte die Animation
animate();


// Schritt 5: Erstelle ein GUI mit Lil-GUI
const gui = new GUI();
const params = {
    triangleSize: 5.0,
    lineVisibility: {
        a: { 'a': false, 'b': true, 'c': true, 'd': true, 'e': true },
        b: { 'a': true, 'b': false, 'c': true, 'd': true, 'e': true },
        c: { 'a': true, 'b': true, 'c': false, 'd': true, 'e': true },
        d: { 'a': true, 'b': true, 'c': true, 'd': false, 'e': true },
        e: { 'a': true, 'b': true, 'c': true, 'd': true, 'e': false }
    }
};

// ...

const visibilityFolder = gui.addFolder('Line Visibility');
visibilityFolder.add(params.lineVisibility.a, 'a').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility.b, 'b').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility.c, 'c').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility.d, 'd').onChange(drawSnowflake);
visibilityFolder.add(params.lineVisibility.e, 'e').onChange(drawSnowflake);

// ...

// Schritt 8: Definiere die Funktion zum Zeichnen der Schneeflocke
function drawSnowflake() {
    console.log(`Drawing snowflake`);
    const degree = 5;
    const s = params.triangleSize;

    // ...

    // Schritt 9: Iteriere über die Grade und zeichne Linien entsprechend der Sichtbarkeit
    for (let d = 0; d <= degree; d++) {
        const lines = koch_snowflake(d, s);
        const color = colors[d];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const geometry = new THREE.BufferGeometry();
            const vertices = [];

            // Schritt 10: Füge die sichtbaren Linienpunkte zur Geometrie hinzu
            if (params.lineVisibility.a.a) {
                vertices.push(line['a'][0], line['a'][1], 0);
            }
            if (params.lineVisibility.b.b) {
                vertices.push(line['b'][0], line['b'][1], 0);
            }
            if (params.lineVisibility.c.c) {
                vertices.push(line['c'][0], line['c'][1], 0);
            }
            if (params.lineVisibility.d.d) {
                vertices.push(line['d'][0], line['d'][1], 0);
            }
            if (params.lineVisibility.e.e) {
                vertices.push(line['e'][0], line['e'][1], 0);
            }

            // ...
        }
    }
}

// ...


*/