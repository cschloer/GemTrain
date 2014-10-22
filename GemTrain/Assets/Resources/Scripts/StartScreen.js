var Manager;
var clock : float;
var counter:float;
var done:boolean = false;

var BUILDSPEED:float = 4.0; 

var YCOORD = 4;

function Start () {
	clock = 0.0;
	counter = 0.0;
}

function Update () {
	clock = clock + Time.deltaTime;	
	if (counter == 0.0  && clock > 1/BUILDSPEED+counter/BUILDSPEED){
			var trackObject1 = new GameObject();					
			var trackScript1 = trackObject1.AddComponent("track");														
			trackScript1.transform.parent = Manager.trackFolder.transform;	
			trackScript1.transform.position = Vector3(-1-6,YCOORD-3,3);								
			trackScript1.init(1, 1, null, Manager, -1, 4);														
			trackScript1.name = "Track "+ "-1";	
			trackScript1.model.renderer.material.color = Color(1.5,1.5,1.5); 	
			Manager.edgeLeft = trackScript1;
			counter++;
	}
	else if (counter < Manager.WIDTH+1  && clock > 1/BUILDSPEED+counter/BUILDSPEED){
			Manager.addTrack(counter-1, YCOORD, 1, 1, null, null);
			counter++;

	}
	else if (counter == Manager.WIDTH+1  && clock > 1/BUILDSPEED+counter/BUILDSPEED) {
	
		var trackObject2 = new GameObject();					
		var trackScript2 = trackObject2.AddComponent("track");														
		trackScript2.transform.parent = Manager.trackFolder.transform;	
		trackScript2.transform.position = Vector3(13-6,YCOORD-3,3);								
		trackScript2.init(1, 1, null, Manager, 13, 4);														
		trackScript2.name = "Track "+ "-2";		
		trackScript2.model.renderer.material.color = Color(1.5,1.5,1.5); 
		Manager.edgeRight = trackScript2;	
		counter++;
	}
	else if (counter > Manager.WIDTH+1  && clock > 1/BUILDSPEED+counter/BUILDSPEED){
		if (!done){
			Manager.addTrain(0, 4, 1, true);
			done = true;
		}
	
	}
}

