var trackType : int;
var Manager;
var rotation;
var x;
var y;


function Start () {
	gameObject.isStatic = true;
	enabled = false; // PERFORMANCE BOOST YEAH
	if (!(trackType==3||trackType==4||trackType==5||trackType==6||
				trackType==7||trackType==8))  Destroy(gameObject.collider);

}

function Update () {
	
}

function OnMouseDown(){		// switches the tracks when clicked

	
  	if (trackType!=0 && trackType!=1 && trackType!=2)	{	// only tracks 3-8 can be switched
  		// typing shortcuts based on the way the textures are arranged in the folder
  		
  		if (Manager.editMode){ 	// If editmode is on we change between all tracks going these directions
  			if ((trackType==3 && rotation==0)||(trackType==5 && rotation==0)||(trackType==6&& rotation==2)|| // These are all the NES tracks
  				(trackType==8 && rotation==2)||(trackType==4 && rotation==1)||(trackType==7 && rotation==1)){
  				
  				if (trackType == 3) changeTrack(5,rotation);
  				else if (trackType == 5) changeTrack(6,2);
  				else if (trackType == 6) changeTrack(8,rotation);
  				else if (trackType == 8) changeTrack(4,1);
  				else if (trackType == 4) changeTrack(7,rotation);
  				else if (trackType == 7) changeTrack(3,0);
  				
  			}
  			if ((trackType==3 && rotation==2)||(trackType==5 && rotation==2)||(trackType==6&& rotation==0)|| // These are all the NSW tracks
  				(trackType==8 && rotation==0)||(trackType==4 && rotation==3)||(trackType==7 && rotation==3)){
  				
  				if (trackType == 3) changeTrack(5,rotation);
  				else if (trackType == 5) changeTrack(6,0);
  				else if (trackType == 6) changeTrack(8,rotation);
  				else if (trackType == 8) changeTrack(4,3);
  				else if (trackType == 4) changeTrack(7,rotation);
  				else if (trackType == 7) changeTrack(3,2);
  				
  			}
  			if ((trackType==3 && rotation==3)||(trackType==5 && rotation==3)||(trackType==6&& rotation==1)|| // These are all the ESW tracks
  				(trackType==8 && rotation==1)||(trackType==4 && rotation==0)||(trackType==7 && rotation==0)){
  				
  				if (trackType == 3) changeTrack(5,rotation);
  				else if (trackType == 5) changeTrack(6,1);
  				else if (trackType == 6) changeTrack(8,rotation);
  				else if (trackType == 8) changeTrack(4,0);
  				else if (trackType == 4) changeTrack(7,rotation);
  				else if (trackType == 7) changeTrack(3,3);
 
  			}
  			if ((trackType==3 && rotation==1)||(trackType==5 && rotation==1)||(trackType==6&& rotation==3)|| // These are all the NEW tracks
  				(trackType==8 && rotation==3)||(trackType==4 && rotation==2)||(trackType==7 && rotation==2)){
  				
  				if (trackType == 3) changeTrack(5,rotation);
  				else if (trackType == 5) changeTrack(6,3);
  				else if (trackType == 6) changeTrack(8,rotation);
  				else if (trackType == 8) changeTrack(4,2);
  				else if (trackType == 4) changeTrack(7,rotation);
  				else if (trackType == 7) changeTrack(3,1);
  			}
  		}
  		else{
			
	
			if (trackType == 3) changeTrack(5, rotation);
			else if (trackType == 6) changeTrack(8, rotation);
			else if (trackType == 5) changeTrack(3, rotation);
			else if (trackType == 8) changeTrack(6, rotation);
			else if (trackType == 4) changeTrack(7, rotation);
			else if (trackType == 7) changeTrack(4, rotation);
  	
		}
		
	}
	
	
}

function changeTrack(t:int, r:int) { // Takes in a rotation and an angle and changes this track to that track
	var trackTypes = ["NE", "NS", "NSEW", "SEN", "SEW", "SNE", "SNW", "SWE", "SWN"];
  	renderer.material.mainTexture = Resources.Load("Textures/track"+trackTypes[t], Texture2D);
	trackType = t;
	transform.eulerAngles = Vector3(0.0,0.0,90.0*r);
	rotation = r;
}