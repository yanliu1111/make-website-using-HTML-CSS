/**
 convert this fire.js to typescript
 Yes, the updated code looks correct. It sets up the canvas, defines the Particle and Firework classes, and implements the setup(), loop(), randomCol(), randomVec(), setSize(), onClick(), and windowResized() functions. The code also properly initializes and updates the fireworks and particles arrays, and handles resizing and clicking events on the canvas.
 **/

let canvas: HTMLCanvasElement;
let width: number;
let height: number;
let ctx: CanvasRenderingContext2D;
let fireworks: Firework[] = [];
let particles: Particle[] = [];

function setup(): void {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  setSize(canvas);
  ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  fireworks.push(new Firework(Math.random() * (width - 200) + 100));
  window.addEventListener("resize", windowResized);
  document.addEventListener("click", onClick);
}

setTimeout(setup, 1);

function loop(): void {
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  fireworks = fireworks.filter((firework) => !firework.update());
  fireworks.forEach((firework) => firework.draw());

  particles = particles.filter((particle) => particle.lifetime <= 80);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  if (Math.random() < 1 / 60) {
    fireworks.push(new Firework(Math.random() * (width - 200) + 100));
  }
}
setInterval(loop, 1 / 60);

class Particle {
  x: number;
  y: number;
  col: string;
  vel: { x: number; y: number };
  lifetime: number;

  constructor(x: number, y: number, col: string) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.vel = randomVec(2);
    this.lifetime = 0;
  }

  update(): void {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.y += 0.02;
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
    this.lifetime++;
  }

  draw(): void {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

class Firework {
  x: number;
  y: number;
  isBlown: boolean;
  col: string;

  constructor(x: number) {
    this.x = x;
    this.y = height;
    this.isBlown = false;
    this.col = randomCol();
  }

  update(): boolean {
    this.y -= 3;
    if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
      this.isBlown = true;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.col));
      }
    }
    return this.isBlown;
  }

  draw(): void {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}
function randomCol(): string {
  const letters = "0123456789ABCDEF";
  const nums = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));

  const brightest = nums.reduce((acc, val) => (val > acc ? val : acc), 0);
  const normalizedNums = nums.map((num) => num / brightest);

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const hex = Math.floor(normalizedNums[i] * 255).toString(16);
    color += hex.length === 1 ? "0" + hex : hex;
  }

  return color;
}

function randomVec(max: number): { x: number; y: number } {
  const dir = Math.random() * Math.PI * 2;
  const spd = Math.random() * max;
  return { x: Math.cos(dir) * spd, y: Math.sin(dir) * spd };
}

function setSize(canv: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio || 1;
  const rect = canv.getBoundingClientRect();

  canv.width = rect.width * dpr;
  canv.height = rect.height * dpr;

  const ctx = canv.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
}
function onClick(e: MouseEvent): void {
  fireworks.push(new Firework(e.clientX));
}

function windowResized(): void {
  setSize(canvas);
}
