// var createScene = function() {
//     var scene = new BABYLON.Scene(engine);

//     BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "box.babylon");

//     const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
//     camera.attachControl(canvas, true);
//     const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

//     return scene;
// };


// Add your code here matching the playground format
const createScene = function () {

    const scene = new BABYLON.Scene(engine);  

    BABYLON.MeshBuilder.CreateBox("box", {})

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    return scene;
};
