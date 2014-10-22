

var done:boolean;

var Manager;
var n : int;

var curTrack;
//These variables are used to make the random track be generated on both sides at the same time
var curTrackWest; // the curTrack coming from the west side
var curTrackEast; // the curTrack coming from the east side
var curTrackBool:boolean; // true if it's the west side, false if the east side
var oneDone:boolean;


var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

var clock:float;
var started:boolean = false;

var bugCheck:boolean = false;
var slowDown: boolean = false;
var DEMONSTRATENEED:boolean = false;
var paths : Queue;


/* CURRENT ISSUES

No currently found bugs

possible bug involving the xTrackList (nTrackList/eTracklist/etc.) being empty when there are still REQUIRED directions, will need to check for this.

*/


function Start(){
	clock = 0.0;
	done = false;
	oneDone = false;
	paths = new Queue();
	if (Manager.useSeed){
		Random.seed = Manager.loadedSeed;
	}
	else {
		var temp = System.Environment.TickCount;
		Random.seed = temp;
		Manager.randSeed = temp;
	}
}



function Update(){
	if (slowDown){
		if ((n+1)%15 != 0) {
		n++;
		return; 
		}
	}
	if (DEMONSTRATENEED) {
		for (var i=0; i<Manager.WIDTH; i++){
			for (var j=0; j<Manager.HEIGHT; j++){
				if (Manager.tracks[i][j] != null) Manager.tracks[i][j].model.renderer.material.color = Color(1.5,1.5,1.5); 
			}	
		}
	}
	if(done) return;
	clock = clock + Time.deltaTime;		
	
	if (clock > 0.5){
		if( !started){
			Manager.isTrack = false;
			n = 0;
			

			// Create two tracks off to the side for purely visual reasons, named Track -2 and Track -1
			var trackObject1 = new GameObject();					
			var trackScript1 = trackObject1.AddComponent("track");														
			trackScript1.transform.parent = Manager.trackFolder.transform;	
			trackScript1.transform.position = Vector3(-1-6,1,3);								
			trackScript1.init(1, 1, null, Manager, -1, 4);														
			trackScript1.name = "Track "+ "-1";	
			var trackObject2 = new GameObject();					
			var trackScript2 = trackObject2.AddComponent("track");														
			trackScript2.transform.parent = Manager.trackFolder.transform;	
			trackScript2.transform.position = Vector3(13-6,1,3);								
			trackScript2.init(1, 1, null, Manager, 13, 4);														
			trackScript2.name = "Track "+ "-2";		
			trackScript1.model.renderer.material.color = Color(1.5,1.5,1.5); 		
			trackScript2.model.renderer.material.color = Color(1.5,1.5,1.5); 
			if (bugCheck) {
				trackScript1.model.renderer.material.color = Color(.9,.9,.9); 		
				trackScript2.model.renderer.material.color = Color(.9,.9,.9); 
			}	
			Manager.edgeLeft = trackScript1;
			Manager.edgeRight = trackScript2;	

			
			var temp1 = new RandHelp();
			var temp2 = new RandHelp();
			
			//temp1.init(null, EAST, [-1, -1, -1, -1]);		// -1 represent that path not being tried yet, 1 repesents not being able to go in that direction, thus it works
			//curTrackEast = Manager.addTrack(6, 4, 2, 0, [-1,-1,-1,-1], temp1); 
			
			temp1.init(null, EAST, [1, -1, 1, -1]);		// -1 represent that path not being tried yet, 1 repesents not being able to go in that direction, thus it works
			curTrackEast = Manager.addTrack(12, 4, 1, 1, [1,1,1,-1], temp1); 
			
			
			temp2.init(null, WEST, [1, -1, 1, -1]);	
			curTrackWest = Manager.addTrack(0, 4, 1, 1, [1,-1,1,1], temp2); 
			paths.Enqueue(curTrackEast);
	
			
			
			curTrack = curTrackEast;
			curTrackBool = false;
				
			started = true;
		}
		
		else{
		
		
		
			if (!oneDone){
				curTrackBool = !curTrackBool;
				if (curTrackBool) {curTrackEast = curTrack; curTrack = curTrackWest;}
				else {curTrackWest = curTrack; curTrack = curTrackEast;}
			}
		
			if (curTrack.model.trackType==3||curTrack.model.trackType==4||curTrack.model.trackType==5||curTrack.model.trackType==6||
				curTrack.model.trackType==7||curTrack.model.trackType==8) { 
				//checkIfChange();
				if (curTrack.randHelp.loopChecked == false && curTrack.randHelp.useLoop2) checkLoop2();
			}
			
			if ((curTrack.randHelp.directions[NORTH] == 1) && (curTrack.randHelp.directions[EAST] == 1) && 
			(curTrack.randHelp.directions[SOUTH] == 1) && (curTrack.randHelp.directions[WEST] == 1)) { 	// all possible directions worked
				if (bugCheck) curTrack.model.renderer.material.color = Color(.9,.9,.9); // Darken 
				curTrack.randHelp.trackDone = true;
				if (curTrack.randHelp.prev == null) {	// One side are finished
					oneDone = true;
					curTrackBool = !curTrackBool;
					if (curTrackBool) {curTrackEast = curTrack; curTrack = curTrackWest;}
					else {curTrackWest = curTrack; curTrack = curTrackEast;}
					if (curTrackEast.randHelp.prev == null && curTrackWest.randHelp.prev == null) { // Both sides finished
						done = true;
						
						Manager.addTrain(0, 4, EAST, true);
						Manager.isTrack = true;
						//Manager.isSpawningTrain = true;
						//Manager.spawnMines();
						//Manager.spawnTowers();
					}
					return;
				}
				switch(curTrack.randHelp.directFrom){
					case (NORTH):
						curTrack.randHelp.prev.randHelp.directions[SOUTH] = 1;
						break;
					case (EAST):
						curTrack.randHelp.prev.randHelp.directions[WEST] = 1;
						break;
					case (SOUTH):
						curTrack.randHelp.prev.randHelp.directions[NORTH] = 1;
						break;
					case (WEST):
						curTrack.randHelp.prev.randHelp.directions[EAST] = 1;	
						break;
				}
				if (curTrack.model.trackType==3||curTrack.model.trackType==4||curTrack.model.trackType==5||curTrack.model.trackType==6||
				curTrack.model.trackType==7||curTrack.model.trackType==8) { 
					//checkLoop2(); 
					if (curTrack.randHelp.loopChecked == false) checkLoop();
					
				}// If this is a 3 pronged track, AKA the only track that causes an infinite loop
				
				// set the correct boolean in the previous track to true
//				curTrack.randHelp.prev.randHelp.allCreated.Add(curTrack);
				updateNeededTracks(curTrack.randHelp.prev, mirrorDirec(curTrack.randHelp.directFrom));
				curTrack = curTrack.randHelp.prev;		// go back to the previous track
				n++;
				return;
			}
			checkBounds();
			if (curTrack.randHelp.directions[NORTH] == 0) 	curTrack = attemptTrack(NORTH); // a track from the north set the boolean false 
			else if (curTrack.randHelp.directions[EAST] == 0) curTrack = attemptTrack(EAST);
			else if (curTrack.randHelp.directions[SOUTH] == 0) curTrack = attemptTrack(SOUTH);
			else if (curTrack.randHelp.directions[WEST] == 0) curTrack = attemptTrack(WEST);
			else if (curTrack.randHelp.directions[NORTH] == -1) curTrack = attemptTrack(NORTH);	// North needs to be checked!
			else if (curTrack.randHelp.directions[EAST] == -1) curTrack = attemptTrack(EAST);		// East needs to be checked!
			else if (curTrack.randHelp.directions[SOUTH] == -1) curTrack = attemptTrack(SOUTH);		// South needs to be checked!
			else if (curTrack.randHelp.directions[WEST] == -1) curTrack = attemptTrack(WEST);		// West needs to be checked!
			n++;

		}
	}
}

