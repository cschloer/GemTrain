var model;
var manager;
function init(m) {
	this.active = false;
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the tower texture.
	model = modelObject.AddComponent("bulletModel");						// Add a towerModel script to control visuals of the tower.
	
	model.transform.parent = transform;									// Set the model's parent to the tower (this object).
	model.transform.localPosition = Vector3(0,0,0);						// Center the model on the parent.
	model.name = "Bullet Model";											// Name the object.
	model.renderer.material.mainTexture = Resources.Load("Textures/bullet", Texture2D);	// Set the texture.  Must be in Resources folder.
	model.renderer.material.color = Color(1.5,1.5,1.5);												// Set the color (easy way to tint things).
	model.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	
	manager = m;
	model.Manager = m;
	model.WIDTH = m.WIDTH;
	model.HEIGHT = m.HEIGHT;
	gameObject.SetActive(false);
	

}
