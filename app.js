import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, AssetsManager, MeshBuilder, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';
import * as GUI from '@babylonjs/gui';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';


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
        addPointOfInterest(scene, new Vector3(0, 0.3, 0), camera, "images/ponto1.png", "Descrição do ponto 1");  // Centro da sala
        addPointOfInterest(scene, new Vector3(1, 0.3, 0), camera, "images/ponto2.png", "Descrição do ponto 2");  // Posição 1
        addPointOfInterest(scene, new Vector3(-1, 0.3, 0), camera, "/home/vicrrs/LAMIA_projects/babylon_javascript/imgs/Lamia.jpg", "lamia"); // Posição 2
        addPointOfInterest(scene, new Vector3(0, 0.3, 0.5), camera, "images/ponto4.png", "Descrição do ponto 4");  // Posição 3
        addPointOfInterest(scene, new Vector3(0, 0.3, -0.5), camera, "/home/vicrrs/LAMIA_projects/babylon_javascript/imgs/LAMIA.png", "Descrição do ponto 5"); // Posição 4
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

function addPointOfInterest(scene, position, camera, imagePath, description) {
    const mesh = scene.getMeshByName("lamia_mesh"); // Nome do objeto mesh carregado

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
    sphere.position = position;

    const material = new StandardMaterial("material", scene);
    material.diffuseColor = Color3.Red();
    sphere.material = material;

    let clickedOnce = false;

    sphere.actionManager = new ActionManager(scene);
    sphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
        if (!clickedOnce) {
            // Primeira ação: mover a câmera para a área de interesse
            //const cameraPosition = new Vector3(position.x, position.y, position.z - 0.5); // Posição simulada em primeira pessoa
            const targetPosition = new Vector3(0, 0.3, 0); // Centro da sala
            const cameraPosition = new Vector3(position.x, 0.1, position.z); // Posição simulada em primeira pessoa
            camera.setTarget(position);
            camera.setPosition(cameraPosition);
            clickedOnce = true;
        } else {
            // Segunda ação: abrir a janela pop-up
            const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

            const rect1 = new GUI.Rectangle();
            rect1.width = "400px";
            rect1.height = "200px";
            rect1.cornerRadius = 20;
            rect1.color = "Orange";
            rect1.thickness = 4;
            rect1.background = "gray";
            advancedTexture.addControl(rect1);

            const image = new GUI.Image("image", imagePath);
            image.width = "100px";
            image.height = "100px";
            image.left = "-150px";
            rect1.addControl(image);

            const text = new GUI.TextBlock();
            text.text = description;
            text.color = "white";
            text.fontSize = 24;
            rect1.addControl(text);

            // Botão para fechar a janela
            const closeButton = GUI.Button.CreateSimpleButton("closeButton", "X");
            closeButton.width = "30px";
            closeButton.height = "30px";
            closeButton.color = "white";
            closeButton.background = "red";
            closeButton.onPointerUpObservable.add(function() {
                advancedTexture.removeControl(rect1);
            });
            rect1.addControl(closeButton);

            // Resetar a flag
            clickedOnce = false;
        }
    }));
}


const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