function checkBounds(){

	

	//		Check NORTH
	//
	if(curTrack.directions[NORTH] == -1) {	// if this track can go to the north
		if(curTrack.y == (Manager.HEIGHT-1)) {
			curTrack = invalidDirection();	// if it will go off the top it's invalid
			return;
		}
		else if (Manager.tracks[curTrack.x][curTrack.y+1] != null) {	// there is a track in the north direction
			if (Manager.tracks[curTrack.x][curTrack.y+1].directions[SOUTH] == -1){ 	// this track can take a track from this direction, set this track to valid
				if (curTrack.randHelp.directions[NORTH] != 1){
					Manager.tracks[curTrack.x][curTrack.y+1].randHelp.directions[SOUTH] = 1;
					updateNeededTracks(Manager.tracks[curTrack.x][curTrack.y+1], SOUTH);
					updateNeededTracks(curTrack, NORTH);
				
				}
				curTrack.randHelp.directions[NORTH] = 1;
				Manager.tracks[curTrack.x][curTrack.y+1].randHelp.useLoop2 = false;
			}
			else { 
				curTrack = invalidDirection();
				return;
			}
		}
	}
	// Checks if a track next to the curTrack needs a connecting track and can't get one from curTrack
	else if ((curTrack.y!=(Manager.HEIGHT-1)) && (Manager.tracks[curTrack.x][curTrack.y+1] != null) && (Manager.tracks[curTrack.x][curTrack.y+1].directions[SOUTH] == -1)) {
		curTrack = invalidDirection();
		return;
	}
	
	//		Check EAST
	//
	if(curTrack.directions[EAST] == -1) {	// if this track can go to the east
		if(curTrack.x == Manager.WIDTH-1){ //|| curTrack.x == Manager.WIDTH/2-1) { 		// A way to make a wall in the middle. Fix West side too.
			curTrack = invalidDirection();	// if it will go off the side it's invalid
			return;
		}
		else if (Manager.tracks[curTrack.x+1][curTrack.y] != null) {	// there is a track in the east direction
			if (Manager.tracks[curTrack.x+1][curTrack.y].directions[WEST] == -1){ 	// this track can take a track from that direction, set this track to valid
				if (curTrack.randHelp.directions[EAST] != 1){
					Manager.tracks[curTrack.x+1][curTrack.y].randHelp.directions[WEST] = 1;
					updateNeededTracks(Manager.tracks[curTrack.x+1][curTrack.y], WEST);
					updateNeededTracks(curTrack, EAST);
				
				}
				
				curTrack.randHelp.directions[EAST] = 1;
				Manager.tracks[curTrack.x+1][curTrack.y].randHelp.useLoop2 = false;
			}
			else { 
				curTrack = invalidDirection();
				return;
			}
		}
	}
	// Checks if a track next to the curTrack needs a connecting track and can't get one from curTrack
	else if ((curTrack.x!=(Manager.WIDTH-1)) && (Manager.tracks[curTrack.x+1][curTrack.y] != null) && (Manager.tracks[curTrack.x+1][curTrack.y].directions[WEST] == -1)) {	
		curTrack = invalidDirection();
		return;
	}
	
	//		Check SOUTH
	//
	if(curTrack.directions[SOUTH] == -1) {	// if this track can go to the south
		if(curTrack.y == 0) {
			curTrack = invalidDirection();	// if it will go off the bottom it's invalid
			return;
		}
		else if (Manager.tracks[curTrack.x][curTrack.y-1] != null) {	// there is a track in the south direction
			if (Manager.tracks[curTrack.x][curTrack.y-1].directions[NORTH] == -1){ 	// this track can take a track from that direction, set this track to valid
				if (curTrack.randHelp.directions[SOUTH] != 1){
					Manager.tracks[curTrack.x][curTrack.y-1].randHelp.directions[NORTH] = 1;
					updateNeededTracks(Manager.tracks[curTrack.x][curTrack.y-1], NORTH);
					updateNeededTracks(curTrack, SOUTH);
				
				}
				Manager.tracks[curTrack.x][curTrack.y-1].randHelp.useLoop2 = false;
				curTrack.randHelp.directions[SOUTH] = 1;
			}
			else { 
				curTrack = invalidDirection();
				return;
			}
		}
	}
	// Checks if a track next to the curTrack needs a connecting track and can't get one from curTrack
	else if (curTrack.y!=0 && (Manager.tracks[curTrack.x][curTrack.y-1] != null) && (Manager.tracks[curTrack.x][curTrack.y-1].directions[NORTH] == -1)) {	
		curTrack = invalidDirection();
		return;
	}
	
	//		Check WEST
	//
	if(curTrack.directions[WEST] == -1) {	// if this track can go to the west
		if(curTrack.x == 0){ // || curTrack.x == Manager.WIDTH/2) { 		// A way to make a wall in the middle. Fix East side too
			curTrack = invalidDirection();	// if it will go off the side it's invalid
			return;
		}
		else if (Manager.tracks[curTrack.x-1][curTrack.y] != null) {	// there is a track in the west direction
			if (Manager.tracks[curTrack.x-1][curTrack.y].directions[EAST] == -1){ 	// this track can take a track from that direction, set this track to valid
				if (curTrack.randHelp.directions[WEST] != 1){
					Manager.tracks[curTrack.x-1][curTrack.y].randHelp.directions[EAST] = 1;
					updateNeededTracks(Manager.tracks[curTrack.x-1][curTrack.y], EAST);
					updateNeededTracks(curTrack, WEST);
				
				}
				Manager.tracks[curTrack.x-1][curTrack.y].randHelp.useLoop2 = false;
				curTrack.randHelp.directions[WEST] = 1;
			}
			else { 
				curTrack = invalidDirection();
				return;
			}
		}
	}
	// Checks if a track next to the curTrack needs a connecting track and can't get one from curTrack
	else if (curTrack.x!=0 && (Manager.tracks[curTrack.x-1][curTrack.y] != null) && (Manager.tracks[curTrack.x-1][curTrack.y].directions[EAST] == -1)) {	
		curTrack = invalidDirection();
		return;
	}
	
}
 

