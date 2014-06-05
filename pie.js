function Pie(){
  this.el = document.createElement('canvas');
  this.el.className = 'pie';
  this.size(120);
  this.cutout(37);
  this.fontSize(16);
  this.colors('#58c23c', '#ef0d2b', '#cfd4d8');
  this.ctx = this.el.getContext('2d');
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
  this._oldData = this._data;
  if (typeof(this._oldData) === "undefined") {
    this.oldSum = 0;
    this.oldAngle = 0;
    this.oldValue = 0;
  } else {
    this.oldSum = this._oldData.reduce(function(previousValue, currentValue){
      return previousValue + currentValue;
    });
    this.oldValue = (this._oldData[0] / this.oldSum);
    this.oldAngle = this.oldValue * (Math.PI * 2);
  }

  this._data = Array.prototype.slice.call(arguments, 0);
  this.sum = this._data.reduce(function(previousValue, currentValue){
    return previousValue + currentValue;
  });
  this.newValue = (this._data[0] / this.sum);
  this.newAngle = this.newValue * (Math.PI * 2);
};

Pie.prototype.zero = function(){
  return this.sum === 0;
};

Pie.prototype.update = function(pos, neg){
  this.data(pos,neg);
  this.animate(true);
}

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

  this._contextSetup();

  var loop = function(){
    animationAmount += frameAmount;
    this.draw(this.easeInOut(animationAmount), fromCurrent);

    if (animationAmount <= 1){
      requestAnimFrame(loop);
    }
  }.bind(this);

  requestAnimFrame(loop);
};

Pie.prototype._contextSetup = function() {
  this.ctx.font = 'bold ' + this._fontSize + 'px Georgia, serif';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
}

Pie.prototype._drawNewState = function(rotateAnimation) {
  var    color = this._colors[0]
    ,  bgcolor = this._colors[1]
    , oldAngle = this.oldAngle
    , newAngle = this.newAngle;
  this.drawSlice(0, oldAngle + (newAngle-oldAngle) * rotateAnimation, bgcolor, true);
  this.drawSlice(0, oldAngle + (newAngle-oldAngle) * rotateAnimation, color, false);
}

Pie.prototype.slideForeground = function(rotateAnimation) {
  this._clearCanvas();
  this._drawNewState(rotateAnimation);
  this._drawPercentage();
}

Pie.prototype.drawSlice = function(startAngle, endAngle, color, counterClockwise) {
  this.ctx.beginPath();
  this.ctx.arc(this.half, this.half, this.half, startAngle, endAngle, counterClockwise);
  this.ctx.arc(this.half, this.half, this.cutoutRadius, endAngle, startAngle, (!counterClockwise));
  this.ctx.lineTo(this.half, this.half);
  this.ctx.closePath();
  this.ctx.fillStyle = color;
  this.ctx.fill();
}

Pie.prototype._clearCanvas = function() {
  this.ctx.clearRect(0, 0, this._size, this._size);
}

Pie.prototype._drawPercentage = function() {
  var maxValue = Math.max.apply(Math, this._data)
    , colorIndex = this.zero() ? this._colors.length-1 : this._data.indexOf(maxValue)
    , color = this._colors[colorIndex]
    , percentage = this.zero() ? 0 : Math.round(maxValue * 100 / this.sum);
  this.ctx.fillStyle = color;
  this.ctx.fillText(percentage + '%', this.half, this.half);
}

Pie.prototype.draw = function(rotateAnimation, fromCurrent){
  var cumulativeAngle = 0;

  if (fromCurrent) {
    this.slideForeground(rotateAnimation);
  } else {
    this._clearCanvas();
    for (var i = 0; i < this._data.length; i++){
      if (this.zero() && i !== 0)
        continue;

      var value = (this._data[i] / this.sum);
      var empty = this.zero() && i === 0;
      var sliceAngle = rotateAnimation * (empty ? 1 : value) * (Math.PI * 2);
      var sumAngle = cumulativeAngle + sliceAngle;
      var color = this._colors[this.zero() ? this._colors.length : i];
      this.drawSlice(cumulativeAngle, sumAngle, color);

      cumulativeAngle += sliceAngle;
    }
    this._drawPercentage();
  }
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.msRequestAnimationFrame     || function(callback){
    window.setTimeout(callback, 1000 / 60);
  };
})();
