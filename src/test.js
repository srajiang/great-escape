import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import Game from "./Game";

function init({ platforms, player }) {

  // --------------------------------------------------CANVAS / RENDERER / SCENE
  
  // ----------- set basic width and height
  const width = 600;
  const height = 1000;
  const aspect = width / height;
  const D = 1;
  const Y = -.5;

  //  ---------- make a canvas and a renderer
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  
  renderer.setSize(width, height)

  // ---------- make an orthographic camera
  const camera = new THREE.OrthographicCamera(-D*aspect, D*aspect, D, -D, 1, 1000);

  // ---------- create a scene, the root of a form of scene graph
  const scene = new THREE.Scene();  


  // --------------------------------------------------------------------- FLOOR


  // -------- Create a plane that receives shadows (but does not cast them)

  var planeGeometry = new THREE.PlaneBufferGeometry( 1000, 1000, 100, 100 );
  var planeMaterial = new THREE.ShadowMaterial()
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;
  plane.castShadow = false;
  plane.rotation.set(-1.5,0,0);
  plane.position.set(0,-.575,0);
  scene.add( plane );

  // ---------------------------------------------------------- RENDER PLATFORMS

  let geometry, material, mesh; 

  for (let platform of platforms) {

    geometry = new THREE.BoxGeometry(platform.W, platform.H, platform.D);
    material = new THREE.MeshPhongMaterial({ color: platform.col });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    scene.add(mesh);
    mesh.position.set(platform.X, platform.Y, platform.Z)

  }

  // ------------------------------------------------------------- RENDER PLAYER

  let playerGeometry, playerMaterial, playerMesh; 

  playerGeometry = new THREE.CylinderGeometry(player.RT, player.RB, player.H, 32);
  playerMaterial = new THREE.MeshLambertMaterial({ color: player.col });
  playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);

  playerMesh.castShadow = true;
  playerMesh.receiveShadow = false;
  scene.add(playerMesh);

  playerMesh.position.set(player.X, player.Y, player.Z);


  // -------------------------------------------------------------------- LIGHTS

  // ---------- create the lights
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-3, 4, -1.5);
  // light.castShadow = true;
  scene.add(light);

  // --------------- Set up shadow properties for the light
  light.shadow.mapSize.width = 2048;  // default
  light.shadow.mapSize.height = 2048; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500;     // default


  // -------------------------------------------------------------------- CAMERA  
  // ---------- set the camera
  camera.position.set(-20, 20, -20);
  camera.lookAt(scene.position);


  //  ------------------------------------------------------------------- ACTION
  renderer.render(scene, camera);



  // ----------------------------------------------------------- POST PROCESSING
  // var composer = new EffectComposer(renderer);
  // composer.addPass(new RenderPass(scene, camera));
  // var pass = new SMAAPass(
  //   window.innerWidth * renderer.getPixelRatio(),
  //   window.innerHeight * renderer.getPixelRatio()
  // );
  // composer.addPass(pass);


  // ----------- make the objects spin!

  // function render(time) {
  //   time *= 0.001; //converts time to seconds

  //   cube.rotation.x = time;
  //   cube.rotation.y = time;
  //   cube2.rotation.x = time;
  //   cube2.rotation.y = time;

  //   renderer.render(scene, camera);

  //   requestAnimationFrame(render);
  // }

  // requestAnimationFrame(render);

}



export default init;