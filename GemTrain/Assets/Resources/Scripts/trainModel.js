var Manager;


var x : float;
var y : float;
var tracks;
var rotationDelta : float;
var rotationType : int;
var rotation :  float;
var timer : float;
var SPEED = 16.0;
var speed; // Higher numbers are slower
var TRACKLENGTH = 1.0;
var direction;	// The direction this 

var clock:float;

var switchSide:boolean;

var xDisplace : float;
var yDisplace : float;

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

var WIDTH = 13;
var HEIGHT = 9;

var xTrack;
var yTrack;

var curTrack;

var origTrain:boolean; // is this the first train added

var isShielded:boolean;

var shieldScript : Component;

var explodeTower:boolean;
var explodeMine:boolean;

var sendBack:boolean;
var iced:boolean;
var iceLevel:float;
var iceTimer:int;
var iceParticle;
var tempRemove:boolean;

var explosionParticle;


// Use this for initialization
function Start () {
	clock = 0;
	speed = SPEED;
	switchSide = false;
	timer = 0;
	rotationDelta = 0; 
	rotationType = 0;
	isShielded = false;
	var shield;
	shield = Instantiate(Manager.trainShield);
	shield.transform.parent = transform;
	shield.active = true;
	shield.enableEmission = true;
	shield.transform.position = Vector3(-50,-50,1);
	shield.name = "Shield";
	shieldScript = shield.GetComponent(Shield);
	shieldScript.train = this;
	
	explosionParticle = Instantiate(Manager.explosion);
	explosionParticle.name = "Explosion";
	explosionParticle.transform.parent = transform;
	explosionParticle.transform.localPosition = Vector3(0,0,0);
	explosionParticle.playOnAwake = false;
	explosionParticle.active = true;
	
	
	explodeMine = false;
	explodeTower = false;
	sendBack = false;
	iced = false;
	iceLevel = 1.0;
	iceTimer = 0;
	iceParticle = Instantiate(Manager.trainIcy);
	iceParticle.name = "Ice";
	iceParticle.transform.parent = transform;
	iceParticle.transform.localPosition = Vector3(0,0,0);
	iceParticle.active = false;
	tempRemove = false;
	//xDisplace = 1/speed;
	//yDisplace = 0;
	//if (!origTrain) speed = SPEED*2;
	updateDisplace();
}

// speed is the number of updates you need to do before the train moves onto the next track.


// Update is called once per frame
function Update () {
	if (Manager.tempPause || Manager.isSpawningTrain){ 
		return;
	}
	
	if (iced){
		if (iceTimer == speed*12){
			iceLevel = 1.0;
			iced = false;
			iceParticle.active = false;
		}
		iceTimer++; 
	}
	
	if (timer >= speed){
		if (sendBack){
			timer = 0;
			rotationDelta = 0;
			rotationType = 0;
			xTrack = 0-1;
			yTrack = 4;
			x = 0-6-.5;
			y = 4-3;
			direction = EAST;
			rotation = 3*90;
			clock = 0;
			sendBack = false;
			tempRemove = true;
			gameObject.renderer.enabled = false;
			iceParticle.active = false;
			shieldScript.reset();
			if (Manager.powerUp != 1) Manager.clearGem();
			Manager.temporaryPause();
			shieldScript.reset();
		}
		updateDisplace();
		timer = 0;
		rotationDelta = 0;
	}
	if (explodeTower && timer >= speed/4){
		switch(direction){
			case NORTH:
				tracks[xTrack][yTrack+1].tower.model.explosion();
				break;
			case EAST:
				if (switchSide) tracks[0][yTrack].tower.model.explosion();
				else tracks[xTrack+1][yTrack].tower.model.explosion();
				break;
			case SOUTH:
				tracks[xTrack][yTrack-1].tower.model.explosion();
				break;
			case WEST:
				if (switchSide) tracks[WIDTH-1][yTrack].tower.model.explosion();
				else tracks[xTrack-1][yTrack].tower.model.explosion();
				break;
		
		}
		explodeTower = false;
	}
	if (explodeMine && timer >= speed/4){
	
		switch(direction){
			case NORTH:
				tracks[xTrack][yTrack+1].mine.model.explode();
				tracks[xTrack][yTrack+1].mine = null;
				break;
			case EAST:
				if (switchSide){
					tracks[0][yTrack].mine.model.explode();
					tracks[0][yTrack].mine = null;
				}
				else{
					tracks[xTrack+1][yTrack].mine.model.explode();
					tracks[xTrack+1][yTrack].mine = null;
				}
				break;
			case SOUTH:
				tracks[xTrack][yTrack-1].mine.model.explode();
				tracks[xTrack][yTrack-1].mine = null;
				break;
			case WEST:
				if (switchSide) {
					tracks[WIDTH-1][yTrack].mine.model.explode();
					tracks[WIDTH-1][yTrack].mine = null;
				}
				else {
					tracks[xTrack-1][yTrack].mine.model.explode();
					tracks[xTrack-1][yTrack].mine = null;
				}
				break;
		
		}
		explodeMine = false;
		sendBack = true;
		explode();
	
	}

	x += xDisplace/iceLevel;
	y += yDisplace/iceLevel;
	transform.position = Vector3(x,y,0);
	
	
	// rotationDelta calculation
	if (rotationType!=0){
	
		/* //Change the angle faster in the middle slower on the outside
		if 	(timer < (speed)/2) rotationDelta+= 45.0/speedSum;
		else if (timer > speed/2) rotationDelta-= 45.0/speedSum;
		*/
		
		
		rotationDelta = 90.0/speed;
	}
	

	
	if(rotationType==1) rotation += rotationDelta/iceLevel;
	else rotation -= rotationDelta/iceLevel;
	
	transform.eulerAngles = Vector3(0.0,0.0,rotation);	
	timer += 1.0/iceLevel;
}

