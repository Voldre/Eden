var TOP_TURN = false;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
context.globalAlpha = .1;
var fps = 1000 / 60;
var then = Date.now();
var startTime = then;

/**
 * Piskel was used to create my sprites.
 * It is a free online editor for animated sprites & pixel art
 * you should check it out (it's incredible)
 * https://www.piskelapp.com/ 
 */

var speedUpSprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABdElEQVRYR82W0RXCIAxF0zXcpG7jnyP55xwuYDdxjXpSm/oIoQlHetA/BJLLy4N0IPxN5zkZlwbjc7CmbhOF9l9H2vZ/A3HyQuAsmbGWk2PgvYPg2g9ATXKJDHtqkst22TOYyaUUoogeA8SNnmSdXMohc3rMIfi/FACViEBM5xkBvKTWfA7AaKWTG1BagQgEqpKXwDu5UskqgQeBPmjqATRjBCL3ADp8rxQFE7YB6FqCSHKlTFsTdr+GP3oAn9+4Cbs/xcbb7nbE5s1IS+8RHNKOuSleYv18vH/7efI5cQrufxnfA5y8FFgLYq2dTjSPEHhPRFy7fA/UJN+qBcA1ybf9K/CAyaUEokRo/CDCkzPM8latalhjnEsARI0lwFpnCyKZUwBLDAcCVcgAIhBYBgIALEUEgtdkJYjKv4EqAE9+Pf9fHgiZTvujpQlrbsQhJUjMtXMTDjNh5AZkKrW8hl080P0ptt52rxs3b0bafB5Ay3b8BvT6cqvw5EPXAAAAAElFTkSuQmCC';

var powerUpSprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABwCAYAAAAXB/A7AAACGklEQVRYR+1ZsXHDMAwk1/AY6egVMkHKdBkpXcpM4BWiLmNkDeVAkcoLhEjAlKy7nFxZJv75AB+QbXmHr+E6Lq7XLsKXz0vzG0dgWKgSQexEYAFn5oTxC3AtBUndcB2XBKoCQJBIYFGxj4JcVMURUv3+XQ0sJ5BqtUENuq3MvK0yY9FMSKJhENvZOfc+ONU8eAuunAcExoWaEIyNTBZwJs4YvwaW0uEKKWaVQFPLJkFLRZOgpUJFUFOhImgdZ7WIx9agtXs2YL8Puq3Mvd06e77h3925t53jZHvVzYPwIcwDAuNCLRWMjSlYwPP0Sxt6DRhTQ5X0uYpgLR0TgaTCRCCpMBNwFWYCrsJEcGwN9vVBt5W5tzXzoGgmJNEQiO0cU7ko58GPNA8ubgywUJ0HEDvNAwN4TjdhvBac00OV9JmaQOxGKwFX8XgFeNRUi8crOLYG+/mg28rc25p2Rvsvvh90tXNMxX2qfi8E91L+XiAwLlTnAcRO88AAnmuWMN4C5rF0bSIo7o33EKCKYxRg0Y9RcGwN9vFBt5W5t1XzgDcTkmgIxHaOwKdBNQ/cdxD+TyQwLFSVQOzEZAFn5oTxd4GB5CQYxrMGm9Sg28rM25p2Rvsvvh/0tXOcbTfdPAjP0vOF2+hgoZoKbZRi0/MFA3iefxPGR9nanYv7+43+Wz8Jzhps4YPcRFY3JgPCwzqDI4tmwgbRTBRQ+wsmv4hBGUclzwAAAABJRU5ErkJggg=='

var bulletSprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAQ0lEQVQoU2NkSPr/n4FUMI+REaYFzgALfPn//z83AwPjVwYGYmlUA6DG/v9PvKswDCBFM8g+6hsAMpUUV1AhECmMRgChtzPdurGgmgAAAABJRU5ErkJggg==';

