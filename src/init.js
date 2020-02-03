import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { calculateScore, sample, checkBullsEye, toggleGameState, toggleAvatar } from './util';
import Platform from "./Platform";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

function init({ APlatforms, IPlatforms, player, score, streak }) {

  // --------------------------------------------------CANVAS / RENDERER / SCENE

  // ----------- set basic width and height
  const width = 450;
  const height = 800;
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
  // renderer.shadowMap.type = THREE.BasicShadowMap;

  renderer.setSize(width, height);

  // ---------- make an orthographic camera
  const camera = new THREE.OrthographicCamera(
    -D * aspect,
    D * aspect,
    D,
    -D,
    1,
    100
  );

  // ---------- create a scene, the root of a form of scene graph
  const scene = new THREE.Scene();

  // --------------------------------------------------------------------- FLOOR

  // -------- Create a plane that receives shadows (but does not cast them)

  var planeGeometry = new THREE.PlaneBufferGeometry(800, 800, 200, 200);
  var planeMaterial = new THREE.ShadowMaterial({
    
    opacity: 0.3
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.receiveShadow = true;
  plane.castShadow = false;
  plane.rotation.set(-1.545, 0, 0);
  plane.position.set(0, -0.09, 0);
  scene.add(plane);

  // ---------------------------------------------------------- RENDER PLATFORMS


  function addPlatformToScene(platform) {
    let geometry, material, mesh;
    geometry = new THREE.BoxGeometry(platform.W, platform.H, platform.D);
    geometry.computeBoundingSphere();
    material = new THREE.MeshPhongMaterial({
      color: platform.col,
      opacity: .9
    });
    mesh = new THREE.Mesh(geometry, material);
    // mesh.castShadow = true;
    mesh.receiveShadow = true;    

    scene.add(mesh);
    mesh.position.set(platform.pos.x, platform.pos.y, platform.pos.z);

    return mesh.id;
  }

  for (let i = 0; i < APlatforms.items.length; i++ ) {
    let platform = APlatforms.items[i];
    let platformId = addPlatformToScene( platform );
    APlatforms.items[i].id = platformId;      //assigns unique id tying scene obj to the Game Object  
  }

  // ------------------------------------------------------------- RENDER PLAYER
  let playerMesh;

   var loader = new FBXLoader();
   var TLoader = new THREE.TextureLoader();

   let texture = TLoader.load("../models/croissant/textures/Texture.jpg");

   loader.load(
     "../models/croissant/source/Croissant.fbx",
     function(fbx) {

       playerMesh = fbx.children[0];
       playerMesh.receiveShadow = true;
       playerMesh.castShadow = true;
       playerMesh.geometry.computeBoundingSphere();

       player.id = playerMesh.id;
       playerMesh.material.map = texture;
       playerMesh.material.depthTest = false;
       playerMesh.scale.multiplyScalar(0.0005);
       playerMesh.position.set(player.pos.x, .125, player.pos.z);
       playerMesh.rotation.set(1.5708, 3.14159, 1);
       playerMesh.name = "player";
       scene.add(playerMesh);

     },
     undefined,
     function(error) {
       console.log("error loading model", error);
     }
   );

  // --------- original test object cylinder
  // playerGeometry = new THREE.CylinderGeometry(
  //   player.RT,
  //   player.RB,
  //   player.H,
  //   32
  // );
  // playerMaterial = new THREE.MeshLambertMaterial({ color: player.col });
  // playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);

  // playerMesh.castShadow = true;
  // playerMesh.receiveShadow = false;
  // playerGeometry.computeBoundingSphere();
  // player.id = playerMesh.id;
  // playerMesh.name = "player";
  
  // scene.add(playerMesh);

  // playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z);

  // -------------------------------------------------------------------- LIGHTS

  // ---------- create the lights
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-3, 4, -1.5);
  light.castShadow = true;
  scene.add(light);

  const amblight = new THREE.AmbientLight(0x404040, .8); // soft white light
  scene.add(amblight); 

  // --------------- Set up shadow properties for the light
  light.shadow.mapSize.width = 2048; // default
  light.shadow.mapSize.height = 2048; // default
  light.shadow.camera.near = .05; // default
  light.shadow.camera.far = 10; // default
  // light.shadow.opacity = 0.1;
  
  

  // -------------------------------------------------------------------- CAMERA
  // ---------- set the camera
  camera.position.set(-20, 20, -20);
  // camera.position.set(-19.8, 20, -19.8); // test camera move
  //camera.lookAt(scene.position);

  camera.rotation.set(
    -2.356194490192345,
    -0.6154797086703874,
    -2.6179938779914944);
 
  // --------- set initial frustum
  let frustum = new THREE.Frustum();
  let cameraViewProjectionMatrix = new THREE.Matrix4();

  camera.updateMatrixWorld();
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

  frustum.setFromMatrix( cameraViewProjectionMatrix );


  //  -------------------------------------------------------ACTION RENDER START
  //  --------------------------------------------------------------------------

  let prevTime = 0;
  let dt;

  function render(time) {

    if (player.dead) {     // if player is dead, break out of render loop
      toggleGameState(true);
      document.getElementById('eaten').play()  // SOUND 

      toggleAvatar(player.dead);
    
      return;
    }

    time *= 0.001; //convert time to seconds

    // --------------------- get the change over time
    dt = time - prevTime;
    prevTime = time;

    if (dt > 0.15) {
      //limit in case update rate of > 1/5 of a second
      dt = 0.15;
    }

    // -------------------- resets position each frame if player is moving
    // if (player.moving === true) {

    //   if (player.pos.y < player.finalPos.y) {
    //     // ----- checks when player Y goes below initial y
    //     player.pos.y = player.finalPos.y;
    //     player.moving = false;

    //     // check delta
    //     if (player.landedSafelyOn(APlatforms.next())) {

    //       document.getElementById("bloop").play(); //SOUND

    //       // console.log('landed on next');
    //       updateStreak();

    //       // console.log('streak', streak);
    //       updateScore();
    //       addNextPlatform( APlatforms.next().pos );

    //       // console.log('score', score);


    //     // } else if (player.landedSafelyOn(APlatforms.curr())) {

    //     //   console.log('landed on curr')

    //     } else {
    //       player.moving = false;  
    //       player.dead = true;    
    //     }

    //   } else {
    //     player.updatePos(dt);
    //   }
    //   playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z);

    // }

    if (player.moving === true) {    // until the spacebar is pressed the player is not moving

      if (player.pos.y < player.finalPos.y) {  // ready to evaluate landing
        
        if (player.landedSafelyOn(APlatforms.next())) {
          
          player.pos.y = .125; 
          player.moving = false;
  
          // console.log('landed safely', player.pos.y);
          
          document.getElementById("bloop").play(); //SOUND
          
          updateStreak();  // update actions
          updateScore();
          addNextPlatform( APlatforms.next().pos );
          
        } else {
          // console.log('didnt land safely');

          setTimeout(() => {
            player.dead = true;
          }, 500);
          clearTimeout();
        }            
      }
    }

    if (player.moving === true) {
      // console.log('ABOUT TO UPDATE FROM LOOP');
      player.updatePos(dt);
      playerMesh.position.set(player.pos.x, player.pos.y, player.pos.z);
    
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render); // kicks off the animation loop


  //-----------------------------------------------------------ACTION RENDER END
  //----------------------------------------------------------------------------

  function updateScore () {

    score = calculateScore(score, streak);
    document.getElementById('score').innerHTML = score;

  }

  function updateStreak () {
    let result = checkBullsEye(APlatforms.next(), player);
    if (streak === 0 && result === 1) {
      streak += 1;
    } else if (streak > 0 && result === 1) {
      streak += result;
    } else if (streak > 0 && result === 0) {
      streak = 0;
    }
  }


  // -------------------- sets the direction of the next platform + player
  function setNextPos( platform ) {  
 
    APlatforms.next().pos = APlatforms.curr().pos;

    let pC = APlatforms.curr().pos;

    let minDistance = platform.W / 2 + APlatforms.curr().W / 2;
    let newPosVal = (Math.random() * .6) + minDistance;
    player.dir = sample(['L', 'R']);

    switch ( player.dir ) { 
      case 'L':
        APlatforms.next().pos.add(new THREE.Vector3(newPosVal, 0, 0));
        break; 
      case 'R':
        APlatforms.next().pos.add(new THREE.Vector3(0, 0, newPosVal));
        break;
    }
    let pN = APlatforms.next().pos;

    recenterCamera(pC, pN);    //resets the camera position
  }

  // ----------------------adds a new platform to the Game Object
  function addPlatformToGame() {


    APlatforms.enQ(new Platform(true, new THREE.Vector3(0,0,0)));  // adds a new platform w/ default pos (0,0,0)
    let dequeuedRes = APlatforms.deQ();
    IPlatforms.enQ(dequeuedRes);

  }

  // ---------------------adds new platform to the scene
  function addNextPlatform( ) {

    addPlatformToGame();
    setNextPos(APlatforms.next());
    
    let newPlatformId = addPlatformToScene( APlatforms.next() )
    APlatforms.next().id = newPlatformId;

  }
  
  // --------------------recenter camera based on the current and next platforms
  let prevDeltaX = 0;
  let prevDeltaZ = 0;
  let prevDir = 'R';

  const cameraPos = camera.position.clone();
  console.log(cameraPos);

  function recenterCamera() {

    let newCamPos = camera.position.clone();
  
    if ( player.dir === 'L' && prevDir === 'L') {

      let deltaX = (APlatforms.next().pos.x - playerMesh.position.x) / 2;

      newCamPos.x += deltaX + prevDeltaX;
      prevDeltaX = deltaX;

    } else if (player.dir === 'R' && prevDir === 'R') {

      let deltaZ = (APlatforms.next().pos.z - playerMesh.position.z ) / 2;

      newCamPos.z += deltaZ + prevDeltaZ;
      prevDeltaZ = deltaZ;
      
    } else if (player.dir === 'R' && prevDir === 'L') {

      let deltaZ = (APlatforms.next().pos.z - playerMesh.position.z);
      let deltaX = prevDeltaX / 2;
      newCamPos.z += deltaZ;
      newCamPos.x += deltaX;

      prevDeltaZ = deltaZ / 2;
      prevDeltaX = deltaX;

      prevDir = player.dir;

    } else if (player.dir === 'L' && prevDir === 'R') {


      let deltaX = (APlatforms.next().pos.x - playerMesh.position.x);
      let deltaZ = prevDeltaZ / 2;
      newCamPos.x += deltaX;
      newCamPos.z += deltaZ;
      

      prevDeltaX = deltaX / 2;
      prevDeltaZ = deltaZ;

      prevDir = player.dir;
 
    }
    // console.log("world pos before",camera.getWorldPosition());
    camera.position.copy(newCamPos);
    // console.log("world pos after",camera.getWorldPosition());

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