function attemptTrack(directFrom:int){	// creates a track in the inputed direction and returns it. Destroys the current track if the tracklist is empty
	var temp2 = new RandHelp();
	var temp1;
	var xAdd = 0;
	var yAdd = 0;
	switch(directFrom) { // Create a track in the direction inputed
		case(NORTH):
			try temp1 = curTrack.randHelp.nTrackList.Pop();
			catch (err){		// If we get here the tracklist is empty, thus the current track is invalid
				
				// check if there is a track needed in that direction,
				// if so, create that track
				if (isNeeded(curTrack, NORTH)) temp1 = getNeededTrack(curTrack, NORTH); 
				else {
					invalidDirection();
					return curTrack;
				}
			}
			if (curTrack.randHelp.neededTracks[directFrom][NORTH] && temp1.directions[NORTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][EAST] && temp1.directions[EAST] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][SOUTH] && temp1.directions[SOUTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][WEST] && temp1.directions[WEST] != -1) return curTrack;
			yAdd = 1;
			temp2.init(curTrack, SOUTH, [temp1.directions[NORTH], temp1.directions[EAST], temp1.directions[SOUTH], temp1.directions[WEST]]);
			break;
		case(EAST):
			try temp1 = curTrack.randHelp.eTrackList.Pop();
			catch (err){
				if (isNeeded(curTrack, EAST)) temp1 = getNeededTrack(curTrack, EAST); 
				else {
					invalidDirection();
					return curTrack;
				}
			}
			if (curTrack.randHelp.neededTracks[directFrom][NORTH] && temp1.directions[NORTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][EAST] && temp1.directions[EAST] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][SOUTH] && temp1.directions[SOUTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][WEST] && temp1.directions[WEST] != -1) return curTrack;
			xAdd = 1;
			temp2.init(curTrack, WEST, [temp1.directions[NORTH], temp1.directions[EAST], temp1.directions[SOUTH], temp1.directions[WEST]]);
			break;
		case(SOUTH):
			try temp1 = curTrack.randHelp.sTrackList.Pop();
			catch (err){
				if (isNeeded(curTrack, SOUTH)) temp1 = getNeededTrack(curTrack, SOUTH); 
				else {
					invalidDirection();
					return curTrack;
				}
			}
			if (curTrack.randHelp.neededTracks[directFrom][NORTH] && temp1.directions[NORTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][EAST] && temp1.directions[EAST] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][SOUTH] && temp1.directions[SOUTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][WEST] && temp1.directions[WEST] != -1) return curTrack;
			yAdd = -1;
			temp2.init(curTrack, NORTH, [temp1.directions[NORTH], temp1.directions[EAST], temp1.directions[SOUTH], temp1.directions[WEST]]);
			break;
		case(WEST):
			try temp1 = curTrack.randHelp.wTrackList.Pop();
			catch (err){
				if (isNeeded(curTrack, WEST)) temp1 = getNeededTrack(curTrack, WEST); 
				else {
					invalidDirection();
					return curTrack;
				}
			}
			if (curTrack.randHelp.neededTracks[directFrom][NORTH] && temp1.directions[NORTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][EAST] && temp1.directions[EAST] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][SOUTH] && temp1.directions[SOUTH] != -1) return curTrack;
			if (curTrack.randHelp.neededTracks[directFrom][WEST] && temp1.directions[WEST] != -1) return curTrack;
			xAdd = -1;
			temp2.init(curTrack, EAST, [temp1.directions[NORTH], temp1.directions[EAST], temp1.directions[SOUTH], temp1.directions[WEST]]);
			break;
	}
	return Manager.addTrack(curTrack.x+xAdd, curTrack.y+yAdd, temp1.trackType, temp1.rotation, [temp1.directions[NORTH],
	temp1.directions[EAST], temp1.directions[SOUTH], temp1.directions[WEST]], temp2);

}

