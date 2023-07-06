export class Vec2 {
  constructor(public x: number, public y: number) {}

  static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static substract(a: Vec2, b: Vec2): Vec2 {
    return Vec2.add(a, Vec2.multiply(b, -1));
  }

  static multiply(vec: Vec2, n: number): Vec2 {
    return new Vec2(vec.x * n, vec.y * n);
  }

  add(v: Vec2): Vec2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  substract(v: Vec2): Vec2 {
    return this.add(Vec2.multiply(v, -1));
  }

  multiply(n: number): Vec2 {
    this.x *= n;
    this.y *= n;
    return this;
  }

  vecTo(target: Vec2): Vec2 {
    return new Vec2(target.x - this.x, target.y - this.y);
  }

  distanceTo(v: Vec2): number {
    return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
  }

  len(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  rotate(angle: number, origin: Vec2 = new Vec2(0, 0)): Vec2 {
    const { x: ox, y: oy } = origin;
    const x = (this.x - ox) * Math.cos(angle) - (this.y - oy) * Math.sin(angle);
    const y = (this.x - ox) * Math.sin(angle) + (this.y - oy) * Math.cos(angle);

    return new Vec2(x + ox, y + oy);
  }
}
