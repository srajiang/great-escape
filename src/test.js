import * as THREE from "three";

function test3DScene() {
  // ----------- set basic width and height
  const width = 600;
  const height = 1000;
  const aspect = width / height;
  const D = 1;

  //  ---------- make a canvas and a renderer
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.tpe = THREE.PCFSoftShadowMap;

  renderer.setSize(width, height)

  // ---------- make a perspective camera

  // const fov = 75;
  // const aspect = 2; // the canvas default
  // const near = 0.1;
  // const far = 5;
  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const camera = new THREE.OrthographicCamera(-D*aspect, D*aspect, D, -D, 1, 1000);

  // ---------- place camera at the origin
  // camera.position.z = 2;

  // ---------- create a scene, the root of a form of scene graph
  const scene = new THREE.Scene();  

  // ---------- define geometry of test box
  const boxWidth = .3;
  const boxHeight = .15;
  const boxDepth = .3;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // ---------- test box 2

  const boxWidth2 = 0.20;
  const boxHeight2 = 0.15;
  const boxDepth2 = 0.20;
  const geometry2 = new THREE.BoxGeometry(boxWidth2, boxHeight2, boxDepth2);

  // ---------- make a basic material for the test box
  const material = new THREE.MeshPhongMaterial({ color: 0xb847c9 });
  const material2 = new THREE.MeshPhongMaterial({ color: 0x67E0F0 });

  // ---------- combine or mesh the geometry (shape) and the material (how to draw, what color, texture etc)
  const cube = new THREE.Mesh(geometry, material);
  const cube2 = new THREE.Mesh(geometry2, material2);

  // ------------- Make cubes cast shadows
  cube.castShadow = true;
  cube.receiveShadow = false;
  cube2.castShadow = true;
  cube2.receiveShadow = false;

  // ---------- add two shiny new cube to the scene and then tell the renderer to render the object
  scene.add(cube);
  cube.position.set(-.3,-.5,0);
  scene.add(cube2);
  cube2.position.set(.3,-.5,0);

  //Create a plane that receives shadows (but does not cast them)
  var planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;
  // scene.add( plane );


  // ---------- create the lights
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  // light.position.set(-1, 2, 4);
  light.position.set(3, 4, 2);
  light.castShadow = true;
  scene.add(light);

  // --------------- Set up shadow properties for the light
  light.shadow.mapSize.width = 512;  // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500;     // default


  // ---------- set the camera
  camera.position.set(20, 20, 20);
  camera.lookAt(scene.position);

  console.log('about to render the scene')
  renderer.render(scene, camera);


  // ----------- make the objects spin!

  // function render(time) {
  //   time *= 0.001; //converts time to seconds

  //   cube.rotation.x = time;
  //   cube.rotation.y = time;

  //   renderer.render(scene, camera);

  //   requestAnimationFrame(render);
  // }

  // requestAnimationFrame(render);

}



export default test3DScene;