function invalidDirection(){	// remove the old curTrack from the game, set the curTrack to the previous track, and set the new curTracks booleans correctly
	// set the correct boolean in the previous track to false	
		switch(curTrack.randHelp.directFrom){
			case (NORTH):
				curTrack.randHelp.prev.randHelp.directions[SOUTH] = 0;
				break;
			case (EAST):
				curTrack.randHelp.prev.randHelp.directions[WEST] = 0;
				break;
			case (SOUTH):
				curTrack.randHelp.prev.randHelp.directions[NORTH] = 0;
				break;
			case (WEST):
				curTrack.randHelp.prev.randHelp.directions[EAST] = 0;	
				break;
	}
	temp = curTrack;
	curTrack = curTrack.randHelp.prev;
	clearTrack(temp);
	// Will also need to destroy things that are succesfully built previously by that track.
	// Have an array list in the randomHelper to see what has been built by a given track and a recursive function to cull it's path

	return curTrack;	
}

function clearTrack(badTrack){	
	Manager.tracks[badTrack.x][badTrack.y] = null;
	Destroy(badTrack.gameObject);
}


function checkLoop() { // Checks if the curTrack has the potential to create an infinite loop and fixes it
	// It works by checking if 2 of the 3 tracks coming from this one are completed, if so this track can cause an infinite loop
	
	if (curTrack.directions[NORTH] == 1){ // If this track can't go north, we know it can go east south and west
		if (checkLoopHelper(EAST, SOUTH, WEST)) return;
		if (checkLoopHelper(EAST, WEST, SOUTH)) return;
		if (checkLoopHelper(SOUTH, WEST, EAST)) return;
		return;
	}
	if (curTrack.directions[EAST] == 1){ // If this track can't go east, we know it can go north south and west
		if (checkLoopHelper(NORTH, SOUTH, WEST)) return;
		if (checkLoopHelper(NORTH, WEST, SOUTH)) return;
		if (checkLoopHelper(SOUTH, WEST, NORTH)) return;
		return;
	}
	if (curTrack.directions[SOUTH] == 1){ // If this track can't go south, we know it can go north east and west
		if (checkLoopHelper(NORTH, EAST, WEST)) return;
		if (checkLoopHelper(NORTH, WEST, EAST)) return;
		if (checkLoopHelper(EAST, WEST, NORTH)) return;
		return;
	}
	if (curTrack.directions[WEST] == 1){ // If this track can't go west, we know it can go north east and south
		if (checkLoopHelper(NORTH, EAST, SOUTH)) return;
		if (checkLoopHelper(NORTH, SOUTH, EAST)) return;
		if (checkLoopHelper(EAST, SOUTH, NORTH)) return;
		return;
	}
}



function checkLoop2() { // Checks if the curTrack has the potential to create an infinite loop and fixes it
	// It works by checking if 2 of the 3 tracks coming from this one are completed, if so this track can cause an infinite loop
	
	if (curTrack.directions[NORTH] == 1){ // If this track can't go north, we know it can go east south and west
		if (checkLoopHelper2(EAST, SOUTH, WEST)) return;
		if (checkLoopHelper2(EAST, WEST, SOUTH)) return;
		if (checkLoopHelper2(SOUTH, WEST, EAST)) return;
		return;
	}
	if (curTrack.directions[EAST] == 1){ // If this track can't go east, we know it can go north south and west
		if (checkLoopHelper2(NORTH, SOUTH, WEST)) return;
		if (checkLoopHelper2(NORTH, WEST, SOUTH)) return;
		if (checkLoopHelper2(SOUTH, WEST, NORTH)) return;
		return;
	}
	if (curTrack.directions[SOUTH] == 1){ // If this track can't go south, we know it can go north east and west
		if (checkLoopHelper2(NORTH, EAST, WEST)) return;
		if (checkLoopHelper2(NORTH, WEST, EAST)) return;
		if (checkLoopHelper2(EAST, WEST, NORTH)) return;
		return;
	}
	if (curTrack.directions[WEST] == 1){ // If this track can't go west, we know it can go north east and south
		if (checkLoopHelper2(NORTH, EAST, SOUTH)) return;
		if (checkLoopHelper2(NORTH, SOUTH, EAST)) return;
		if (checkLoopHelper2(EAST, SOUTH, NORTH)) return;
		return;
	}
}

