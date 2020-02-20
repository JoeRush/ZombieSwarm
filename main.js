
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 2.5;
    this.maxS = 200;
    this.visualRadius = 25;
    this.accel = 100000;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.changed = false;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.stateOFAccel = 1;
    
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    this.isGuard = {ammo: 0, stateG: false};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > 200) {
        var ratio = 200 / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setZombie = function () {
    this.it = true;
    this.color = 1;
    this.visualRadius = 500;
    this.speed = 10;
    this.velocity.x /= 3;
    this.velocity.y /= 3;
    this.accel /= 3;
    this.maxS /= 2;
    this.type = "z";
    if(!this.changed) {
        this.changed = true;
        this.game.zombies += 1;
        //console.log("humans before" + this.game.humans);
        this.game.humans -= 1;
       // console.log("humans" + this.game.humans);
        //console.log("zombies" + this.game.zombies);
       // console.log("___________");
    }


};
Circle.prototype.setGuard = function() {
    this.it = false;
    this.color = 2;
    this.visualRadius = 400;
    this.isGuard.ammo = 60;
    this.type = "g";
    this.isGuard.stateG = true;
    this.game.guard += 1;
    
}
Circle.prototype.setHuman = function () {
    this.it = false;
    this.color = 3;
    this.type = "h";
    this.game.humans += 1;
    
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 775 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 775 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if(ent.isGuard.stateG && this.it && ent.isGuard.ammo > 0) {
                console.log("hello theres the guards have worked");
                ent.isGuard.ammo -= 15;
                console.log("before azombie count: " + this.game.zombies);
                this.removeFromWorld = true;
                console.log(this.removeFromWorld);
                this.game.zombies -= 1;
                console.log("after zombie count: " + this.game.zombies);
                console.log("the ammo is" + ent.isGuard.ammo);
                if(ent.isGuard.ammo <= 0) {
                    ent.isGuard.stateG = false;
                    ent.setHuman;
                    console.log("became human" + this.game.humans);

                    this.game.guard -= 1;
                }
            }else if(this.isGuard.stateG && ent.it && this.isGuard.ammo > 0) {
                console.log("______________");
                this.isGuard.ammo -= 15;
                console.log("before azombie count: " + this.game.zombies)
                ent.removeFromWorld = true;
                this.game.zombies -= 1;
                console.log("after zombie count: " + this.game.zombies);
                if(this.isGuard.ammo <= 0) {
                    this.isGuard.stateG = false;
                    this.setHuman;
                    
                    this.game.guard -= 1;
                }
            }else if(this.it && !ent.it&& !ent.isGuard.stateG) {
                var chance = Math.floor((Math.random() * 100) + 1);
                console.log("the chance is" + chance);
                if(chance < 50) {
                    ent.setZombie();
                    

                } else {
                    console.log("hi");
                    ent.removeFromWorld = true;
                    if(this.game.humans > 0) {
                        ent.game.humans -= 1;
                    }else {
                        var ZCount = 0;
                        var HCount = 0;
                        var BCount = 0;
                        for(var i = 0; i < this.game.entities.length; i++) {
                            if(this.game.entities[i].type == "z") {
                                ZCount += 1;
                            }else if(this.game.entities[i].type == "h"){
                                HCount += 1;
                            }else if(this.game.entities[i].type == "g") {
                                BCount += 1;
                            }

                        }
                        this.game.humans = HCount;
                        this.game.zombies = ZCount;
                        this.game.guard = BCount;
                    }
                    
                }
                
            }
            else if (ent.it && !this.it && !this.isGuard.stateG) {
                var chance = Math.floor((Math.random() * 100) + 1);
                console.log("the chance is" + chance);
                if(chance < 50) {
                    this.setZombie();
                
                    
                } else {
                    this.removeFromWorld = true;
                    if(this.game.humans > 0) {
                        this.game.humans -= 1;
                    } else {
                        var ZCount = 0;
                        var HCount = 0;
                        var BCount = 0;
                        for(var i = 0; i < this.game.entities.length; i++) {
                            if(this.game.entities[i].type == "z") {
                                ZCount += 1;
                            }else if(this.game.entities[i].type == "h"){
                                HCount += 1;
                            }else if(this.game.entities[i].type == "g") {
                                BCount += 1;
                            }

                        }
                        this.game.humans = HCount;
                        this.game.zombies = ZCount;
                        this.game.guard = BCount;
                    }
                   
                    //humanCount--;
                    
                
                    
                }
              
            }  
            
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * this.accel / (dist*dist);
                this.velocity.y += difY * this.accel / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > this.maxS) {
                    var ratio = this.maxS / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            // if (this.it && ent.isGuard.stateG && dist > this.radius + ent.radius + 10) {
            //     var difX = (ent.x - this.x)/dist;
            //     var difY = (ent.y - this.y)/dist;
            //     this.velocity.x += difX * this.accel / (dist*dist);
            //     this.velocity.y += difY * this.accel / (dist * dist);
            //     var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
            //     if (speed > this.maxS) {
            //         var ratio = this.maxS / speed;
            //         this.velocity.x *= ratio;
            //         this.velocity.y *= ratio;
            //     }
            // }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * this.accel / (dist * dist);
                this.velocity.y -= difY * this.accel / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > this.maxS) {
                    var ratio = this.maxS / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

function CountManager(game) {
 
    this.ZombieLife = 10;
    this.HumanCountDown = 0;
    this.game = game;
    this.humanC = 20;
    this.type = "c";
    this.ctx = game.ctx;
    this.hasSpawned = false;
    this.lastSpawn = 0;
};

CountManager.prototype.draw = function () {

};

CountManager.prototype.update = function () {
    
    //console.log("humanCount is: " + this.game.humans);
    //console.log("the timer for this is:" + this.game.timer.gameTime % 30);
    if(!this.hasSpawned) {
        //console.log("hello hasSPawn" + this.game.timer.gameTime % 15);
        this.hasSpawned = true;
        if(this.game.timer.gameTime % 45  < 1 && this.game.humans < 200) {

            //console.log("this is how many guards to spawn: " + Math.floor(this.game.humans/50));
            
            if(this.game.humans >= 20) {
                for(var j = 0; j < Math.floor(this.game.humans/5); j++) {
                    if(this.game.guard < 20) {
                        var circle = new Circle(this.game);
                        circle.setGuard();
                        this.game.addEntity(circle);
                    
                    }
                }
            }


        }

        if(this.game.timer.gameTime % 15  < 1 && this.game.humans < 200) {
            
            //console.log("current humans new humans" + this.game.humans);
            var newPop = Math.floor(this.game.humans/4);
            //console.log("new humans to spawn:" + newPop)
            //console.log("Statue of hasSpawn" + this.hasSpawned);
            for(var i = 0; i < newPop ;i++) {
                var oldPop = this.game.humans;
                if( oldPop< 230) {
                    var circle = new Circle(this.game);
                    circle.setHuman();
                    
                    this.game.addEntity(circle);
                
                }
            }
           // console.log("new human count:" + this.game.humans);
            console.log("__________");
           // this.game.addHuman(circle);
        }
        this.HumanCountDown = 0;
    } else {
        //console.log("hasSPawn" + this.game.timer.gameTime % 15);
        //(this.hasSpawned &&  this.game.timer.gameTime % 15 > 1) {
            this.hasSpawned = false;
       // }
    }
    if(this.game.humans <= 0) {
        console.log("spawning new HUMANS AFTER DEATH");
        for(var i = 0; i < 15 ;i++) {
  
 
                var circle = new Circle(this.game);
                circle.setHuman();
                
                this.game.addEntity(circle);
                console.log("human count after respawn is " + this.game.humans);
            
        }
        for(var i = 0; i < 10 ;i++) {
  
 
            var circle = new Circle(this.game);
            circle.setGuard();
            
            this.game.addEntity(circle);
        
        }
    }
    
    if(this.game.zombies <= 0) {
        for(var i = 0; i < 5 ;i++) {


                var circle = new Circle(this.game);
                circle.setZombie();
                
                this.game.addEntity(circle);
            
            }
        
    }
    this.HumanCountDown += 1;
    
};

// the "main" code begins here
var friction = 1;
var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
//ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    circle.setZombie();   


    gameEngine.addEntity(circle);
    
    console.log("human count is now" + gameEngine.humans);
    var countManager = new CountManager(gameEngine);
    gameEngine.addEntity(countManager);
    gameEngine.init(ctx);
    gameEngine.start();
});
