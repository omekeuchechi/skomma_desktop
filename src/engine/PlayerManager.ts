import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export interface PlayerConfig {
  spawn?: Vector3;
  speed?: number;
  sprintMultiplier?: number;
}

const KEY_BINDINGS: Record<string, keyof PlayerInput> = {
  KeyW: 'forward',
  KeyA: 'left',
  KeyS: 'backward',
  KeyD: 'right',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
};

export class PlayerManager {
  readonly camera: UniversalCamera;
  private readonly scene: Scene;
  private readonly speed: number;
  private readonly sprintMultiplier: number;
  private readonly input: PlayerInput = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  };

  private readonly keyDown = (event: KeyboardEvent): void => {
    const binding = KEY_BINDINGS[event.code];
    if (binding) this.input[binding] = true;
  };

  private readonly keyUp = (event: KeyboardEvent): void => {
    const binding = KEY_BINDINGS[event.code];
    if (binding) this.input[binding] = false;
  };

  constructor(scene: Scene, config: PlayerConfig = {}) {
    this.scene = scene;
    this.speed = config.speed ?? 0.12;
    this.sprintMultiplier = config.sprintMultiplier ?? 2;

    this.camera = new UniversalCamera(
      'playerCamera',
      config.spawn ?? new Vector3(0, 1.7, 0),
      this.scene,
    );
    this.camera.setTarget(new Vector3(0, 1.7, 1));
    this.camera.minZ = 0.1;
    this.camera.attachControl(true);
  }

  attachInput(): void {
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
  }

  detachInput(): void {
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
  }

  update(deltaSeconds: number): void {
    const multiplier = this.input.sprint ? this.sprintMultiplier : 1;
    const step = this.speed * deltaSeconds * multiplier;

    const forward = this.camera.getDirection(new Vector3(0, 0, 1));
    const right = this.camera.getDirection(new Vector3(1, 0, 0));

    if (this.input.forward) this.camera.position.addInPlace(forward.scale(step));
    if (this.input.backward) this.camera.position.addInPlace(forward.scale(-step));
    if (this.input.right) this.camera.position.addInPlace(right.scale(step));
    if (this.input.left) this.camera.position.addInPlace(right.scale(-step));
  }

  get position(): Vector3 {
    return this.camera.position;
  }
}
