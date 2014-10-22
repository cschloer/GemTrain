// Conrad Schloer & Tom Wexler 
// 
// KNOWN BUGS:
// SLOW train does not look good on turns
// Mine can be clicked and not explode but still send back
// 

import System;
import System.IO;

public var font:Font;
public var color:Color;


var gemFolder : GameObject;	// This will be an empty game object used for organizing objects in the hierarchy pane.
var gems : Array;			// This array will hold the gem objects that are created.
var gemType : int; 		// The next gem type to be created.

var towerFolder : GameObject;
var towers: Array;

var mineFolder : GameObject;
var mines : Array;

var trackFolder : GameObject;
var tracks : Array;

var bulletFolder : GameObject;
var bullets : Array;
var nextBullet: int;
var NUMBULLETS : int;

var trainFolder;
var trains : Array;
var WIDTH = 13;		// If Width is not odd need to change the gem spawning
var HEIGHT = 9;

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var n;

var editMode:boolean;

var randSeed:int; // the randomSeed used by the rand track generator
var useSeed:boolean;	// whether or not the rand track generator should use a loaded seed
var loadedSeed:int;

var randScript = null;

var isGem:boolean;

var xGem:int;
var yGem:int;

var gemTimer: float;
var totalGemTimer:float;

var clock:float;

var isTrack:boolean;

var score:float;
var scoreAdd:float;

var powerUp1;

var begin:boolean = false;

var startScreenObject= null;

var edgeLeft = null;
var edgeRight = null;

var hasGem:boolean = false; // wether the train has picked up a gem
var GEMTIME:int;
var SCORESPEED = 1;
var GUIskin : GUIStyle;

var GREEN:int = 1;
var BLUE:int = 2;
var RED:int = 3;
var ORANGE:int = 4;

var GREENPOWER:int = 2;
var BLUEPOWER:int = 3;
var REDPOWER:int = 5;
var ORANGEPOWER:int =7;

var curGems:Array;
var curLevel:int;

var powerUp : int;
var r:float;
var g:float;
var b:float;

var isGameOver:boolean;
var tempPause:boolean; // are the mines being spawned, aka pause the game for 1 second
var spawningClock:float;
var isSpawningTrain:boolean;

var DEVELOPER = true;

var trainSpawn : ParticleSystem;
var trainShield: ParticleSystem;
var explosion: ParticleSystem;
var bulletPart : ParticleSystem;
var explosionIce : ParticleSystem;
var trainIcy : ParticleSystem;

var OTrain;

// Called once when the script is created.
function Start () {
	NUMBULLETS = 50;
	initAll();
	startScreen();	
	//test = Instantiate(trainSpawn);
	trainSpawn.enableEmission = false;
	trainShield.enableEmission = false;
	trainShield.active = false;
	explosion.active = false;
	bulletPart.active = false;
	explosionIce.active = false;
	trainIcy.active = false;
}



function initAll(){
	r = 1;
	g = 1;
	b = 1;
	GEMTIME = 30;
	Destroy(gemFolder);
	gemFolder = new GameObject();  
	gemFolder.name = "Gems";
	gems = new Array();
	gemType = 1;
	gemTimer = 0;
	totalGemTimer = -20;
	trains = new Array();
	Destroy(trainFolder);
	trainFolder = new GameObject();
	trainFolder.name = "Trains";
	
	Destroy(towerFolder);
	towerFolder = new GameObject();
	towerFolder.gameObject.isStatic = true;
	towerFolder.name = "Towers";
	towers = new Array();
	
	Destroy(bulletFolder);
	bulletFolder = new GameObject();
	bulletFolder.name = "Bullets";
	bullets = new Array();
	nextBullet = 0;
	
	for (var i = 0; i < NUMBULLETS; i++){
		addBullet();
	}
	
	n = 1;
	editMode = false;
	Destroy(trackFolder);
	trackFolder = new GameObject();
	trackFolder.gameObject.isStatic = true;
	trackFolder.name = "Tracks";
	tracks = new Array(WIDTH);
	for (i=0; i<WIDTH; i++){
		tracks[i] = new Array(HEIGHT);
		for (var j=0; j<HEIGHT; j++){
			tracks[i][j] = null;
		}	
	}
	Destroy(mineFolder);
	mineFolder = new GameObject();
	mineFolder.gameObject.isStatic = true;
	mineFolder.name = "Mines";
	mines = new Array();
	this.GetComponent("TextMesh");
	clock = 0.0;
	powerUp = 1;
	isGem = false;
	isTrack = false;
	isGameOver = false;
	tempPause = false;
	isSpawningTrain = false;
	begin = false;
	score = 0;
	scoreAdd = 0;
	spawningTimer = 0;
	curLevel = 1;
	randSeed = 0;
	loadedSeed = 0;
	useSeed = false;
}