// var burnSprite = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAAw0lEQVRoQ+2ZwQ3AIAwDYY7uP1rnoAIJBFXfPkt1F8A4l5CktcBfhc8vPgLu0tpVqlxQ7QfPMCAC+uFTBCJgd6CLUYsYMSdFhIHDAQsG5BCSAHbHvbLgnwy8C1EgVHOQQuTlgDoDRiW0asmI3jAMeDAw3wMkCzIbxoE4EAfiwO4AsSlZSylsSYXviGYICPs/p2P1k3wwoJ6KPPYDFgzsIjAGqL4wEPo5gEFoUYrVt1+VkErBQwD1LMv/kr170AiIA3HgARYMhEG2cflOAAAAAElFTkSuQmCC';
var burnSprite = 'images/Aircraft 2000b sprites steam.png';

var popCornSprite = 'data:image/png;base64,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';

// var shipSprite = 'data:image/png;base64,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';
var shipSprite = 'images/Aircraft 2000b sprites.png';
// var shipSprite = 'data:image/png;base64,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';

var explosionSprite = 'data:image/png;base64,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';

canvas.id = 'viewport';
canvas.width = window.innerWidth*.5;
canvas.height = window.innerHeight*.5;
context.imageSmoothingEnabled = false;
document.getElementsByTagName('body')[0].appendChild(canvas);
WAVE =  1800;
if (TOP_TURN) {
  canvas.style.transform = 'scaleX(-1)';
  UP = 39;
  DOWN = 37;
  LEFT = 40;
  RIGHT = 38;
  SHOOT = 32;
  RESET = 82;
  START = 13;
} else {
  UP = 38;
  DOWN = 40;
  LEFT = 37;
  RIGHT = 39;
  SHOOT = 32;
  RESET = 82;
  START = 13;
}

function State(name, updater, renderer)
{
  this.name = name;
  this.updater = updater;
  this.renderer = renderer;
}

function Intersection() {
  
}

Intersection.rectanglesIntersect = function(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
}

function Star(x, y) {
  var r = Math.max(50,Math.floor(Math.random()*256));
  var g = Math.max(125, Math.floor(Math.random()*256));
  var b = Math.max(240, Math.floor(Math.random()*256));
  this.x = Math.floor(x);
  this.y = Math.floor(y);
  var size = Math.floor(Math.random() * Star.MAX_SIZE);
  this.width = size;
  this.height = size;
  this.variance = Math.max(Math.random(), .2);
  this.color = 'rgb('+r+', '+g+', '+b+')';
}

Star.SPEED = 5;
Star.MAX_SIZE = 2;
Star.prototype.update = function() {
  if (game.overdrive) {
    var travel = Star.SPEED*this.variance*6;
    this.width = 50;
  } else {
    var travel = Star.SPEED*this.variance;
    this.width = this.height;
  }
  this.x -= travel;
  if(this.x + this.width < 0) {
    this.x = canvas.width;
  }
}
Game.prototype.updateScore = function() {
  document.getElementById('score').innerHTML = 'Score : ' + this.score;
}

Game.prototype.updateLives = function() {
  document.getElementById('lives').innerHTML = 'Vies : ' + this.lives;
}
Star.prototype.render = function(context) {
  if (game.overdrive) {
    context.globalAlpha = .6;
  }
  context.fillStyle = (game.overdrive) ? 'rgba(125, 135, 255, 1)' : this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
  context.globalAlpha = 1;
}

function Explosion(x, y) {
  this.currentFrame = 0;
  this.frames = 12;
  this.buffer = 4;
  this.currentBuffer = 0;
  this.alive = false;
  this.img = document.createElement('img');
  this.img.src = explosionSprite;
}

Explosion.prototype.reset = function() {
  this.currentFrame = 0;
  this.frames = 12;
  this.buffer = 4;
  this.currentBuffer = 0;
  this.alive = false;
};

Explosion.prototype.update = function() {
  if (!this.alive) {
     return;
  }
  this.x -= Popcorn.SPEED;
  if (this.currentBuffer === this.buffer) {
    this.currentBuffer = 0;
    this.currentFrame++;
    if (this.currentFrame === this.frames) {
      this.reset();
    }
  }
  this.currentBuffer++;
}

Explosion.prototype.render = function(context) {
  if (!this.alive) {
     return;
  }
  context.drawImage(
    this.img,
    0, this.currentFrame * 32, 32, 32,
    this.x-16, this.y-16, 64, 64
  );
}

function TitleState(name)
{
  State.call(this, name, this.update, this.render);
}

