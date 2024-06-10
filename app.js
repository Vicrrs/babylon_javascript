import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, AssetsManager, MeshBuilder, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';
import * as GUI from '@babylonjs/gui';

// Obter o canvas e criar o engine
const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

function createScene() {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 10, new Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);

    // Definir limites para a rotação da câmera
    camera.lowerBetaLimit = Math.PI / 4;  // Limite inferior
    camera.upperBetaLimit = Math.PI / 2;  // Limite superior

    // Definir limites para o zoom
    camera.lowerRadiusLimit = 2;  // Limite mínimo de zoom 
    camera.upperRadiusLimit = 20; // Limite máximo de zoom 

    // Luz hemisférica para iluminação geral
    new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);

    // Luz direcional para simular o sol
    const directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 0), scene);
    directionalLight.position = new Vector3(0, 10, 0);

    // Carregamento de assets
    const assetsManager = new AssetsManager(scene);
    const objTask = assetsManager.addMeshTask("obj task", "", "lamia-tafnes/", "meshs001.obj");

    objTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            mesh.position = new Vector3(0, 0, 0);
        });

        // Adicionar pontos de interesse dentro do objeto
        addPointOfInterest(scene, new Vector3(0, 1, 0), camera);  // Centro da sala
        addPointOfInterest(scene, new Vector3(1, 1, 0), camera);  // Posição 1
        addPointOfInterest(scene, new Vector3(-1, 1, 0), camera); // Posição 2
        addPointOfInterest(scene, new Vector3(0, 1, 1), camera);  // Posição 3
        addPointOfInterest(scene, new Vector3(0, 1, -1), camera); // Posição 4
    };

    objTask.onError = function (task, message, exception) {
        console.log('Erro ao carregar o modelo:', message, exception);
    };

    assetsManager.load();

    // Adicionar GUI
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const slider = new GUI.Slider();
    slider.minimum = 2;
    slider.maximum = 10;
    slider.value = camera.radius;
    slider.height = "20px";
    slider.width = "200px";
    slider.color = "white";
    slider.background = "gray";
    slider.onValueChangedObservable.add(function (value) {
        camera.radius = value;
    });

    advancedTexture.addControl(slider);
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    return scene;
}

function addPointOfInterest(scene, position, camera) {
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
    sphere.position = position;

    const material = new StandardMaterial("material", scene);
    material.diffuseColor = Color3.Red();
    sphere.material = material;

    sphere.actionManager = new ActionManager(scene);
    sphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
        camera.setTarget(position);
        camera.setPosition(new Vector3(position.x + 0.5, position.y + 0.5, position.z + 0.5));
    }));
}

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
