import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import Game from "./Game";
import { calculateScore, sample, checkBullsEye } from './util';
import Platform from "./Platform";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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

  // ------------------------------------------------- ADD LOADER + IMPORT MODEL

  // var loader = new GLTFLoader();
  // var TLoader = new THREE.TextureLoader();
  // var CMaterial; 

  // TLoader.load("../models/textures/croissant-texture.jpeg", (texture) => {
  //   CMaterial = new THREE.MeshBasicMaterial({
  //     map: texture
  //   });
    
  //   console.log("material", CMaterial);
  //     loader.load( '../models/scene.gltf', function( gltf ) {

  //       console.log('gltf', gltf);

  //       // let mesh = gltf.scene;

  //       // console.log('3d scene', mesh);

  //       // mesh.material = CMaterial;
  //       // mesh.geometry = new THREE.CylinderGeometry(.5, .5, .5);
  //       // mesh.position.set(0,0,0);
  //       // mesh.castShadow = true;
  //       scene.add(gltf.scene);
  //       console.log(scene);

  //     }, undefined, function( error) {
  //       console.log('error loading model', error);
  //   })



  // });

  var loader = new FBXLoader();
  var TLoader = new THREE.TextureLoader();
  var CMaterial;

  TLoader.load(
    "../models/croissant/textures/internal_ground_ao_texture.jpeg",
    texture => {
      CMaterial = new THREE.MeshBasicMaterial({
        map: texture
      });

      console.log("material", CMaterial);
      loader.load(
        "../models/croissant/source/Croissant.fbx",
        function(fbx) {

          console.log("fbx", fbx);

          let mesh = fbx.children[0];
          mesh.scale.multiplyScalar(.0005);
          mesh.position.set(.5, .5, .5)
          scene.add(mesh);
          console.log(scene);
        },
        undefined,
        function(error) {
          console.log("error loading model", error);
        }
      );
    }
  );


  // --------------------------------------------------------------------- FLOOR

  // -------- Create a plane that receives shadows (but does not cast them)

  var planeGeometry = new THREE.PlaneBufferGeometry(400, 400, 200, 200);
  var planeMaterial = new THREE.ShadowMaterial({
    
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
    geometry.computeBoundingSphere();
    material = new THREE.MeshPhongMaterial({
      color: platform.col,
      opacity: 0.75
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
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
  playerGeometry.computeBoundingSphere();
  player.id = playerMesh.id;
  playerMesh.name = "player";
  
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
  // console.log('matrix world', camera.matrixWorld);
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  // console.log('matrix world inverse', camera.matrixWorldInverse);

  cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  // console.log('camera view projection matrix', cameraViewProjectionMatrix);

  frustum.setFromMatrix( cameraViewProjectionMatrix );


  //  -------------------------------------------------------ACTION RENDER START
  //  --------------------------------------------------------------------------

  let prevTime = 0;
  let dt;

  function render(time) {

    if (player.dead) {     // if player is dead, break out of render loop
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
    if (player.moving === true) {

      if (player.pos.y < player.finalPos.y) {
        // ----- stops when player Y goes below initial y
        player.pos.y = player.finalPos.y;
        player.moving = false;

        // check delta
        if (player.landedSafelyOn(APlatforms.next())) {

              console.log('landed on next');
              updateStreak();

              console.log('streak', streak);
              updateScore();
              addNextPlatform( APlatforms.next().pos );

          console.log('score', score);


        // } else if (player.landedSafelyOn(APlatforms.curr())) {

        //   console.log('landed on curr')

        } else {
          player.dead = true;
        }

      } else {
        player.updatePos(dt);
      }

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
  function recenterCamera() {

    let playerMesh = scene.getObjectByName("player", true);

    let newCamPos = camera.position.clone();

    if ( player.dir === 'L') {
      let deltaX = (APlatforms.next().pos.x - playerMesh.position.x);
      newCamPos.x += deltaX;
      console.log('dx',deltaX);
      
    } else {
      let deltaZ = (APlatforms.next().pos.z - playerMesh.position.z );
      newCamPos.z += deltaZ;
      console.log('dz', deltaZ);
    }

    camera.position.copy(newCamPos);






    // whats the pos of the curr, whats the pos of the next is outside of the camera frame

    // find the midpoint of that

    // center camera to move


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