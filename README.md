# Pie

Pie with two segments.

![js pie component](http://f.cl.ly/items/2F3H1i3S0Q3K0D0t2R3v/Screen%20Shot%202012-11-07%20at%2011.14.30%20AM.png)

## Example

```js
var pie = new Pie('#canvas');

pie.attach();
pie.setVotes(100, 50);
```

## API

### Pie#attach

Attach canvas to the container.

### Pie#font(family)

Change the font to `family`.

### Pie#setVotes(up, down)

Update positive and negative values and re-draw.

## License

MIT
