import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, AssetsManager, MeshBuilder, StandardMaterial, Color3, ActionManager, ExecuteCodeAction, GlowLayer, HighlightLayer } from '@babylonjs/core';
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

    // Efeito de brilho
    const glowLayer = new GlowLayer("glow", scene);
    const highlightLayer = new HighlightLayer("highlight", scene);

    // Carregamento de assets
    const assetsManager = new AssetsManager(scene);
    const objTask = assetsManager.addMeshTask("obj task", "", "lamia-tafnes/", "meshs001.obj");

    objTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            mesh.position = new Vector3(0, 0, 0);
        });

        // Adicionar pontos de interesse dentro do objeto
        addPointOfInterest(scene, new Vector3(0, 0.3, 0), camera, "images/ponto1.png", "Descrição do ponto 1", new Vector3(0, 0.3, 0), new Vector3(2, 1, 2));  // Centro da sala
        addPointOfInterest(scene, new Vector3(1, 0.3, 0), camera, "images/ponto2.png", "Descrição do ponto 2", new Vector3(1, 0., 0), new Vector3(3, 1, 3));  // Posição 1
        addPointOfInterest(scene, new Vector3(-1, 0.3, 0), camera, "/home/vicrrs/LAMIA_projects/babylon_javascript/imgs/Lamia.jpg", "lamia", new Vector3(-1, 0.3, 0), new Vector3(3, 1, -3)); // Posição 2
        addPointOfInterest(scene, new Vector3(0, 0.3, 0.5), camera, "images/ponto4.png", "Descrição do ponto 4", new Vector3(0, 0.3, 0.5), new Vector3(3, 1, 0.5));  // Posição 3
        addPointOfInterest(scene, new Vector3(0, 0.3, -0.5), camera, "/home/vicrrs/LAMIA_projects/babylon_javascript/imgs/LAMIA.png", "Descrição do ponto 5", new Vector3(0, 0.3, -0.5), new Vector3(3, 1, -0.5)); // Posição 4
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

    // Adicionar botões de controle de câmera
    addCameraControls(scene, camera, advancedTexture);

    // Adicionar minimapa
    addMiniMap(scene);

    return scene;
}

function addCameraControls(scene, camera, advancedTexture) {
    const buttonWidth = "150px";
    const buttonHeight = "50px";

    // Botão de órbita
    const orbitButton = GUI.Button.CreateSimpleButton("orbitButton", "Órbita");
    orbitButton.width = buttonWidth;
    orbitButton.height = buttonHeight;
    orbitButton.color = "white";
    orbitButton.background = "blue";
    orbitButton.onPointerUpObservable.add(function() {
        // Função para habilitar órbita
        camera.attachControl(canvas, true);
    });
    advancedTexture.addControl(orbitButton);
    orbitButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    orbitButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    orbitButton.top = "20px";

    // Botão de zoom
    const zoomButton = GUI.Button.CreateSimpleButton("zoomButton", "Zoom");
    zoomButton.width = buttonWidth;
    zoomButton.height = buttonHeight;
    zoomButton.color = "white";
    zoomButton.background = "green";
    zoomButton.onPointerUpObservable.add(function() {
        // Função para habilitar zoom
        camera.attachControl(canvas, true);
    });
    advancedTexture.addControl(zoomButton);
    zoomButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    zoomButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    zoomButton.top = "80px";

    // Botão de pan
    const panButton = GUI.Button.CreateSimpleButton("panButton", "Pan");
    panButton.width = buttonWidth;
    panButton.height = buttonHeight;
    panButton.color = "white";
    panButton.background = "red";
    panButton.onPointerUpObservable.add(function() {
        // Função para habilitar pan
        camera.attachControl(canvas, true);
    });
    advancedTexture.addControl(panButton);
    panButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panButton.top = "140px";
}

function addPointOfInterest(scene, position, camera, imagePath, description, targetPosition, cameraPosition) {
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
            camera.setTarget(targetPosition);
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

function addMiniMap(scene) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("minimapUI");

    const minimap = new GUI.Image("minimap", "https://www.babylonjs.com/assets/pirate.jpg");
    minimap.width = "200px";
    minimap.height = "200px";
    minimap.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    minimap.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(minimap);

    scene.registerAfterRender(function () {
        // Atualizar minimapa com a posição atual da câmera
        const camera = scene.activeCamera;
        if (camera) {
            const context = advancedTexture.getContext();
            context.clearRect(0, 0, advancedTexture.getSize().width, advancedTexture.getSize().height);
            context.beginPath();
            context.arc(camera.position.x * 10 + 100, camera.position.z * 10 + 100, 5, 0, 2 * Math.PI);
            context.fillStyle = "red";
            context.fill();
        }
    });
}

// Criar e executar a cena
const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});

// Redimensionar
window.addEventListener('resize', function () {
    engine.resize();
});
