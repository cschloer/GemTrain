var shielding:boolean;
var train;
var clock: float;
var TIME:float;
function Start () {
	shielding = false;
	clock = 6;
}

function Update () {
	TIME = 3.0;
	if (shielding && clock > 0) clock -= Time.deltaTime*2;
	else if (!shielding && clock < TIME) clock +=Time.deltaTime/2;
	else if (clock > TIME) clock = TIME;
	else if (clock <= 0){ 
		train.explode();
		//transform.localPosition = Vector3(-50,-50,1);
		return;
	}

	//particleSystem.
	var WARNINGTIME = 1; 
	var EXPLODING = .25;
	if (clock > WARNINGTIME) particleSystem.startColor = Color32.Lerp(Color32(118, 0, 28, 200), Color32(43,255,235, 200), (clock-WARNINGTIME)/(TIME-WARNINGTIME));
	else if (clock > EXPLODING) particleSystem.startColor = Color32.Lerp(Color32(255, 128, 0, 200), Color32(118,0,28, 200), (clock - EXPLODING)/(WARNINGTIME - EXPLODING));
	else particleSystem.startColor = Color32.Lerp(Color32(204, 204, 0, 200), Color32(255, 128, 0, 200), (clock)/(WARNINGTIME));
}

function turnOn(){
	shielding = true;
	transform.localPosition = Vector3(0,0,1);
	particleSystem.enableEmission = true;
	//particleSystem.renderer.active = false;
	particleSystem.active = true;
	//particleSystem.GetComponent(ParticleSystem).active = false;
}

function turnOff(){
	shielding = false;
	//particleSystem.renderer.active = false;
	transform.localPosition = Vector3(-50,-50,1);
}

function reset(){
	transform.localPosition = Vector3(-50,-50,1);
	shielding = false;
	clock = TIME;
}