function checkCollide(){
	if (curTrack.gem != null) {
		if (Manager.hasGem == true){
			//Add more levels here
			Manager.powerUp = 1;
		}
		else Manager.hasGem = true;
		switch(curTrack.gem.model.gemType){ // Multiples the gem power correctly
			case 1:			// GREEN
				Manager.powerUp *= Manager.GREENPOWER;
				break;
			case 2:			// BLUE
				Manager.powerUp *= Manager.BLUEPOWER;
				break;
			case 3:			// RED
				Manager.powerUp *= Manager.REDPOWER;
				break;
			case 4:			// ORANGE
				Manager.powerUp *= Manager.ORANGEPOWER;
				break;
		}
		
		Destroy(curTrack.gem.gameObject);
		curTrack.hasGem = false;
		Manager.gotGem();
		
	}
	if (Manager.powerUp % Manager.GREENPOWER == 0){
		speed = SPEED/2;
		if (origTrain) renderer.material.mainTexture = Resources.Load("Textures/train2", Texture2D);
	}
	else {
		speed = SPEED;
		if (origTrain) renderer.material.mainTexture = Resources.Load("Textures/train1", Texture2D);	
	}

	
	
	/* NOT USEFUL WITH ONLY ONE TRAIN
	for (var i = 0; i < Manager.trains.length; i++){	// Check colliding with another train
		if (Manager.trains[i].model != null && (Manager.trains[i].model.curTrack == this.curTrack && Manager.trains[i].model != this)){
			if ( Manager.trains[i].model.origTrain){
				Destroy(transform.parent.gameObject);
			//	Manager.gameOver();
			}
			else if (this.origTrain ){
				Destroy(Manager.trains[i].gameObject);
			}
			else {
				
				Destroy(Manager.trains[i].gameObject);
				Destroy(transform.parent.gameObject);
			}
			
		}
	}
	*/


}

function checkExplode(){
	switch(direction){
			case NORTH:
				if (tracks[xTrack][yTrack+1].tower != null) explodeTower = true;
				if (tracks[xTrack][yTrack+1].mine != null) {
					explodeMine = true; 
					tracks[xTrack][yTrack+1].mine.model.toExplode = true;
				}
				break;
			case EAST:
				if (switchSide){ 
					if (tracks[0][yTrack].tower != null) explodeTower = true;
					if (tracks[0][yTrack].mine != null) {
						explodeMine = true; 
						tracks[0][yTrack].mine.model.toExplode = true;
						}
				}
				else {	
					if (xTrack < WIDTH -1 && tracks[xTrack+1][yTrack].tower != null) explodeTower = true;
					if (xTrack < WIDTH -1 && tracks[xTrack+1][yTrack].mine != null) {
						explodeMine = true; 
						tracks[xTrack+1][yTrack].mine.model.toExplode = true;
					}
					
				}
				break;
			case SOUTH:
				if (tracks[xTrack][yTrack-1].tower != null) explodeTower = true;
				if (tracks[xTrack][yTrack-1].mine != null) {
					explodeMine = true; 
					tracks[xTrack][yTrack-1].mine.model.toExplode = true;
				}
				break;
			case WEST:
				if (switchSide){ 
					if (tracks[WIDTH-1][yTrack].tower != null) explodeTower = true;
					if (tracks[WIDTH-1][yTrack].mine != null) {
						explodeMine = true; 
						tracks[WIDTH-1][yTrack].mine.model.toExplode = true;
					}
				}
				else {	
					if (xTrack > 0 && tracks[xTrack-1][yTrack].tower != null) explodeTower = true;
					if (xTrack > 0 && tracks[xTrack-1][yTrack].mine != null) {
						explodeMine = true; 
						tracks[xTrack-1][yTrack].mine.model.toExplode = true;
					}
				}
				break;
		}

}

