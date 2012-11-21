# Pie

Pie with flexible segments.

![js pie component](http://f.cl.ly/items/0E2e3c2n1O052n3J3h0a/Screen%20Shot%202012-11-07%20at%201.14.34%20PM.png)

## Example

```js
var pie = new Pie;
document.body.appendChild(pie.el);

pie.segments(2);
pie.colors("#58c23c", "#ef0d2b").blank("#cfd4d8");
pie.font("14px 'Helvetica Neue', sans-serif");
pie.update(150, 100);
```

## API

### Pie#segments(n)

Change the number of segments to `n`.

### Pie#size(n)

Change the pie diameter to `n`, defaults to 137.

### Pie#colors(colors)

Set color of segments.

### Pie#blank(color)

Set default color of segment.

### Pie#background(color)

Set `fill` color of the centered circle.

### Pie#font(family)

Change the font to `family`.

### Pie#update(values)

Update values of segments and animate them.

### Pie#redraw

Redraw `Pie`. Useful if you have made any styling changes.

## License

MIT
