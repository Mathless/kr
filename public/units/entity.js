export class Entity {
	pos_x= 0;
	pos_y= 0;
	size_x= 0;
	size_y= 0;
	constructor(physicManager, soundManager) {
		this.physicManager = physicManager;
		this.soundManager = soundManager;
	}
}