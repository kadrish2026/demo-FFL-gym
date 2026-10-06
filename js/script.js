// ===== PRICING: change names, prices and features here =====
const plans = [
  { name: 'BASIC', price: '999',   popular: false },
  { name: 'PRO',   price: '1,499', popular: true },
  { name: 'ELITE', price: '2,499', popular: false }
];
const planFeatures = ['Gym access', 'Cardio area', 'Strength area', 'Locker facility', 'Trainer guidance'];

const pricingGrid = document.getElementById('pricingGrid');
plans.forEach(plan => {
  const card = document.createElement('div');
  card.className = 'price-card reveal' + (plan.popular ? ' popular' : '');
  card.innerHTML =
    (plan.popular ? '<span class="badge">MOST POPULAR</span>' : '') +
    `<h3>${plan.name}</h3>` +
    `<div class="price">₹${plan.price} <small>/ Month</small></div>` +
    '<ul>' + planFeatures.map(f => `<li>${f}</li>`).join('') + '</ul>' +
    '<a href="#contact" class="btn">Start Your Journey</a>';
  pricingGrid.appendChild(card);
});

// ===== Animated counters =====
function runCounter(el) {
  const target = +el.dataset.count;
  let current = 0;
  const timer = setInterval(() => {
    current += Math.ceil(target / 60);
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 25);
}

// ===== Gallery lightbox =====
const lightbox = document.getElementById('lightbox');
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.querySelector('img').src = img.src;
    lightbox.classList.add('open');
  });
});
lightbox.addEventListener('click', () => lightbox.classList.remove('open'));

// ===== Testimonials slider =====
const slides = document.querySelectorAll('.testimonial');
const dots = document.getElementById('sliderDots');
let currentSlide = 0;
slides.forEach((s, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
  dot.addEventListener('click', () => showSlide(i));
  dots.appendChild(dot);
});
function showSlide(n) {
  currentSlide = n;
  slides.forEach((s, i) => s.classList.toggle('active', i === n));
  dots.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === n));
}
showSlide(0);
setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);

// ===== Contact form (demo only: connect to your own backend or WhatsApp later) =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formNote').textContent = 'Thanks! We will call you soon.';
  e.target.reset();
});

// ===== 3D weight plate (Three.js) =====
const isMobile = window.innerWidth < 700;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createPlateScene(canvasId, plateSize) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || reduceMotion || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

  // The plate: a metal disc + a red ring + a centre hub
  const metal = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 });
  const plate = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.4, 48), metal);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 12, 64), new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.6 }));
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 1, roughness: 0.2 }));
  ring.position.y = 0.21; ring.rotation.x = Math.PI / 2;
  plate.add(disc, ring, hub);
  plate.scale.setScalar(plateSize);
  scene.add(plate);

  // Floating particles
  const count = isMobile ? 40 : 120;
  const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 14);
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0xff3b30, size: 0.04 }));
  scene.add(particles);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.PointLight(0xffffff, 1.4, 50);
  light.position.set(4, 4, 6);
  scene.add(light);

  // Follow the mouse slowly
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // In the hero, push the plate to the right so it sits beside the text
    plate.position.x = canvasId === 'heroCanvas' && w > 900 ? 2.4 : 0;
  }
  window.addEventListener('resize', resize);
  resize();

  const baseTilt = Math.PI / 2.4; // how far the plate leans back
  function animate() {
    plate.rotation.y += 0.006; // slow spin
    plate.rotation.x += (baseTilt + mouseY * 0.6 - plate.rotation.x) * 0.05;
    plate.rotation.z += (mouseX * 0.8 - plate.rotation.z) * 0.05;
    particles.rotation.y += 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

createPlateScene('heroCanvas', 1);
createPlateScene('plateCanvas', 1.3);
