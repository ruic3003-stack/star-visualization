export class MatrixGridWave {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private running: boolean = false;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '0';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.draw();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private draw = () => {
    if (!this.running) return;
    const time = performance.now() * 0.001;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;
    const gridSize = 40;
    const cols = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 1;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#05050B';
    ctx.fillRect(0, 0, width, height);

    // Vertical oscillating lines
    ctx.strokeStyle = 'rgba(74, 177, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < cols; i++) {
      const baseX = i * gridSize;
      const offset = Math.sin(time * 2 + i * 0.3) * 10;
      ctx.beginPath();
      ctx.moveTo(baseX + offset, 0);
      ctx.lineTo(baseX + offset, height);
      ctx.stroke();
    }

    // Horizontal perspective grid
    const perspective = 0.6;
    for (let j = 0; j < rows; j++) {
      const baseY = j * gridSize;
      const offset = Math.cos(time * 1.5 + j * 0.2) * 8;
      const y = baseY + offset;
      const alpha = 1 - (j / rows) * perspective;
      ctx.strokeStyle = `rgba(74, 177, 255, ${0.08 * alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Pulse light point
    const pulseX = Math.sin(time * 0.8) * width * 0.4 + width * 0.5;
    const pulseY = Math.cos(time * 0.7) * height * 0.3 + height * 0.5;
    const gradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 120);
    gradient.addColorStop(0, 'rgba(74, 177, 255, 0.25)');
    gradient.addColorStop(0.5, 'rgba(74, 177, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(74, 177, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(pulseX - 120, pulseY - 120, 240, 240);

    // Corner decorative elements
    ctx.strokeStyle = 'rgba(74, 177, 255, 0.2)';
    ctx.lineWidth = 1;

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(20, 20);
    ctx.lineTo(50, 20);
    ctx.stroke();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - 50, 20);
    ctx.lineTo(width - 20, 20);
    ctx.lineTo(width - 20, 50);
    ctx.stroke();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(20, height - 50);
    ctx.lineTo(20, height - 20);
    ctx.lineTo(50, height - 20);
    ctx.stroke();

    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - 50, height - 20);
    ctx.lineTo(width - 20, height - 20);
    ctx.lineTo(width - 20, height - 50);
    ctx.stroke();

    this.animationId = requestAnimationFrame(this.draw);
  };

  destroy() {
    this.stop();
    this.canvas.remove();
  }
}