function checkLoopHelper2(d1:int, d2: int, d3: int){
	
	switch(d3){
		case (NORTH): 
			if (!(checkNeeded(curTrack, NORTH)  || (curTrack.y < Manager.HEIGHT - 1 && Manager.tracks[curTrack.x][curTrack.y+1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y+1].randHelp.trackDone))) return false;	// If the track in inputed direction is done, return false
			break;
		case (EAST): 
			if (!(checkNeeded(curTrack, EAST)  || (curTrack.x < Manager.WIDTH - 1 && Manager.tracks[curTrack.x+1][curTrack.y] !=null 
			 && Manager.tracks[curTrack.x+1][curTrack.y].randHelp.trackDone)))return false;
			break;
		case (SOUTH): 
			if (!(checkNeeded(curTrack, SOUTH)  || (curTrack.y > 0  && Manager.tracks[curTrack.x][curTrack.y-1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y-1].randHelp.trackDone)))return false;
			break;			
		case (WEST): 
			if (!(checkNeeded(curTrack, WEST)  || (curTrack.x > 0  && Manager.tracks[curTrack.x-1][curTrack.y] !=null 
			&& Manager.tracks[curTrack.x-1][curTrack.y].randHelp.trackDone)))return false;
			break;
	}

	


	switch(d1){
		case (NORTH): 
			if (checkNeeded(curTrack, NORTH)  || (curTrack.y < Manager.HEIGHT - 1 && Manager.tracks[curTrack.x][curTrack.y+1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y+1].randHelp.trackDone))return false;	// If the track in inputed direction is not done, return false
			break;
		case (EAST): 
			if (checkNeeded(curTrack, EAST)  || (curTrack.x < Manager.WIDTH - 1 && Manager.tracks[curTrack.x+1][curTrack.y] !=null 
			 && Manager.tracks[curTrack.x+1][curTrack.y].randHelp.trackDone))return false;
			break;
		case (SOUTH): 
			if (checkNeeded(curTrack, SOUTH)  || (curTrack.y > 0  && Manager.tracks[curTrack.x][curTrack.y-1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y-1].randHelp.trackDone))return false;
			break;			
		case (WEST): 
			if (checkNeeded(curTrack, WEST)  || (curTrack.x > 0  && Manager.tracks[curTrack.x-1][curTrack.y] !=null 
			&& Manager.tracks[curTrack.x-1][curTrack.y].randHelp.trackDone))return false;
			break;
	}
	switch(d2){
		case (NORTH): 
			if (checkNeeded(curTrack, NORTH)  || (curTrack.y < Manager.HEIGHT - 1 && Manager.tracks[curTrack.x][curTrack.y+1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y+1].randHelp.trackDone))return false;	// If the track in inputed direction is not done, return false
			break;
		case (EAST): 
			if (checkNeeded(curTrack, EAST)  || (curTrack.x < Manager.WIDTH - 1 && Manager.tracks[curTrack.x+1][curTrack.y] !=null 
			 && Manager.tracks[curTrack.x+1][curTrack.y].randHelp.trackDone))return false;
			break;
		case (SOUTH): 
			if (checkNeeded(curTrack, SOUTH)  || (curTrack.y > 0  && Manager.tracks[curTrack.x][curTrack.y-1] !=null 
			&& Manager.tracks[curTrack.x][curTrack.y-1].randHelp.trackDone))return false;
			break;			
		case (WEST): 
			if (checkNeeded(curTrack, WEST)  || (curTrack.x > 0  && Manager.tracks[curTrack.x-1][curTrack.y] !=null 
			&& Manager.tracks[curTrack.x-1][curTrack.y].randHelp.trackDone))return false;
			break;
	}
	checkLoopFix2(d1, d2, d3);
	return true;


}

function checkLoopFix2(d1:int, d2:int, d3: int){

	if (curTrack.randHelp.loopChecked == false) return;
	if (!curTrack.randHelp.useLoop2) return;
	curTrack.randHelp.loopChecked = true;
	if (bugCheck) curTrack.model.renderer.material.color = Color(2,2,2); // Darken 
	return;
	
}


