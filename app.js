import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, AssetsManager } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';


const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

function createScene() {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    // Carregamento de assets
    const assetsManager = new AssetsManager(scene);
    const objTask = assetsManager.addMeshTask("obj task", "", "objs/", "mesh.obj");

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
