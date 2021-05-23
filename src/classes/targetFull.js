import { Vector } from "./vector";
import { v4 as uuidv4 } from "uuid";

export class TargetFull {
  constructor(x, y, r, creatures, data, speed) {
    this.id = uuidv4();
    this.r = r;
    this.orignalR = 0;
    this.clickR = r;
    this.growth = 1;

    this.speed = speed;
    this.birth = Date.now();
    this.pos = new Vector(x, y);
    this.clickPos = null;
    this.isActive = true;
    this.isClicked = false;
    this.clickedTime = null;
    this.vel = new Vector(Math.random() * speed, Math.random() * speed);
    creatures.current.push(this);
    data?.current?.targets?.push(this);
  }

  drawTarget(ctx) {
    if  (this.r  >  10)  {
      if (this.orignalR < this.r && this.growth === 1 && this.isActive) {
        this.orignalR = this.orignalR + 0.3;
        if (this.orignalR === this.r || this.orignalR > this.r) {
          this.growth = -1;
          this.orignalR = this.r;
        }
      } else if (this.orignalR > 0 && this.growth === -1 && this.isActive) {
        this.orignalR = this.orignalR - 0.2;
        if (this.orignalR === 0 || this.orignalR < 0) {
          this.growth = 1;
          this.orignalR = 0;
        }
      }
    }  else  {
      this.orignalR = this.r;
    }
    

    if (this.isActive) {
      if (this.isClicked) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.orignalR, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "#4DFF00";
        ctx.lineWidth = 2;
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.orignalR, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF5100";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(
          this.pos.x,
          this.pos.y,
          (this.orignalR * 3) / 4,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.orignalR / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF5100";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(
          this.pos.x,
          this.pos.y,
          (this.orignalR * 1) / 4,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
      }
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.orignalR, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.closePath();
    }
  }

  canDie() {
    if (this.isClicked && this.clickedTime + 200 < Date.now()) return true;
    return this.birth + 2500 < Date.now();
  }

  setClickedRadius() {
    this.clickR = this.orignalR;
  }

  reposition(ctx) {
    const canvas = ctx.canvas;
    const multiplier = [1, -1];
    const plusMinusX = Math.floor(Math.random() * 2);
    const plusMinusY = Math.floor(Math.random() * 2);
    let newPosition;
    if (Math.random() > 0.98) {
      this.vel = new Vector(
        multiplier[plusMinusX] * Math.random(),
        multiplier[plusMinusY] * Math.random()
      );
    }
    newPosition = this.pos.add(this.vel.mult(this.speed));

    let isAtBoundary = false;
    if (newPosition.x + this.r > canvas.clientWidth) {
      this.vel = new Vector(-1 * this.vel.x, this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.y + this.r > canvas.clientHeight) {
      this.vel = new Vector(this.vel.x, -1 * this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.x + this.r < 0) {
      this.vel = new Vector(-1 * this.vel.x, this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.y + this.r < 0) {
      this.vel = new Vector(this.vel.x, -1 * this.vel.y);
      isAtBoundary = true;
    }

    if (isAtBoundary) {
      newPosition = this.pos.add(this.vel.mult(this.speed));
    }

    this.pos = newPosition;

    // console.log(this.pos);
  }

  updateCreature(ctx) {
    this.reposition(ctx);
    // console.log(ctx);
    if (this.birth + 2200 < Date.now()) {
      this.isActive = false;
    }
    this.drawTarget(ctx);
  }
}