function checkLoopHelper(d1:int, d2:int, d3:int){	// Checks if tracks at d1 and d2 are done, if so correctly changes the track so it doesn't infinitely loop
		// d3 is the direction that it we're checking if it is the only one not done
		
		/*
		Each case checks whether that track is completed
		
		If all of these are true it runs through the for loop in the other direction
		*/
		
		switch(d1){
			case (NORTH): 
				if (!checkNeeded(curTrack, NORTH) && (curTrack.y < Manager.HEIGHT - 1 && !Manager.tracks[curTrack.x][curTrack.y+1].randHelp.trackDone))return false;	// If the track in inputed direction is not done, return false
				break;
			case (EAST): 
				if (!checkNeeded(curTrack, EAST)  && (curTrack.x < Manager.WIDTH - 1 && !Manager.tracks[curTrack.x+1][curTrack.y].randHelp.trackDone))return false;
				break;
			case (SOUTH): 
				if (!checkNeeded(curTrack, SOUTH) && (curTrack.y > 0 && !Manager.tracks[curTrack.x][curTrack.y-1].randHelp.trackDone))return false;
				break;			
			case (WEST): 
				if (!checkNeeded(curTrack, WEST)  && (curTrack.x > 0 && !Manager.tracks[curTrack.x-1][curTrack.y].randHelp.trackDone))return false;
		}
		switch(d2){
			case (NORTH): 
				if (!checkNeeded(curTrack, NORTH) && (curTrack.y < Manager.HEIGHT - 1 && !Manager.tracks[curTrack.x][curTrack.y+1].randHelp.trackDone))return false;	// If the track in inputed direction is not done, return false
				break;
			case (EAST): 
				if (!checkNeeded(curTrack, EAST)  && (curTrack.x < Manager.WIDTH - 1 && !Manager.tracks[curTrack.x+1][curTrack.y].randHelp.trackDone))return false;
				break;
			case (SOUTH): 
				if (!checkNeeded(curTrack, SOUTH)  && (curTrack.x > 0 && !Manager.tracks[curTrack.x][curTrack.y-1].randHelp.trackDone))return false;
				break;			
			case (WEST): 
				if (!checkNeeded(curTrack, WEST)  && (curTrack.x > 0 && !Manager.tracks[curTrack.x-1][curTrack.y].randHelp.trackDone)) return false;
		}
	checkLoopFix(d1, d2, d3);
	return true;
}


function checkLoopFix(d1:int, d2:int, d3:int){ // See OneNote document for details on why this works
	// d3 is the direction that is not done yet
	var temp;
	var tempRand = curTrack.randHelp;
	var tempDirec = curTrack.directions;
	var tempX = curTrack.x;
	var tempY = curTrack.y;
	
	if (d1 + d2 + d3 == 3) { // north, east, south track
		if (d3 == NORTH){
			clearTrack(curTrack);
		 	curTrack = Manager.addTrack(tempX, tempY, 6, 2, tempDirec, tempRand);
		 }
		if (d3 == EAST){
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 4, 1, tempDirec, tempRand);
		}
		if (d3 == SOUTH){
			clearTrack(curTrack);
		  	curTrack = Manager.addTrack(tempX, tempY, 3, 0, tempDirec, tempRand);
		  	}
	}
	if (d1 + d2 + d3 == 4) { // north, east, west track

		if (d3 == NORTH){
			clearTrack(curTrack);	
		 	curTrack = Manager.addTrack(tempX, tempY, 4, 2, tempDirec, tempRand);
		}
		if (d3 == EAST){
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 3, 1, tempDirec, tempRand);
		}
		if (d3 == WEST){ 
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 8, 3, tempDirec, tempRand);
		}
	}
	if (d1 + d2 + d3 == 5) { // north, south, west track
		if (d3 == NORTH) {
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 3, 2, tempDirec, tempRand);
		}
		if (d3 == SOUTH){
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 6, 0, tempDirec, tempRand);
		}
		if (d3 == WEST){
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 4, 3, tempDirec, tempRand);
		}
	}
	if (d1 + d2 + d3 == 6) { // east, south, west, track
		if (d3 == EAST){
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 8, 1, tempDirec, tempRand);
		}
		if (d3 == SOUTH) {
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 4, 0, tempDirec, tempRand);
		}
		if (d3 == WEST) {
			clearTrack(curTrack);
			curTrack = Manager.addTrack(tempX, tempY, 3, 3, tempDirec, tempRand);
		}
	}
	curTrack.randHelp.loopChecked = true;
	
	if (bugCheck) curTrack.model.renderer.material.color = Color(.9,.9,.9); // Darken 
	
}

public class RandHelp {

	var NORTH = 0;
	var EAST = 1;
	var SOUTH = 2;
	var WEST = 3;
	
	var neededTracks:Array; // the tracks that need to be fulfilled in the given direction.
	//[NORTH][EAST]:boolean means whether or not the track in the north direction NEEDS to fulfill the EAST side
	
	var prev; // the previous track that moved to this
	
	var directFrom : int;	// the direction this track came from;
	
	var directions : Array;	// whether this direction worked. Will always be true if the track does not go in this direction
						// will be 0 if the direction set it to false
						// will be -1 if it has not been tried yet
						// will be 1 if if it works or it can't go in this direction (and thus works)
						
	var trackDone:boolean;
	var useLoop2:boolean; // if this track was ever surrounded by two finished tracks, it should be changed to fix an infinite loop
	
	var loopChecked;
	
	
	var nTrackList : Array; // the list of tracks to try
	var eTrackList : Array; // the list of tracks to try
	var sTrackList : Array; // the list of tracks to try
	var wTrackList : Array; // the list of tracks to try
	