// Called every frame.
function Update () {
	if (tempPause){
		spawningClock += Time.deltaTime;
		if (spawningClock > 1){
			if (trains[0].model.tempRemove) {
				trains[0].model.gameObject.renderer.enabled = true;
				trains[0].model.tempRemove = false;
				if (trains[0].model.iced) trains[0].model.iceParticle.active = true;
				spawningClock = 0;
				
				}
			else tempPause = false;
			
		}
		return;
	}

	
	if (isTrack || isGameOver) clock = clock + Time.deltaTime;
	
	if (isGameOver){
		if (clock > 2){
			isGameOver = false;
			startScreen();
		}
		return;
	
	}	
	
	if (hasGem) {
		gemTimer -= Time.deltaTime; // countdown from 10 if it has a gem
		scoreAdd+= Mathf.Pow(1.01, (((totalGemTimer+(GEMTIME -gemTimer))-11)))/2.5; // score speed function
		if (gemTimer <= 0){
			clearGem();
			clearMines();
			clearTowers();
			clearBullets();	 
		}
	}

	
	if (isTrack && clock>2 && !isGem){
    	spawnGem();

	}
	
}




public function addTrack(x:int, y:int,  trackType:int, rotation:int, directions:Array, randHelp){		// the ints here represent directions this track can go. -1 if possible, 1 if not
	
	var trackObject = new GameObject();					// Create a new empty game object that will hold a track.
	var trackScript = trackObject.AddComponent("track");		// Add the track.js script to the object.														// We can now refer to the object via this script.
	trackScript.transform.parent = trackFolder.transform;	// Set the track's parent object to be the track folder.
	trackScript.transform.position = Vector3(x-6,y-3,3);		// Position the track at x,y.								
	trackScript.init(trackType, rotation, directions, this, x, y);							// Initialize the track script.
	tracks[x][y] = trackScript;								// Add the track to the tracks array for future access.
	trackScript.name = "Track "+ n++;				// Give the track object a name in the Hierarchy pane.
	trackScript.randHelp = randHelp;
	

	return trackScript;

}

public function addBullet(){
	var bulletObject = new GameObject();
	var bulletScript = bulletObject.AddComponent("bullet");
	bulletScript.transform.parent = bulletFolder.transform;
	bulletScript.transform.position = Vector3(0, 0, 0);
	bulletScript.init(this);
	bulletScript.name = "Bullet";
	bullets.Add(bulletScript);
}


public function addTrain(x:int, y:int, direction:int, origTrain:boolean){
	var trainObject = new GameObject();							// Create a new empty game object that will hold a train.
	var trainScript = trainObject.AddComponent("train");		// Add the train.js script to the object.
																// We can now refer to the object via this script
	if (origTrain) OTrain = trainScript;
	trainObject.layer = 0;
	trainScript.transform.parent = trainFolder.transform;
	trainScript.transform.position = Vector3(x-6,y-3,1);		// Position the train at x,y.								
	trainScript.init(x, y, direction, tracks, this, origTrain);							// Initialize the train script.
	trainScript.name = "Train";									// Give the train object a name in the Hierarchy pane.
	trains.Add(trainScript);
}

function addGem(x : float , y : float) {
	var randDone:boolean = false;
	while (!randDone){
		gemType = UnityEngine.Random.Range(1, 4);
		if (!((powerUp % GREENPOWER == 0 && gemType == GREEN) || 
		(powerUp % BLUEPOWER == 0 && gemType == BLUE) ||
		(powerUp % REDPOWER == 0 && gemType == RED) ||
		(powerUp % ORANGEPOWER == 0 && gemType == ORANGE)) ){ // Make sure the gem isn't the same as last time
				randDone = true;
		}
	
	}
	var gemObject = new GameObject();					// Create a new empty game object that will hold a gem.
	var gemScript = gemObject.AddComponent("gem");		// Add the gem.js script to the object.
														// We can now refer to the object via this script.
	gemScript.transform.parent = gemFolder.transform;	// Set the gem's parent object to be the gem folder.
	gemScript.transform.position = Vector3(x-6,y-3,2);		// Position the gem at x,y.								
	
	gemScript.init(gemType);							// Initialize the gem script.
	
	gems.Add(gemScript);								// Add the gem to the gems array for future access.
	gemScript.name = "Gem "+gems.length;				// Give the gem object a name in the Hierarchy pane.
	tracks[x][y].hasGem = true;
	tracks[x][y].gem = gemScript; 
							
}