function updateDisplace(){
	if (switchSide) {
		if (direction == WEST) {
			xTrack = WIDTH - 1;
			x = WIDTH-6-.5;
			curTrack = tracks[xTrack][yTrack];
			checkCollide();
			xDisplace = -TRACKLENGTH/speed;
			
		}
		else { // Direction is East, switch other side
			xTrack = 0;
			x = 0-6-.5;	
			curTrack = tracks[xTrack][yTrack];
			checkCollide();
			xDisplace = TRACKLENGTH/speed;
		}	
		switchSide = false;
		checkExplode();
		return;
	
	}
	switch(direction){
		case (NORTH):
			yTrack += 1;
			curTrack = tracks[xTrack][yTrack];
			checkCollide();
			goingNorth();
			checkExplode();
			break;
		case (EAST):
			if (xTrack == WIDTH - 1){
				switchSide = true;
				yDisplace = 0;
				rotationType = 0;
				checkCollide();
				checkExplode();
				xDisplace = TRACKLENGTH/speed;
			}
			else {
				xTrack += 1;
				curTrack = tracks[xTrack][yTrack];
				checkCollide();
				goingEast();
				checkExplode();
			}
			break;
		case (SOUTH):
			yTrack -= 1;
			curTrack = tracks[xTrack][yTrack];
			checkCollide();
			goingSouth();
			checkExplode();
			break;
		case (WEST):
			if (xTrack == 0){
			 	switchSide = true; 	// Need to send it to the other side
				yDisplace = 0;
				rotationType = 0;
				checkCollide();
				checkExplode();
				xDisplace = -TRACKLENGTH/speed;
			}
			else {
				xTrack -= 1;
				curTrack = tracks[xTrack][yTrack];
				checkCollide();
				goingWest();
				checkExplode();
			}
			break;
	}
	

}


function goingNorth(){
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==3)||(curTrack.model.trackType==3 && curTrack.model.rotation==0)||	// These are all tracks types that go from south to east
	(curTrack.model.trackType==4 && curTrack.model.rotation==0)||(curTrack.model.trackType==4 && curTrack.model.rotation==1)||
	(curTrack.model.trackType==7 && curTrack.model.rotation==1)||(curTrack.model.trackType==6 && curTrack.model.rotation==1)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==1)) {
		xDisplace = .5*TRACKLENGTH/speed;
		yDisplace = .5*TRACKLENGTH/speed;
		rotationType = -1;
		direction = EAST;
		return;
	}
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==2)||(curTrack.model.trackType==4 && curTrack.model.rotation==3)||	// These are all tracks types that go from south to west
	(curTrack.model.trackType==7 && curTrack.model.rotation==0)||(curTrack.model.trackType==7 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==0)||(curTrack.model.trackType==3 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==5 && curTrack.model.rotation==3)){
		xDisplace = -.5*TRACKLENGTH/speed;
		yDisplace = .5*TRACKLENGTH/speed;
		rotationType = 1;
		direction = WEST;
		return;
	}
	
	//otherwise it is going south to north
	xDisplace = 0;
	yDisplace = TRACKLENGTH/speed;
	rotationType = 0;
	return;
}

function goingEast(){

	if ((curTrack.model.trackType==0 && curTrack.model.rotation==1)||(curTrack.model.trackType==3 && curTrack.model.rotation==2)||	// These are all tracks types that go from west to north
	(curTrack.model.trackType==4 && curTrack.model.rotation==2)||(curTrack.model.trackType==5 && curTrack.model.rotation==2)||
	(curTrack.model.trackType==7 && curTrack.model.rotation==2)||(curTrack.model.trackType==7 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==3)){
		xDisplace = .5*TRACKLENGTH/speed;
		yDisplace = .5*TRACKLENGTH/speed;
		rotationType = 1;
		direction = NORTH;
		return;
	}
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==2)||(curTrack.model.trackType==3 && curTrack.model.rotation==3)||	// These are all tracks types that go from west to south
	(curTrack.model.trackType==4 && curTrack.model.rotation==0)||(curTrack.model.trackType==4 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==6 && curTrack.model.rotation==0)||(curTrack.model.trackType==7 && curTrack.model.rotation==0)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==0)){
		xDisplace = .5*TRACKLENGTH/speed;
		yDisplace = -.5*TRACKLENGTH/speed;
		rotationType = -1;
		direction = SOUTH;
		return;
	}
	
	//otherwise it is going west to east
	xDisplace = TRACKLENGTH/speed;
	yDisplace = 0;
	rotationType = 0;
	return;
}