TitleState.prototype = new State();

TitleState.prototype.init = function() {
  game.overdrive = true;
  context.setTransform(1, 0, 0, 1, 0, 0);
  game.showUI('title');
  this.entities = [];
  this.starField = [];
  for (var i = 0; i < 1024; i++) {
    this.starField.push(
      new Star(
        Math.random()*canvas.width,
        Math.random()*canvas.height
      )
    );
  }
}

TitleState.prototype.update = function() {
  if (inputManager.start) {
    game.setState(game.states.game);
    game.currentState.init();
  }
  this.starField.forEach(function(entity) {
    entity.update();
  })
}

TitleState.prototype.render = function(context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  this.starField.forEach(function(entity) {
    entity.render(context);
  })
}

function GameOverState(name)
{
  State.call(this, name, this.update, this.render);
}

GameOverState.prototype = new State();

GameOverState.prototype.init = function() {
  context.setTransform(1, 0, 0, 1, 0, 0);
  this.timer = 0;
  console.log('Game Over');
  game.showUI('game_over');
  document.querySelector('#final_score').innerHTML = 'Score final : ' + game.score;
}

GameOverState.prototype.update = function() {
  if (inputManager.start) {
    game.setState(game.states.game);
    game.currentState.init();
    game.reset();
  }
  this.timer++;
}

GameOverState.prototype.render = function(context) { 
  for (var i = 0; i < canvas.width; i++) {
    context.drawImage(
      canvas,
      i, 0, 1, canvas.height,
      i, Math.sin((i*20*Math.PI/180))*2, 1, canvas.height
    );
  }
  for (var i = 0; i < canvas.height; i++) {
    context.drawImage(
      canvas,
      i, 0, canvas.width, 1,
      i, Math.sin((i*12*Math.PI/180))*2, canvas.width, 1
    );
  }
  if (this.timer > 60) {
    context.globalAlpha = .3;
  }
}


function GameState(name)
{
  State.call(this, name, this.update, this.render);
}

GameState.prototype = new State();

GameState.prototype.init = function() {
  game.overdrive = true;
  this.overdriveTimer = 90;
  context.fillStyle ='rgb(200,200,200)';
  context.setTransform(1, 0, 0, 1, 0, 0);
  game.showUI('game');
  this.timer = 0;
  this.tier1 = 1 * WAVE;
  this.tier2 = 2 * WAVE;
  this.tier3 = 3 * WAVE;
  this.tier4 = 4 * WAVE;
  this.enemyTimerEasy = 120;
  this.enemyTimerMedium = 60;
  this.enemyTimerHard = 30;
  this.enemyTimerNightmare = 5;
  this.currentEnemyTimer = this.enemyTimerEasy;
  this.powerUpTimer = 1600;
  this.starField = [];
  for (var i = 0; i < 1024; i++) {
    this.starField.push(
      new Star(
        Math.random()*canvas.width,
        Math.random()*canvas.height
      )
    );
  }
  
  this.player = new Player(20, Math.floor(canvas.height * .5), 100, null);
  for (var i = 0; i < 256; i++) {
    this.player.bulletPool.push(new Bullet(this.player.x + 32, this.player.y + 16, 1, 15));
  }
  this.enemyList = [];
  for (var i = 0; i < 32; i++) {
    this.enemyList.push(new Popcorn(canvas.width, Math.random() * (canvas.height - 32)));
  }
  
  this.explosions = [];
  for (var i = 0; i < 32; i++) {
    this.explosions.push(new Explosion(0, 0));
  }
  
  this.powerUps = [];
  for (var i = 0; i < 32; i++) {
    this.powerUps.push(new PowerUp(0, 0));
  }
  
  this.entities = [this.player];
  this.entities = this.entities.concat(
    this.enemyList,
    this.explosions,
    this.powerUps,
    this.player.bulletPool
  );
  
  console.log('game initialised');
}

GameState.prototype.deployEnemies = function() {
  if (this.timer && (this.timer % this.currentEnemyTimer === 0) ) {
    var enemy = this.enemyList.find(function(enemy) {
      return !enemy.alive;
    });
    enemy.reset();
    enemy.x = canvas.width;
    enemy.alive = true;
    enemy.y = Math.max(4, (canvas.height * Math.random()) - 24);
  }
}

