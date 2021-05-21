import { Vector } from "./vector";
import { v4 as uuidv4 } from "uuid";

export class TargetFull {
  constructor(x, y, r, creatures, speed, dirChangeProp) {
    this.id = uuidv4();
    this.r = r;
    this.orignalR = 0;
    this.growth = 1;
    this.dirChangeProp = dirChangeProp;
    this.speed = speed;
    this.birth = Date.now();
    this.pos = new Vector(x, y);
    this.isActive = true;
    this.isClicked = false;
    this.clickedTime = null;
    this.vel = new Vector(Math.random(), Math.random());
    creatures.current.push(this);
  }

  drawTarget(ctx) {
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

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.orignalR, 0, 2 * Math.PI);
    ctx.fillStyle = this.isActive ? "#00FFFF" : "#FF5100";
    if (!this.isClicked) {
      ctx.fill();
    } else {
      ctx.stroke();
      ctx.strokeStyle = "#9DFF00";
      ctx.lineWidth = 2;
    }
    ctx.closePath();
  }

  canDie() {
    if (this.isClicked && this.clickedTime + 200 < Date.now()) return true;
    return this.birth + 2500 < Date.now();
  }

  reposition(boundaries) {
    const multiplier = [1, -1];
    const plusMinusX = Math.floor(Math.random() * 2);
    const plusMinusY = Math.floor(Math.random() * 2);
    let newPosition;
    if (true && Math.random() < this.dirChangeProp) {
      this.vel = new Vector(
        multiplier[plusMinusX] * Math.random(),
        multiplier[plusMinusY] * Math.random()
      );
    }
    newPosition = this.pos.add(this.vel * this.speed);

    let isAtBoundary = false;
    if (newPosition.x + this.r > boundaries.right) {
      this.vel = new Vector(-1 * this.vel.x, this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.y + this.r > window.bottom) {
      this.vel = new Vector(this.vel.x, -1 * this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.x < boundaries.left) {
      this.vel = new Vector(-1 * this.vel.x, this.vel.y);
      isAtBoundary = true;
    }
    if (newPosition.y < boundaries.top) {
      this.vel = new Vector(this.vel.x, -1 * this.vel.y);
      isAtBoundary = true;
    }

    if (isAtBoundary) {
      newPosition = this.pos.add(this.vel * this.speed);
    }

    this.pos = newPosition;

    // console.log(this.pos);
  }

  updateCreature(ctx, boundaries) {
    // this.reposition(boundaries);
    if (this.birth + 2200 < Date.now()) {
      this.isActive = false;
    }
    this.drawTarget(ctx);
  }
}
