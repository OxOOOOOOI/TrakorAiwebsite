import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class TrakorAITokenHunterScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.setupScene();
        this.createBackground();
        this.createAIElements();
        this.createAdditionalElements();
        this.animate();
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
    }

    createBackground() {
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                void main() {
                    vec3 color1 = vec3(0.0, 0.1, 0.2);
                    vec3 color2 = vec3(0.0, 0.3, 0.4);
                    float mixVal = sin(vUv.x * 10.0 + time * 0.5) * 0.5 + 0.5;
                    gl_FragColor = vec4(mix(color1, color2, mixVal), 0.5);
                }
            `
        });
        const background = new THREE.Mesh(geometry, material);
        this.scene.add(background);
    }

    createAIElements() {
        const geometry = new THREE.IcosahedronGeometry(1, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });

        this.aiSphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.aiSphere);
    }

    createAdditionalElements() {
        // Add some additional floating AI-themed elements
        const smallerGeometry = new THREE.TetrahedronGeometry(0.3, 1);
        const smallerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        this.additionalElements = [];
        for (let i = 0; i < 5; i++) {
            const element = new THREE.Mesh(smallerGeometry, smallerMaterial);
            element.position.set(
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2
            );
            this.scene.add(element);
            this.additionalElements.push(element);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate main AI sphere
        this.aiSphere.rotation.x += 0.01;
        this.aiSphere.rotation.y += 0.02;

        // Animate additional elements
        if (this.additionalElements) {
            this.additionalElements.forEach((element, index) => {
                element.rotation.x += 0.005 * (index + 1);
                element.rotation.y += 0.01 * (index + 1);
            });
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new TrakorAITokenHunterScene();
});

window.addEventListener('resize', () => {
    const scene = document.getElementById('scene-container');
    const renderer = scene.querySelector('canvas');
    if (renderer) {
        renderer.width = window.innerWidth;
        renderer.height = window.innerHeight;
    }
});