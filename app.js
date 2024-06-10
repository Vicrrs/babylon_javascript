import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, AssetsManager } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';

const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

function createScene() {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Definir limites para a rotação da câmera
    camera.lowerBetaLimit = Math.PI / 4;  // Limite inferior
    camera.upperBetaLimit = Math.PI / 2;  // Limite superior

    // Definir limites para o zoom
    camera.lowerRadiusLimit = 2;  // Limite mínimo de zoom (ajuste conforme necessário)
    camera.upperRadiusLimit = 10; // Limite máximo de zoom (ajuste conforme necessário)

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
            mesh.position = new Vector3(0, 0, 0); // Ajuste conforme necessário
        });
    }

    objTask.onError = function (task, message, exception) {
        console.log('Erro ao carregar o modelo:', message, exception);
    }

    assetsManager.load();

    return scene;
}

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
