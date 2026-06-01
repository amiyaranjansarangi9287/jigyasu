// src/shared/canvas/helpers/ColorHelpers.ts

export const ColorHelpers = {
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0'))
      .join('');
  },

  withAlpha(hex: string, alpha: number): string {
    const rgb = ColorHelpers.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  },

  mixColors(color1: string, color2: string, ratio: number): string {
    const c1 = ColorHelpers.hexToRgb(color1);
    const c2 = ColorHelpers.hexToRgb(color2);
    if (!c1 || !c2) return color1;
    return ColorHelpers.rgbToHex(
      Math.round(c1.r + (c2.r - c1.r) * ratio),
      Math.round(c1.g + (c2.g - c1.g) * ratio),
      Math.round(c1.b + (c2.b - c1.b) * ratio)
    );
  },

  hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  },

  hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const rgb = ColorHelpers.hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  },

  randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  },

  lighten(hex: string, amount: number): string {
    const hsl = ColorHelpers.hexToHsl(hex);
    if (!hsl) return hex;
    return ColorHelpers.hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + amount));
  },

  darken(hex: string, amount: number): string {
    const hsl = ColorHelpers.hexToHsl(hex);
    if (!hsl) return hex;
    return ColorHelpers.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - amount));
  },
};
