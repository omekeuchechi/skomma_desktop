import { AssetsManager } from '@babylonjs/core/Misc/assetsManager';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Scene } from '@babylonjs/core/scene';
import type { Texture } from '@babylonjs/core/Materials/Textures/texture';

export class AssetManager {
  private readonly manager: AssetsManager;
  private readonly meshes = new Map<string, Mesh>();
  private readonly textures = new Map<string, Texture>();
  private loading = false;

  constructor(scene: Scene) {
    this.manager = new AssetsManager(scene);
  }

  registerMesh(key: string, rootUrl: string, filename: string): void {
    const task = this.manager.addMeshTask(`load-mesh:${key}`, '', rootUrl, filename);
    task.onSuccess = (result) => {
      const mesh = result.loadedMeshes[0];
      if (mesh instanceof Mesh) this.meshes.set(key, mesh);
    };
  }

  registerTexture(key: string, url: string): void {
    const task = this.manager.addTextureTask(`load-texture:${key}`, url, false, true);
    task.onSuccess = (result) => {
      this.textures.set(key, result.texture);
    };
  }

  async loadAll(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    try {
      await new Promise<void>((resolve, reject) => {
        this.manager.onFinish = () => resolve();
        this.manager.onTaskError = (task) =>
          reject(new Error(task.errorObject.message ?? 'Asset load failed'));
        this.manager.load();
      });
    } finally {
      this.loading = false;
    }
  }

  getMesh(key: string): Mesh | undefined {
    return this.meshes.get(key);
  }

  getTexture(key: string): Texture | undefined {
    return this.textures.get(key);
  }

  dispose(): void {
    this.meshes.clear();
    this.textures.clear();
  }
}