function addMine(x:float, y:float){
	var mineObject = new GameObject();							// Create a new empty game object that will hold a mine
	var mineScript = mineObject.AddComponent("mine");		// Add the mine.js script to the object.
	mineScript.transform.parent = mineFolder.transform;		// We can now refer to the object via this script
	mineScript.transform.position = Vector3(x-6, y-3, 2);
	
	tracks[x][y].mine = mineScript;
	mineScript.init(x, y, tracks[x][y], this);							// Initialize the mine script.
	mineScript.name = "Mine" + mines.length;									// Give the mine object a name in the Hierarchy pane.
	mines.Add(mineScript);

}

function addTower(x:float, y:float){
	var towerObject = new GameObject();							// Create a new empty game object that will hold a tower
	var towerScript = towerObject.AddComponent("tower");		// Add the tower.js script to the object.
	
	towerScript.transform.parent = towerFolder.transform;		// We can now refer to the object via this script
	towerScript.transform.position = Vector3(x-6, y-3, 2);
	tracks[x][y].tower = towerScript;
	towerScript.init(x-6, y-3, this, tracks[x][y]);							// Initialize the tower script.
	towerScript.name = "Tower" + towers.length;									// Give the tower object a name in the Hierarchy pane.
	towers.Add(towerScript);

}

function saveTrack(){
	return;
	try {
		var c = 1;
		while (true){
			if(File.Exists("Assets/Resources/Tracks/new_track"+c+".track"))c++;
			else {
				break;
			}
		}
//		var path = EditorUtility.SaveFilePanel("Track Save", "Assets/Resources/Tracks/", "new_track"+c, "track");
		var path;
		var seed = "" + randSeed;
		File.WriteAllText(path, seed);
	} 
    catch (err){
    	if (DEVELOPER) print(err);
    	return;
    }


}

function loadTrack(){
	return;
	try {
		clearTrack();
		initAll();
//		var file = EditorUtility.OpenFilePanel("Track Load", "Assets/Resources/Tracks/", "track");
		var file;
		var sr = File.OpenText(file);
	    var seed = sr.ReadLine();
	   	loadedSeed = parseInt(seed);
	    sr.Close(); 
	    useSeed = true;
	    begin = true;
	    makeRandom();
	    
	  
	
	    }
    catch (err){
    	if (DEVELOPER) print(err);
    	return;
    }



}


function clearTrack(){
	
	destroyTrains();
	clearGem();
	clearMines();
	Destroy(trackFolder);


	if (randScript!=null) Destroy(randScript.gameObject); // Clears any random track generators that are still running
	if (startScreenObject!=null) Destroy(startScreenObject.gameObject);
	if (edgeLeft!=null) Destroy(edgeLeft.gameObject);
	if (edgeRight!=null) Destroy(edgeRight.gameObject);
	clock = 0;
	hasGem = false;
	isGem = false;
	
	


}

public function clearGem(){

	Destroy(gemFolder);
	gemFolder = new GameObject();  
	gemFolder.name = "Gems";
	r = 1;
	g = 1;
	b = 1;
	powerUp = 1;
	hasGem = false;
	isGem = false;;
	scoreAdd = 0;
	gemTimer = 0;
	totalGemTimer = -20;
	clock = 0;
}

public function clearMines(){
	Destroy(mineFolder);
	mineFolder = new GameObject();  
	mineFolder.name = "Mines";
}

public function clearTowers(){
	Destroy(towerFolder);
	towerFolder = new GameObject();  
	towerFolder.name = "Towers";
}

public function clearBullets(){
	Destroy(bulletFolder);
	bulletFolder = new GameObject();
	bulletFolder.name = "Bullets";
	bullets = new Array();
	nextBullet = 0;
	
	for (var i = 0; i < NUMBULLETS; i++){
		addBullet();
	}

}


function destroyTrains(){
	Destroy(trainFolder);
	trainFolder = new GameObject();  
	trainFolder.name = "Trains";
}


function makeRandom(){
	clock = 0.0;

	
	var randObject = new GameObject();
	randScript = randObject.AddComponent("RandomTrack");
	randScript.Manager = this;
	randScript.name = "RandomTrack";
}

function startScreen(){
	clearTrack();
	initAll();
	var startObject = new GameObject();
	startScreenObject = startObject.AddComponent("StartScreen");
	startScreenObject.Manager = this;
	startScreenObject.name = "Start Screen";
}


