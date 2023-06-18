export class Vec2 {
  x: number;
  y: number;

  constructor(pos: [number, number]) {
    this.x = pos[0];
    this.y = pos[1];
  }

  add(v: Vec2): Vec2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  substract(v: Vec2): Vec2 {
    return this.add(v.multiply(-1));
  }

  multiply(n: number): Vec2 {
    this.x *= n;
    this.y *= n;
    return this;
  }

  vecTo(target: Vec2): Vec2 {
    return new Vec2([target.x - this.x, target.y - this.y]);
  }

  distanceTo(v: Vec2): number {
    return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
  }

  len(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
