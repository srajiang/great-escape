import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import Game from "./Game";

function init({ APlatforms, player }) {

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

  var planeGeometry = new THREE.PlaneBufferGeometry( 1.3, 1.3, 200, 200 );
  var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, opacity: .5 });
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;
  plane.castShadow = false;
  plane.rotation.set(-1.545,0,0);
  plane.position.set(0,-.09,0);
  scene.add( plane );

  // ---------------------------------------------------------- RENDER PLATFORMS

  let geometry, material, mesh; 

  for (let platform of APlatforms) {

    geometry = new THREE.BoxGeometry(platform.W, platform.H, platform.D);
    material = new THREE.MeshPhongMaterial({ color: platform.col, opacity: .75 });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
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

  playerMesh.position.set(
    player.pos.x,
    player.pos.y,
    player.pos.z
  );


  // -------------------------------------------------------------------- LIGHTS

  // ---------- create the lights
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-3, 4, -1.5);
  light.castShadow = true;
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

  let prevTime = 0;
  let dt;

  function render(time) {

    time *= 0.001; //convert time to seconds

    // --------------------- get the change over time
    dt = time - prevTime;
    prevTime = time;

    if (dt > .15) {  //limit in case update rate of > 1/5 of a second
      dt = .15;
    }

    // -------------------- resets position each frame if player is moving
    if (player.moving === true) {

      if (player.pos.y < player.finalPos.y) {   // ----- stops when player Y goes below initial y
        player.pos.y = player.finalPos.y;
        player.moving = false;
      } else {
        player.updatePos(dt);
      }


      playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z); 
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
    requestAnimationFrame(render);

}


  // ----------------------------------------------------------- POST PROCESSING
  // var composer = new EffectComposer(renderer);
  // composer.addPass(new RenderPass(scene, camera));
  // var pass = new SMAAPass(
  //   window.innerWidth * renderer.getPixelRatio(),
  //   window.innerHeight * renderer.getPixelRatio()
  // );
  // composer.addPass(pass);



export default init;