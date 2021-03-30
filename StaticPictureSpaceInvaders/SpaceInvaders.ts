
namespace StaticPictureSpaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);
    let node: fCore.Node = new fCore.Node("SpaceInvaders");
    let viewport: fCore.Viewport = new fCore.Viewport();
    let materialGreen: fCore.Material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 1)));
    let materialWhite: fCore.Material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
    let materialRed: fCore.Material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 0, 0, 1)));

    let translationX: number = 0;
    let translationY: number = 0;

    function init(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
       
        node.addComponent(new fCore.ComponentTransform());
        let mesh: fCore.Mesh = new fCore.MeshTorus("Torus");
        node.addComponent(new fCore.ComponentMesh(mesh));
        let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);        
        node.addComponent(cmpMaterial);
        node.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.2, 0.2, 0.2));
        node.getComponent(fCore.ComponentMesh).mtxPivot.translateY(-4);
    
        for (let i: number = 0; i < 4; i++) {
            translationX += 4;
            createProtection(translationX);
        }
        translationX = 0;
        for (let i: number = 0; i < 48; i++) {
            translationX += 2;
            if (i % 16 == 0) {
                translationX = 1.75;
                translationY -= 3;
            }
               
            createEnemies(translationX, translationY);
        }

        let lastEnemyNode: fCore.Node = new fCore.Node("lastEnemyNode");
        let pyramideEnemie: fCore.Mesh = new fCore.MeshPyramid("Pyramide");
        lastEnemyNode.addComponent(new fCore.ComponentMesh(pyramideEnemie));
        node.addChild(lastEnemyNode);
        let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialRed);
        lastEnemyNode.addComponent(cmpMaterialQuad);
        lastEnemyNode.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.25, 0.25, 0.25));
        lastEnemyNode.getComponent(fCore.ComponentMesh).mtxPivot.translateY(3.5);
        lastEnemyNode.getComponent(fCore.ComponentMesh).mtxPivot.rotateX(180);
       
        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
    }
    function createProtection(xTranslate: number): void {
        let protectionNode: fCore.Node = new fCore.Node("ProtectionNode");
        let quads: fCore.Mesh = new fCore.MeshQuad("Quads");
        protectionNode.addComponent(new fCore.ComponentMesh(quads));
        node.addChild(protectionNode);
        let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);
        protectionNode.addComponent(cmpMaterialQuad);
        protectionNode.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.2, 0.2, 0.2));
        protectionNode.getComponent(fCore.ComponentMesh).mtxPivot.translateY(-2);
        protectionNode.getComponent(fCore.ComponentMesh).mtxPivot.translateX(-10);
        protectionNode.getComponent(fCore.ComponentMesh).mtxPivot.translateX(xTranslate);
        
    }
    function createEnemies(xTranslate: number, yTranslate: number): void {
        let enemiesNode: fCore.Node = new fCore.Node("enemiesNode");
        let quads: fCore.Mesh = new fCore.MeshQuad("Quads");
        enemiesNode.addComponent(new fCore.ComponentMesh(quads));
        node.addChild(enemiesNode);
        let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialWhite);
        enemiesNode.addComponent(cmpMaterialQuad);
        enemiesNode.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.1, 0.1, 0.1));
        enemiesNode.getComponent(fCore.ComponentMesh).mtxPivot.translateY(8);
        enemiesNode.getComponent(fCore.ComponentMesh).mtxPivot.translateX(-17);
        enemiesNode.getComponent(fCore.ComponentMesh).mtxPivot.translateX(xTranslate);
        enemiesNode.getComponent(fCore.ComponentMesh).mtxPivot.translateY(yTranslate);
        }
    }
