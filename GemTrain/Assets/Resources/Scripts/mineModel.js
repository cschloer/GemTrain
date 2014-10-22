var trackObject;
var clock:float;
var curTexture:boolean;
var explosionParticle;
var exploding:boolean;
var toExplode:boolean;
var Manager;

function Start () {
	clock = 0.0;
	curTexture = true;
	exploding = false;
	toExplode = false;
}

function Update () {
	
	clock += Time.deltaTime;
	if (exploding) {
		if (clock > 0.95){
			Destroy(transform.parent.gameObject);
		}
		return;
	}
	if (clock > 0.5){
		if (curTexture) renderer.material.mainTexture = Resources.Load("Textures/mine" + "B" , Texture2D);	// Set the texture.  Must be in Resources folder.
		else renderer.material.mainTexture = Resources.Load("Textures/mine", Texture2D);	// Set the texture.  Must be in Resources folder.
	
		curTexture = !curTexture;
		clock = 0.0;
	}
}

function OnMouseDown(){	
	if (toExplode) return;
	trackObject.mine = null;
	Destroy(this.gameObject);	


}

function explode(){
	explosionParticle = Instantiate(Manager.explosion);
	explosionParticle.transform.parent = transform;
	explosionParticle.transform.localPosition = Vector3(0,0,0);
	explosionParticle.active = true;
	exploding = true;
	clock = 0;
}