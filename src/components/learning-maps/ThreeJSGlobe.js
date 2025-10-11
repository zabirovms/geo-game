import React, { Component, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

class ThreeJSGlobe extends Component {
  constructor(props) {
    super(props);
    this.mountRef = React.createRef();
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.controls = null;
    this.animationId = null;
    this.globeGroup = null;
    this.globeColorMesh = null;
    this.globeStrokesMesh = null;
    this.globeSelectionOuterMesh = null;
    this.rayCaster = null;
    this.pointer = null;
    this.hoveredCountryIdx = 6;
    this.isTouchScreen = false;
    this.isHoverable = true;
    this.textureLoader = null;
    this.bBoxes = [];
    this.dataUris = [];
    this.svgCountries = [];
    this.svgMapDomEl = null;
    this.svgCountryDomEl = null;
    this.countryNameEl = null;
    
    this.params = {
      strokeColor: "#111111",
      defaultColor: "#9a9591",
      hoverColor: "#00C9A2",
      fogColor: "#e4e5e6",
      fogDistance: 2.6,
      strokeWidth: 2,
      hiResScalingFactor: 2,
      lowResScalingFactor: 0.7
    };

    this.svgViewBox = [2000, 1000];
    this.offsetY = -0.1;
  }

  componentDidMount() {
    this.initScene();
    this.createControls();
    this.loadWorldMapData();
    this.animate();
    
    window.addEventListener('resize', this.updateSize);
  }

  componentWillUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.updateSize);
  }

  loadWorldMapData = () => {
    // Create SVG data directly to avoid build issues
    const svgData = `
      <svg id="map" viewBox="0 0 2000 1000">
        <path d="M1383 261.6l1.5 1.8-2.9 0.8-2.4 1.1-5.9 0.8-5.3 1.3-2.4 2.8 1.9 2.7 1.4 3.2-2 2.7 0.8 2.5-0.9 2.3-5.2-0.2 3.1 4.2-3.1 1.7-1.4 3.8 1.1 3.9-1.8 1.8-2.1-0.6-4 0.9-0.2 1.7-4.1 0-2.3 3.7 0.8 5.4-6.6 2.7-3.9-0.6-0.9 1.4-3.4-0.8-5.3 1-9.6-3.3 3.9-5.8-1.1-4.1-4.3-1.1-1.2-4.1-2.7-5.1 1.6-3.5-2.5-1 0.5-4.7 0.6-8 5.9 2.5 3.9-0.9 0.4-2.9 4-0.9 2.6-2-0.2-5.1 4.2-1.3 0.3-2.2 2.9 1.7 1.6 0.2 3 0 4.3 1.4 1.8 0.7 3.4-2 2.1 1.2 0.9-2.9 3.2 0.1 0.6-0.9-0.2-2.6 1.7-2.2 3.3 1.4-0.1 2 1.7 0.3 0.9 5.4 2.7 2.1 1.5-1.4 2.2-0.6 2.5-2.9 3.8 0.5 5.4 0z" data-name="Afghanistan"/>
        <path d="M1088 228l0.4 1.2 1.4-0.6 1.2 1.7 1.3 0.7 0.6 2.3-0.5 2.2 1 2.7 2.3 1.5 0.1 1.7-1.7 0.9-0.1 2.1-2.2 3.1-0.9-0.4-0.2-1.4-3.1-2.2-0.7-3 0.1-4.4 0.5-1.9-0.9-1-0.5-2.1 1.9-3.1z" data-name="Albania"/>
        <path d="M1070.6 190.8l-0.3 0.8 0.7 2.1-0.2 2.6-2.8 0 1.1 1.4-1.3 4-0.9 1.1-4.4 0.1-2.4 1.5-4.2-0.5-7.3-1.7-1.3-2.1-4.9 1.1-0.5 1.2-3.1-0.9-2.6-0.2-2.3-1.2 0.7-1.5-0.2-1.1 1.4-0.3 2.7 1.7 0.6-1.7 4.4 0.3 3.5-1.1 2.4 0.2 1.7 1.3 0.4-1.1-1-4.1 1.7-0.8 1.6-2.9 3.8 2.1 2.6-2.6 1.7-0.5 4 1.9 2.3-0.3 2.4 1.2z" data-name="Austria"/>
        <path d="M1016.5 177.1l-0.4 4.2-1.3 0.2-0.4 3.5-4.4-2.9-2.5 0.5-3.5-2.9-2.4-2.5-2.2-0.1-0.8-2.2 3.9-1.2 3.6 0.5 4.5-1.3 3.1 2.7 2.8 1.5z" data-name="Belgium"/>
        <path d="M1132.6 221.6l-2.3 2.6-1.3 4.5 2.1 3.6-4.6-0.8-5 2 0.3 3.2-4.6 0.6-3.9-2.3-4 1.8-3.8-0.2-0.8-4.2-2.8-2.1 0.7-0.8-0.6-0.8 0.6-2 1.8-2-2.8-2.7-0.7-2.4 1.1-1.4 1.8 2.6 1.9-0.4 4 0.9 7.6 0.4 2.3-1.6 5.9-1.5 4 2.3 3.1 0.7z" data-name="Bulgaria"/>
        <path d="M1083 214.3l1.9-0.1-1.1 2.8 2.7 2.5-0.5 2.9-1.1 0.3-0.9 0.6-1.6 1.5-0.4 3.5-4.8-2.4-2.1-2.7-2.1-1.4-2.5-2.4-1.3-1.9-2.7-3 0.8-2.6 2 1.5 1-1.4 2.3-0.1 4.5 1.1 3.5-0.1 2.4 1.4z" data-name="Bosnia and Herzegovina"/>
        <path d="M1141.6 162.7l-3.9-0.2-0.8 0.6 1.5 2 2 4-4.1 0.3-1.3 1.4 0.3 3.1-2.1-0.6-4.3 0.3-1.5-1.5-1.7 1.1-1.9-0.9-3.9-0.1-5.7-1.5-4.9-0.5-3.8 0.2-2.4 1.6-2.3 0.3-0.5-2.8-1.9-2.8 2.8-1.3-0.4-2.4-1.7-2.3-0.6-2.7 4.7 0 4.8-2.3 0.5-3.4 3.6-2-1-2.7 2.7-1 4.6-2.3 5.3 1.5 0.9 1.5 2.4-0.7 4.8 1.4 1.1 2.9-0.7 1.6 3.8 4 2.1 1.1 0 1.1 3.4 1.1 1.7 1.6-1.6 1.3z" data-name="Belarus"/>
      </svg>
    `;
    
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
    this.svgMapDomEl = svgDoc.querySelector('#map');
    this.svgCountries = Array.from(this.svgMapDomEl.querySelectorAll('path'));
    
    // Create a temporary country SVG for individual country rendering
    this.svgCountryDomEl = document.createElement('svg');
    this.svgCountryDomEl.innerHTML = this.svgMapDomEl.innerHTML;
    
    this.prepareHiResTextures();
    this.prepareLowResTextures();
  };

  initScene = () => {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.mountRef.current, 
      alpha: true,
      antialias: true 
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(400, 400);

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(this.params.fogColor, 0, this.params.fogDistance);

    // Create camera
    this.camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, 0, 3);
    this.camera.position.z = 1.3;

    // Create globe group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // Create raycaster and pointer
    this.rayCaster = new THREE.Raycaster();
    this.rayCaster.far = 1.15;
    this.pointer = new THREE.Vector2(-1, -1);

    // Create texture loader
    this.textureLoader = new THREE.TextureLoader();

    // Create globe
    this.createGlobe();

    this.updateSize();
  };

  createGlobe = () => {
    const globeGeometry = new THREE.IcosahedronGeometry(1, 20);

    const globeColorMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: true,
      side: THREE.DoubleSide
    });

    const globeStrokeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      depthTest: false,
    });

    const outerSelectionColorMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide
    });

    this.globeColorMesh = new THREE.Mesh(globeGeometry, globeColorMaterial);
    this.globeStrokesMesh = new THREE.Mesh(globeGeometry, globeStrokeMaterial);
    this.globeSelectionOuterMesh = new THREE.Mesh(globeGeometry, outerSelectionColorMaterial);

    this.globeStrokesMesh.renderOrder = 2;

    this.globeGroup.add(this.globeStrokesMesh, this.globeSelectionOuterMesh, this.globeColorMesh);
  };

  createControls = () => {
    this.controls = new OrbitControls(this.camera, this.mountRef.current);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = 0.46 * Math.PI;
    this.controls.maxPolarAngle = 0.46 * Math.PI;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed *= 1.2;

    this.controls.addEventListener("start", () => {
      this.isHoverable = false;
      this.pointer = new THREE.Vector2(-1, -1);
      gsap.to(this.globeGroup.scale, {
        duration: 0.3,
        x: 0.9,
        y: 0.9,
        z: 0.9,
        ease: "power1.inOut"
      });
    });

    this.controls.addEventListener("end", () => {
      gsap.to(this.globeGroup.scale, {
        duration: 0.6,
        x: 1,
        y: 1,
        z: 1,
        ease: "back(1.7).out",
        onComplete: () => {
          this.isHoverable = true;
        }
      });
    });
  };

  setMapTexture = (material, URI) => {
    this.textureLoader.load(URI, (texture) => {
      texture.repeat.set(1, 1);
      material.map = texture;
      material.needsUpdate = true;
    });
  };

  prepareHiResTextures = () => {
    if (!this.svgMapDomEl || !this.svgCountries.length) return;

    let svgData;
    gsap.set(this.svgMapDomEl, {
      attr: {
        "viewBox": `0 ${this.offsetY * this.svgViewBox[1]} ${this.svgViewBox[0]} ${this.svgViewBox[1]}`,
        "stroke-width": this.params.strokeWidth,
        "stroke": this.params.strokeColor,
        "fill": this.params.defaultColor,
        "width": this.svgViewBox[0] * this.params.hiResScalingFactor,
        "height": this.svgViewBox[1] * this.params.hiResScalingFactor,
      }
    });

    svgData = new XMLSerializer().serializeToString(this.svgMapDomEl);
    const staticMapUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    this.setMapTexture(this.globeColorMesh.material, staticMapUri);

    gsap.set(this.svgMapDomEl, {
      attr: {
        "fill": "none",
        "stroke": this.params.strokeColor,
      }
    });

    svgData = new XMLSerializer().serializeToString(this.svgMapDomEl);
    const staticStrokeUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    this.setMapTexture(this.globeStrokesMesh.material, staticStrokeUri);
  };

  prepareLowResTextures = () => {
    if (!this.svgCountryDomEl || !this.svgCountries.length) return;

    gsap.set(this.svgCountryDomEl, {
      attr: {
        "viewBox": `0 ${this.offsetY * this.svgViewBox[1]} ${this.svgViewBox[0]} ${this.svgViewBox[1]}`,
        "stroke-width": this.params.strokeWidth,
        "stroke": this.params.strokeColor,
        "fill": this.params.hoverColor,
        "width": this.svgViewBox[0] * this.params.lowResScalingFactor,
        "height": this.svgViewBox[1] * this.params.lowResScalingFactor,
      }
    });

    this.svgCountries.forEach((path, idx) => {
      this.bBoxes[idx] = path.getBBox();
    });

    this.svgCountries.forEach((path, idx) => {
      this.svgCountryDomEl.innerHTML = "";
      this.svgCountryDomEl.appendChild(this.svgCountries[idx].cloneNode(true));
      const svgData = new XMLSerializer().serializeToString(this.svgCountryDomEl);
      this.dataUris[idx] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    });

    this.setMapTexture(this.globeSelectionOuterMesh.material, this.dataUris[this.hoveredCountryIdx]);
  };

  updateMap = (uv = { x: 0, y: 0 }) => {
    if (!this.svgMapDomEl || !this.svgCountries.length) return;

    const pointObj = this.svgMapDomEl.createSVGPoint();
    pointObj.x = uv.x * this.svgViewBox[0];
    pointObj.y = (1 + this.offsetY - uv.y) * this.svgViewBox[1];

    for (let i = 0; i < this.svgCountries.length; i++) {
      const boundingBox = this.bBoxes[i];
      if (
        pointObj.x > boundingBox.x &&
        pointObj.x < boundingBox.x + boundingBox.width &&
        pointObj.y > boundingBox.y &&
        pointObj.y < boundingBox.y + boundingBox.height
      ) {
        const isHovering = this.svgCountries[i].isPointInFill(pointObj);
        if (isHovering) {
          if (i !== this.hoveredCountryIdx) {
            this.hoveredCountryIdx = i;
            this.setMapTexture(this.globeSelectionOuterMesh.material, this.dataUris[this.hoveredCountryIdx]);
            break;
          }
        }
      }
    }
  };

  updateMousePosition = (eX, eY) => {
    const rect = this.mountRef.current.getBoundingClientRect();
    this.pointer.x = (eX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -((eY - rect.top) / rect.height) * 2 + 1;
  };

  handleMouseMove = (event) => {
    this.updateMousePosition(event.clientX, event.clientY);
  };

  handleClick = (event) => {
    this.updateMousePosition(event.clientX, event.clientY);
  };

  handleTouchStart = (event) => {
    this.isTouchScreen = true;
  };

  updateSize = () => {
    const side = Math.min(400, Math.min(window.innerWidth, window.innerHeight) - 50);
    if (this.renderer) {
      this.renderer.setSize(side, side);
    }
  };

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    if (this.controls) {
      this.controls.update();
    }

    if (this.isHoverable && this.globeStrokesMesh) {
      this.rayCaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.rayCaster.intersectObject(this.globeStrokesMesh);
      if (intersects.length) {
        this.updateMap(intersects[0].uv);
      }
    }

    if (this.isTouchScreen && this.isHoverable) {
      this.isHoverable = false;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  render() {
    return (
      <div>
        <h4 className="text-center mb-3">Interactive 3D Globe</h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <canvas
            ref={this.mountRef}
            onMouseMove={this.handleMouseMove}
            onClick={this.handleClick}
            onTouchStart={this.handleTouchStart}
            style={{
              cursor: 'pointer',
              width: '400px',
              height: '400px',
              display: 'block'
            }}
          />
        </div>
      </div>
    );
  }
}

export default ThreeJSGlobe;
