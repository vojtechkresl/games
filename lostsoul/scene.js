// Add your code here matching the playground format
const createScene = function () {

    const scene = new BABYLON.Scene(engine);  
    scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);

    const ambLight = new BABYLON.HemisphericLight("ambLight", new BABYLON.Vector3(0, 10, 0), scene);
    // ambLight.diffuse = new BABYLON.Color3(1, 1, 1);
	ambLight.specular = new BABYLON.Color3(1, 1, 1);
	ambLight.groundColor = new BABYLON.Color3(1, 1, 1);
    const dirLight = new BABYLON.DirectionalLight("dirlight", new BABYLON.Vector3(10, -20, -10), scene);
    // var lightx = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, 1), scene);

    const player = BABYLON.MeshBuilder.CreateSphere("player", { segments: 7, diameter: 0.2 }, scene);
    player.position.y = 1.1;
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:500, height:500, subdivisions:5}, scene);

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.01);
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMat; //Place the material property of the ground

    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.attachControl(canvas, true);
    // const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 25, 5), scene, player);
    // const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 10, -10), scene);
    const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-70), BABYLON.Tools.ToRadians(70), 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 50;
    camera.attachControl(canvas, true);    

    // shadows
    ground.receiveShadows = true;
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.addShadowCaster(player);
    
    var turret1 = null;
    var turret2 = null;
    var turret3 = null;
    var rover = null;

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "rover.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.position.x = 6;
        mesh0.position.z = 2;
        mesh0.scaling = new BABYLON.Vector3(2, 2, 2);
        shadowGenerator.addShadowCaster(mesh0);
        rover = mesh0;
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "turret_single.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh = newMeshes[0];
        mesh.position.x = 1;
        shadowGenerator.addShadowCaster(mesh);
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "my_turret_double.gltf", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh = newMeshes[0];
        // mesh.scaling = new BABYLON.Vector3(1, 1, 1);
        // mesh.position = new BABYLON.Vector3(0,0,0);
        shadowGenerator.addShadowCaster(mesh);
        turret1 = newMeshes[1];
        turret2 = newMeshes[2];
        turret3 = newMeshes[3];
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "hangar_largeB.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.scaling = new BABYLON.Vector3(2, 2, 2);
        mesh0.position.z = 8;
        shadowGenerator.addShadowCaster(mesh0);
    });

    debug_showAxis(3, scene);
    // const debug_light = BABYLON.MeshBuilder.CreateSphere("debug_light", { segments: 7, diameter: 0.2 }, scene);
    // debug_light.position = new BABYLON.Vector3(5, 4, 0);

    // dirLight.autoCalcShadowZBounds = true
    // dirLight.autoCalcShadowXBounds = true
    // dirLight.autoCalcShadowYBounds = true

    var time = 0;
    var reverse = false;
    scene.registerBeforeRender(function() {
        time += 0.01;
        if(rover && rover.position.x > 1){
            reverse = false;            
        };
        if(rover && rover.position.x < -1){
            reverse = true;            
        };
        if(reverse){
            if (rover)
                rover.position.z -= 0.05;
            // player.position.y -= 0.05;
        }else{
            if (rover)
                rover.position.z += 0.05;
            // player.position.y += 0.05;
        }

        // let turretHead = scene.getMeshByName("turret_double/turret");
        if (turret1) {
            turret1.addRotation(0, 0.01, 0);
            turret2.addRotation(0, 0.01, 0);
            turret3.addRotation(0, 0.01, 0);
        }

    });


    return scene;
};

var debug_showAxis = function (size, scene) {
    var makeTextPlane = function (text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size }, scene);
        var planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material = planeMaterial
        planeMaterial.backFaceCulling = false;
        planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        planeMaterial.diffuseTexture = dynamicTexture;
        return plane;
    };

    var axisX = BABYLON.MeshBuilder.CreateLines("axisX", {
        points: [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)]
    }
        , scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    var axisY = BABYLON.MeshBuilder.CreateLines("axisY", {
        points: [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ]
    }, scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    var axisZ = BABYLON.MeshBuilder.CreateLines("axisZ", {
        points: [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ]
    }, scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};