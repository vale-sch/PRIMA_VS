namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class ProtectionsStripes extends QuadNode {
        constructor(_name: string, _pos: fCore.Vector2, _scale: fCore.Vector2) {
            super("ProtectionStripe", new fCore.Vector2(_pos.x, _pos.y), new fCore.Vector2(_scale.x, _scale.y));
        }
    }
}

