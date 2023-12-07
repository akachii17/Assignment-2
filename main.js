//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PAREMETERS
 
//-- SCENE VARIABLES
var gui;
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

const parameters = {
  mainarms: 6,
  shards: 2,
}

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the geometrie
var nodes = [];
var edges = [];
var angleMultiplier = 30;
var arms = parameters.mainarms;
var sha = parameters.shards;
 

function main(){
  //GUI
  gui = new GUI;
  
  gui.add(parameters, `mainarms`, 0, 20, 1);
  gui.add(parameters, `shards`, 0, 10);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 100);
  camera.position.set(10, 10, 10)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION

  //Testing the Node Class
 
  var location = new THREE.Vector3(0,0,0);
  generateTree(location, sha, arms, null);


  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------

//RECURSIVE TREE GENERATION
function generateTree(position, sha, parentAngle, parent){
  var node = new TreeNode(position, sha, parentAngle, parent);
  nodes.push(node);

  if (parent){
    var edge = new Edge(parent.position, node.position);
    edges.push(edge);
  }

  if (sha > 0){
    node.createChildren();
    for(var i=0; i<node.children.length; i++){
      var child = node.children[i];
      generateTree(child.position, child.sha, child.mainarms, node);
    }
  }
}

console.log(edges, nodes);

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

//RANDOM INTEGER IN A RANGE
function getRndInteger(min, max){
  return Math.floor(Math.random() * (max-min+1)) + min;
}

// Remove 3D Objects and clean the caches
function removeObject(nodes) {
  if (!(nodes instanceof THREE.Object3D)) return;

  // Remove the geometry to free GPU resources
  if (nodes.geometry) nodes.geometry.dispose();

  // Remove the material to free GPU resources
  if (nodes.material) {
    if (nodes.material instanceof Array) {
      nodes.material.forEach((material) => material.dispose());
    } else {
      nodes.material.dispose();
    }
  }

  // Remove object from scene
  nodes.removeFromParent();
}

//Remove the cubes
function removeObjects(){
  arms = parameters.mainarms;
  level = parameters.shards;


  nodes.forEach(element =>{
    let scene_objects = scene.getObjectByName(element.name);
    removeObject(scene_objects);
    console.log(scene_objects);
  })

  edges.forEach(element =>{
    let scene_objects = scene.getObjectByName(element.name);
    removeObject(scene_objects);
    console.log(scene_objects);
  })

  nodes = [];
  edges = [];

  
}

