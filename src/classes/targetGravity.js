import { Vector } from "./vector";
import { v4 as uuidv4 } from "uuid";

export class TargetGravity {
  constructor(x, y, r, targets, data, isGravityReversed, speed) {
    this.id = uuidv4();
    this.r = r;
    this.speed = speed;
    this.birth = Date.now();
    this.pos = new Vector(x, y);
    this.clickPos = null;
    this.isClicked = false;
    this.clickedTime = null;
    this.gravity = speed/100*(isGravityReversed?-1:1)
    this.vel = new Vector(0, isGravityReversed?(2+4*Math.random()):(-2-4*Math.random()));
    targets.current.push(this);
    this.isGravityReversed = isGravityReversed;
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

  canDie(canvasHeight) {
    return (
      (this.isClicked && this.clickedTime + 200 < Date.now()) ||
      (!this.isGravityReversed &&
        this.pos.y > canvasHeight + 20 &&
        this.vel.y > 0) ||
      (this.isGravityReversed && this.pos.y < -20 && this.vel.y < 0)
    );
  }

  reposition(ctx) {
    
    const canvas = ctx.canvas;
    this.vel = new Vector(0, this.vel.y +this.gravity);
    let newPosition = this.pos.add(this.vel);
    this.pos = newPosition;

    // console.log(this.pos);
  }

  updateCreature(ctx) {
    this.reposition(ctx);

    this.drawTarget(ctx);
  }
}
