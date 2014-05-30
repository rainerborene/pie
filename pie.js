function Pie(){
  this.el = document.createElement('canvas');
  this.el.className = 'pie';
  this.size(120);
  this.cutout(37);
  this.fontSize(16);
  this.colors('#58c23c', '#ef0d2b', '#cfd4d8');
  this.ctx = this.el.getContext('2d');
  this.angles = [];
}

Pie.prototype.fontSize = function(n){
  this._fontSize = n;
};

Pie.prototype.size = function(n){
  this.el.width = n;
  this.el.height = n;
  this._size = n;
  this.half = n / 2;
  return this;
};

Pie.prototype.cutout = function(percentage){
  this.cutoutRadius = this.half * (percentage / 100);
  return this;
};

Pie.prototype.colors = function(){
  this._colors = Array.prototype.slice.call(arguments, 0);
  return this;
};

Pie.prototype.data = function(){
  this._data = Array.prototype.slice.call(arguments, 0);
  this.sum = this._data.reduce(function(previousValue, currentValue){
    return previousValue + currentValue;
  });
};

Pie.prototype.zero = function(){
  return this.sum === 0;
};

Pie.prototype.easeInOut = function(n){
  var q = 0.48 - n / 1.04,
      Q = Math.sqrt(0.1734 + q * q),
      x = Q - q,
      X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
      y = -Q - q,
      Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
      t = X + Y + 0.5;

  return (1 - t) * 3 * t * t + t * t * t;
};

Pie.prototype.animate = function(fromCurrent){
  var frameAmount = 1 / 50
    , animationAmount = 0;

  var loop = function(){
    animationAmount += frameAmount;

    this.draw(this.easeInOut(animationAmount), fromCurrent);

    if (animationAmount <= 1){
      requestAnimFrame(loop);
    }
  }.bind(this);

  requestAnimFrame(loop);
};

Pie.prototype.draw = function(rotateAnimation, fromCurrent){
  var cumulativeAngle = -Math.PI/2
    , maxValue = Math.max.apply(Math, this._data)
    , colorIndex = this.zero() ? this._colors.length-1 : this._data.indexOf(maxValue)
    , percentage = this.zero() ? 0 : Math.round(maxValue * 100 / this.sum);

  // Clear the canvas, ready for the new frame
  this.ctx.clearRect(0, 0, this._size, this._size);

  for (var i = 0; i < this._data.length; i++){
    if (this.zero() && i !== 0)
      continue;

    var value = (this._data[i] / this.sum);
    var empty = this.zero() && i === 0;
    var sliceAngle = rotateAnimation * (empty ? 1 : value) * (Math.PI * 2);
    var sumAngle = cumulativeAngle + sliceAngle;

    this.ctx.beginPath();
    this.ctx.arc(this.half, this.half, this.half, cumulativeAngle, sumAngle);
    this.ctx.arc(this.half, this.half, this.cutoutRadius, sumAngle, cumulativeAngle, true);
    this.ctx.lineTo(this.half, this.half);
    this.ctx.closePath();
    this.ctx.fillStyle = this._colors[this.zero() ? this._colors.length : i];
    this.ctx.fill();

    cumulativeAngle += sliceAngle;
  }

  this.ctx.font = 'bold ' + this._fontSize + 'px Georgia, serif';
  this.ctx.fillStyle = this._colors[colorIndex];
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText(percentage + '%', this.half, this.half);
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    || function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();