GameState.prototype.deployPowerUps = function() {
  if (this.timer && (this.timer % this.powerUpTimer === 0) ) {
    if (Math.random() >= .01) {
      var powerup = this.powerUps.find(function(powerup) {
        return !powerup.alive;
      });
      powerup.x = canvas.width;
      powerup.alive = true;
      powerup.y = (canvas.height * Math.random()) - 16;
    }
  }
}

GameState.prototype.update = function() {
  
  if (this.timer > this.tier2) {
      this.currentEnemyTimer = this.enemyTimerMedium;
  }
  
  if (this.timer > this.tier3) {
      this.currentEnemyTimer = this.enemyTimerHard;
  }
  
  if (this.timer > this.tier4) {
      this.currentEnemyTimer = this.enemyTimerNightmare;
  }
  
  if (this.overdriveTimer < this.timer) {
    game.overdrive = false;
  }
  this.timer++;
  
  this.deployEnemies();
  this.deployPowerUps();
  
  this.entities.forEach(function(entity) {
    entity.update();
  });
  
  this.player.bulletPool.forEach(function(bullet) {
    if (!bullet.alive) {
      return;
    }
    
    game.currentState.enemyList.forEach(function(enemy) {
      if (!enemy.alive) {
        return;
      }
      if (Intersection.rectanglesIntersect(bullet, enemy)) {
        enemy.takeDamage(10);
        bullet.alive = false;
        if (!enemy.alive) {
          game.score += enemy.value;
          game.updateScore();
          enemy.hit = true;
          var explosion = game.currentState.explosions.find(notAlive);
          explosion.x = enemy.x;
          explosion.y = enemy.y;
          explosion.alive = true;
        }
      }
    });
  });
  var player = game.currentState.player;
  if (player.alive) {
    this.enemyList.forEach(function(enemy) {
      if(!enemy.alive) {
        return;
      }
      var playerHitBox = player.getHitBox();
      if(Intersection.rectanglesIntersect(enemy, playerHitBox)) {
        player.takeDamage(500);
        enemy.takeDamage(500);
        game.lives--;
        game.updateLives();
        var explosion = game.currentState.explosions.find(notAlive);
        explosion.x = enemy.x;
        explosion.y = enemy.y;
        explosion.alive = true;

        var explosion = game.currentState.explosions.find(notAlive);
        explosion.x = player.x;
        explosion.y = player.y;
        explosion.alive = true;

        if (game.lives === 0) {
          game.setState(game.states.game_over);
          game.currentState.init();
        }
      }
    });
    
    this.powerUps.forEach(function(powerup) {
      if (!powerup.alive) {
        return;
      }
      if (Intersection.rectanglesIntersect(powerup, player.getHitBox())) {
        player.powerLevel++;
        powerup.reset();
        game.score += powerup.value;
        game.updateScore();
      }
    });
  }
}
notAlive = function(item){
  return !item.alive;
}
alive = function(item) {
  return alive;
}
GameState.prototype.renderBackground = function(context) {
  this.starField.forEach(function(star) {
    star.update();
    star.render(context);
  });
}

GameState.prototype.render = function(context)  {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;
  this.renderBackground(context);
  this.entities.forEach(
    function(entity){
      entity.render(context);
    }
  );
}

function Game()
{
  this.reset();
  this.states = {};
  this.states['game'] = new GameState('game');
  this.states['title']  = new TitleState('title');
  this.states['game_over'] = new GameOverState('game_over');
  this.entities = [];
}

Game.prototype.reset = function() {
  this.score = 0;
  this.lives = 3;
  this.updateScore();
  this.updateLives();
}

Game.prototype.setState = function(state) {
  this.currentState = state;
}

Game.prototype.showUI = function(name)  {
  document.querySelectorAll('.state-ui-container').forEach(function(element) {
    element.style.display = 'none';
  });
  document.querySelector('#'+name).style.display = 'flex';
}

function Ship(x, y, width, height, health)
{
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.health = health;
  this.hit = false;
  
  this.alive = true;
  this.vx = 0;
  this.vy = 0;
}

