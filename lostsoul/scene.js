// Add your code here matching the playground format
const createScene = function () {

    const scene = new BABYLON.Scene(engine);  
    scene.clearColor = new BABYLON.Color3(0.31, 0.48, 0.64);

    // const ambLight = new BABYLON.HemisphericLight("ambLight", new BABYLON.Vector3(0, 10, 0), scene);
    // ambLight.diffuse = new BABYLON.Color3(1, 1, 1);
	// ambLight.specular = new BABYLON.Color3(0, 1, 0);
	// ambLight.groundColor = new BABYLON.Color3(1, 1, 1);
    const dirLight = new BABYLON.DirectionalLight("dirlight", new BABYLON.Vector3(-1, -2, 1), scene);
    // dirLight.

    const player = BABYLON.MeshBuilder.CreateSphere("player", { segments: 7, diameter: 0.2 }, scene);
    player.position.y = 0.1;
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:20, height:10, subdivisions:5}, scene);

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 0.4, 0);
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMat; //Place the material property of the ground

    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.attachControl(canvas, true);
    // const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 25, 5), scene, player);
    // const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 10, -10), scene);
    const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(125), BABYLON.Tools.ToRadians(70), 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 50;
    camera.attachControl(canvas, true);    

    // BABYLON.SceneLoader.Append("./assets/", "alien.glb", scene, function (scene) {});
    // BABYLON.SceneLoader.Append("./assets/", "rover.glb", scene, function (scene) {});
    // BABYLON.SceneLoader.Append("./assets/", "alien.glb", scene, function (scene) {});
    // BABYLON.SceneLoader.Append("./assets/", "alien.glb", scene, function (scene) {});
    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "rover.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.position.x += 2;
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "alien.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.position.x += 1;
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "turret_double.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.position.x += 0;
    });
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "hangar_largeB.glb", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        let mesh0 = newMeshes[0];
        mesh0.position.x -= 3;
    });

    debug_showAxis(3, scene);
    // const debug_light = BABYLON.MeshBuilder.CreateSphere("debug_light", { segments: 7, diameter: 0.2 }, scene);
    // debug_light.position = new BABYLON.Vector3(5, 4, 0);

    BABYLON.register

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