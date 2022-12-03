import {Entity} from './entity.js';
import {Player} from './player.js';

export class Bonus extends Entity{
	move_x = 0;
	move_y = 0;
	speed = 0;
	constructor(physicManager, soundManager) {
		super(physicManager, soundManager);
	}
	draw(spriteManager, ctx){
		spriteManager.drawSprite(ctx, 'boost', this.pos_x, this.pos_y);
	}
	onTouchEntity(obj){
		if (obj instanceof Player){
			console.log('SPEEEEEEEED');
			obj.speed += 5;
			this.kill();
		}

	}
	update(){
		this.physicManager.update(this);
	}
	kill(){
		// localStorage['currentPoints'] += 100;
		this.physicManager.gameManager.kill(this);
	}
    
}