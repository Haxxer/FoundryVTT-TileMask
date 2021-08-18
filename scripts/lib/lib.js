export function rotateVector(ax, ay, bx, by, angle) {
	let rad = -((Math.PI / 180) * angle);
	let cos = Math.cos(-rad);
	let sin = Math.sin(-rad);
	let run = bx - ax;
	let rise = by - ay;
	let cx = (cos * run) + (sin * rise) + ax;
	let cy = (cos * rise) - (sin * run) + ay;
	return {
		x: cx,
		y: cy
	};
}


export function getMask(origin, radius, scale, degrees) {
	const { rays, los, fov } = canvas.walls.computePolygon(origin, radius, {
		type: "movement",
		density: "12",
	});

	if(degrees !== 0) {
		let points = [];
		for (let i = 0; i < fov.points.length; i += 2) {
			let obj = rotateVector(
				origin.x,
				origin.y,
				fov.points[i],
				fov.points[i + 1],
				degrees
			);
			points.push(obj.x)
			points.push(obj.y)
		}
		fov.points = points;
	}

	if(scale.x !== 1 || scale.y !== 1){
		let points = [];
		for (let i = 0; i < fov.points.length; i += 2) {
			points.push(fov.points[i] * (1/scale.x));
			points.push(fov.points[i + 1] * (1/scale.y));
		}
		fov.points = points;
	}

	let g = new PIXI.Graphics();
	g.beginFill(0xffffff);
	g.drawPolygon(fov);
	g.endFill();
	g.x -= origin.x * (1 / scale.x);
	g.y -= origin.y * (1 / scale.y);
	g.isMask = true;
	return g;
}