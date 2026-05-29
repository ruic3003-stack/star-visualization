export class AnalogStaticNoise {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private running: boolean = false;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '2';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.mixBlendMode = 'overlay';
    this.canvas.style.opacity = '0.08';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    // Use quarter resolution for performance
    this.canvas.width = Math.floor(window.innerWidth / 4);
    this.canvas.height = Math.floor(window.innerHeight / 4);
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
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 15;
    }

    ctx.putImageData(imageData, 0, 0);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }

    this.animationId = requestAnimationFrame(this.draw);
  };

  destroy() {
    this.stop();
    this.canvas.remove();
  }
}