Ship.prototype.render = function(context) {
  context.fillStyle = '#666';
  context.fillRect(this.x, this.y, this.width, this.height);
}

Ship.prototype.takeDamage = function(damage) {
  this.health -= damage;
  if (this.health <= 0) {
    this.alive = false;
  }
}

function Bullet(x, y, dir, speed) {
  this.vx = 0;
  this.vy = 0;
  this.width = 16;
  this.height = 8;
  this.x = x;
  this.y = y;
  this.dir = dir;
  this.speed = speed;
  this.alive = false;
  this.img = document.createElement('img');
  this.img.src = bulletSprite;
}

Bullet.prototype.update = function() {
  if (!this.alive) {
    return;
  }
  if (this.dir === 1) this.vx = this.speed + (Math.min(game.currentState.player.powerLevel * 2, 20));
  if (this.dir === -1) this.vx = this.speed;
  this.x += this.vx;
  if (this.x > canvas.width) {
    this.alive = false;
  }
}

Bullet.prototype.render = function(context) {
  if (!this.alive) {
    return
  }
  context.drawImage(this.img, 0, 0, 16, 8, this.x, this.y, this.width, this.height);
}

function PowerUp(x, y) {
  this.x = x;
  this.y = y;
  this.timer = Math.random() * 256;
  this.currentFrame = 0;
  this.currentBuffer = 0;
  this.buffer = 4;
  this.jump = canvas.height * .5;
  this.speed = 3;
  this.frames = 7;
  this.width = 16;
  this.height = 16;
  this.img = document.createElement('img');
  this.img.src = powerUpSprite;
  this.value = 20;
}

PowerUp.prototype.update = function() {
  this.vy = Math.cos(this.timer) * this.jump;
  this.timer += .03;
  this.y = canvas.height * .5 + this.vy;
  this.x -= this.speed;
  if (this.x + this.width <= 0) {
    this.reset();
  }
}

PowerUp.prototype.reset = function() {
  this.alive = false;
}

PowerUp.prototype.render = function(context) {
  if (!this.alive) {
    return;
  }
  if (this.currentBuffer === this.buffer) {
    this.currentBuffer = 0;
    this.currentFrame ++;
    if (this.currentFrame === this.frames) {
      this.currentFrame = 0;
    }
  }
  this.currentBuffer++;
  context.drawImage(
    this.img, 0, this.currentFrame * 16, 16, 16,
    this.x, this.y, this.width, this.height
  )
}

function Player(x, y, health, weapon)
{
  Ship.call(this, x, y, 32, 32, health);
  this.burning = false;
  this.frame = 0;
  this.burnFrame = 0;
  this.weapon = weapon;
  this.speed = 5;
  this.powerLevel = 1;
  this.bulletTimer = 5;
  this.bulletCoolDown = 5;
  this.img = document.createElement('img');
  this.burnImg = document.createElement('img');
  this.img.src = shipSprite;
  this.burnImg.src = burnSprite;
  this.bulletPool = [];
  this.hitBoxSize = [8, 8];

  this.timeToRespawn = 60
  this.timeBeforePlay = 0
}

Player.prototype = new Ship();

Player.prototype.getHitBox = function() {
  return {
    x: this.x + (this.width * .5) - (this.hitBoxSize[0] * .5),
    y: this.y + (this.height * .5) - (this.hitBoxSize[1] * .5),
    width: this.hitBoxSize[0],
    height: this.hitBoxSize[1],
  }
}

Player.prototype.update = function() {
  if (!this.alive) {
    this.timeBeforePlay++
    if (inputManager.start || this.timeBeforePlay >= this.timeToRespawn){
      this.timeBeforePlay = 0;
      game.currentState.init();
    }
    return;
  }
  this.vx = 0;
  this.vy = 0;
  if (inputManager.upPressed) {
    this.vy -= this.speed;
  }
  
  if (inputManager.downPressed) {
    this.vy += this.speed;
  }
  
  if (inputManager.rightPressed) {
    this.vx += this.speed;
    this.burning = true;
  } else {
    this.burning = false;
  }
  
  if (inputManager.leftPressed) {
    this.vx -= this.speed;
    this.burning = false;
  }
  
  if (inputManager.shooting || game.autoShoot) {
    if (this.bulletCoolDown === this.bulletTimer) {
      this.shoot();
      this.bulletTimer = 0;
    } else {
      this.bulletTimer++;
    }
  }
  
  this.x += this.vx;
  this.y += this.vy;
  
  if (this.x < 0) {
      this.x = 0;
  }
  
  if (this.y < 0) {
    this.y = 0;
  }
  
  if (this.x+this.width > canvas.width) {
    this.x = canvas.width - this.width;
  }
  
  if (this.y+this.height > canvas.height) {
    this.y = canvas.height - this.height;
  }
}

