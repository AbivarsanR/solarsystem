const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(0, 0, 0);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets config
const planetData = [
  { name: 'Mercury', color: 0xaaaaaa, distance: 11, size: 0.5, speed: 0.02 },
  { name: 'Venus', color: 0xffc04d, distance: 14, size: 0.9, speed: 0.015 },
  { name: 'Earth', color: 0x2a73d3, distance: 18, size: 1, speed: 0.01 },
  { name: 'Mars', color: 0xb22222, distance: 22, size: 0.8, speed: 0.008 },
  { name: 'Jupiter', color: 0xffcc99, distance: 30, size: 2.5, speed: 0.006 },
  { name: 'Saturn', color: 0xd2b48c, distance: 38, size: 2, speed: 0.004 },
  { name: 'Uranus', color: 0xadd8e6, distance: 44, size: 1.5, speed: 0.003 },
  { name: 'Neptune', color: 0x4169e1, distance: 50, size: 1.5, speed: 0.002 }
];

const planets = [];

planetData.forEach((data, index) => {
  const geo = new THREE.SphereGeometry(data.size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = data.distance;
  mesh.userData = { angle: 0, speed: data.speed, distance: data.distance };
  scene.add(mesh);
  planets.push({ mesh, ...data });

  // UI Slider
  const sliderDiv = document.getElementById("sliders");
  const label = document.createElement("label");
  label.textContent = data.name;
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0.001";
  input.max = "0.05";
  input.step = "0.001";
  input.value = data.speed;
  input.oninput = (e) => {
    mesh.userData.speed = parseFloat(e.target.value);
  };
  label.appendChild(input);
  sliderDiv.appendChild(label);
});

// Animation
let paused = false;
document.getElementById('toggle').onclick = () => {
  paused = !paused;
  document.getElementById('toggle').innerText = paused ? 'Resume' : 'Pause';
};

function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    planets.forEach(({ mesh }) => {
      const data = mesh.userData;
      data.angle += data.speed;
      mesh.position.x = Math.cos(data.angle) * data.distance;
      mesh.position.z = Math.sin(data.angle) * data.distance;
    });
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
