// Inisialisasi canvas dan konteks
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

// Set ukuran canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update tahun menjadi 2026
const yearDisplay = document.getElementById("yearDisplay");
yearDisplay.textContent = "2026";

// Array untuk menyimpan partikel kembang api
let fireworks = [];
let particles = [];

// Warna tema yang modern untuk 2026
const colorThemes = [
  { primary: "#FF6B6B", secondary: "#4ECDC4" }, // Coral & Turquoise
  { primary: "#FFE66D", secondary: "#45B7D1" }, // Yellow & Blue
  { primary: "#95E1D3", secondary: "#F38181" }, // Mint & Coral
  { primary: "#A8E6CF", secondary: "#FFAAA5" }, // Pastel Green & Pink
  { primary: "#FFD3B6", secondary: "#A8D8EA" }, // Peach & Sky Blue
];

let currentColorTheme = 0;

// Kelas untuk partikel kembang api
class Particle {
  constructor(x, y, color, isStar = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isStar = isStar;
    this.velocity = {
      x: (Math.random() - 0.5) * (isStar ? 15 : 12),
      y: (Math.random() - 0.5) * (isStar ? 15 : 12),
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = isStar ? Math.random() * 5 + 2 : Math.random() * 4 + 2;
    this.gravity = isStar ? 0.03 : 0.05;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
  }

  update() {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    if (this.isStar) {
      // Gambar bintang
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos((i * 2 * Math.PI) / 5) * this.size,
          Math.sin((i * 2 * Math.PI) / 5) * this.size
        );
        ctx.lineTo(
          Math.cos(((i * 2 + 1) * Math.PI) / 5) * (this.size / 2),
          Math.sin(((i * 2 + 1) * Math.PI) / 5) * (this.size / 2)
        );
      }
      ctx.closePath();
      ctx.fill();
    } else {
      // Gambar lingkaran biasa
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Kelas untuk kembang api
class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = colorThemes[currentColorTheme].primary;
    this.size = 4;
    this.speed = 7;
    this.acceleration = 1.06;
    this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
    this.traveled = 0;
    this.trail = [];
    this.trailLength = 10;
    this.exploded = false;
    this.sparkleInterval = Math.random() * 5 + 5;
    this.sparkleCounter = 0;
  }

  update() {
    // Simpan posisi sebelumnya untuk trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    // Tambahkan efek berkelap-kelip
    this.sparkleCounter++;
    if (this.sparkleCounter >= this.sparkleInterval && !this.exploded) {
      particles.push(new Particle(this.x, this.y, this.color, true));
      this.sparkleCounter = 0;
    }

    // Jika belum mencapai target, bergerak ke arah target
    if (!this.exploded) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.hypot(dx, dy);

      // Normalisasi arah
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      this.speed *= this.acceleration;

      this.traveled += this.speed;

      // Cek jika sudah mencapai target
      if (this.traveled >= this.distanceToTarget || distance < 5) {
        this.explode();
      }
    }
  }

  explode() {
    this.exploded = true;

    // Buat partikel ledakan dengan jumlah yang berbeda-beda
    const particleCount = Math.floor(Math.random() * 100) + 150;
    const secondaryColor = colorThemes[currentColorTheme].secondary;

    for (let i = 0; i < particleCount; i++) {
      const isStar = Math.random() > 0.7;
      const color = Math.random() > 0.5 ? this.color : secondaryColor;
      particles.push(new Particle(this.x, this.y, color, isStar));
    }

    // Tambahkan efek ledakan khusus angka 2026
    if (Math.random() > 0.7) {
      this.createSpecialEffect();
    }
  }

  createSpecialEffect() {
    // Efek khusus untuk 2026
    const colors = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1"];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 20; j++) {
        const angle = (i * Math.PI) / 2 + j * 0.1;
        const velocity = {
          x: Math.cos(angle) * 8,
          y: Math.sin(angle) * 8,
        };

        particles.push({
          x: this.x,
          y: this.y,
          color: colors[i],
          velocity: velocity,
          alpha: 1,
          decay: 0.02,
          size: 3,
          gravity: 0.03,
          update: function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.velocity.y += this.gravity;
            this.alpha -= this.decay;
            this.size *= 0.98;
          },
          draw: function () {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
      }
    }
  }

  draw() {
    // Gambar trail
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const alpha = i / this.trail.length;

      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Gambar kembang api utama
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Fungsi untuk membuat kembang api baru
function createFirework() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const targetX = Math.random() * canvas.width;
  const targetY = Math.random() * (canvas.height * 0.6) + 100;

  fireworks.push(new Firework(x, y, targetX, targetY));
}

// Fungsi untuk membuat kembang api angka 2026
function createYearFirework() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Buat kembang api di posisi yang membentuk angka 2026
  const positions = [
    { x: centerX - 300, y: centerY - 100 },
    { x: centerX - 100, y: centerY - 100 },
    { x: centerX + 100, y: centerY - 100 },
    { x: centerX + 300, y: centerY - 100 },
  ];

  positions.forEach((pos, index) => {
    setTimeout(() => {
      fireworks.push(
        new Firework(Math.random() * canvas.width, canvas.height, pos.x, pos.y)
      );
    }, index * 200);
  });
}

// Fungsi untuk animasi
function animate() {
  // Bersihkan canvas dengan efek fade yang lebih halus
  ctx.fillStyle = "rgba(10, 10, 42, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update dan gambar kembang api
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();

    // Hapus kembang api yang sudah meledak
    if (fireworks[i].exploded) {
      fireworks.splice(i, 1);
    }
  }

  // Update dan gambar partikel
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].update) {
      particles[i].update();
    }
    if (particles[i].draw) {
      particles[i].draw();
    }

    // Hapus partikel yang sudah transparan
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

// Event listener untuk resize window
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Event listener untuk klik (membuat kembang api manual)
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Buat 3 kembang api sekaligus
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height;
      fireworks.push(new Firework(startX, startY, x, y));
    }, i * 100);
  }
});

// Fungsi untuk mengubah tema warna
function changeColorTheme() {
  currentColorTheme = (currentColorTheme + 1) % colorThemes.length;

  // Update warna teks ucapan sesuai tema
  const greetingElements = document.querySelectorAll(".greeting span");
  const colors = [
    ["#FF6B6B", "#4ECDC4", "#FFE66D"],
    ["#FFE66D", "#45B7D1", "#FF6B6B"],
    ["#95E1D3", "#F38181", "#FFE66D"],
    ["#A8E6CF", "#FFAAA5", "#45B7D1"],
    ["#FFD3B6", "#A8D8EA", "#FF6B6B"],
  ];

  greetingElements.forEach((el, index) => {
    el.style.background = colors[currentColorTheme][index];
  });
}

// Mulai animasi
animate();

// Buat kembang api pertama secara otomatis
setTimeout(() => {
  // Buat efek awal yang spektakuler
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createFirework(), i * 150);
  }

  // Buat kembang api khusus untuk angka 2026
  setTimeout(() => createYearFirework(), 2000);
}, 800);

// Buat kembang api secara otomatis
setInterval(
  () => {
    if (fireworks.length < 15) {
      // Batasi jumlah kembang api
      createFirework();
    }
  },
  Math.random() * 800 + 400
);

// Ganti tema warna setiap 15 detik
setInterval(() => {
  changeColorTheme();
}, 15000);

// Tambahkan efek kembang api saat keyboard ditekan
document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFirework(), i * 100);
    }
  }
});
