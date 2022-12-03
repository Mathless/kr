export class EventsManager {
	bind = {};
	action = {};
	constructor(canvas){
		this.bind[87] = 'up';
		this.bind[65] = 'left';
		this.bind[83] = 'down';
		this.bind[68] = 'right';
		this.bind[32] = 'fire'; 
		canvas.addEventListener('mousedown', (((self) => () => {
			self.onMouseDown(event);
		})(this)));
		canvas.addEventListener('mouseup', (((self) => () => {
			self.onKeyUp(event);
		})(this)));
		document.body.addEventListener('keydown', (((self) => () => {
			self.onKeyDown(event);
		})(this)));
		document.body.addEventListener('keyup', (((self) => () => {
			self.onKeyUp(event);
		})(this)));
	}
	onMouseDown (event) {
		this.action['fire'] = true;
		this.action.click = {};
		this.action.click.pos_x = event.offsetX;
		this.action.click.pos_y = event.offsetY;
	}
	onMouseUp (event) {
		this.action['fire'] = false;
	}
	onKeyDown (event) {
		const action = this.bind[event.keyCode];
		if (action) {
			this.action[action] = true;
		}
	}

	onKeyUp (event) {
		const action = this.bind[event.keyCode];
		if (action) {
			this.action[action] = false;
		}
	}
}