var x:int;
var y:int;
var model;
function init(x:int, y:int, track, m) {
	enabled = false;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the gem texture.
	model = modelObject.AddComponent("mineModel");						// Add a gemModel script to control visuals of the gem.
	model.transform.parent = transform;									// Set the model's parent to the gem (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Mine Model";											// Name the object.
	this.x = x;
	this.y = y;
	model.trackObject = track;
	model.Manager = m;
	
	// If statements to place the mine correctly aesthetically
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
	model.renderer.material.mainTexture = Resources.Load("Textures/mine", Texture2D);	// Set the texture.  Must be in Resources folder..

	model.renderer.material.color = Color(1.5,1.5,1.5);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
}
