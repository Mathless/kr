import {MapManager} from './map.manager.js';
import {SpriteManager} from './sprite.manager.js';
import {EventsManager} from './events.manager.js';
import {Player} from './units/player.js';
import {Bonus} from './units/bonus.js';
import {Bullet} from './units/bullet.js';
import {Spider} from './units/spider.js';
import {PhysicManager} from './physic.manager.js';
import {SoundManager} from './soundManager.js';


class GameManager {
	constructor(canvas, level) {
		document.getElementById('name').innerHTML = `Name = ${localStorage['name']}`;
		this.score = 0;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.soundManager = new SoundManager();
		this.soundManager.loadArray(['blaster.mp3', 'crunch.mp3', 'background.mp3']);
		this.soundManager.play('background.mp3', {looping: true});

		this.currentLevel = level;
		this.factory['Player'] = Player;
		this.factory['bonus'] = Bonus;
		this.factory['bullet'] = Bullet;
		this.factory['spider'] = Spider;
		this.eventsManager = new EventsManager(canvas);

		this.loadLevel(level);
		this.spriteManager = new SpriteManager();

	}

	loadLevel(level) {
		this.entities = [];
		this.player = undefined;
		this.mapManager = new MapManager(level);
		this.physicManager = new PhysicManager(this, this.mapManager);
		this.mapManager.parseEntities(this, this.physicManager, this.soundManager);
		this.mapManager.draw(this.ctx);
	}

	factory = {};
	entities = [];
	fireNum = 0;
	player = null;
	laterKill = [];

	initPlayer (obj) {
		this.player = obj;
	}
	kill (obj) {
		this.laterKill.push(obj);
	}
	update() {
		document.getElementById('hp').innerHTML = `HP = ${this.player.lifetime}`;

		document.getElementById('score').innerHTML = `Score = ${this.score}`;

		if(this.player === null) {
			return;
		}
		if (this.player.lifetime <= 0) {
			this.endGame();
		}

		this.player.move_x = 0;
		this.player.move_y = 0;
		if (this.eventsManager.action['up']) this.player.move_y = -1;
		if (this.eventsManager.action['down']) this.player.move_y = 1;
		if (this.eventsManager.action['left']) this.player.move_x = -1;
		if (this.eventsManager.action['right']) this.player.move_x = 1;
		if (this.eventsManager.action['fire']) {
			this.soundManager.play('blaster.mp3');
			const bullet1 = new Bullet(this.physicManager, this.soundManager, this.player, this.eventsManager.action.click);
			const bullet2 = new Bullet(this.physicManager, this.soundManager, this.player, this.eventsManager.action.click);
			bullet2.pos_x += bullet2.move_x*20 ;
			bullet2.pos_y += bullet2.move_y*20;

			this.entities.push(bullet1);
			this.entities.push(bullet2);

			this.eventsManager.action['fire'] = false;
			// this.player.fire();
		}
		let noEnemiesLeft = true;
		this.entities.forEach((e) => {
			try {
				if(e instanceof Spider){
					e.move_x = Math.sign(this.player.pos_x - e.pos_x);
					e.move_y = Math.sign(this.player.pos_y - e.pos_y);
					noEnemiesLeft = false;
				}
				if ( e instanceof Spider && Math.abs(e.pos_x - this.player.pos_x) +Math.abs(e.pos_y - this.player.pos_y) > 160) {
					e.move_x = 0;
					e.move_y = 0;
				}
				e.update();
			} catch(ex) {
				console.log(ex);
			}
		});
		for(let i = 0; i < this.laterKill.length; i++) {
			const idx = this.entities.indexOf(this.laterKill[i]);
			console.log(idx);
			if(idx > -1) {

				this.entities.splice(idx, 1);
			}
		}
		if(this.laterKill.length > 0) {
			this.laterKill.length = 0;
		}
		this.mapManager.draw(this.ctx);
		// mapManager.centerAt(this.player.pos_x, this.player.pos_y);
		this.draw(this.ctx);
		// if(this.currentLevel === 1) noEnemiesLeft = true;
		if(noEnemiesLeft) this.nextLevel();
	}

	draw() {
		for(let e = 0; e < this.entities.length; e++) {
			this.entities[e].draw(this.spriteManager, this.ctx);
		}
	}

	nextLevel(){
		clearInterval(this.interval);
		if (this.currentLevel === 2){
			this.endGame();
		} else{
			this.currentLevel += 1;
			this.loadLevel(this.currentLevel, this.canvas);
			alert('???? ???????????????????? ???? ?????????????????? ??????????????');
			this.play();
		}
	}


	play() {
		localStorage['currentPoints'] = 0;

		this.interval = setInterval((((self) => () => {
			self.update();
		})(this)), 100);}

	endGame() {
		clearInterval(this.interval);

		const scores = new Map(JSON.parse(localStorage.scores ?? '[]'));
		if ((scores.get(localStorage.name) ?? 0) <= this.score) { scores.set(localStorage.name, this.score); }
		localStorage.setItem('scores', JSON.stringify(Array.from(scores.entries())));

		alert(`Your score: ${this.score}!`);
		location.href = 'http://localhost:3001/login.html';

	}
}

window.GameManager = GameManager;