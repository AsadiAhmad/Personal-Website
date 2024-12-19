const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.border = "none";
renderer.domElement.style.margin = "0";
renderer.domElement.style.padding = "0";
renderer.domElement.style.zIndex = "-1";
renderer.domElement.style.overflow = "hidden";
document.getElementById("particle-wave").appendChild(renderer.domElement);

const particleCount = 1500;
const positions = [];
const colors = [];
const particleGeometry = new THREE.BufferGeometry();

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 40;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 40;
    positions.push(x, y, z);

    const randomColor = Math.random();
    if (randomColor < 0.33) {
        colors.push(112 / 255, 144 / 255, 255 / 255);
    } else if (randomColor < 0.66) {
        colors.push(255 / 255, 105 / 255, 180 / 255);
    } else {
        colors.push(186 / 255, 85 / 255, 211 / 255);
    }
}

particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);
particleGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    map: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/sprites/circle.png"
    ),
    depthWrite: false,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

let angle = 0;
const orbitRadius = 15;
const orbitSpeed = 0.002;

function animateParticles() {
    const positions = particleGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(positions[i] * 0.1 + Date.now() * 0.001) * 0.01;
    }

    particleGeometry.attributes.position.needsUpdate = true;
}

function animateCamera() {
    angle += orbitSpeed;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    camera.position.set(x, 10, z);
    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    animateParticles();
    animateCamera();
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
