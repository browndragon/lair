"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Maps between x/y float coordinates and u/v integer coordinates. 
 */
class UV {
  constructor(width = 16, height = 16, offsetX = -width / 2, offsetY = -height / 2) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
  /** Returns the 'x coordinate' in tile counts. */


  u(x) {
    return Math.floor((x + this.offsetX) / this.width);
  }
  /** Returns the 'y coordinate' in tile counts. */


  v(y) {
    return Math.floor((y + this.offsetY) / this.height);
  }
  /** Returns [u, v]  of (x, y) ("tile space") */


  uv(x, y) {
    return [this.u(x), this.v(y)];
  }
  /** Returns the number of tiles containing 'width'. */


  uCount(width) {
    return Math.ceil(width / this.width);
  }
  /** Returns the number of tiles containing 'height'. */


  vCount(height) {
    return Math.ceil(height / this.height);
  }
  /** Returns min tile u & v, as well as count of tiles in u & v, to contain x/y/w/h world bounds. */


  uvBounds(x, y, w, h) {
    return [this.u(x), this.v(y), this.uCount(w), this.vCount(h)];
  }
  /** Returns x coordinate of the uth tile. */


  x(u) {
    return u * this.width - this.offsetX;
  }
  /** Returns y coordinate of the vth tile. */


  y(v) {
    return v * this.height - this.offsetY;
  }
  /** Returns [x, y] of (u, v) ("world space") */


  xy(u, v) {
    return [this.x(u), this.y(v)];
  }
  /** Returns the width of u tiles. */


  wCount(uC) {
    return uC * this.width;
  }
  /** Returns the height of v tiles. */


  hCount(vC) {
    return vC * this.height;
  }
  /** Returns [x, y, w, h] from tile information. */


  xyBounds(u, v, uC, vC) {
    return [this.x(u), this.v(y), this.wCount(uC), this.hCount(vC)];
  }

}

exports.default = UV;