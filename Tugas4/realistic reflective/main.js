import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

function main() {
    
    const canvas = document.querySelector('#myCanvas');

    const renderer = new THREE.WebGLRenderer({ canvas });
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = -5;
    camera.position.y = 5;
    camera.position.z = 15;


    const controls = new OrbitControls(camera, canvas);
    controls.target.set(-4, 0, 0);
    controls.update();

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        scene.add(light);
    }


    function makeInstance(geometry, material, x, y, z) {

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }
    const loader = new THREE.TextureLoader();


    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

    let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
    sphereCamera.position.set(0, -5, 0);
    scene.add(sphereCamera);

    let sphereMaterial = new THREE.MeshBasicMaterial({
        envMap: sphereCamera.renderTarget
    });
    const spheres = [
        makeInstance(new THREE.SphereGeometry(3, 500, 500), sphereMaterial, -4, 0, 0),
    ];

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'img/panorama_studio.jpg',
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
            });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        sphereCamera.update(renderer,scene);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
