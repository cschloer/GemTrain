var model : trackModel;
var trackType : int;
var rotation : int;

var directions : Array;	// list of 1's and -1s used in the random track generator
					// determine if a train can come or go in this direction
					// -1 means it can 1 means it can't
					//
var trainDirections : Array; // an array containing the directions a train can go, used in the spawnTrains method					

var south : int;
var west : int;

var hasGem:boolean;
var gem;

var mine;
var tower;

var x : int;
var y : int;

var randHelp;

function init(trackType:int, rotation:int, directions:Array, Manager, x:int, y:int) {
	gameObject.isStatic = true;
	enabled = false;
	hasGem = false;
	var trackTypes = ["NE", "NS", "NSEW", "SEN", "SEW", "SNE", "SNW", "SWE", "SWN"];
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the track texture.
	model = modelObject.AddComponent("trackModel");	
						// Add a trackModel script to control visuals of the track.
	model.trackType = trackType;
	model.Manager = Manager;
	model.rotation = rotation;
	this.x = x;
	this.y = y;
	model.x = x;
	model.y = y;
	
	
	model.transform.parent = transform;									// Set the model's parent to the track (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Track Model";											// Name the object.
	model.renderer.material.mainTexture = Resources.Load("Textures/track"+trackTypes[trackType], Texture2D);	// Set the texture.  Must be in Resources folder.
	model.renderer.material.color = Color(1.5,1.5,1.5);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	model.transform.eulerAngles = Vector3(0.0,0.0,90.0*rotation);
	
	this.directions = directions; 
	
	trainDirections = new Array(0);
	if (directions != null)
	for (var n = 0; n < 4; n++) if (directions[n] == -1)	trainDirections.Add(n);
	

}

function OnMouseDown(){
	print("hello");
}

