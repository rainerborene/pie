/**
 * Initialize a new `Pie`.
 */

function Pie() {
  this.el = document.createElement('div');
  this.el.className = 'pie';
  this.size(137, 137);
  this.background("#fff");
  this.font('11px "Helvetica Neue", sans-serif');
  this.colors("#58c23c", "#ef0d2b", "#cfd4d8");
}

/**
 * Change the number of segments to `n`.
 *
 * @param {Number} n
 * @return {Pie}
 * @api public
 */

Pie.prototype.segments = function(n){
  this._segments = n;
  return this;
};

/**
 * Change the pie diameter to `n`, defaults to 137.
 *
 * @param {Number} n
 * @return {Pie}
 * @api public
 */

Pie.prototype.size = function(n){
  this._width = n;
  this._height = n;
  return this;
};

/**
 * Set colors of segments.
 *
 * @param {Array} colors
 * @return {Pie}
 * @api public
 */

Pie.prototype.colors = function(){
  this._colors = arguments;
  return this;
};

/**
 * Set background color of centered circle.
 *
 * @param {String} color
 * @return {Pie}
 * @api public
 */

Pie.prototype.background = function(color){
  this._backgroundColor = color;
  return this;
};

/**
 * Set the font `family`.
 *
 * @param {String} family
 * @return {Pie}
 * @api public
 */

Pie.prototype.font = function(family){
  this._font = family;
  return this;
};

/**
 * Draw on `el`.
 *
 * @return {Pie}
 * @api private
 */

Pie.prototype.render = function(){
  var i;

  this.el.innerHTML = '';
  this.ctx = Raphael(this.el, this._width, this._height);
  this.ctx.customAttributes.segment = function(x, y, r, a1, a2) {
    var flag = (a2 - a1) > 180,
    clr = (a2 - a1) / 360;
    a1 = (a1 % 360) * Math.PI / 180;
    a2 = (a2 % 360) * Math.PI / 180;
    return {
      path: [
          ["M", x, y]
        , ["l", r * Math.cos(a1), r * Math.sin(a1)]
        , ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)]
        , ["z"]
      ]
    };
  };

  this.paths = this.ctx.set();

  for (i = 0; i < this._segments; i++) {
    this.paths.push(this.ctx.path().attr({ segment: this.segment(), fill: this._colors[i], "stroke-width": 0 }));
  }

  this.circle = this.ctx.circle(this._width / 2, this._height / 2, Math.round(this._width * 0.19));
  this.circle.attr({ stroke: 0, fill: this._backgroundColor });
  this.text = this.ctx.text(this._width / 2, this._height / 2, "");
  this.text.attr({ font: this._font, fill: "#fff" });

  return this;
};

/**
 * Segment array.
 *
 * @param {Number} a1
 * @param {Number} a2
 * @return {Array}
 * @api private
 */

Pie.prototype.segment = function(a1, a2){
  return [this._width / 2, this._height / 2, this._width / 2, a1 || 0, a2 || 0];
};


/**
 * Animate segments and set text.
 *
 * @return {Pie}
 * @api private
 */

Pie.prototype.animate = function(){
  var default_color = this._colors[this._colors.length - 1]
    , start = 0
    , idx = 0
    , val
    , percentage
    , color
    , i;

  if (this.el.childElementCount === 0) {
    this.render();
  }

  for (i = 0; i < this._segments; i++) {
    val = 360 / this.total * this.values[i];
    val = val === 360 ? 359.9 : val;
    idx = this.values[idx] < this.values[i] ? i : idx;
    this.paths[i].attr("fill", this._colors[i]);
    this.paths[i].animate({ segment: this.segment(start, start += val) }, 1000, "<>");
    this.paths[i].angle = start - val / 2;

    if (this.total === 0 && i === 0) {
      idx = this._colors.length - 1;
      this.paths[i].attr("fill", default_color);
      this.paths[i].animate({ segment: this.segment(start, 359.9) }, 1000, "<>");
    }
  }

  percentage = (this.values[idx] * 100 / this.total) || 0;
  this.text.attr("text", parseInt(percentage, 10) + "%");
  this.text.attr("fill", this._colors[idx]);

  return this;
};

/**
 * Redraw `Pie`.
 *
 * @return {Pie}
 * @api public
 */

Pie.prototype.redraw = function(){
  this.render();
  this.animate();
  return this;
};

/**
 * Update values of segments and redraw.
 *
 * @param {Array} values
 * @return {Pie}
 * @api public
 */

Pie.prototype.update = function(){
  var i;

  this.values = [];
  this.total = 0;

  for (i = 0; i < this._segments; i++) {
    this.values.push(parseInt(arguments[i], 10) || 0);
    this.total += this.values[i];
  }

  this.animate();

  return this;
};
