export class MapManager {
	imgLoadCount;

	constructor(level) {
		this.level = level;
		this.loadMap(`/res/json/level${level}.json`);
		this.mapData = null;
		this.tLayer = null;
		this.xCount = 0;
		this.yCount = 0;
		this.tSize = {x: 64, y: 64};
		this.mapSize = {x: 64, y: 64};
		this.tilesets = [];
	}

	loadMap(path) {
		const request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				this.parseMap(request.responseText);
			}
		};
		request.open('GET', path, true);
		request.send();
	}

	parseMap(tilesJSON) {
		const img = new Image();
		let i;
		this.mapData = JSON.parse(tilesJSON);
		this.xCount = this.mapData.width;
		this.yCount = this.mapData.height;
		this.tSize.x = this.mapData.tilewidth;
		this.tSize.y = this.mapData.tileheight;
		this.mapSize.x = this.xCount * this.tSize.x;

		this.mapSize.y = this.yCount * this.tSize.y;
		this.imgLoadCount = 0;
		for (i = 0; i < this.mapData.tilesets.length; i++) {

			img.onload = () => {
				this.imgLoadCount++;
				if (this.imgLoadCount ===
					this.mapData.tilesets.length) {
					this.imgLoaded = true;
				}
			};

			img.src = 'res/' + this.mapData.tilesets[i].image;
			const t = this.mapData.tilesets[i];
			const ts = {
				firstgid: t.firstgid,

				image: img,
				name: t.name,
				xCount: Math.floor(t.imagewidth / this.tSize.x),
				yCount: Math.floor(t.imageheight / this.tSize.y)
			};
			this.tilesets.push(ts);
		}
		this.jsonLoaded = true;
	}

	draw(ctx) {
		if (!this.imgLoaded || !this.jsonLoaded) {
			setTimeout(() => {
				this.draw(ctx);
			}, 100);
		} else {
			if (this.tLayer === null) {
				for (let id = 0; id < this.mapData.layers.length; id++) {
					const layer = this.mapData.layers[id];
					if (layer.type === 'tilelayer') {
						this.tLayer = layer;
						break;
					}
				}
			}
			for (let i = 0; i < this.tLayer.data.length; i++) {
				if (this.tLayer.data[i] !== 0) {
					const tile = this.getTile(this.tLayer.data[i]);
					const pX = (i % this.xCount) * this.tSize.x;
					const pY = Math.floor(i / this.xCount) * this.tSize.y;
					ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x,
						this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
				}
			}

		}
	}

	getTile(tileIndex) {
		const tile = {
			img: null,
			px: 0, py: 0
		};
		const tileset = this.getTileset(tileIndex);
		tile.img = tileset.image;
		const id = tileIndex - tileset.firstgid;
		const x = id % tileset.xCount;
		const y = Math.floor(id / tileset.xCount);
		tile.px = x * this.tSize.x;
		tile.py = y * this.tSize.y;
		return tile;
	}

	getTileset(tileIndex) {
		for (var i = this.tilesets.length - 1; i >= 0; i--)
			if (this.tilesets[i].firstgid <= tileIndex) {
				return this.tilesets[i];
			}
		return null;
	}
	parseEntities(gameManager, physicManager, soundManager) {
		if (!this.imgLoaded || !this.jsonLoaded) {
			setTimeout(() => { this.parseEntities(gameManager, physicManager, soundManager); }, 100);
		} else
			for (let j = 0; j < this.mapData.layers.length; j++)
				if(this.mapData.layers[j].type === 'objectgroup') {
					const entities = this.mapData.layers[j];
					for (let i = 0; i < entities.objects.length; i++) {
						const e = entities.objects[i];
						try {
							const obj = new gameManager.factory[e.class](physicManager, soundManager);
							obj.name = e.name;
							obj.pos_x = e.x;
							obj.pos_y = e.y;
							obj.size_x = e.width;
							obj.size_y = e.height;
							gameManager.entities.push(obj);
							if(obj.name === 'Player')
								gameManager.initPlayer(obj);
						} catch (ex) {
							console.log('Error while creating: [' + e.gid + '] ' + e.class +
								', ' + ex);
						}
					}
				}
	}
	getTilesetIdx(x, y){
		const wX = x;
		const wY = y;
		const idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
		return this.tLayer.data[idx];
	}
}