public function startGame(){
	clearTrack();
	initAll();
	begin = true;
	makeRandom();
	
}

function gameOver(){
	var temp:float = score;
	clearTrack();
	initAll();
	score = temp;
	isGameOver = true;

}

function gotGem(){	
	//addTrain(0, 4, EAST, false);
			
	r = 0;
	g = 0;
	b = 0;
	gemTimer = GEMTIME;					// reset the gem timer
	if (powerUp % GREENPOWER == 0){ 
		g = 1; 
		gemTimer = GEMTIME / 2;
	}
	if (powerUp % BLUEPOWER == 0) {
		b = 1; 
		spawnTowers();
		//isSpawningTrain = true;
	}
	if (powerUp % REDPOWER == 0) {
	 	r = 1;
	 	spawnMines();
	 }
	if (powerUp % ORANGEPOWER == 0) {r = 1; g = 0.5;} 

	isGem = false; 		// no gem on track
	totalGemTimer += (GEMTIME - gemTimer);	// Set the total amount of time that the player has had gems
	score += scoreAdd;
	scoreAdd = 0;
	if (score > 1000*curLevel){
		var tempLevel:int = ++curLevel;
		var tempScore:float = score;
		startGame();
		curLevel = tempLevel;
		score = tempScore;
	}
}

function spawnGem(){


	var counter:int = 0;
	while (1){
		counter++;
		if (counter > 200) return;
			var randX:int = UnityEngine.Random.Range(0, WIDTH);
			var randY:int = UnityEngine.Random.Range(0, HEIGHT);

			if (tracks[randX][randY]!= null && tracks[randX][randY].mine == null){ 
				var tooClose:boolean = false;
				for (var i = 0; i < trains.length; i++){ // Check all of the trains to see if they're too close
					var curTrain = trains[i];
					var DISTANCE:int = 3;
					if (curTrain.model !=null && (((curTrain.model.xTrack < randX+DISTANCE) && (curTrain.model.xTrack > randX-DISTANCE)) &&
					((curTrain.model.yTrack < randY+DISTANCE) && (curTrain.model.yTrack > randY-DISTANCE)))) {
						tooClose = true;
					}
				}
				if (!tooClose){
					gemGen = false; 
					addGem(randX, randY);
					isGem = true;
					return;
				
				}
			}
	}



}

function spawnMines(){
	temporaryPause();
	var NUMMINES = 20;
	for (var j = 0; j < NUMMINES; j++){
		var randX:int = UnityEngine.Random.Range(0, WIDTH);
		var randY:int = UnityEngine.Random.Range(0, HEIGHT);

		if (tracks[randX][randY]!= null && tracks[randX][randY].mine == null && tracks[randX][randY].tower == null){ 
			var tooClose:boolean = false;
			for (var i = 0; i < trains.length; i++){
				var curTrain = trains[i];
				var DISTANCE:int = 2; 
    			if (curTrain.model !=null && (((curTrain.model.xTrack < randX+DISTANCE) && (curTrain.model.xTrack > randX-DISTANCE)) &&
    			((curTrain.model.yTrack < randY+DISTANCE) && (curTrain.model.yTrack > randY-DISTANCE)))) {
					tooClose = true;
				}
			}
			if (!tooClose){
				addMine(randX, randY);
			}
		}
		

	
	}


}



function spawnTowers(){
	var NUMTOWERS = 10;
	var counter:int = 0;
	//while (1){
		counter++;
		if (counter > 200) return;
		for (var j = 0; j < NUMTOWERS; j++){
			var randX:int = UnityEngine.Random.Range(0, WIDTH);
			var randY:int = UnityEngine.Random.Range(0, HEIGHT);

			if (tracks[randX][randY]!= null && tracks[randX][randY].tower == null){ 
				var tooClose:boolean = false;
				for (var i = 0; i < trains.length; i++){
					var curTrain = trains[i];
					var DISTANCE:int = 2; 
	    			if (curTrain.model !=null && (((curTrain.model.xTrack < randX+DISTANCE) && (curTrain.model.xTrack > randX-DISTANCE)) &&
	    			((curTrain.model.yTrack < randY+DISTANCE) && (curTrain.model.yTrack > randY-DISTANCE)))) {
						tooClose = true;
					}
				}
				if (!tooClose){
					if (tracks[randX][randY].mine != null) Destroy(tracks[randX][randY].mine.gameObject);
					addTower(randX, randY);
					//return;
				}
			}
			
		}
			
	//}
	
}

