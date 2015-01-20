#pragma strict
#pragma implicit
#pragma downcast

//PUBLIC VARIABLES
var enableCaustics : boolean = true;
var causticTint : Color = Color(1,1,1,1);
//var causticsOnMobile : boolean = false;
var causticRange : float = 50.0;
var sceneLightObject : Transform;
var causticObject : Transform;

var useTheseLayers : LayerMask = 0;
var causticFPS : int = 32;
var animationSpeed : float = 1.0;

var causticFrames : Texture2D[];

var manualUpdate : boolean = false;

//PUBLIC VARIABLES
public var useTex : Texture2D;


//PRIVATE VARIABLES
private var useCaustics : boolean = true;
private var maxCausticEffects : int = 30;
private var step = 40.0;
private var followObject : Transform;
private var useObject : Transform;
private var moduleObject : SuimonoModule;
private var frameIndex : int = 0;
private var currentSpeed : float = 1.0;
private var causticObjects : Transform[];
private var causticObjectsFX : fx_causticObject[];
private var hasStarted = false;

var savedPosition : Vector3;

//private var sceneLightComponent: Light;


//collect for GC
var checkPos : Vector3;
var setPX : float;
var setPY : float;
var lightPos : Vector3;
var lightDist : float;
var lx : int;
var ly : int;	
var xP : int;
var yP : int;
var posPass : boolean;
var cx : int;
var setPos : Vector3;
var causticObjectPrefab : Transform;



function Awake() {
	
	//get master objects
	moduleObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule);
}


	
	
function Start(){

	if (moduleObject.causticObjectNum > 0){
		useCaustics = true;
	} else {
		useCaustics = false;
	}
	
	//mobile check
	if (!moduleObject.causticsOnMobile){
		if (moduleObject.unityVersionIndex == 4 || moduleObject.unityVersionIndex == 5){
			useCaustics = false;
		}
	} else {
		useCaustics = true;
		if (enableCaustics) useCaustics = true;
	}
	
	if (useCaustics){
		//instantiate caustic object pool
		if (causticObject != null){
			maxCausticEffects = moduleObject.causticObjectNum;
			causticObjects = new Transform[maxCausticEffects];
			causticObjectsFX = new fx_causticObject[maxCausticEffects];
			for (cx = 0; cx < maxCausticEffects; cx++){
				setPos = transform.position;
				setPos.y = -500.0;
				causticObjectPrefab = Instantiate(causticObject, setPos, transform.rotation);
				causticObjectPrefab.transform.parent = this.transform;
				causticObjects[cx] = (causticObjectPrefab);
				causticObjectsFX[cx] = causticObjects[cx].gameObject.GetComponent(fx_causticObject);
			}
		}
		
		//set animation scheduler
		InvokeRepeating("CausticEffectUpdate", (1.0 / causticFPS), (1.0 / causticFPS)); 

	}
}



function Update () {

	if (useCaustics){

		followObject = moduleObject.setTrack;
		animationSpeed = Mathf.Clamp(animationSpeed,0.001,3.0);

		//reset invoke
		if (currentSpeed != animationSpeed){
			CancelInvoke();
			InvokeRepeating("CausticEffectUpdate", 0.0, (1.0 / (causticFPS*animationSpeed)));
			currentSpeed=animationSpeed;
		}
		
		//get the current follow object from module
		if (followObject != null){
			useObject = followObject;
		} else {
			useObject = Camera.main.transform;
		}
		
		
		SetGridSpace();
		
		if (!hasStarted){
			//SetGridSpace();
			hasStarted = true;
			manualUpdate = true;
		}
		
		if (manualUpdate){
			SetGridSpace();
			manualUpdate = false;
		}
	}
}








function SetGridSpace(){	


	step = Mathf.Sqrt(causticRange) * (causticRange/maxCausticEffects);
	
	//reposition caustic objects from ppol
	if (useObject != null){
		checkPos = Vector3(useObject.transform.position.x,0.0,useObject.transform.position.z);
		if (Vector3.Distance(savedPosition,checkPos) >= 3.0 || !hasStarted || manualUpdate){
		
			savedPosition = checkPos;
		
			//move caustic lights into new positions
			for (xP = (savedPosition.x - causticRange); xP <= (savedPosition.x + causticRange); xP += step){
			for (yP = (savedPosition.z - causticRange); yP <= (savedPosition.z + causticRange); yP += step){
			

				for (lx = 0; lx < causticObjects.length; lx++){
				
				lightPos = Vector3(causticObjects[lx].transform.position.x,0.0,causticObjects[lx].transform.position.z);
				lightDist = Vector3.Distance(lightPos,checkPos);
				
					if (lightDist > (causticRange*0.5) || !hasStarted){
						//causticObjects[lx].transform.localEulerAngles = Vector3(90.0,0.0,0.0);
						//causticObjectsFX[lx].shiftTime = 3.0 + Random.Range(0.0,12.0);
						
						//check positions for other lights
						posPass = true;
						setPX = (Mathf.Round(xP/step))*step;
						setPY = (Mathf.Round(yP/step))*step;
						for (ly = 0; ly < causticObjects.length; ly++){
							if (causticObjects[ly].transform.position.x == setPX){
							if (causticObjects[ly].transform.position.z == setPY){
								posPass = false;
							}
							}
						}
						
						//set new position
						if (posPass || !hasStarted){
							causticObjects[lx].transform.position.x = setPX;
							causticObjects[lx].transform.position.z = setPY;
							causticObjects[lx].GetComponent(Light).intensity = 0.0;
						}

					}

				}
			
			}
			}

	
		}
	}
	
}












function CausticEffectUpdate() {
	
	if (this.enabled){
	if (animationSpeed > 0.0){
		
  		useTex = causticFrames[frameIndex];

		frameIndex += 1;
    	if (frameIndex == causticFrames.length) frameIndex = 0;

    }
    }
    
}



