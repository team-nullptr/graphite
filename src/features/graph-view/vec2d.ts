export class Vec2d {
  x: number;
  y: number;

  constructor(pos: [number, number]) {
    this.x = pos[0];
    this.y = pos[1];
  }

  add(v: Vec2d): Vec2d {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  substract(v: Vec2d): Vec2d {
    return this.add(v.multiply(-1));
  }

  multiply(n: number): Vec2d {
    this.x *= n;
    this.y *= n;
    return this;
  }

  vecTo(target: Vec2d): Vec2d {
    return new Vec2d([target.x - this.x, target.y - this.y]);
  }

  distanceTo(v: Vec2d): number {
    return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
  }

  len(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
