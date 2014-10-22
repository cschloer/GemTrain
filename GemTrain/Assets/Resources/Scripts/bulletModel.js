var curX:float;
var curY:float;

var Manager;
var clock : float;

var direction : int;


var SPEED : float;


var NORTH:int = 0;
var EAST:int = 1;
var SOUTH:int = 2;
var WEST:int = 3;

var target;
var WIDTH:int;
var HEIGHT:int;
var particleGlow;

function Start () {
	Destroy(gameObject.collider);
	clock = 0.0;
	SPEED = 0.1;
	if (Manager.curLevel > 1) SPEED *= Manager.curLevel;
	delay = 0;
	particleGlow = Instantiate(Manager.bulletPart);
	particleGlow.transform.parent = transform;
	particleGlow.transform.localPosition = Vector3(0,0,1);
	particleGlow.active = true;
}

function Update () {
	if (Manager.tempPause){
		return;
	}
	clock = clock + Time.deltaTime;		// Update the clock based on how much time has elapsed since the previous update.
	switch (direction){
		case NORTH:
			transform.position = Vector3(curX,curY+SPEED,0);
			curY+=SPEED;
			break;
		case EAST:
			transform.position = Vector3(curX+SPEED,curY,0);
			curX+=SPEED;
			break;
		case SOUTH:
			transform.position = Vector3(curX,curY-SPEED,0);
			curY-=SPEED;
			break;
		case WEST:
			transform.position = Vector3(curX-SPEED,curY,0);
			curX-=SPEED;
			break;
	
	
	}
	
	if (curX + 6 > WIDTH + 1 || curX + 6 < 0 -1|| curY + 3 > HEIGHT + 1|| curY + 3< 0 - 1) this.transform.parent.gameObject.SetActive(false);
	
	var HITBOX:float = 0.5; // HITBOX of a train
	
	if (( curX > target.x - HITBOX) && (curX < target.x + HITBOX) && (curY > target.y - HITBOX) && (curY < target.y + HITBOX)){

		if (!target.isShielded) target.iceHit();
		
		this.transform.parent.gameObject.SetActive(false);

	 }
}

