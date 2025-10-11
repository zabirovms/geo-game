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
    // Load the SVG world map data
    fetch('/world-map.svg')
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        this.svgMapDomEl = svgDoc.querySelector('#map');
        this.svgCountries = Array.from(this.svgMapDomEl.querySelectorAll('path'));
        
        // Create a temporary country SVG for individual country rendering
        this.svgCountryDomEl = document.createElement('svg');
        this.svgCountryDomEl.innerHTML = this.svgMapDomEl.innerHTML;
        
        this.prepareHiResTextures();
        this.prepareLowResTextures();
      })
      .catch(error => {
        console.error('Error loading world map data:', error);
      });
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
