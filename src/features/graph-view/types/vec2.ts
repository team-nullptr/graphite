// TODO: Change methods so that they don't mutate the original vector.
export class Vec2 {
  x: number;
  y: number;

  // TODO: Maybe we can just pass x and y arguments?
  constructor(pos: [number, number] = [0, 0]) {
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

  rotate(angle: number, origin: Vec2 = new Vec2([0, 0])): Vec2 {
    const { x: ox, y: oy } = origin;

    const x = (this.x - ox) * Math.cos(angle) - (this.y - oy) * Math.sin(angle);
    const y = (this.x - ox) * Math.sin(angle) + (this.y - oy) * Math.cos(angle);

    this.x = x + ox;
    this.y = y + oy;
    return this;
  }
}
