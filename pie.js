/**
 * Pie
 */

var Pie = function(context, options) {
  this.context = $(context);
  this.container = $(context).find('.pie');
  this.backgroundColor = this.container.css("background-color");
  this.family = 'bold 18px "Georgia", Arial, sans-serif';
  this.options = options || {};
  this.width = this.options.width || 137;
  this.height = this.options.height || 137;
  this.canvas = Raphael(this.container.get(0), this.width, this.height);
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
};

/**
 * Prototype
 */

Pie.prototype = {

  up: 0,
  down: 0,
  total: 0,

  segment: function(a1, a2) {
    return [this.width / 2, this.height / 2, 67, a1 || 0, a2 || 0];
  },

  font: function(family) {
    this.family = family || this.family;
    return this.family;
  },

  setVotes: function(up, down) {
    this.up = parseInt(up);
    this.down = parseInt(down);
    this.total = (this.up + this.down);
    this.updateLabels();
    this.redraw();
    return this;
  },

  updateLabels: function() {
    this.changeValue('.yes', this.up);
    this.changeValue('.no', this.down);
    this.changeValue('.total', this.total);
  },

  changeValue: function(selector, value) {
    var el = this.context.find(selector);
    el.text(el.text().replace(/\d+/, value));
    return this;
  },

  attach: function() {
    this.paths = this.canvas.set();
    this.paths.push(
      this.canvas.path().attr({ segment: this.segment(), fill: "#58c23c", "stroke-width": 0 }),
      this.canvas.path().attr({ segment: this.segment(), fill: "#ef0d2b", "stroke-width": 0 }));

    console.log(this.backgroundColor);

    this.circle = this.canvas.circle(this.width / 2, this.height / 2, 26);
    this.circle.attr({ stroke: 0, fill: this.backgroundColor });

    this.text = this.canvas.text(this.width / 2, this.height / 2, "");
    this.text.attr({ font: this.font(), fill: "#fff" });

    return this;
  },

  redraw: function() {
    var total = (this.up + this.down)
      , start = 0
      , keys = ['up', 'down']
      , val
      , percentage
      , color;

    for (var i = 0; i < keys.length; i++) {
      val = 360 / total * this[keys[i]];
      val = val == 360 ? 359.9 : val;
      this.paths[i].animate({ segment: this.segment(start, start += val) }, 1000, "<>");
      this.paths[i].angle = start - val / 2;
    }

    percentage = (this.up > this.down ? this.up : this.down) * 100 / total;
    color = (this.up > this.down ? "#58c23c" : "#ef0d2b");
    this.text.attr("text", parseInt(percentage) + "%");
    this.text.attr("fill", color);
  }

};