	function init(prev, d:int, directions:Array){
		this.prev = prev;
		this.directFrom = d;
		this.directions = directions;
		useLoop2 = true;
		trackDone = false;
		nTrackList = new Array();
		eTrackList = new Array();
		sTrackList = new Array();
		wTrackList = new Array();
		
		loopChecked = false;
		
		neededTracks = [ [false, false, false, false], [false, false, false, false],
		[false, false, false, false], [false, false, false, false] ];

		
		
		
		
		// Whichever direction this track came from already works since there is a track coming from it
		this.directions[directFrom] = 1;
		// If the directions are possible, give them arrays to work with.
		if (directions[NORTH] == -1) nTrackList = getRand(NORTH);	
		if (directions[EAST] == -1) eTrackList = getRand(EAST);
		if (directions[SOUTH] == -1) sTrackList = getRand(SOUTH);
		if (directions[WEST] == -1) wTrackList = getRand(WEST);
	
	}
	
	
	function createStruc(t:int, r:int, d:Array){		// Directions will be -1 or 1 for valid or invalid direction respectively
		var temp = new trackStruc();
		temp.trackType = t;
		temp.rotation = r;
		temp.directions = d;
		return temp;
	}

	class trackStruc {
		var trackType;
		var rotation;
		var directions:Array;
		
	}

	var NES = [createStruc(3, 0, [-1, -1, -1, 1]), createStruc(5, 0, [-1, -1, -1, 1]), createStruc(6, 2, [-1, -1, -1, 1]), 
	createStruc(8, 2, [-1, -1, -1, 1]), createStruc(4, 1, [-1, -1, -1, 1]), createStruc(7, 1, [-1, -1, -1, 1])];
	var NEW = [createStruc(3, 1, [-1, -1, 1, -1]), createStruc(4, 2, [-1, -1, 1, -1]), createStruc(5, 1, [-1, -1, 1, -1]),
	createStruc(6, 3, [-1, -1, 1, -1]), createStruc(7, 2, [-1, -1, 1, -1]), createStruc(8, 3, [-1, -1, 1, -1])];
	var NSW = [createStruc(3, 2, [-1, 1, -1, -1]), createStruc(5, 2, [-1, 1, -1, -1]), createStruc(6, 0, [-1, 1, -1, -1]),
	createStruc(8, 0, [-1, 1, -1, -1]), createStruc(4, 3, [-1, 1, -1, -1]), createStruc(7, 3, [-1, 1, -1, -1])];
	var ESW = [createStruc(3, 3, [1, -1, -1, -1]), createStruc(5, 3, [1, -1, -1, -1]), createStruc(4, 0, [1, -1, -1, -1]),
	createStruc(7, 0, [1, -1, -1, -1]), createStruc(6, 1, [1, -1, -1, -1]), createStruc(8, 1, [1, -1, -1, -1])];


	var NE = createStruc(0, 0, [-1, -1, 1, 1]);
	var NW = createStruc(0, 1, [-1, 1, 1, -1]);
	var SW = createStruc(0, 2, [1, 1, -1, -1]);
	var ES = createStruc(0, 3, [1, -1, -1, 1]);

	var NS = createStruc(1, 0, [-1, 1, -1, 1]);
	var EW = createStruc(1, 1, [1, -1, 1, -1]);


	function getRand(direct:int){			// Currently not randomized
		var temp = new Array();
		//if (Random.Range(0,2) == 1) temp.Add(createStruc(2, 0, [-1, -1, -1, -1]));
		
		if (direct!=NORTH) temp.Add(NEW[Random.Range(0,6)]);
		if (direct!=SOUTH) temp.Add(ESW[Random.Range(0,6)]);
			
		if (direct!=SOUTH && direct!=EAST) temp.Add(ES);
		else temp.Add(NW);
		
		if (direct!=NORTH && direct!=EAST) temp.Add(NE);
		else temp.Add(SW);
		if (direct!=EAST && direct != WEST) temp.Add(NS);
		else temp.Add(EW);
		
		if (direct!=EAST) temp.Add(NES[Random.Range(0,6)]);
		if (direct!=WEST) temp.Add(NSW[Random.Range(0,6)]);
		
		//for(var i=0; i < temp.length; i++)
        //	list.Swap(i, rnd.Next(i, list.Count));
		
		
		for (var i = 0; i < temp.length; i++) {		// randomize the list
      		var t = temp[i];
      		var randomIndex = Random.Range(i, temp.length);
      		temp[i] = temp[randomIndex];
      		temp[randomIndex] = t;
    	}
    	
 
		
		return temp;
	}
		


}

function updateNeededTracks(track, direction:int){
	if (track.randHelp.prev == null){
		//if (Manager.DEVELOPER) print("Null track at end");
	  return;
	}
	if (DEMONSTRATENEED) track.model.renderer.material.color = Color(.5,.5,.5); 
	track.randHelp.prev.randHelp.neededTracks[mirrorDirec(track.randHelp.directFrom)][direction] = true;
	
	updateNeededTracks(track.randHelp.prev, mirrorDirec(track.randHelp.directFrom));
	return;
	
}

function mirrorDirec(direction:int){
	switch(direction){
		case NORTH: return SOUTH;
		case EAST: return WEST;
		case SOUTH: return NORTH;
		case WEST: return EAST;
	
	}

}

function checkNeeded(track, direction:int){
	return track.randHelp.prev.randHelp.neededTracks[mirrorDirec(track.randHelp.directFrom)][direction];

}


