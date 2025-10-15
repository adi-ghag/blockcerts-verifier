// Vitest setup file for polyfilling browser APIs not available in jsdom

// Polyfill DOMMatrix for pdfjs-dist
// @ts-expect-error - DOMMatrix is not available in jsdom
globalThis.DOMMatrix = class DOMMatrix {
  constructor() {
    // Minimal implementation for testing purposes
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m14 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m24 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
    this.m34 = 0;
    this.m41 = 0;
    this.m42 = 0;
    this.m43 = 0;
    this.m44 = 1;
    this.is2D = true;
    this.isIdentity = true;
  }

  multiply() {
    return this;
  }

  translate() {
    return this;
  }

  scale() {
    return this;
  }

  rotate() {
    return this;
  }

  inverse() {
    return this;
  }

  transformPoint() {
    return { x: 0, y: 0, z: 0, w: 1 };
  }
};
