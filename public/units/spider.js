import {Entity} from './entity.js';
import {Player} from './player.js';

export class Spider extends Entity {
	lifetime = 100;

	move_x = 0;
	move_y = 0;
	speed = 3;
	_currentSpirte_stay = 0;
	_currentSpirte_walk = 0;
	constructor(physicManager, soundManager) {
		super(physicManager, soundManager);
	}
	draw(spriteManager, ctx){
		this._currentSpirte_stay = this._currentSpirte_stay % 2 + 1;
		this._currentSpirte_walk = this._currentSpirte_walk % 4 + 1;
		if(this.move_x === 0 && this.move_y === 0) {
			spriteManager.drawSprite(ctx, `spider_stay_${this._currentSpirte_stay}`, this.pos_x, this.pos_y);
		} else{
			spriteManager.drawSprite(ctx, `spider_walk_${this._currentSpirte_walk}`, this.pos_x, this.pos_y);

		}
	}
	update(){
		if(this.lifetime <= 0) this.kill();
		this.physicManager.update(this);
	}
	onTouchEntity(obj){
		if(obj instanceof Player){
			obj.lifetime -= 1;
		}

	}
	kill(){ // Уничтожения объекта
		this.soundManager.play('crunch.mp3');
		this.physicManager.gameManager.score += 100;
		this.physicManager.gameManager.kill(this);
	}
	fire(){

	}
}