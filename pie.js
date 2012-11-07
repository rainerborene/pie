/**
 * Initialize a new `Pie` chart.
 */

var Pie = function() {
  this.el = document.createElement('div');
  this.el.className = 'pie';

  this._backgroundColor = "#fff";
  this._font = '11px "Helvetica Neue", sans-serif';
  this._colors = ["#58c23c", "#ef0d2b"];
  this._width = 137;
  this._height = 137;

  this.draw();
};

/**
 * Set width and height of `Pie`.
 *
 * @param {Number} width
 * @param {Number} height
 * @return {Pie}
 * @api public
 */

Pie.prototype.size = function(width, height) {
  this._width = width;
  this._height = height;
  this.el.innerHTML = "";
  this.draw();
  this.redraw();
  return this;
};

/**
 * Set colors of segments.
 *
 * @param {Array} colors
 * @return {Pie}
 * @api public
 */

Pie.prototype.colors = function() {
  this._colors = new Array(arguments[0], arguments[1]);
  this.paths[0].attr("fill", this._colors[0]);
  this.paths[1].attr("fill", this._colors[1]);
  return this;
};

/**
 * Set background color of centered circle.
 *
 * @param {String} color
 * @return {Pie}
 * @api public
 */

Pie.prototype.background = function(color) {
  this._backgroundColor = color;
  this.circle.attr("fill", color);
  return this;
};

/**
 * Set the font `family`.
 *
 * @param {String} family
 * @return {Pie}
 * @api public
 */

Pie.prototype.font = function(family) {
  this._font = family;
  this.text.attr("font", family);
  return this;
};

/**
 * Draw on `el`.
 *
 * @return {Pie}
 * @api private
 */

Pie.prototype.draw = function() {
  this.canvas = Raphael(this.el, this._width, this._height);
  this.canvas.customAttributes.segment = function(x, y, r, a1, a2) {
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

  this.paths = this.canvas.set();
  this.paths.push(
    this.canvas.path().attr({ segment: this.segment(), fill: this._colors[0], "stroke-width": 0 }),
    this.canvas.path().attr({ segment: this.segment(), fill: this._colors[1], "stroke-width": 0 }));

  this.circle = this.canvas.circle(this._width / 2, this._height / 2, Math.round(this.min() * 0.19));
  this.circle.attr({ stroke: 0, fill: this._backgroundColor });

  this.text = this.canvas.text(this._width / 2, this._height / 2, "");
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

Pie.prototype.segment = function(a1, a2) {
  return [this._width / 2, this._height / 2, this.min() / 2, a1 || 0, a2 || 0];
};

/**
 * Get the minimum value based on dimensions.
 *
 * @return {Number}
 * @api private
 */

Pie.prototype.min = function() {
  return Math.min(this._width, this._height);
};

/**
 * Redraw `Pie`.
 *
 * @return {Pie}
 * @api private
 */

Pie.prototype.redraw = function() {
  var start = 0
    , keys = ['up', 'down']
    , val
    , percentage
    , color;

  for (var i = 0; i < keys.length; i++) {
    val = 360 / this.total * this[keys[i]];
    val = val == 360 ? 359.9 : val;
    this.paths[i].animate({ segment: this.segment(start, start += val) }, 1000, "<>");
    this.paths[i].angle = start - val / 2;
  }

  percentage = (this.up > this.down ? this.up : this.down) * 100 / this.total;
  color = (this.up > this.down ? this._colors[0] : this._colors[1]);
  this.text.attr("text", parseInt(percentage) + "%");
  this.text.attr("fill", color);
  return this;
};

/**
 * Update values of segments and redraw.
 *
 * @param {Number} up
 * @param {Number} down
 * @return {Pie}
 * @api public
 */

Pie.prototype.values = function(up, down) {
  this.up = parseInt(up);
  this.down = parseInt(down);
  this.total = (this.up + this.down);
  this.redraw();
  return this;
};