Player.prototype.shoot = function() {
  
  if (this.powerLevel === 1) {
    var bullet = this.bulletPool.find(notAlive);
    if (!bullet) {
      return;
    }
    bullet.x = this.x + this.width - bullet.width;
    bullet.y = (this.y + (this.height * .5)) - (bullet.height * .5);
    bullet.alive = true;
  }
  
  if (this.powerLevel === 2) {
    var bullet = this.bulletPool.find(notAlive);
    if (!bullet) {
      return;
    }
    bullet.alive = true;
    
    var bullet2 = this.bulletPool.find(notAlive);
    if (!bullet) {
      return;
    }
    bullet2.alive = true;
    
    bullet.x = this.x + this.width - bullet.width;
    bullet.y = (this.y + (this.height * .5)) - (bullet.height * .5) - 6;
    
    
    bullet2.x = this.x + this.width - bullet2.width;
    bullet2.y = (this.y + (this.height * .5)) - (bullet2.height * .5) + 6;
  }
  
  if (this.powerLevel >= 3) {
    var bullet = this.bulletPool.find(notAlive);
    if (!bullet) {
      return;
    }
    bullet.alive = true;
    
    var bullet2 = this.bulletPool.find(notAlive);
    if (!bullet2) {
      return;
    }
    bullet2.alive = true;
    
    var bullet3 = this.bulletPool.find(notAlive);
    if (!bullet3) {
      return;
    }
    bullet3.alive = true;
    
    bullet.x = this.x + this.width - bullet.width;
    bullet.y = (this.y + (this.height * .5)) - (bullet.height * .5) - 12;
    
    
    bullet2.x = this.x + this.width - bullet2.width + 8;
    bullet2.y = (this.y + (this.height * .5)) - (bullet2.height * .5);
    
    bullet3.x = this.x + this.width - bullet3.width;
    bullet3.y = (this.y + (this.height * .5)) - (bullet3.height * .5) + 12;
  }
  
  if (this.powerLevel >= 5) {
    var bullet = this.bulletPool.find(notAlive);
    if (!bullet) {
      return;
    }
    bullet.alive = true;
    
    var bullet2 = this.bulletPool.find(notAlive);
    if (!bullet2) {
      return;
    }
    bullet2.alive = true;
    bullet.x = this.x + this.width - bullet.width - 8;
    bullet.y = (this.y + (this.height * .5)) - (bullet.height * .5) - 24;
    bullet2.x = this.x + this.width - bullet2.width - 8;
    bullet2.y = (this.y + (this.height * .5)) - (bullet2.height * .5) + 24;
    
  }
  
}

Player.prototype.render = function(context) {
  if (!this.alive) {
    return;
  }
  this.buffer = this.buffer ? this.buffer + 1 : 1;
  if(this.buffer && this.buffer == 4) {
    this.frame += 1;
    if (this.frame >= 7) this.frame = 0;
    this.burnFrame += 1;
    if (this.burnFrame >= 2) this.burnFrame = 0;
    this.buffer = 0;
  }
  
  context.drawImage(
    this.img, 0, this.frame * 32, 32, 32,
    this.x, this.y, this.width, this.height
  )
  
  if (this.burning) {
    context.drawImage(
      this.burnImg, 0, this.burnFrame * 32, 32, 32,
      this.x, this.y, this.width, this.height
    )
  }
  
  this.bulletPool.forEach(function(bullet) {
    if (!bullet.alive) {
      return false;
    }
    bullet.render(context);
  })
  
}