function spawnBullets(x:float, y:float, direction:int){
	nextBullet++;
	if (nextBullet == NUMBULLETS) nextBullet = 0;
	var b = bullets[nextBullet];
	b.model.clock = 0;
	b.model.curX = x;
	b.model.curY = y;
	b.model.direction = direction;
	b.model.target = trains[0].model;
	b.gameObject.active = true;
	
}

function spawnSpawner(x:int, y:int){ // Spawn a train spawner

	var spawnTrack = tracks[x][y];
	var randDirec:int = UnityEngine.Random.Range(0, spawnTrack.trainDirections.length);
	addTrain(x, y, spawnTrack.trainDirections[randDirec], false);
	return;

}

function temporaryPause(){
	tempPause = true;
	spawningClock = 0.0;

}


function OnGUI () {

	var e : Event = Event.current;
	if (powerUp % BLUEPOWER != -1 && e.current.type == EventType.KeyDown && e.keyCode == KeyCode.Space) {
		if (randScript.bugCheck) randScript.slowDown = false;
   		if (trains.length > 0 && !trains[0].model.isShielded) trains[0].model.shieldOn();
   	}

	if (powerUp % BLUEPOWER != -1 && e.current.type == EventType.KeyUp && e.keyCode == KeyCode.Space) { // lifted space
		if (randScript.bugCheck) randScript.slowDown = true;
   		if (trains.length > 0) trains[0].model.shieldOff();
    }


	GUI.backgroundColor = Color.black;
	GUI.contentColor = Color.white;
	/*GUI.depth = 5;
	var Mytexture:Texture2D;
		MyTexture = UnityEngine.Resources.Load("Textures/whiteTexture") as Texture2D;
		GUI.color = Color.white;//Reset color to white
		GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), MyTexture);
	*/
	
	if (isGameOver){
		GUI.contentColor = Color.black;
		GUI.skin.label.fontSize = (Screen.width+Screen.height) / 20;
		GUI.Label(Rect (Screen.width/3-50,5*Screen.height/8-50,Screen.width/2,Screen.width/2), "game over");
		GUI.skin.label.fontSize = (Screen.width+Screen.height) / 45;
		GUI.Label(Rect (Screen.width/3-50,5*Screen.height/6-50,Screen.width/2,Screen.width/2), "score: " + Math.Floor(score));
	}
	
	else if (!begin) {
	
		GUI.skin.button.fontSize = (Screen.width+Screen.height) / 45;

		if (GUI.Button (Rect (Screen.width/4-50,5*Screen.height/8-50,Screen.width/10,Screen.width/10), "go!")) {
			startGame();
		}
		if (DEVELOPER){
			GUI.skin.button.fontSize = (Screen.width+Screen.height) / 90;

			if (GUI.Button (Rect (1*Screen.width/12,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), "load")) {
				loadTrack();
			}
		}
	}
	else {
		
		GUI.skin.button.fontSize = (Screen.width+Screen.height) / 90;

		if (GUI.Button (Rect (11*Screen.width/12,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), "home")) {
			startScreen();
		}
		if (DEVELOPER){ 
			if (GUI.Button (Rect (1*Screen.width/12,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), "seed")) {
				saveTrack();
			}
		}
		//GUI.contentColor = Color.black;
		//print( r + " " + g + " " + b);
		GUI.contentColor = new Color(r, g, b, 1);
		GUI.Button(Rect (Screen.width/2,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), (Math.Floor(score+scoreAdd)).ToString());
		GUI.contentColor = Color.white;
		if (hasGem) GUI.Button(Rect (Screen.width/4,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), (Math.Floor(gemTimer)).ToString());
		else GUI.Label(Rect (Screen.width/4,Screen.height/18-Screen.width/30,Screen.width/15,Screen.width/30), "");
		
	
	}
	/*if (GUI.Button (Rect (1*Screen.width/8-50,Screen.height-25,100,25), "Load a track")) 
		loadTracks();
	if (GUI.Button (Rect (3*Screen.width/8-50,Screen.height-25,100,25), "Save this track")) 
		saveTracks();
	if (editMode) GUI.backgroundColor = Color.green;
	if (GUI.Button (Rect (5*Screen.width/8-50,Screen.height-25,100,25), "Edit Mode")) editMode = !editMode;
	GUI.backgroundColor = Color.grey;
	
	if (GUI.Button (Rect (7*Screen.width/8-50,Screen.height-25,100,25), "Randomize")) 
		makeRandom();
		*/
}



