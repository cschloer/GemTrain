var model : towerModel;
var manager;
var x:int;
var y:int;
function init(x:int, y:int, m, track) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the tower texture.
	model = modelObject.AddComponent("towerModel");						// Add a towerModel script to control visuals of the tower.
	
	model.transform.parent = transform;									// Set the model's parent to the tower (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Tower Model";											// Name the object.
	model.renderer.material.mainTexture = Resources.Load("Textures/tower", Texture2D);	// Set the texture.  Must be in Resources folder.
	model.renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	
	manager = m;
	model.manager = m;
	model.x = x;
	model.y = y;
	this.x = x;
	this.y = y;
	if ((track.model.trackType == 0 && track.model.rotation == 0)) // NE
		model.transform.localPosition = Vector3(.15, .15, 0);
	else if ((track.model.trackType == 0 && track.model.rotation == 1)) // NW
		model.transform.localPosition = Vector3(-.15, .15, 0);
	else if ((track.model.trackType == 0 && track.model.rotation == 2)) // SW
		model.transform.localPosition = Vector3(-.15, -.15, 0);
	else if ((track.model.trackType == 0 && track.model.rotation == 3)) // SE
		model.transform.localPosition = Vector3(.15, -.15, 0);
	else if ((track.model.trackType == 4 || track.model.trackType == 7) && track.model.rotation == 0)
		model.transform.localPosition = Vector3(0, -.15, 0);
	else if ((track.model.trackType == 4 || track.model.trackType == 7) && track.model.rotation == 1)
		model.transform.localPosition = Vector3(.15, 0, 0);
	else if ((track.model.trackType == 4 || track.model.trackType == 7) && track.model.rotation == 2)
		model.transform.localPosition = Vector3(0, .15, 0);
	else if ((track.model.trackType == 4 || track.model.trackType == 7) && track.model.rotation == 3)
		model.transform.localPosition = Vector3(-.15, 0, 0);
		
	// spawn particle
	spawnArea = Instantiate(manager.trainSpawn);
	spawnArea.name = "Spawning Particle";
	spawnArea.transform.parent = transform;
	spawnArea.transform.position = Vector3(x,y,0);
	spawnArea.enableEmission = true;
	
}


