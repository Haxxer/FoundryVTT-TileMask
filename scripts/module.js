import { libWrapper } from "./lib/libWrapper/shim.js";
import * as lib from "./lib/lib.js";

Hooks.once('ready', async function() {
	patchTileRender();
	refreshTiles();
});

Hooks.on("renderTileConfig", (app, html, data) => {
	let tile = canvas.foreground.get(app.object.id);
	let checked = tile.data?.flags?.tilemask?.isMasked ? "checked" : "";
	let container = html.find('div[data-tab="basic"]');
	container.append(`
		<div class="form-group">
				<label>Walls masks tile</label>
				<div class="form-fields">
					<input class="checkbox" type="checkbox" name="flags.tilemask.isMasked" ${checked}>
				</div>
		</div>
	`);
	html.css("height", "443px");
});

function patchTileRender() {
	libWrapper.register(
		"tile-mask",
		"Tile.prototype.refresh",
		async function refresh(wrapped) {
			this.tile.children.forEach(c => {
				if(c.name === "tilemask"){
					this.tile.removeChild(c);
				}
			})
			if(this.data?.flags?.tilemask?.isMasked) {
				let width = Math.abs(this.data.width);
				let height = Math.abs(this.data.height);
				let radius = Math.max(width, height);
				let mask = lib.getMask(this.center, radius+10, this.tile.scale, this.data.rotation);
				mask.name = "tilemask"
				this.tile.mask = mask;
				this.tile.addChild(mask);
			}else{
				this.tile.mask = null;
			}
			return wrapped();
		},
		"WRAPPER"
	);
}

function refreshTiles(){
	let tiles = canvas.background.placeables;
	tiles = tiles.concat(canvas.foreground.placeables);
	tiles.forEach(t => {
		if(t.data?.flags?.tilemask?.isMasked) t.refresh();
	})
}