//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
 // control.update();

 if(arms != parameters.mainarms){
  removeObjects()
  var location = new THREE.Vector3(0,0,0);
  generateTree(location, sha, arms, null);

 }

 /*
// Re draw scene when changing dat.gui parameters

function reDrawScene() {

  cylgeometry = new THREE.Geometry();
  snowflake = [];
  pivotParent = new THREE.Object3D();
  snowflakeObj = new THREE.Object3D();
  snowflakeObjCopy = new THREE.Object3D();
  
  for (let i = scene.children.length - 1; i >= 0; i--) {
  
  obj = scene.children[i];
  scene.remove(obj);
  }
  
  createLights();
  createSnowflakeScene();
  
  addSnowflakeMiddle();
  calculateSnowflakeMainArms();
  drawSnowflakeTemplate();
  
  // add pivot parent to scene
  scene.add(pivotParent);
  
  // draw sublines
  calculateSublines();
  }
*/

	renderer.render( scene, camera );
}
//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------
class TreeNode{
  constructor(position, sha, parentAngle, parent){
    this.position = position;
    this.sha = sha;
    this.parentAngle = parentAngle * (Math.PI/180);
    this.parentDirection = new THREE.Vector3(0,1,0);
    this.parent = parent;
    this.children = [];

/*
// calculate points from center of circle to edge
// given number of segments

function calculateSnowflakeMainArms() {

  // get geometry for snowflake template
  for (let i = 0; i < segmentCount; i++) {
  
  // segement size
  let theta = i / segmentCount * Math.PI * 2;
  
  // line drawing
  cylgeometry.vertices.push(
  new THREE.Vector3(
  0,
  Math.cos(theta) * radius,
  Math.sin(theta) * radius));
  
  
  
  // start point is always central to screen
  let start = new THREE.Vector3(0, 0, 0);
  
  // end is a segment point from edge of circle
  let end =
  new THREE.Vector3(
  0,
  Math.cos(theta) * radius,
  Math.sin(theta) * radius);
  
  
  //define end point for copy
  let rotatedEnd =
  new THREE.Vector3(
  0,
  Math.cos(theta) * radius,
  Math.sin(theta) * radius);
  
  
  // rotate vector around axis to find new co-ordinate
  let axis = new THREE.Vector3(1, 0, 0);
  let angle = Math.PI / segmentCount;
  
  //apply rotation
  rotatedEnd.applyAxisAngle(axis, angle);
  
  // push lines to obj
  snowflake.push({ "start": start, "end": end });
  snowflakeCopy.push({ "start": start, "end": rotatedEnd });
  }
  
  snowflakeMainArmsGeometry();
  calculateSnowflakeConstraints();
  }
  
  // work out snowflake main arms geometry

  function snowflakeMainArmsGeometry() {
  
  // draw lines for snowflake
  for (let i = 0; i < snowflake.length; i++) {
  
  //temp vars
  let start, end;
  let geo = new THREE.Geometry();
  let line;
  
  // define start and end co-ordinates
  start = snowflake[i].start;
  end = snowflake[i].end;
  
  // angle of line in degrees
  let angleDeg = Math.atan2(end.y - start.y, end.z - start.z) * 180 / Math.PI;
  angleDeg = Math.round(angleDeg);
  
  // push to snowflake
  snowflake[i].angle = angleDeg;
  
  // push to geometry
  geo.vertices.push(start);
  geo.vertices.push(end);
  
  //new line
  line = new THREE.Line(geo, snowflakeLineMat);
  line2 = new THREE.Line(geo, snowflakeIntersectionLineMat); // visual only
  
  // add line to obj
  snowflakeObj.add(line);
  snowflakeObjCopy.add(line2); // visual only
  }
  }
*/  

  //Calculate the angle based on the parent's angle
  this.mainarms = this.parentAngle + getRndInteger(0-angleMultiplier/2, angleMultiplier/2) * (Math.PI/180);

  this.length = this.sha === 0 ? 2:Math.random() * 2 + 1;

  //Create the shape for the node
  var nodeGeometry = new THREE.SphereGeometry(0.1, 10, 10);
  var material = new THREE.MeshBasicMaterial({color:0x00ff00});
  this.nodeMesh = new THREE.Mesh(nodeGeometry, material);
  this.nodeMesh.position.copy(this.position);

  //Add the node to the scene
  scene.add(this.nodeMesh);

  //Create an edge (branch)connecting to the parent if it exist
  if (parent){
    var edge = new Edge(parent.position, this.position);
    this.edgeMesh = edge.mesh;
    scene.add(this.edgeMesh);
  }
}

createChildren(){
  for(var i=0; i<6; i++){
    var childPosition = new THREE.Vector3().copy(this.position);

    let axisZ = new THREE.Vector3(0,0,1);
    let axisY = new THREE.Vector3(0,1,0);

    this.parentDirection.applyAxisAngle(axisZ, this.mainarms);
    this.parentDirection.applyAxisAngle(axisY, this.mainarms);

    childPosition.x += this.parentDirection.x * this.length;
    childPosition.y += this.parentDirection.y * this.length;
    childPosition.z += this.parentDirection.z * this.length;

    var child = new TreeNode(childPosition, this.sha-1, this.mainarms, this)

    this.children.push(child);
    
  }
}
}

class Edge{
constructor(start, end){
  this.start = start;
  this.end = end;

  const points = [];
  points.push(this.start);
  points.push(this.end);

  var edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);

  var material = new THREE.MeshBasicMaterial({color:0x00ff00});

  this.mesh = new THREE.Line(edgeGeometry, material);
}
}

//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();

