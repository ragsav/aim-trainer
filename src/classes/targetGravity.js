import { Vector } from "./vector";
import { v4 as uuidv4 } from "uuid";

export class TargetGravity {
  constructor(x, y, r, targets, data, speed) {
    this.id = uuidv4();
    this.r = r;
    this.speed = speed;
    this.birth = Date.now();
    this.pos = new Vector(x, y);
    this.clickPos = null;
    this.isClicked = false;
    this.clickedTime = null;
    this.vel = new Vector(0, 2 + Math.random() * speed);
    targets.current.push(this);
    data?.current?.targets?.push(this);
  }

  drawTarget(ctx) {
    if (this.isClicked) {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "#4DFF00";
      ctx.lineWidth = 2;
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF5100";
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, (this.r * 3) / 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r / 2, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF5100";
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, (this.r * 1) / 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
    }
  }

  canDie() {
    return (
      (this.isClicked && this.clickedTime + 200 < Date.now()) ||
      (this.pos.y < 0 && this.vel.y < 0)
    );
  }

  reposition(ctx) {
    const gravity = this.speed / 100;
    const canvas = ctx.canvas;
    this.vel = new Vector(0, this.vel.y - gravity);
    let newPosition = this.pos.add(this.vel);
    this.pos = newPosition;

    // console.log(this.pos);
  }

  updateCreature(ctx) {
    this.reposition(ctx);

    this.drawTarget(ctx);
  }
}
