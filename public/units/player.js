import {Entity} from './entity.js';

export class Player extends Entity {
	lifetime = 100;
	move_x = 0;
	move_y = 0;
	speed = 5;
	_currentSpirte = 0;
	constructor(physicManager, soundManager) {
		super(physicManager, soundManager);
	}
	draw(spriteManager, ctx){
		this._currentSpirte = this._currentSpirte % 2 + 1;

		if(this.move_x === 0 && this.move_y === 0) {
			spriteManager.drawSprite(ctx, `player_stay_${this._currentSpirte}`, this.pos_x, this.pos_y);
		} else{
			spriteManager.drawSprite(ctx, `player_walk_${this._currentSpirte}`, this.pos_x, this.pos_y);

		}
	}
	update(){
		this.physicManager.update(this);
	}
	onTouchEntity(obj){

	}
	kill(){ // Уничтожения объекта

	}
	fire(){
        
	}
}