function goingSouth(){
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==0)||(curTrack.model.trackType==3 && curTrack.model.rotation==1)||	// These are all tracks types that go from north to east
	(curTrack.model.trackType==4 && curTrack.model.rotation==1)||(curTrack.model.trackType==5 && curTrack.model.rotation==1)||
	(curTrack.model.trackType==7 && curTrack.model.rotation==1)||(curTrack.model.trackType==7 && curTrack.model.rotation==2)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==2)) {
		xDisplace = .5*TRACKLENGTH/speed;
		yDisplace = -.5*TRACKLENGTH/speed;
		rotationType = 1;
		direction = EAST;
		return;
	}
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==1)||(curTrack.model.trackType==3 && curTrack.model.rotation==2)||	// These are all tracks types that go from north to west
	(curTrack.model.trackType==4 && curTrack.model.rotation==2)||(curTrack.model.trackType==4 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==6 && curTrack.model.rotation==3)||(curTrack.model.trackType==7 && curTrack.model.rotation==3)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==3)){
		xDisplace = -.5*TRACKLENGTH/speed;
		yDisplace = -.5*TRACKLENGTH/speed;
		rotationType = -1;
		direction = WEST;
		return;
	}
	
	//otherwise it is going north to south
	xDisplace = 0;
	yDisplace = -TRACKLENGTH/speed;
	rotationType = 0;
	return;
}

function goingWest(){
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==0)||(curTrack.model.trackType==3 && curTrack.model.rotation==1)||	// These are all tracks types that go from east to north
	(curTrack.model.trackType==4 && curTrack.model.rotation==1)||(curTrack.model.trackType==4 && curTrack.model.rotation==2)||
	(curTrack.model.trackType==6 && curTrack.model.rotation==2)||(curTrack.model.trackType==7 && curTrack.model.rotation==2)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==2)){
		xDisplace = -.5*TRACKLENGTH/speed;
		yDisplace = .5*TRACKLENGTH/speed;
		rotationType = -1;
		direction = NORTH;
		return;
	}
	
	//NOT DONE
	if ((curTrack.model.trackType==0 && curTrack.model.rotation==3)||(curTrack.model.trackType==3 && curTrack.model.rotation==0)||	// These are all tracks types that go from eastt to south
	(curTrack.model.trackType==4 && curTrack.model.rotation==0)||(curTrack.model.trackType==5 && curTrack.model.rotation==0)||
	(curTrack.model.trackType==7 && curTrack.model.rotation==0)||(curTrack.model.trackType==7 && curTrack.model.rotation==1)||
	(curTrack.model.trackType==8 && curTrack.model.rotation==1)){
		xDisplace = -.5*TRACKLENGTH/speed;
		yDisplace = -.5*TRACKLENGTH/speed;
		rotationType = 1;
		direction = SOUTH;
		return;
	}
	
	//otherwise it is going west to east
	xDisplace = -TRACKLENGTH/speed;
	yDisplace = 0;
	rotationType = 0;
	return;

}



function shieldOn(){
	if (tempRemove) return;
	isShielded = true;
	shieldScript.turnOn();
}

function shieldOff(){
	isShielded = false;
	shieldScript.turnOff();
	//shield.enableEmission = false;
	//shield.active = false;
}

function iceHit(){
	iced = true;
	iceLevel = 8;
	iceTimer = 0;
	iceParticle.active = true;

}

function reset(){
	timer = 0;
	rotationDelta = 0;
	rotationType = 0;
	xTrack = 0-1;
	yTrack = 4;
	x = 0-6-.5;
	y = 4-3;
	direction = EAST;
	rotation = 3*90;
	clock = 0;
	sendBack = false;
	tempRemove = true;
	gameObject.renderer.enabled = false;
	iceParticle.active = false;
	shieldScript.reset();
	if (Manager.powerUp != 1) Manager.clearGem();
	Manager.resetBullets();
	Manager.temporaryPause();

}

function sendBegin(){
	timer = 0;
	rotationDelta = 0;
	rotationType = 0;
	xTrack = 0-1;
	yTrack = 4;
	x = 0-6-.5;
	y = 4-3;
	direction = EAST;
	rotation = 3*90;
	clock = 0;
	updateDisplace();
	Manager.clearTowers();
	Manager.clearMines();
	Manager.clearBullets();

}

function explode(){
	explosionParticle.transform.parent = curTrack.transform;
	explosionParticle.transform.localPosition = Vector3(0,0,0);
	explosionParticle.Play();
	sendBack = true;
	Manager.clearTowers();
	Manager.clearMines();
	Manager.clearBullets();
	//sendBegin();

}