function Popcorn(x, y)
{
  Ship.call(this, x, y, 32, 32, Popcorn.HEALTH);
  this.img = document.createElement('img');
  this.img.src = popCornSprite;
  this.frames = 12; 
  this.buffer = 4;
  this.speed = Popcorn.SPEED;
  this.value = 5;
  this.healthMax = Popcorn.HEALTH;
  this.reset();
}

Popcorn.prototype = new Ship(); 
Popcorn.SPEED = 5;
Popcorn.HEALTH = 80;

Popcorn.prototype.reset = function() {
  this.x = canvas.width;
  this.y = Math.random() * canvas.height - this.height;
  this.currentFrame = 0;
  this.currentBuffer = 0;
  this.alive = false;
  this.health = Popcorn.HEALTH;
}

Popcorn.prototype.update = function() {
  this.vx = -this.speed;
  this.x += this.vx;
  if (this.x + this.width <= 0) {
    this.reset();
  }
}

Popcorn.prototype.render = function(context) {
  if (!this.alive) {
    return;
  }
  if (this.currentBuffer === this.buffer) {
    this.currentBuffer = 0;
    this.currentFrame ++;
    if (this.currentFrame === this.frames) {
      this.currentFrame = 0;
    }
  }
  context.drawImage(
    this.img, 0, this.currentFrame * 32, 32, 32,
    this.x, this.y, this.width, this.height
  )
  context.fillStyle = '#f00';
  context.fillRect(this.x, this.y - 2, this.width, 1);
  
  context.fillStyle = '#0f0';
  this.perc = this.health/ this.healthMax;
  
  context.fillRect(this.x, this.y - 2, this.width * this.perc , 1)
  
  if (this.hit) {
    var tmpOperation = context.globalCompositeOperation
    context.globalCompositeOperation = 'color-dodge';
    context.drawImage(
      this.img, 0, this.currentFrame * 32, 32, 32,
      this.x, this.y, this.width, this.height
    )
    context.drawImage(
      this.img, 0, this.currentFrame * 32, 32, 32,
      this.x, this.y, this.width, this.height
    )
    context.globalCompositeOperation = tmpOperation;
    this.hit = false;
  }
  
  this.currentBuffer++;
}

Game.prototype.update = function() {
  this.currentState.update();
}

Game.prototype.render = function(context) {
  this.currentState.render(context);
}

Game.prototype.loop = function() {
  window.requestAnimationFrame(function(){this.loop()}.bind(this));
  now = Date.now();
  dt = now - then;
  if (dt <= fps) { return }
  then = now - (dt % fps);
  this.update();
  this.render(context);
}

Game.prototype.init = function() {
  this.autoShoot = true;
  this.setState(this.states.title);
  this.currentState.init();
  window.requestAnimationFrame(function(){ this.loop() }.bind(this));
}

var game = new Game();

function InputManager() {
  this.upPressed = false;
  this.downPressed = false;
  this.leftPressed = false;
  this.rightPressed = false;
  this.shooting = false;
  this.start = false;
}

InputManager.prototype.handleKey = function(e, state) {
  switch(e.keyCode) {
    case InputManager.UP:
      this.upPressed = state;
      break;
    case InputManager.DOWN:
      this.downPressed = state;
      break;
    case InputManager.LEFT:
      this.leftPressed = state;
      break;
    case InputManager.RIGHT:
      this.rightPressed = state;
      break;
    case InputManager.SHOOT:
      this.shooting = state;
      break;
    case InputManager.RESET:
      game.reset();
      game.setState(game.states.title);
      game.currentState.init();
      break;
    case InputManager.START:
      this.start = state;
      break;
  }
}

InputManager.UP = UP;
InputManager.DOWN = DOWN;
InputManager.LEFT = LEFT;
InputManager.RIGHT = RIGHT;
InputManager.SHOOT = SHOOT;
InputManager.RESET = RESET;
InputManager.START = START;

var inputManager = new InputManager();

window.addEventListener(
  'keydown', 
  function(e) {
    game.autoShoot = false;
    this.handleKey(e, true)
  }.bind(inputManager)
);

window.addEventListener(
  'keyup', 
  function(e){ 
    this.handleKey(e, false)
  }.bind(inputManager)
);

game.init();