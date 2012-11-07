# Pie

Pie with two segments.

![js pie component](http://f.cl.ly/items/0E2e3c2n1O052n3J3h0a/Screen%20Shot%202012-11-07%20at%201.14.34%20PM.png)

## Example

```js
var pie = new Pie;
document.body.appendChild(pie.el);

pie.values(150, 100);
pie.colors("#000", "#ccc");
pie.font("14px 'Helvetica Neue', sans-serif");
```

## API

### Pie#size(width, height)

Set width and height attributes.

### Pie#colors(colors)

Set color of segments.

### Pie#background(color)

Set background color of centered circle.

### Pie#font(family)

Change the font to `family`.

### Pie#values(up, down)

Update values of segments and redraw.

## License

MIT
