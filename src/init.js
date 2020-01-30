import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import Game from "./Game";
import { calculateScore, sample } from './util';
import Platform from "./Platform";

function init({ APlatforms, IPlatforms, player, score, streak}) {
  // --------------------------------------------------CANVAS / RENDERER / SCENE

  // ----------- set basic width and height
  const width = 600;
  const height = 1000;
  const aspect = width / height;
  const D = 1;
  const Y = -0.5;

  //  ---------- make a canvas and a renderer
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  renderer.setSize(width, height);

  // ---------- make an orthographic camera
  const camera = new THREE.OrthographicCamera(
    -D * aspect,
    D * aspect,
    D,
    -D,
    1,
    1000
  );

  // ---------- create a scene, the root of a form of scene graph
  const scene = new THREE.Scene();

  // --------------------------------------------------------------------- FLOOR

  // -------- Create a plane that receives shadows (but does not cast them)

  var planeGeometry = new THREE.PlaneBufferGeometry(2.5, 2.5, 200, 200);
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    opacity: 0.3
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.castShadow = false;
  plane.rotation.set(-1.545, 0, 0);
  plane.position.set(0, -0.09, 0);
  scene.add(plane);

  // ---------------------------------------------------------- RENDER PLATFORMS


  function addPlatformToScene(platform) {
    let geometry, material, mesh;
    geometry = new THREE.BoxGeometry(platform.W, platform.H, platform.D);
    material = new THREE.MeshPhongMaterial({
      color: platform.col,
      opacity: 0.75
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    mesh.position.set(platform.pos.x, platform.pos.y, platform.pos.z);
  }

  for (let platform of APlatforms.items) {
    addPlatformToScene( platform );
  }

  // ------------------------------------------------------------- RENDER PLAYER
  let playerGeometry, playerMaterial, playerMesh;

  playerGeometry = new THREE.CylinderGeometry(
    player.RT,
    player.RB,
    player.H,
    32
  );
  playerMaterial = new THREE.MeshLambertMaterial({ color: player.col });
  playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);

  playerMesh.castShadow = true;
  playerMesh.receiveShadow = false;
  scene.add(playerMesh);

  playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z);

  // -------------------------------------------------------------------- LIGHTS

  // ---------- create the lights
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-3, 4, -1.5);
  light.castShadow = true;
  scene.add(light);

  // --------------- Set up shadow properties for the light
  light.shadow.mapSize.width = 2048; // default
  light.shadow.mapSize.height = 2048; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  // -------------------------------------------------------------------- CAMERA
  // ---------- set the camera
  camera.position.set(-20, 20, -20);
  //camera.lookAt(scene.position);
  camera.rotation.set(
    -2.356194490192345,
    -0.6154797086703874,
    -2.6179938779914944);
  //  ------------------------------------------------------------------- ACTION

  let prevTime = 0;
  let dt;

  function render(time) {
    time *= 0.001; //convert time to seconds

    // --------------------- get the change over time
    dt = time - prevTime;
    prevTime = time;

    if (dt > 0.15) {
      //limit in case update rate of > 1/5 of a second
      dt = 0.15;
    }

    // -------------------- resets position each frame if player is moving
    if (player.moving === true) {

      if (player.pos.y < player.finalPos.y) {
        // ----- stops when player Y goes below initial y
        player.pos.y = player.finalPos.y;
        player.moving = false;

        // ----- for testing, print out next platform pos and player final pos
        // console.log("player is at", player.pos);
        // console.log("next platform is at", APlatforms.next().pos);

        // check delta
        if (player.landedSafelyOnNext(APlatforms.next())) {

              console.log('landed on next');

              addNextPlatform( APlatforms.next().pos );
              score = calculateScore(score, streak); 


          // if there is 1 item in the platforms Q 
              //Don't do anything because the person has moved on the same platform 
            

          console.log('score', score);
          // generate a new box (new next ) and change next -> curr


        } else if (player.landedSafelyOnCurr(APlatforms.curr())) {

          console.log('landed on curr')

        
        } else {
          console.log("did not land safely. sorry, you died :(");
        }

      } else {
        // console.log('player pos is', player.pos);
        player.updatePos(dt);
      }

      playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);


  // -------------------- sets the direction of the next platform + player
  function setNextPos( platform ) {  

    let minDistance = platform.W / 2 + APlatforms.curr().W / 2;
    let newPosVal = (Math.random() * .6) + minDistance;
    player.dir = sample(['L', 'R']);

    switch ( player.dir ) { 
      case 'L':
        return platform.pos.add(new THREE.Vector3(newPosVal, 0, 0));
      case 'R':
        return platform.pos.add(new THREE.Vector3(0, 0, newPosVal));
    }

  }



  function addPlatformToGame() {

    APlatforms.enQ(new Platform(true));  // adds a new platform w/ default pos (0,0,0)
    IPlatforms.enQ(APlatforms.deQ());

  }

  function addNextPlatform( prevNextPos ) {

    addPlatformToGame();
    setNextPos(APlatforms.next());

    console.log("active platforms", APlatforms.next());
    console.log('inactive platforms', APlatforms.curr());

    addPlatformToScene( APlatforms.next())
  } 

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