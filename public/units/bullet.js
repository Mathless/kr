import {Entity} from './entity.js';
import {Player} from './player.js';

export class Bullet extends Entity {
	move_x = 0;
	move_y = 0;
	speed = 10;
	constructor(physicManager, soundManager, player, click) {
		super(physicManager, soundManager);
		this.size_x = 12;
		this.size_y = 12;
		this.move_x = player.pos_x - click.pos_x;
		this.move_y = player.pos_y - click.pos_y;
		const normalized_x = this.move_x / (Math.abs(this.move_x)+Math.abs(this.move_y));
		const normalized_y = this.move_y / (Math.abs(this.move_x)+Math.abs(this.move_y));
		this.move_x = -1*normalized_x;
		this.move_y = -1*normalized_y;
		this.pos_x = player.pos_x + this.move_x*20;
		this.pos_y = player.pos_y + this.move_y*20;
	}
	draw(spriteManager, ctx){
		spriteManager.drawSprite(ctx, 'bullet', this.pos_x, this.pos_y);
	}
	update(){
		this.physicManager.update(this);
	}
	onTouchEntity(entity){
		if(!(entity instanceof  Player))
		{entity.lifetime -= 100;}
		this.kill();
	}
	onTouchMap(idx){
		this.kill();
	}
	kill(){ // Уничтожения объекта
		this.physicManager.gameManager.kill(this);

	}
	fire(){

	}
}