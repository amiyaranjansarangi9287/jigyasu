// src/shared/canvas/helpers/CanvasHelpers.ts

export const CanvasHelpers = {
  setupHiDPI(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    return ctx;
  },

  clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.clearRect(0, 0, width, height);
  },

  fillCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  },

  drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.closePath();
  },

  createLinearGradient(
    ctx: CanvasRenderingContext2D,
    x0: number, y0: number, x1: number, y1: number,
    stops: [number, string][]
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    return gradient;
  },

  createRadialGradient(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, innerRadius: number, outerRadius: number,
    stops: [number, string][]
  ): CanvasGradient {
    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    return gradient;
  },

  drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number, y: number,
    options: {
      font?: string;
      color?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
      maxWidth?: number;
    } = {}
  ): void {
    ctx.save();
    if (options.font) ctx.font = options.font;
    if (options.color) ctx.fillStyle = options.color;
    ctx.textAlign = options.align ?? 'center';
    ctx.textBaseline = options.baseline ?? 'middle';
    ctx.fillText(text, x, y, options.maxWidth);
    ctx.restore();
  },

  getTouchPos(
    canvas: HTMLCanvasElement,
    event: TouchEvent | MouseEvent
  ): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (event as MouseEvent).clientX - rect.left,
      y: (event as MouseEvent).clientY - rect.top,
    };
  },

  drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, radius: number,
    options: { fill?: string; stroke?: string; lineWidth?: number } = {}
  ): void {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (options.fill) {
      ctx.fillStyle = options.fill;
      ctx.fill();
    }
    if (options.stroke) {
      ctx.strokeStyle = options.stroke;
      ctx.lineWidth = options.lineWidth ?? 1;
      ctx.stroke();
    }
  },

  drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number,
    options: { color?: string; width?: number; dash?: number[] } = {}
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = options.color ?? '#000';
    ctx.lineWidth = options.width ?? 1;
    if (options.dash) ctx.setLineDash(options.dash);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  },
};
