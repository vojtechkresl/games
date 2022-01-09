const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene =  () => {
    // Scene
    var scene = new BABYLON.Scene(engine);
	scene.clearColor = BABYLON.Color3.Black();

    // Ground, player and enemy
    var lightH = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    const skybox = CreateSkybox(scene);
    const gridground = CreateGridGround(scene);
    const physground = CreatePhysGround(scene);
    const player = CreatePlayer(scene);
    const enemy = CreateEnemy(scene);
	
    // Camera
    var camera = new BABYLON.ArcRotateCamera("camera1", - Math.PI / 3, 5 * Math.PI / 12, 2, new BABYLON.Vector3(0, .5, 0), scene);
    //var camera = new BABYLON.AnaglyphArcRotateCamera("camera1", - Math.PI / 3, 5 * Math.PI / 12, 2, new BABYLON.Vector3(0, .5, 0), 0.033, scene);
    camera.attachControl(canvas, true);
    //camera.parent = player;

    // Physics
	scene.enablePhysics();	
	player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0.1 }, scene);
	enemy.physicsImpostor = new BABYLON.PhysicsImpostor(enemy, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0.1 }, scene);
	physground.physicsImpostor = new BABYLON.PhysicsImpostor(physground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

    var max_player_speed = 1;
    var player_drive_degree = 0;
    var player_drive_speed = 0;

    if (window.Worker) {
        const myWorker1 = new Worker("custom-robot1.js");
        myWorker1.onmessage = function(e) {
            //console.log('Message received from worker:', e.data[0], e.data[1]);
            player_drive_degree = e.data[0]; // drive_degree
            player_drive_speed = e.data[1]; // drive_speed
            const dx = Math.cos(ToRad(player_drive_degree)) * player_drive_speed / 100;
            const dz = Math.sin(ToRad(player_drive_degree)) * player_drive_speed / 100;
            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(dx, 0, dz));
        }
    } 
    else {
        console.log('Your browser doesn\'t support web workers.')
    }

    // var d = 0.05;
	engine.runRenderLoop(function () {
		// camera.alpha += 0.009;
        // player.position.x += 0.02;
        // player.position.z += 0.01;
        // enemy.position.x += 0.01;
        // enemy.position.z += 0.02;
        // if (player.position.x < -3)
        //     d = -d;
        // else if (player.position.x > 3)
        //     d = -d;
        //UpdatePlayer(player, player_drive_degree, player_drive_speed);
	});	
		
    return scene;
};


const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});

// Player Update
function UpdatePlayer(player, deg, speed) {
    const dx = Math.cos(ToRad(deg)) * speed / 100;
    const dz = Math.sin(ToRad(deg)) * speed / 100 / 5;
    player.position.x += dx;
    player.position.z += dz;
}

const PI_180 = Math.PI / 180.0
function ToRad(deg) {
    return deg * PI_180;
}

// Helpers
//
function CreateSkybox(scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;	
}

function CreateGridGround(scene) {
    const gridMat = new BABYLON.GridMaterial("ground_material", scene);
    gridMat.mainColor = BABYLON.Color3.White();
    gridMat.lineColor = BABYLON.Color3.White();
    gridMat.gridRatio = 0.5;
    gridMat.majorUnitFrequency = 20;
    gridMat.minorUnitVisibility = 0.6
    gridMat.opacity = 0.7;
    const ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./heightmap01.png", 500, 500, 50, 0, 30, scene, false);
    ground.material = gridMat;
    return ground;
}

function CreatePhysGround(scene) {
    const ground = BABYLON.Mesh.CreateGround("physGround", 500, 500, 100, scene);
    const groundMat = new BABYLON.StandardMaterial("physGroundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.1, .1, .1);
    groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // groundMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    groundMat.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMat;
    ground.position.y = -0.01;
    return ground;
}

function CreatePlayer(scene) {
    const playerMat = new BABYLON.GridMaterial("ground_material", scene);
    //playerMat.mainColor = BABYLON.Color3.Yellow();
    playerMat.lineColor = BABYLON.Color3.Green();
    playerMat.gridRatio = 0.25;
    // playerMat.majorUnitFrequency = 10;
    playerMat.minorUnitVisibility = 0.8
    // playerMat.opacity = 0.9;
    const visionMat = new BABYLON.StandardMaterial("visionMat");
    visionMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    visionMat.specularColor = new BABYLON.Color3(0, 1, 0);
    visionMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
    visionMat.ambientColor = new BABYLON.Color3(0, 1, 0);
    const player = BABYLON.MeshBuilder.CreateSphere("player", {segments:9, diameterX: 1, diameterY: 1, diameterZ: 1});
    player.material = playerMat;
    const playerVision = BABYLON.MeshBuilder.CreateSphere("playerVision", {segments:9, diameterX: .1, diameterY: .1, diameterZ: .1});
    playerVision.material = visionMat;
    playerVision.parent = player;
    player.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);        
    player.position = new BABYLON.Vector3(0, 0.25, 0);
    playerVision.position = new BABYLON.Vector3(0, .2, -0.43);
    player.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
    //const startRotation = player.rotationQuaternion.clone();    
    return player;
}

function CreateEnemy(scene) {
    const enemyMat = new BABYLON.GridMaterial("ground_material", scene);
    // enemyMat.diffuseColor = new BABYLON.Color3(0.1, .2, .3);
    // enemyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // // enemyMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // enemyMat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    //enemyMat.mainColor = BABYLON.Color3.Yellow();
    enemyMat.lineColor = BABYLON.Color3.Red();
    enemyMat.gridRatio = 0.25;
    // enemyMat.majorUnitFrequency = 10;
    enemyMat.minorUnitVisibility = 0.8
    // enemyMat.opacity = 0.9;
    const enemyvisionMat = new BABYLON.StandardMaterial("enemyvisionMat");
    enemyvisionMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    enemyvisionMat.specularColor = new BABYLON.Color3(1, 0, 0);
    enemyvisionMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
    enemyvisionMat.ambientColor = new BABYLON.Color3(1, 0, 0);
    const enemy = BABYLON.MeshBuilder.CreateSphere("enemy", {segments:9, diameterX: 1, diameterY: 1, diameterZ: 1});
    enemy.material = enemyMat;
    const enemyVision = BABYLON.MeshBuilder.CreateSphere("playerVision", {segments:9, diameterX: .1, diameterY: .1, diameterZ: .1});
    enemyVision.material = enemyvisionMat;
    enemyVision.parent = enemy;
    enemy.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);        
    enemy.position = new BABYLON.Vector3(-3, 0.25, 0);
    enemyVision.position = new BABYLON.Vector3(0, .2, -0.43);
    enemy.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
    //const startRotation = player.rotationQuaternion.clone();    
    return enemy;
}