function isNeeded(track, direction:int){
	return ( (mirrorDirec(direction) != NORTH && track.randHelp.neededTracks[direction][NORTH] ) ||
	 (mirrorDirec(direction) != EAST && track.randHelp.neededTracks[direction][EAST] ) || 
	(mirrorDirec(direction) != SOUTH && track.randHelp.neededTracks[direction][SOUTH] ) || 
	(mirrorDirec(direction) != WEST && track.randHelp.neededTracks[direction][WEST] ) );

}

function getNeededTrack(track, direction:int){
	var direcsNeeded:Array = [false, false, false, false];
	direcsNeeded[mirrorDirec(direction)] = true;
	if (track.randHelp.neededTracks[direction][NORTH]) direcsNeeded[NORTH] = true;
	if (track.randHelp.neededTracks[direction][EAST]) direcsNeeded[EAST] = true;
	if (track.randHelp.neededTracks[direction][SOUTH]) direcsNeeded[SOUTH] = true;
	if (track.randHelp.neededTracks[direction][WEST]) direcsNeeded[WEST] = true;
	
	tempRand = new RandHelp();
	
	if (direcsNeeded[NORTH] && direcsNeeded[EAST] && !direcsNeeded[SOUTH] && !direcsNeeded[WEST]) // NORTH EAST
		return tempRand.createStruc(0, 0, [-1, -1, 1, 1]);
	if (direcsNeeded[NORTH] && !direcsNeeded[EAST] && direcsNeeded[SOUTH] && !direcsNeeded[WEST]) // NORTH SOUTH
		return tempRand.createStruc(1, 0, [-1, 1, -1, 1]);
	if (direcsNeeded[NORTH] && !direcsNeeded[EAST] && !direcsNeeded[SOUTH] && direcsNeeded[WEST]) // NORTH WEST
		return tempRand.createStruc(0, 1, [-1, 1, 1, -1]);
	if (!direcsNeeded[NORTH] && direcsNeeded[EAST] && direcsNeeded[SOUTH] && !direcsNeeded[WEST]) // EAST SOUTH
		return tempRand.createStruc(0, 3, [1, -1, -1, 1]);
	if (!direcsNeeded[NORTH] && direcsNeeded[EAST] && !direcsNeeded[SOUTH] && direcsNeeded[WEST]) // EAST WEST
		return tempRand.createStruc(1, 1, [1, -1, 1, -1]);
	if (!direcsNeeded[NORTH] && !direcsNeeded[EAST] && direcsNeeded[SOUTH] && direcsNeeded[WEST]) // SOUTH WEST
		return tempRand.createStruc(0, 2, [1, 1, -1, -1]);
		
	var NES = [tempRand.createStruc(3, 0, [-1, -1, -1, 1]), tempRand.createStruc(5, 0, [-1, -1, -1, 1]), tempRand.createStruc(6, 2, [-1, -1, -1, 1]), 
	tempRand.createStruc(8, 2, [-1, -1, -1, 1]), tempRand.createStruc(4, 1, [-1, -1, -1, 1]), tempRand.createStruc(7, 1, [-1, -1, -1, 1])];
	var NEW = [tempRand.createStruc(3, 1, [-1, -1, 1, -1]), tempRand.createStruc(4, 2, [-1, -1, 1, -1]), tempRand.createStruc(5, 1, [-1, -1, 1, -1]),
	tempRand.createStruc(6, 3, [-1, -1, 1, -1]), tempRand.createStruc(7, 2, [-1, -1, 1, -1]), tempRand.createStruc(8, 3, [-1, -1, 1, -1])];
	var NSW = [tempRand.createStruc(3, 2, [-1, 1, -1, -1]), tempRand.createStruc(5, 2, [-1, 1, -1, -1]), tempRand.createStruc(6, 0, [-1, 1, -1, -1]),
	tempRand.createStruc(8, 0, [-1, 1, -1, -1]), tempRand.createStruc(4, 3, [-1, 1, -1, -1]), tempRand.createStruc(7, 3, [-1, 1, -1, -1])];
	var ESW = [tempRand.createStruc(3, 3, [1, -1, -1, -1]), tempRand.createStruc(5, 3, [1, -1, -1, -1]), tempRand.createStruc(4, 0, [1, -1, -1, -1]),
	tempRand.createStruc(7, 0, [1, -1, -1, -1]), tempRand.createStruc(6, 1, [1, -1, -1, -1]), tempRand.createStruc(8, 1, [1, -1, -1, -1])];

	var randNum = Random.Range(0,6);
	
	if (direcsNeeded[NORTH] && direcsNeeded[EAST] && direcsNeeded[SOUTH] && !direcsNeeded[WEST]) // NORTH EAST SOUTH
		return NES[randNum];
	if (direcsNeeded[NORTH] && direcsNeeded[EAST] && !direcsNeeded[SOUTH] && direcsNeeded[WEST]) // NORTH EAST WEST
		return NEW[randNum];
	if (direcsNeeded[NORTH] && !direcsNeeded[EAST] && direcsNeeded[SOUTH] && direcsNeeded[WEST]) // NORTH SOUTH WEST
		return NSW[randNum];	
	if (!direcsNeeded[NORTH] && direcsNeeded[EAST] && direcsNeeded[SOUTH] && direcsNeeded[WEST]) // EAST SOUTH WEST
		return ESW[randNum];
		
	if (direcsNeeded[NORTH] && direcsNeeded[EAST] && direcsNeeded[SOUTH] && direcsNeeded[WEST]) // NORTH EAST SOUTH WEST
		return tempRand.createStruc(2, 0, [-1, -1, -1, -1]);
}





	