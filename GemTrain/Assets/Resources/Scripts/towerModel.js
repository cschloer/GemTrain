var manager;
var x:float;
var y:float;
var clock : float;
var explode : boolean;
var explosionParticle;

var NORTH:int = 0;
var EAST:int = 1;
var SOUTH:int = 2;
var WEST:int = 3;

var direction:int;



function Start () {
	Destroy(gameObject.collider);
	explode = false;
	clock = Random.Range(0,6);
	turret = false;
}

function Update () {
	if (manager.tempPause){
		return;
	}
	clock = clock + Time.deltaTime;		// Update the clock based on how much time has elapsed since the previous update.
	if (explode){
		if (clock > 0.95){
			Destroy(transform.parent.gameObject);
		}
		return;
	}
	
	if (clock> (5 / (manager.curLevel))) { 
		direction = Random.Range(0,4);
		manager.spawnBullets(x, y, NORTH);
		manager.spawnBullets(x, y, EAST);
		manager.spawnBullets(x, y, SOUTH);
		manager.spawnBullets(x, y, WEST);
		
		clock = 0;
	}
}

function explosion(){
	clock = 0;
	explode = true;
	explosionParticle = Instantiate(manager.explosionIce);
	explosionParticle.name = "Explosion";
	explosionParticle.transform.parent = transform;
	explosionParticle.transform.localPosition = Vector3(0,0,0);
	explosionParticle.active = true;

}