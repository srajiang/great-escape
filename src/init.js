import * as THREE from "three";
import { calculateScore, sample, triggerBullsEyeFx, toggleGameState, toggleAvatar } from './util';
import Platform from "./Platform";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// { game.gameActive, game.ActivePlatforms, game.InactivePlatforms, player, game.score, game.streak }

function init(game) {
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

  // -------- Create a plane

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
    mesh.receiveShadow = true;    
    mesh.position.set(platform.pos.x, platform.pos.y, platform.pos.z);
    scene.add(mesh);
    return mesh.id;
  }

  for (let i = 0; i < game.ActivePlatforms.items.length; i++ ) {
    let platform = game.ActivePlatforms.items[i];
    let platformId = addPlatformToScene( platform );
    game.ActivePlatforms.items[i].id = platformId;      //assigns unique id tying scene obj to the Game Object  
  }

  // -------------------------------------------------------------- PLAYER GROUP
  let playerGroup = new THREE.Group();  

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

       game.player.id = playerMesh.id;
       playerMesh.material.map = texture;
       playerMesh.material.depthTest = false;
       playerMesh.scale.multiplyScalar(0.0005);
       playerMesh.position.set(0,0,0);
       playerMesh.rotation.set(1.5708, 3.14159, 1);
       playerMesh.name = "player";
       playerGroup.add(playerMesh);
     },
     undefined,
     function(error) {
       console.log("error loading model", error);
     }
   );

  // ------------------------------------------------------ RENDER BULLSEYE RING
  let ringGeometry, ringMaterial, ringMesh, ringTexture, diffuse;
  ringGeometry = new THREE.PlaneGeometry( .5, .5 );
  diffuse = new THREE.TextureLoader().load("../dist/media/diffuse-map.png");
  ringTexture = new THREE.TextureLoader().load("../dist/media/landing-ring.png");
  ringMaterial = new THREE.MeshBasicMaterial({ map: diffuse, alphaMap: ringTexture, transparent:true });
  ringMesh = new THREE.Mesh( ringGeometry, ringMaterial );
  ringMesh.castShadow = false;
  ringMesh.rotation.set(1.5708, 3.14159, 1);
  ringMaterial.opacity = 0;
  playerGroup.add(ringMesh);

  // ------------------------------------------------- ADD PLAYER GROUP TO SCENE
  playerGroup.position.set(game.player.pos.x, 0.125, game.player.pos.z);
  scene.add(playerGroup);

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
  
  // -------------------------------------------------------------------- CAMERA
  // ---------- set the camera
  camera.position.set(-20, 20, -20);
  camera.rotation.set(
    -2.356194490192345,
    -0.6154797086703874,
    -2.6179938779914944)
  ;
 
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

    if (!game.gameActive && !game.player.active) {     // if player is inactive, break out of render loop
      toggleGameState(!game.player.active);
      document.getElementById('eaten').play()  // SOUND 
      toggleAvatar(false);
      return;
    }

    time *= 0.001; //convert time to seconds
    dt = time - prevTime; // get change over time
    prevTime = time;

    if (dt > 0.15) {
      dt = 0.15;  //limit in case update rate of > 1/5 of a second
    }

    if (game.player.moving === true) {    // until the spacebar is pressed the player is not moving
      if (game.player.pos.y < game.player.finalPos.y && game.gameActive) {  // player has dipped below the final y position calculated
        if (game.player.landedSafelyOn(game.ActivePlatforms.next())) {
          game.player.pos.y = .125; 
          game.player.moving = false;
  
          // console.log('landed safely', game.player.pos.x, game.player.pos.z);
          
          document.getElementById("bloop").play(); //SOUND
          updateStreak();  // update actions
          updateScore();
          addNextPlatform( game.ActivePlatforms.next().pos);
        } else {
          // console.log('didnt land safely');
          game.gameActive = false;
          setTimeout(() => {
            game.player.active = false;
          }, 500);
          clearTimeout();
        }            
      }
    }
    if (game.player.moving === true) {
      game.player.updatePos(dt);
      playerGroup.position.set(game.player.pos.x, game.player.pos.y, game.player.pos.z);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render); // kicks off the animation loop


  //-----------------------------------------------------------ACTION RENDER END
  //----------------------------------------------------------------------------

  function updateScore () {

    game.score = calculateScore(game.score, game.streak);
    document.getElementById('score').innerHTML = game.score;

  }

  function updateStreak () {
    let result = game.player.checkBullsEye(game.ActivePlatforms.next(), game.player);
    if (game.streak === 0 && result === 1) {
      triggerBullsEyeFx(ringMaterial);
      game.streak += 1;
    } else if (game.streak > 0 && result === 1) {
      game.streak += result;
    } else if (game.streak > 0 && result === 0) {
      game.streak = 0;
    }
  }


  // -------------------- sets the direction of the next platform + player
  function setNextPos( platform ) {  
 
    game.ActivePlatforms.next().pos = game.ActivePlatforms.curr().pos;
    let pC = game.ActivePlatforms.curr().pos;
    console.log('curr', pC)
    let minDistance = platform.W / 2 + game.ActivePlatforms.curr().W / 2;
    let newPosVal = (Math.random() * .6) + minDistance;
    game.player.dir = sample(['L', 'R']);

    switch ( game.player.dir ) { 
      case 'L':
        game.ActivePlatforms.next().pos.add(new THREE.Vector3(newPosVal, 0, 0));
        break; 
      case 'R':
        game.ActivePlatforms.next().pos.add(new THREE.Vector3(0, 0, newPosVal));
        break;
    }
    let pN = game.ActivePlatforms.next().pos;

    console.log('current platform', pC, 'next platform', pN);
    recenterCamera(pC, pN);    //resets the camera position
  }

  // ----------------------adds a new platform to the Game Object
  function addPlatformToGame() {
    game.ActivePlatforms.enQ(new Platform(true, new THREE.Vector3(0,0,0)));  // adds a new platform w/ default pos (0,0,0)
    let dequeuedRes = game.ActivePlatforms.deQ();
    game.InactivePlatforms.enQ(dequeuedRes);
  }

  // ---------------------adds new platform to the scene
  function addNextPlatform( ) {
    addPlatformToGame();
    setNextPos(game.ActivePlatforms.next());
    let newPlatformId = addPlatformToScene( game.ActivePlatforms.next() )
    game.ActivePlatforms.next().id = newPlatformId;

  }
  
  // --------------------recenter camera based on the current and next platforms
  let prevDeltaX = 0;
  let prevDeltaZ = 0;
  let prevDir = 'R';

  function recenterCamera() {

    let newCamPos = camera.position.clone();
  
    if ( game.player.dir === 'L' && prevDir === 'L') {

      let deltaX = (game.ActivePlatforms.next().pos.x - playerMesh.position.x) / 2;

      newCamPos.x += deltaX + prevDeltaX;
      prevDeltaX = deltaX;

    } else if (game.player.dir === 'R' && prevDir === 'R') {

      let deltaZ = (game.ActivePlatforms.next().pos.z - playerMesh.position.z ) / 2;

      newCamPos.z += deltaZ + prevDeltaZ;
      prevDeltaZ = deltaZ;
      
    } else if (game.player.dir === 'R' && prevDir === 'L') {

      let deltaZ = (game.ActivePlatforms.next().pos.z - playerMesh.position.z);
      let deltaX = prevDeltaX / 2;
      newCamPos.z += deltaZ;
      newCamPos.x += deltaX;

      prevDeltaZ = deltaZ / 2;
      prevDeltaX = deltaX;

      prevDir = game.player.dir;

    } else if (game.player.dir === 'L' && prevDir === 'R') {


      let deltaX = (game.ActivePlatforms.next().pos.x - playerMesh.position.x);
      let deltaZ = prevDeltaZ / 2;
      newCamPos.x += deltaX;
      newCamPos.z += deltaZ;
      

      prevDeltaX = deltaX / 2;
      prevDeltaZ = deltaZ;

      prevDir = game.player.dir;
 
    }
    // console.log("world pos before",camera.getWorldPosition());
    camera.position.copy(newCamPos);
    // console.log("world pos after",camera.getWorldPosition());
  }
}

export default init;