#pragma strict

//PUBLIC VARIABLES
var applyToParent : boolean = false;
var engageBuoyancy : boolean = false;
var inheritForce : boolean = false;
var keepAtSurface : boolean = false;
var updateSpeed : float = 0.065;
var buoyancyStrength : float = 1.0;
var buoyancyOffset : float = 0.0;
var surfaceRange : float = 0.2;
var forceAmount : float = 1.0;
var forceHeightFactor : float = 0.0;
var maxVerticalSpeed: float = 5.0;
//var testHeightAmt : float = 1.0;

// PRIVATE VARIABLES
private var isUnder : boolean = false;
private var surfaceLevel : float = 0.0;
private var underwaterLevel : float = 0.0;

private var isUnderwater : boolean = false;
private var isOverWater : boolean = false;

private var physTarget : Transform;
private var moduleObject : SuimonoModule;
private var suimonoObject : SuimonoObject;

private var height : float = -1;
private var getScale : float = 1.0;
private var waveHeight : float = 0.0;

private var modTime : float = 0.0;
private var splitFac : float = 1.0;

private var rendererComponent : Renderer;
private var rigidbodyComponent : Rigidbody;
private var setUpdateSpeed : float = 0.065;

private var isOver : float = 0.0;
private var forceDir : float = 0.0;
private var forceAngles : Vector2 = Vector2(0.0,0.0);
private var forceSpeed : float = 0.0;
private var waveHt : float = 0.0;

//collect for GC
var gizPos : Vector3;
var testObjectHeight : float;
var buoyancyFactor : float;
var forceMod : float;
var waveFac : float;

var heightValues : float[];
	

function OnDrawGizmos (){
	gizPos = transform.position;
	gizPos.y += 0.03;
	Gizmos.DrawIcon(gizPos, "gui_icon_buoy.psd", true);
	gizPos.y -= 0.03;

	//Gizmos.color = Color(0.2,0.4,1.0,0.75);
	//Gizmos.DrawWireSphere(gizPos, 0.2);
	//Gizmos.DrawWireSphere(gizPos, 0.195);
	//Gizmos.DrawWireSphere(gizPos, 0.19);
}


function Awake() {

	moduleObject = GameObject.Find("SUIMONO_Module").gameObject.GetComponent(SuimonoModule);
	rendererComponent = GetComponent(Renderer);

}


function Start(){

	//get number of buoyant objects
	if (applyToParent){
		var buoyancyObjects : Component[];
		buoyancyObjects = transform.parent.gameObject.GetComponentsInChildren(fx_buoyancy);
		if (buoyancyObjects != null){
			splitFac = 1.0/buoyancyObjects.Length;
		}
	}
	
	InvokeRepeating("SetUpdate",0.1,updateSpeed);
}


function Update(){

	if (setUpdateSpeed != updateSpeed){
		setUpdateSpeed = updateSpeed;
		CancelInvoke("SetUpdate");
		InvokeRepeating("SetUpdate",0.1,updateSpeed);
	}

}






function SetUpdate () {

	// Get all height variables from Suimono Module object
	heightValues = moduleObject.SuimonoGetHeightAll(this.transform.position);
	isOver = heightValues[4];
	waveHt = heightValues[8];
	surfaceLevel = heightValues[1];

	
	//clamp
	forceHeightFactor = Mathf.Clamp(forceHeightFactor,0.0,1.0);
	
	//set debug visibility
	if (rendererComponent && applyToParent){
	if (moduleObject != null){
		if (moduleObject.showDebug){
			rendererComponent.enabled = true;
		}
	
		if (!moduleObject.showDebug && rendererComponent){
			rendererComponent.enabled = false;
		}
	}
	}
	
	//set physics target
	if (applyToParent){
		physTarget = this.transform.parent.transform;
		if (physTarget != null){
		if (rigidbodyComponent == null){
			rigidbodyComponent = physTarget.GetComponent(Rigidbody);
		}}
	} else {
		physTarget  = this.transform;
		if (physTarget != null){
		if (rigidbodyComponent == null){
			rigidbodyComponent = GetComponent(Rigidbody);
		}}
	}
	

	
	//Reset values
	isUnderwater = false;
	//isOverWater = false;
	//surfaceLevel = -1;
	//suimonoObject = null;
	underwaterLevel = 0.0;


	//get wave height calculations from suimono module
	//surfaceLevel = moduleObject.SuimonoGetHeight(this.transform.position,"surfaceLevel");
	//if (isOver == 1.0) isOverWater = true;

	
	
	//calculate scaling
	testObjectHeight = (transform.position.y+buoyancyOffset);
	
		waveHeight = surfaceLevel;
		if (testObjectHeight < waveHeight){
			isUnderwater = true;
		}
		underwaterLevel =  waveHeight-testObjectHeight;

	
	


	
	//set buoyancy
	if (engageBuoyancy && isOver == 1.0){
	if (rigidbodyComponent && !rigidbodyComponent.isKinematic){
			
			buoyancyFactor = 10.0;

			if (this.transform.position.y+buoyancyOffset < waveHeight-surfaceRange){
				
				// add vertical force to buoyancy while underwater
				isUnder = true;
				forceMod = (buoyancyFactor * (buoyancyStrength * rigidbodyComponent.mass) * (underwaterLevel) * splitFac);
				if (rigidbodyComponent.velocity.y < maxVerticalSpeed){
					rigidbodyComponent.AddForceAtPosition(Vector3(0,1,0) * forceMod, transform.position);
				}
				modTime = 0.0;
				
			} else {
				
				// slow down vertical velocity as it reaches water surface or wave zenith
				isUnder = false;
				modTime = (this.transform.position.y+buoyancyOffset) / (waveHeight+Random.Range(0.0,0.25));
				if (rigidbodyComponent.velocity.y > 0.0){
					rigidbodyComponent.velocity.y = Mathf.SmoothStep(rigidbodyComponent.velocity.y,0.0,modTime);
				}
			}
			
			
			//Add Water Force / Direction to Buoyancy Object
			if (inheritForce){
			if (this.transform.position.y+buoyancyOffset <= waveHeight){
				waveFac = Mathf.Lerp(forceHeightFactor,1.0,waveHt);
				rigidbodyComponent.AddForceAtPosition(Vector3(forceAngles.x,0,forceAngles.y) * (buoyancyFactor*2.0) * forceSpeed * waveFac * splitFac * forceAmount, transform.position);
			}
			}

	}
	}


	
}



function LateUpdate(){
	
	if (keepAtSurface){
		//rigidbodyComponent.isKinematic = true;
		//rigidbodyComponent.useGravity = false;
		//physTarget.transform.position.y = (waveHeight - (this.transform.localPosition.y));
	}

}

