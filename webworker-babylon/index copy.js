const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene =  () => {
    const scene = new BABYLON.Scene(engine);

    // camera
    //const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-6, 0, 0), scene);
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 150, new BABYLON.Vector3(0, 60, 0));	camera.radius = 4;
	camera.heightOffset = 4;
	camera.rotationOffset = 0;
	camera.cameraAcceleration = 0.005
	camera.maxCameraSpeed = 10
    camera.attachControl(canvas, true);

    // light
    // const  light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -3, 1), scene);
    // light.position = new BABYLON.Vector3(0, 7, -50);    
    // const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 5, 0));

    const walk = function (turn, dist) {
        this.turn = turn;
        this.dist = dist;
    }
    
    const track = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))


    const playerMat = new BABYLON.StandardMaterial("playerMat");
    playerMat.diffuseColor = new BABYLON.Color3(0.1, .2, .3);
    playerMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // playerMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    playerMat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    const visionMat = new BABYLON.StandardMaterial("visionMat");
    visionMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    visionMat.specularColor = new BABYLON.Color3(0, 1, 0);
    visionMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
    visionMat.ambientColor = new BABYLON.Color3(0, 1, 0);

    const player = BABYLON.MeshBuilder.CreateSphere("player", {segments:9, diameterX: 1, diameterY: 2, diameterZ: 1});
    player.material = playerMat;
    

    const playerVision = BABYLON.MeshBuilder.CreateSphere("playerVision", {segments:9, diameterX: .3, diameterY: .3, diameterZ: .3});
    playerVision.material = visionMat;
    playerVision.parent = player;
    
    player.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);        
    player.position = new BABYLON.Vector3(-6, 0.5, 0);
    playerVision.position = new BABYLON.Vector3(0, .45, -0.3);
    player.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
    const startRotation = player.rotationQuaternion.clone();    

    var gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.7;

    camera.lockedTarget = player;
    //scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
        player.movePOV(0, 0, step);
        distance += step;
            
        if (distance > track[p].dist) {
                
            player.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
            p +=1;
            p %= track.length; 
            if (p === 0) {
                distance = 0;
                player.position = new BABYLON.Vector3(-6, 0, 0);
                player.rotationQuaternion = startRotation.clone();
            }
        }
    })

    
    //Skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:100}, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./skybox/CloudyLightRays", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
    light.position = new BABYLON.Vector3(1, 7, -2);
    light.intensity = 0.7;
    
    // var generator = new BABYLON.ShadowGenerator(512, light);
    // generator.useBlurExponentialShadowMap = true;
    // generator.blurKernel = 32;
    // light.intensity = 0.7;

    // for (var i = 0; i < scene.meshes.length; i++) {
    //     generator.addShadowCaster(scene.meshes[i], false);
    //     scene.meshes[i].alwaysSelectAsActiveMesh = true;
    // }

    // var helper = scene.createDefaultEnvironment({
    //     cameraContrast: 1.5,
    //     cameraExposure: 1.66,
    //     toneMappingEnabled: true,

    //     groundShadowLevel: 0.8,

    //     groundOpacity: 0.7, 

    //     skyboxColor: new BABYLON.Color3(.060, .0777, .082),
    //     groundColor: new BABYLON.Color3(.07, .087, .0893)

    // });

    // BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");

	const mat = new BABYLON.StandardMaterial("");
	mat.diffuseTexture = new BABYLON.Texture("./CDN/Assets/Ground.jpg");
    mat.specularColor = new BABYLON.Color3(0,0,0);
	
	const pat = BABYLON.Mesh.FLIP_TILE;

	const options = {
		sideOrientation: BABYLON.Mesh.DOUBLESIDE,
		pattern: pat,
		width: 30,
		height: 30,
		tileSize: 5,
		tileWidth: 5
	}
	
	const ground = BABYLON.MeshBuilder.CreateTiledPlane("", options);
	//const ground = BABYLON.MeshBuilder.CreateGround("ground", options);
    ground.rotation.x = Math.PI / 2;
	ground.material = mat;

    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(512, light);    
    shadowGenerator.addShadowCaster(player, true);
    shadowGenerator.blurKernel = 32;
    ground.receiveShadows = true;
    
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