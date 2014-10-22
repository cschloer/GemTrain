var model;


var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

var spawnArea : ParticleSystem;


function init(x:int, y:int, direction:int, tracks, manager, originalTrain:boolean) {	
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the train texture.
	
	var rotation;	// Starting out east at the beginning
	
	model = modelObject.AddComponent("trainModel");						// Add a trackModel script to control visuals of the track.
	model.transform.parent = transform;									// Set the model's parent to the train (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Train Model";											// Name the object.
	if (originalTrain) model.renderer.material.mainTexture = Resources.Load("Textures/train1", Texture2D);	// Set the texture.  Must be in Resources folder.
	else model.renderer.material.mainTexture = Resources.Load("Textures/train3", Texture2D);
	model.renderer.material.color = Color(1.5,1.5,1.5);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	
	if (manager.tempPause || manager.isSpawningTrain) model.GetComponent(MeshRenderer).enabled = false;
	
	switch(direction){	// start the track one place back so it can call the updateDisplace() function correctly
		case NORTH:
			/*model.xTrack = x;
			model.yTrack = y-1;
			model.x = x-6;
			model.y = y-3-.5;
			*/
			
			model.x = x-6;
			model.y = y-3+.5;
			rotation = 0;
			break;
		case EAST:
			//model.xTrack = x-1;
			//model.yTrack = y;
			model.x = x-6+.5;
			model.y = y-3;
			rotation = 3;
			break;
		case SOUTH:
			//model.xTrack = x;
			//model.yTrack = y+1;
			model.x = x-6;
			model.y = y-3-.5;
			rotation = 2;
			break;
		case WEST:
			//model.xTrack = x+1;
			//model.yTrack = y;
			model.x = x-6-.5;
			model.y = y-3;
			rotation = 1;
			break;
		
	}
	model.xTrack = x;
	model.yTrack = y;
	
	if (originalTrain) { 
		model.xTrack -=1;
		model.x = x-6-.5;
	}
	
	var track = tracks[x][y];
	
	
	model.transform.eulerAngles = Vector3(0.0,0.0,90.0*rotation);
	
	model.rotation = 90.0*rotation;
	
	model.transform.position = Vector3(model.x,model.y,0);	
	
	model.Manager = manager;
	model.tracks = tracks;
	model.direction = direction;
	model.origTrain = originalTrain;

	enabled = false;

}
