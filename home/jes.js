

import * as THREE from "https://cdn.skypack.dev/three@0.129.0";

class Stage {
    constructor() {
      this.renderParam = {
        width: window.innerWidth,
        height: window.innerHeight
      }
  
      this.cameraParam = {
        fov: 40,
        x: 0,
        y: 0,
        z: 1000
      }
  
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.geometry = null;
      this.material = null;
      this.mesh = null;
      this.isInitialized = false;
    }
  
    init() {
      this._setScene();
      this._setRender();
      this._setCamera();
      this._setLight();
  
      this.isInitialized = true;
    }
  
    _setScene() {
      this.scene = new THREE.Scene();
    }
  
    _setRender() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("webgl-canvas")
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(new THREE.Color(0xffffff));
      this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    }
  
    _setCamera() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      if (!this.isInitialized) {
        this.camera = new THREE.PerspectiveCamera(
          this.cameraParam.fov,
          this.renderParam.width / this.renderParam.height
        );
  
        this.camera.position.set(
          this.cameraParam.x,
          this.cameraParam.y,
          this.cameraParam.z
        );
      }
  
      this.camera.aspect = windowWidth / windowHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(windowWidth, windowHeight);
    }
  
    _setLight() {
      const ambientlight = new THREE.AmbientLight(0xffffff, 1);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
   
      directionalLight.position.set(1, 1, 1);
      this.scene.add(ambientlight);
      this.scene.add(directionalLight);
    }
  
    _render() {
      this.renderer.render(this.scene, this.camera);
    }
  
    onResize() {
      this._setCamera();
    }
  
    onRaf() {
      this._render();
    }
  }
  
  class Mesh {
    constructor(stage) {
      this.geometryParam = {
        radius: 300,
        widthSegments: 30,
        heightSegments: 30
      }
  
      this.stage = stage;
      this.mesh = null;
      this.clock = new THREE.Clock()
    }
  
    init() {
      this._setMesh();
    }
  
    _setMesh() {
      const geometry = new THREE.SphereGeometry(
        this.geometryParam.radius,
        this.geometryParam.widthSegments,
        this.geometryParam.heightSegments
      );
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#009f8c"),
        wireframe: true
      });
  
      this.mesh = new THREE.Mesh(geometry, material);
      this.stage.scene.add(this.mesh);
    }
  
    _render() {
      const elaspedTime = this.clock.getElapsedTime()
      this.mesh.rotation.x = elaspedTime * 0.5;
      this.mesh.rotation.y = elaspedTime * 0.5;
    }
  
    onRaf() {
      this._render();
    }
  }
  
  (() => {
    const stage = new Stage();
    const mesh = new Mesh(stage);
  
    stage.init();
    mesh.init();
  
    window.addEventListener("resize", () => {
      stage.onResize();
    });
  
    const _raf = () => {
      window.requestAnimationFrame(() => {
        stage.onRaf();
        mesh.onRaf();
  
        _raf();
      });
    };
  
    _raf();
  })();
  