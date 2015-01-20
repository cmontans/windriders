#pragma strict

@script ExecuteInEditMode()
import System.IO;


//preset variables
var useDarkUI : boolean = true;
//var renderTex : RenderTexture;
var presetIndex : int;
private var presetUseIndex : int;
var presetOptions : String[];

var presetFileIndex : int;
var presetFileUseIndex : int;
var presetFiles : String[];

var refractShift : float = 1.0;
var refractScale : float = 1.0;
var blurSpread : float = 0.1;
var hasStarted : boolean = false;
var setShoreWaveScale : float = 1.0;
var setFlowShoreScale : float = 1.0;
var setflowOffX : float = 0.0;
var setflowOffY : float = 0.0;
var usewaveShoreHt : float = 0.0;
var waveBreakAmt : float = 1.0;
var shallowFoamAmt : float = 1.0;

var shoreOffX : float = 0.0;
var shoreOffY : float = 0.0;

var presetTransIndexFrm : int = 0;
var presetTransIndexTo : int = 0;
var presetStartTransition : boolean = false;
var presetTransitionTime : float = 3.0;
var presetTransitionCurrent : float = 1.0;
var presetSaveName : String = "my custom preset";
var presetToggleSave : boolean = false;
var presetDataArray : String[];
var presetDataString : String;
var baseDir : String = "SUIMONO - WATER SYSTEM 2";
var suimonoModuleObject : GameObject;
var suimonoModuleLibrary : SuimonoModuleLib;
var mirrorTexture : RenderTexture;

var hFoamHeight : float = 5.5;
var hFoamAmt : float = 1.0;
var hFoamSpread : float = 2.0;

var reflectionObject : GameObject;
var shorelineObject : GameObject;
var shorelineComponent : Suimono_flowGenerator;

var overallBright : float = 1.0;
var overallTransparency : float = 1.0;
var enableUnderDebris : boolean = true;
var enableUnderDebrisWrite : float = 1.0;

var waterForce : Vector2 = Vector2(0.0,0.0);
var flowForce : Vector2 = Vector2(0.0,0.0);
var convertAngle:Vector3;

//general variables
var presetFile : String = "/RESOURCES/_PRESETS.txt";
var typeIndex : int;
var typeUseIndex : int;
var typeOptions = new Array("Infinite 3D Ocean","3D Waves","Flat Plane");
var enableCustomTextures : boolean = false;

//editor variables
var showGeneral : boolean = false;
var showWaves : boolean = false;
var showSurface : boolean = false;
var showFoam : boolean = false;
var showUnderwater : boolean = false;
var showEffects : boolean = false;
var showPresets : boolean = false;
var showPresetsTrans : boolean = false;
var showTess : boolean = false;
var autoTess : boolean = true;

//underwater settings
var enableUnderwaterFX : boolean = true;
var enableUnderRefraction : boolean = true;
var enableDynamicReflections : boolean = true;

var underRefractionAmount : float = 1.0;
var underRefractionScale : float = 1.0;
var underRefractionSpeed : float = 1.0;

var enableUnderBlur : boolean = true;
var underBlurAmount : float = 0.01;
var blurSamples : int = 20;
var enableUnderAutoFog : boolean = true;
var underwaterColor : Color = Color(0.2,0.2,1.0,1.0);
var enableUnderEthereal : boolean = true;
var etherealShift : float = 0.1;
var underwaterFogDist : float = 1.0;
var underwaterFogSpread : float = 1.0;

var cameraIsSet : boolean;

//wave settings
var projectHeight : float = 1.0;
var waveHeight : float = 0.0;
var detailHeight : float = 0.0;
var waveShoreHeight : float = 0.0;
var heightScale : float = 1.0;
var waveScale : float = 0.0;
var detailScale : float = 0.0;
var waveShoreScale : float = 0.0;
var shoreInfluence : float = 0.0;
var normalShore : float = 0.0;
var overallScale : float = 5.0;
var lightAbsorb : float = 0.125;
var shadowAmount : float = 0.5;
var lightRefract : float = 1.0;
var foamScale : float = 0.5;
var foamAmt : float = 0.3;
var foamColor : Color = Color(0.9,0.9,0.9,0.9);
var useFoamColor : Color = Color(0.9,0.9,0.9,0.9);
var edgeSpread : float = 0.3;
var edgeBlend : float = 0.3;
var edgeColor : Color = Color(0.9,0.9,0.9,0.9);
var useEdgeColor : Color = Color(0.9,0.9,0.9,0.9);
var reflectDist : float = 0.2;
var reflectDistUnderAmt : float = 0.2;
var reflectSpread : float = 0.05;
var colorDynReflect : Color = Color(1.0,1.0,1.0,0.4);
var reflectionOffset : float = 0.35;
var reflectPlaneObject : GameObject;

var colorSurfHigh : Color = Color(0.25,0.5,1.0,0.75);
var colorSurfLow : Color = Color(0,0,0,0);
var colorHeight : float = 6.0;
var colorHeightSpread : float = 2.5;
var surfaceSmooth : float = 1.0;

//color variables
var depthColor : Color;
var depthColorR : Color;
var depthColorG : Color;
var depthColorB : Color;

var specColorH : Color;
var specColorL : Color;
var specScatterWidth : float;
var specScatterAmt : float;

//tessellation settings
var waveTessAmt : float = 8;
var waveTessMin : float = 0.0;
var waveTessSpread : float = 0.2;
var waveFac : float = 1.0;

//flowmap
var inheritColor : boolean = true;
var wave_speed : Vector2 = Vector2(0.0015,0.0015);
var shore_speed : Vector2 = Vector2(0.0015,0.0015);
var foam_speed : Vector2 = Vector2(-0.02,-0.02);

//tide
var tideColor : Color;
var tideAmount : float;
var tideSpread : float;

private var useDepthColor : Color; 

var castshadowIsOn : boolean = true;
var castshadowStrength : float;
var castshadowFade : float;
var castshadowColor : Color = Color(0,0,0,1);

//splash & collision variables
var splashIsOn : boolean = true;
var UpdateSpeed : float = 0.5;
var rippleSensitivity : float = 0.0;
var splashSensitivity :float = 0.2;
var isinwater : boolean = false;
var isUnderwater : boolean = false;
var atDepth : float = 0.0;
private var setvolume = 0.65;
private var ringsTime = 0.0;

//var objectRingsTime : float[];
//var objectRingsTimes = new Array();

var CurrentColliders : Collider[];
var CurrCollPoss : Vector3[];
var CurrCollPos = new Array();
var CurrentCollider = new Array();
private var moduleSplashObject : SuimonoModule;
private var thisSuimonoObject : GameObject;
private var suimonoScaleObject : GameObject;
private var suimonoShadowObject : GameObject;

private var shoreAmt : float = 0.85;
private var shoreAmtDk : float = 1.0;
private var shoreTideTimer : float = 0.0;

var _suimono_uvx : float;
var _suimono_uvy : float;
var _suimono_uv2x : float;
var _suimono_uv2y : float;
var _suimono_uv3x : float;
var _suimono_uv3y : float;
var _suimono_uv4x : float;
var _suimono_uv4y : float;
var setWavScale : float;
var setDetScale : float;
var setDtScale : float;
var useWaveHt : float;
var useDetHt : float;
var useDpWvHt : float;
var useDtHt : float;

//wave texture animation variables
var flowSpeed : float = 0.1;
var setflowSpeed : float = 0.1;
var setshoreflowSpeed : float = 0.1;
var waveSpeed : float = 0.1;
var foamSpeed : float = 0.1;
var shoreSpeed : float = 0.1;
var flow_dir : Vector2 = Vector2(0.0015,0.0015);
var flow_dir_degrees : float = 0.0;

var shore_dir : Vector2 = Vector2(0.0015,0.0015);
var shore_dir_degrees : float = 0.0;

var wave_dir : Vector2 = Vector2(0.0015,0.0015);
var foam_dir : Vector2 = Vector2(-0.02,-0.02);
var water_dir : Vector2 = Vector2(0.0,0.0);
private var animationSpeed : float = 1.0;
private var timex : float = 0.0;
private var timey : float = 0.0;

private var shaderSurface : Shader;
private var shaderSurfaceScale : Shader;
private var shaderUnderwater : Shader;
private var shaderUnderwaterFX : Shader;

//flowmap
private var m_animationSpeed : float = 1.0;
private var systemSpeed : float = 1.0;
private var m_fFlowMapOffset0 : float = 0.0f;
private var m_fFlowMapOffset1 : float = 0.0f;
private var m_fFlowSpeed : float = 0.05f;
private var m_fCycle : float = 1.0f;
private var m_fWaveMapScale : float = 2.0f;

//infinite ocean
private var saveScale : Vector2 = Vector2(10.0,10.0);
private var oceanTimer : float = 1.0;
private var oceanHasStarted : boolean = false;

private var currentWaterLevel : float = 0.0;
private var currentSurfaceLevel : float = 0.0;

private var tempMaterial : Material;
private var tempMaterialScale : Material;
private var tempMaterialShadow : Material;

private var setPos : Vector3 = Vector3(0,0,0);
private var setSpace : Vector2 = Vector2(0.0,0.0);
private var setSpace2 : Vector2 = Vector2(0.0,0.0);
private var setSpace3 : Vector2 = Vector2(0.0,0.0);
private var setSpace4 : Vector2 = Vector2(0.0,0.0);
private var uvMult : float = 1.0;
private var uvMult2 : float = 1.0;
private var uvMult3 : float = 1.0;
private var uvMult4 : float = 1.0;		

private var savePos : Vector2 = Vector2(0.0,0.0);
private var savePos2 : Vector2 = Vector2(0.0,0.0);

private var currVersionIndex : int = 50;
private var shaderIsSet : boolean = false;



private var thisrendererComponent : Renderer;
private var scalerendererComponent : Renderer;
private var reflectrendererComponent : Renderer;
private var shadowrendererComponent : Renderer;


//collect for GC
var userenderTex : boolean;
var isHDR : float;
var isMac : float;
var isLin : float;
var setTessScale : float;
var setTessStart : float;
var setTessSpread : float;
var cx : int;
var reflDist : float;
var getTex : Texture;
var useRefract : float;
var refractScl : float;
var useScale : float;
var shoreWaveStretch : float;
var shoreWaveStretch2 : float;
var absorbAmt : float;
var shadowAmt : float;
var setSCL : float;
var refractAmt : float;
var refractShft : float;
var reflectDistAmt : float;
var reflectSpreadAmt : float;
var reflectAmt : float;
var reflectUnderDist : float;
var blurSprd : float;
var surfaceSmoothAmt : float;
var useUnderFogDist : float;
var _SpecHotAmt : float;
var _SpecAmt : float;
var suiHeight : float;
var camHeight : float;
var setFoamScale : float;
var useFoamScale : float;
var foamSpread : float;
var useFoamHt : float;
var useHFoam : float;
var useHFoamSpd : float;
var setFoamSpread : float;
var useEdgeBlend : float;
var setEdgeBlend : float;
var useUVR : float;
var setScaleX : float;
var setScaleY : float;
var setScale2X : float;
var setScale2Y : float;
var setUsePos : Vector3;
var upStep : float;
var spacer : float;
var spacerUV : float;
var setScale : float;
var useSc : float;
var setSc : Vector2;
var setDpth : float;
var newPos : Vector3;
var fudgex : float;
var fudgey : float;
var offamt : float;
var offamt2 : float;
var getRatio : float;
var getScale : Vector2;
var setDynRef : float;
var outColor : Color;
var outValue : float;
var ckSpeed : float;
var alwaysEmit : boolean;
var addSize : float;
var addRot : float;
var addVel : Vector3;		
var hitVeloc : Vector3;
var tempPointer : GameObject;
var tempDetector : GameObject;
var checkColl : Collider;
var collsetpos : Vector3;
var sizeScale : float;
var soundVol : float;	
var retFloat : float;

var thisRenderMaterial : Material;
var scaleRenderMaterial : Material;

function Start () {

	//DISCONNECT FROM PREFAB
	#if UNITY_EDITOR
		PrefabUtility.DisconnectPrefabInstance(this.gameObject);
	#endif

	//SET DIRECTORIES
	#if UNITY_EDITOR
		baseDir = "SUIMONO - WATER SYSTEM 2/RESOURCES/";
		presetFile  = "_PRESETS.txt";
	#else
		baseDir = "/Resources/";
		presetFile  = "_PRESETS.txt";
	#endif
	
	//REFERENCE OBJECTS
	if (GameObject.Find("SUIMONO_Module") != null) suimonoModuleObject = GameObject.Find("SUIMONO_Module").gameObject;
	
	thisSuimonoObject = this.transform.Find("Suimono_Object").gameObject;
	suimonoScaleObject = this.transform.Find("Suimono_ObjectScale").gameObject;
	//suimonoShadowObject = this.transform.Find("Suimono_ObjectShadow").gameObject;
	reflectionObject = this.transform.Find("Suimono_reflectionObject").gameObject;
	shorelineObject = this.transform.Find("Suimono_shorelineObject").gameObject;
	shorelineComponent = shorelineObject.GetComponent(Suimono_flowGenerator) as Suimono_flowGenerator;
	
	//INIT RENDER TEXTURE FOR REFLECTION
	//renderTex = new RenderTexture(512,512,16,RenderTextureFormat.ARGB32);

	//SPLASH & COLLISION SETUP
	//objectRingsTime = objectRingsTimes.ToBuiltin(float) as float[];
	if (suimonoModuleObject != null){
		moduleSplashObject = suimonoModuleObject.GetComponent(SuimonoModule);
		suimonoModuleLibrary = suimonoModuleObject.GetComponent(SuimonoModuleLib);
	} else {
		Debug.Log("SUIMONO: Warning... SUIMONO_Module game object cannot be found!");
	}
	
	CurrentColliders = CurrentCollider.ToBuiltin(Collider) as Collider[];
	CurrCollPoss = CurrCollPos.ToBuiltin(Vector3) as Vector3[];
	//Save Original Scale
	saveScale.x = this.transform.localScale.x;

	//setup custom material
	//if (thisSuimonoObject != null) tempMaterial = new Material(thisSuimonoObject.GetComponent(Renderer).sharedMaterial);
	//thisSuimonoObject.GetComponent(Renderer).sharedMaterial = tempMaterial;
	//if (suimonoScaleObject != null) tempMaterialScale = new Material(suimonoScaleObject.GetComponent(Renderer).sharedMaterial);
	//suimonoScaleObject.GetComponent(Renderer).sharedMaterial = tempMaterialScale;
	//if (suimonoShadowObject != null) tempMaterialShadow = new Material(suimonoShadowObject.GetComponent(Renderer).sharedMaterial);
	//suimonoShadowObject.GetComponent(Renderer).sharedMaterial = tempMaterialShadow;	

	//store component references
	if (thisSuimonoObject != null) thisrendererComponent = thisSuimonoObject.GetComponent(Renderer);
	if (suimonoScaleObject != null) scalerendererComponent = suimonoScaleObject.GetComponent(Renderer);
	if (reflectionObject != null) reflectrendererComponent = reflectionObject.GetComponent(Renderer);
	//if (suimonoShadowObject != null) shadowrendererComponent = suimonoShadowObject.GetComponent(Renderer);

	cameraIsSet = true;
	if (moduleSplashObject.setCamera != null){
		if (moduleSplashObject.setCamera.GetComponent(Camera) != null) cameraIsSet = false;
	}

	PresetLoad();
	InvokeRepeating("StoreSurfaceHeight",0.1,0.1);
	Invoke("MarkAsStarted",0.1);
	presetStartTransition = false;

	//reset collider hax
	if (GetComponent(MeshCollider) != null){
		//thisSuimonoObject.GetComponent(MeshCollider).enabled = false;
		//thisSuimonoObject.GetComponent(MeshCollider).enabled = true;
	}
	//shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro");
	//suimonoScaleObject.GetComponent(Renderer).sharedMaterial.shader = shaderSurfaceScale;

	//FORCE GAME OBJECT TO NON-STATIC
	this.gameObject.isStatic = false;
	thisSuimonoObject.isStatic = false;
	suimonoScaleObject.isStatic = false;
	//reflectionObject
	//shorelineObject
	//shorelineComponent




	//store component references
	thisrendererComponent = thisSuimonoObject.GetComponent(Renderer);
	scalerendererComponent = suimonoScaleObject.GetComponent(Renderer);
	reflectrendererComponent = reflectionObject.GetComponent(Renderer);
	//shadowrendererComponent = suimonoShadowObject.GetComponent(Renderer);

	suimonoModuleObject = GameObject.Find("SUIMONO_Module").gameObject;
	//moduleSplashObject = suimonoModuleObject.GetComponent(SuimonoModule);
	suimonoModuleLibrary = suimonoModuleObject.GetComponent(SuimonoModuleLib);
	thisSuimonoObject = this.transform.Find("Suimono_Object").gameObject;
	suimonoScaleObject = this.transform.Find("Suimono_ObjectScale").gameObject;



	
    //var tmp = new System.Object[1024];
    // make allocations in smaller blocks to avoid them to be treated in a special way, which is designed for large blocks
        //for (var i : int = 0; i < 1024; i++)
       // tmp[i] = new byte[1024];
    // release reference
        //tmp = null;
        
        
}









function LateUpdate(){

//if (Time.frameCount % (60*20) == 0){
//   System.GC.Collect();
//}


	#if UNITY_EDITOR
	if (!Application.isPlaying){
		//set default material explicitly
		if (suimonoModuleLibrary.materialSurface != null){
			thisrendererComponent.sharedMaterial = suimonoModuleLibrary.materialSurface;
			if (scalerendererComponent != null) scalerendererComponent.sharedMaterial = suimonoModuleLibrary.materialSurfaceScale;
		}
	}
	#endif
	
	


	
	//get objects while in editor mode
	#if UNITY_EDITOR
	if (!Application.isPlaying){	
		if (moduleSplashObject == null){	
		if (GameObject.Find("SUIMONO_Module")){
			moduleSplashObject = GameObject.Find("SUIMONO_Module").GetComponent(SuimonoModule) as SuimonoModule;
		}
		}
	}
	#endif
	
	//set UI color
	if (moduleSplashObject != null){
		useDarkUI = moduleSplashObject.useDarkUI;
	}

	if (moduleSplashObject.unityVersionIndex != currVersionIndex){
		shaderIsSet = false;
	}
	
	
	
	//SET SHADER DEFAULTS
	//if (!shaderIsSet){
	
		//avoids incompatible shader assignments in various unity/target versions
		#if UNITY_EDITOR
		//if (!Application.isPlaying){	
			//UNITY BASIC VERSION SPECIFIC
			if (moduleSplashObject.unityVersionIndex == 0){//unity basic version
				shaderSurface = Shader.Find("Suimono2/water_basic");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_basic");
				shaderUnderwater = Shader.Find("Suimono2/water_under_basic");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
			
			//UNITY BASIC DX11 VERSION SPECIFIC
			if (moduleSplashObject.unityVersionIndex == 1){//unity basic version
				shaderSurface = Shader.Find("Suimono2/water_basic_dx11");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_basic");
				shaderUnderwater = Shader.Find("Suimono2/water_under_basic_dx11");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}	
					
			//UNITY iOS VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 4){//iOS
				shaderSurface = Shader.Find("Suimono2/water_ios");
				shaderSurfaceScale = Shader.Find("Suimono2/water_ios");
				shaderUnderwater = Shader.Find("Suimono2/water_under_ios");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
			
			//UNITY ANDROID VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 5){//android
				shaderSurface = Shader.Find("Suimono2/water_android");
				shaderSurfaceScale = Shader.Find("Suimono2/water_android");
				shaderUnderwater = Shader.Find("Suimono2/water_under_android");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_basic");
			}
				
			//UNITY PRO DX11 VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 3){//dx11
				shaderSurface = Shader.Find("Suimono2/water_pro_dx11");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro");
				shaderUnderwater = Shader.Find("Suimono2/water_under_pro_dx11");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane_dx11");
			}
	
			//UNITY PRO VERSION SPECIFIC
			else if (moduleSplashObject.unityVersionIndex == 2){//pro
				shaderSurface = Shader.Find("Suimono2/water_pro");
				shaderSurfaceScale = Shader.Find("Suimono2/waterscale_pro");
				shaderUnderwater = Shader.Find("Suimono2/water_under_pro");
				shaderUnderwaterFX = Shader.Find("Suimono2/effect_refractPlane");
			}
		
			suimonoModuleLibrary.shader1 = shaderSurface;
			suimonoModuleLibrary.shader2 = shaderUnderwater;
			suimonoModuleLibrary.shader3 = shaderUnderwaterFX;
			suimonoModuleLibrary.shader4 = shaderSurfaceScale;
		//}
		#else
			shaderSurface = suimonoModuleLibrary.shader1;
			shaderUnderwater = suimonoModuleLibrary.shader2;
			shaderUnderwaterFX = suimonoModuleLibrary.shader3;
			shaderSurfaceScale = suimonoModuleLibrary.shader4;
		#endif
	//}


		//#######  SET SHADERS  #######
		//setup custom material
		if (tempMaterial == null){
			if (thisSuimonoObject != null){
				tempMaterial = new Material(shaderSurface);
				thisSuimonoObject.GetComponent(Renderer).sharedMaterial = tempMaterial;
			}
		}
		if (tempMaterialScale == null){
			if (suimonoScaleObject != null){
				tempMaterialScale = new Material(shaderSurfaceScale);
				suimonoScaleObject.GetComponent(Renderer).sharedMaterial = tempMaterialScale;
			}
		}
		thisRenderMaterial = thisrendererComponent.sharedMaterial;
		scaleRenderMaterial = scalerendererComponent.sharedMaterial;
	
		
		// set shaders
		if (Application.isPlaying){
			if (moduleSplashObject != null){
				if (currentWaterLevel >= 0.0){
					thisRenderMaterial.shader = shaderUnderwater;
				} else {
					thisRenderMaterial.shader = shaderSurface;
				}
			}
		} else {
			thisSuimonoObject.GetComponent(Renderer).sharedMaterial.shader = shaderSurface;
		}
		

		
	if (!shaderIsSet){
	if (Application.isPlaying){	
		scaleRenderMaterial.shader = shaderSurfaceScale;
		currVersionIndex = moduleSplashObject.unityVersionIndex;
		shaderIsSet = true;
	}
	}


				



	//UPDATE PRESETS
	//get the current preset data.
	#if UNITY_EDITOR
		PresetSetFile();
		PresetGetData();
		if (presetToggleSave) PresetSave("");
		if (presetStartTransition) PresetDoTransition();
		if (!presetStartTransition) presetTransitionCurrent = 0.0;
	#else
		if (moduleSplashObject.includePresetsInBuild){
			PresetGetData();
			if (presetToggleSave) PresetSave("");
			if (presetStartTransition) PresetDoTransition();
			if (!presetStartTransition) presetTransitionCurrent = 0.0;
		}
	#endif
	
	//CONVERT DEGREES to FLOW DIRECTION
	//convert 0-360 degree setting to useable Vector2 data.
	//used for the normal and foam flow/uv scrolling.
	if (moduleSplashObject != null){
		flow_dir = moduleSplashObject.SuimonoConvertAngleToDegrees(flow_dir_degrees);
		shore_dir = moduleSplashObject.SuimonoConvertAngleToDegrees(270.0);
	}

	
	//####### RESET WAVE SETTINGS ON FLAT SURFACE ##########
	if (typeIndex == 2){
		waveFac = 1.0;
	} else {
		waveFac = 1.0;
	}
	

	//#######  MANAGE LOCAL REFLECTION TEXTURE  #######
	userenderTex = true;



	//######## HANDLE FORWARD RENDERING SWITCH #######
	if (cameraIsSet){
	//if (moduleSplashObject.setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
	//	Shader.SetGlobalFloat("_isForward",1.0);
	//} else {
	//	Shader.SetGlobalFloat("_isForward",0.0);
	//}
	}
	
	//######## HANDLE HDR RENDERING SWITCH #######
	isHDR = 0.0;
	if (cameraIsSet){
	//if (moduleSplashObject.setCamera.GetComponent(Camera).hdr){
		//if (moduleSplashObject.setCamera.GetComponent(Camera).actualRenderingPath == RenderingPath.Forward){
		//	isHDR =1.0;
		//}
	//}
	}
	Shader.SetGlobalFloat("_isHDR",isHDR);


	//######## HANDLE MAC RENDERING SWITCH #######
	isMac = 0.0;
	#if UNITY_STANDALONE_OSX
		isMac = 1.0;
	#endif
	Shader.SetGlobalFloat("_isMac",isMac);
	
	
	//######## HANDLE LINEAR RENDERING SWITCH #######
	isLin = 0.0;
	if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		isLin = 1.0;
	}
	Shader.SetGlobalFloat("_SuimonoIsLinear",isLin);
	
	
	//set blursamples
	if (moduleSplashObject != null){
		blurSamples = moduleSplashObject.blurSamples;
		thisRenderMaterial.SetFloat("_blurSamples", floatRound(blurSamples));
	}
	
	//FLOW MAP HANDLING
	m_animationSpeed = 1.0;
	m_animationSpeed = Mathf.Clamp(m_animationSpeed,0.0,1.0);
	
	//set speed limits
	setflowSpeed = Mathf.Lerp(0.0,0.3,flowSpeed);
	wave_speed.x = -flow_dir.x*(setflowSpeed);
	wave_speed.y = -flow_dir.y*(setflowSpeed);
	
	setshoreflowSpeed = Mathf.Lerp(0.0,2.0,shoreSpeed);
	shore_speed.x = -shore_dir.x*(setshoreflowSpeed);
	shore_speed.y = -shore_dir.y*(setshoreflowSpeed);

	//assign speed to shader
	thisRenderMaterial.SetTextureOffset("_WaveTex",Vector2((wave_speed.x*Time.time*m_animationSpeed),(wave_speed.y*Time.time*m_animationSpeed)));
	
	setflowOffX = thisRenderMaterial.GetTextureOffset("_Surface2").x;
	setflowOffY = thisRenderMaterial.GetTextureOffset("_Surface2").y;
	
	thisRenderMaterial.SetFloat("flowOffX",floatRound(setflowOffX));
	thisRenderMaterial.SetFloat("flowOffY",floatRound(setflowOffY));
	
	shoreOffX = floatRound(thisRenderMaterial.GetTextureOffset("_FlowMap").x);
	shoreOffY = floatRound(thisRenderMaterial.GetTextureOffset("_FlowMap").y);
	thisRenderMaterial.SetFloat("shoreOffX",shoreOffX);
	thisRenderMaterial.SetFloat("shoreOffY",shoreOffY);

	thisRenderMaterial.SetFloat("shoreWaveOffX",floatRound(thisRenderMaterial.GetTextureOffset("_WaveTex").x));
	thisRenderMaterial.SetFloat("shoreWaveOffY",floatRound(thisRenderMaterial.GetTextureOffset("_WaveTex").y));



	//FILL MAIN TEXTURES BY DEFAULT
	//fills default texture slots from the Module object
	if (enableCustomTextures == false){
		if (suimonoModuleLibrary){
			if (suimonoModuleLibrary.texDisplace) thisRenderMaterial.SetTexture("_WaveLargeTex",suimonoModuleLibrary.texDisplace);
			if (suimonoModuleLibrary.texHeight1) thisRenderMaterial.SetTexture("_Surface1",suimonoModuleLibrary.texHeight1);
			if (suimonoModuleLibrary.texHeight2) thisRenderMaterial.SetTexture("_Surface2",suimonoModuleLibrary.texHeight2);
			if (suimonoModuleLibrary.texFoam) thisRenderMaterial.SetTexture("_FoamTex",suimonoModuleLibrary.texFoam);
			if (suimonoModuleLibrary.texRampWave) thisRenderMaterial.SetTexture("_WaveRamp",suimonoModuleLibrary.texRampWave);
			if (suimonoModuleLibrary.texRampDepth) thisRenderMaterial.SetTexture("_DepthRamp",suimonoModuleLibrary.texRampDepth);
			if (suimonoModuleLibrary.texRampBlur) thisRenderMaterial.SetTexture("_BlurRamp",suimonoModuleLibrary.texRampBlur);
			if (suimonoModuleLibrary.texRampFoam) thisRenderMaterial.SetTexture("_FoamRamp",suimonoModuleLibrary.texRampFoam);
			if (suimonoModuleLibrary.texCube1) thisRenderMaterial.SetTexture("_CubeTex",suimonoModuleLibrary.texCube1);
			if (suimonoModuleLibrary.texWave) thisRenderMaterial.SetTexture("_WaveTex",suimonoModuleLibrary.texWave);
		}
	}
	

	// SET WAVE SCALE
	if (hasStarted){
		setWavScale = waveScale * this.transform.localScale.x;
		setDetScale = detailScale * this.transform.localScale.x * 10.0;

		setShoreWaveScale = thisRenderMaterial.GetTextureScale("_WaveTex").x;

		thisRenderMaterial.SetFloat("waveScale",floatRound(setWavScale));
		thisRenderMaterial.SetTextureScale("_Surface1",Vector2(setWavScale,setWavScale));
		
		thisRenderMaterial.SetFloat("detailScale",floatRound(setDetScale));
		thisRenderMaterial.SetTextureScale("_WaveLargeTex",Vector2(setDetScale,setDetScale));
		thisRenderMaterial.SetTextureScale("_Surface2",Vector2(setDetScale,setDetScale));
		
		thisRenderMaterial.SetFloat("normalShore",floatRound(normalShore));
		thisRenderMaterial.SetFloat("shoreWaveScale",floatRound(setShoreWaveScale));
		
		//set shore wave breaks
		thisRenderMaterial.SetTextureScale("_WaveTex",Vector2(floatRound(waveBreakAmt),0.0));
	}


	//SET SHADER TIME and SCALE
    thisRenderMaterial.SetFloat("_Phase", Time.time );
    thisRenderMaterial.SetFloat("_dScaleX", floatRound(thisRenderMaterial.GetTextureScale("_Surface1").x));
	thisRenderMaterial.SetFloat("_dScaleY", floatRound(thisRenderMaterial.GetTextureScale("_Surface1").y));
	

	//TESSELLATION SETTINGS
	setTessScale = waveTessAmt;
	thisRenderMaterial.SetFloat("_Tess", floatRound(setTessScale));
	setTessStart = Mathf.Lerp(-180.0,0.0,waveTessMin);
	thisRenderMaterial.SetFloat("_minDist", floatRound(setTessStart));
	setTessSpread = Mathf.Lerp(20.0,500.0,waveTessSpread);
	thisRenderMaterial.SetFloat("_maxDist", floatRound(setTessSpread));
	thisRenderMaterial.SetFloat("_Displacement", 1.0);
	

	//EDITOR MODE TWEAKS
	//certain calculations rely on depth buffer generation which the scene camera
	//won't calculate while in editor mode. The below temporarily addresses these
	//issues so the water surface doesn't look whack in editor mode.  this shouldn't
	//effect the in-game modes at all.
	useFoamColor = foamColor;
	useDepthColor = depthColor;
	useEdgeColor = edgeColor;

	if (!Application.isPlaying){
		useFoamColor.a = 0.0;
		//useDepthColor.a = 0.35;
		useEdgeColor.a = 0.0;
	}
	

	//SPLASH AND COLLISION EFFECTS
	//advance fx timer
	//ringsTime += Time.deltaTime;
	//if (CurrentColliders.length > 0){
	//	for (cx = 0; cx < CurrentColliders.length; cx++){
	//		objectRingsTime[cx] += Time.deltaTime;
	//	}
	//}

	
	
	if (moduleSplashObject.unityVersionIndex == 0 || moduleSplashObject.unityVersionIndex == 1) userenderTex = false;
	if (moduleSplashObject.unityVersionIndex == 4 || moduleSplashObject.unityVersionIndex == 5) userenderTex = false;	

	if (!moduleSplashObject.enableDynamicReflections || !enableDynamicReflections){
		userenderTex = false;
	}
	if (!userenderTex){
	
		if (Application.isPlaying){
				if (reflectionObject != null) reflectionObject.SetActive(false);
		}

	} else {

		if (reflectionObject != null && userenderTex){
		
			reflectionObject.SetActive(true);

			
			//enable reflection based on distance
			//if (moduleSplashObject.setCamera) reflDist = Vector3.Distance(transform.localPosition,moduleSplashObject.setCamera.localPosition);
			//if (moduleSplashObject.setCamera) reflDist = Vector3.Distance(thisSuimonoObject.transform.position,moduleSplashObject.setCamera.position);
			//if (reflectionObject != null){
			//if (Application.isPlaying){

				//check distance render
				//if (reflDist <= 100.0) reflectionObject.SetActive(true);
				//if (reflDist > 100.0 && hasStarted) reflectionObject.SetActive(false);

			//}
			//}
							
			//check for underwater
			isUnderwater = false;
			if (currentWaterLevel >= 0.0){
				//swap reflection coordinates underwater
				if (reflectionObject != null) reflectionObject.transform.eulerAngles = Vector3(0.0,0.0,180.0);
			} else {
				if (reflectionObject != null) reflectionObject.transform.eulerAngles = Vector3(0.0,0.0,0.0);
			}
		
		if (Application.isPlaying){	
			getTex = reflectrendererComponent.sharedMaterial.GetTexture("_ReflectionTex");
			thisRenderMaterial.SetTexture("_ReflectionTex",getTex);
		}
		}
	}
	

	
	//if (shorelineObject != null){
	//if (Application.isPlaying){
		//unity 3.5 compilation
		//if (reflDist <= (60.0*transform.localScale.x)) shorelineObject.active = true;
		//if (reflDist > (60.0*transform.localScale.x)) shorelineObject.active = false;
	//}
	//}
	


	// ########## ASSIGN GENERAL ATTRIBUTES ############
	useRefract = 1.0;
	if (!moduleSplashObject.enableRefraction) useRefract = 0.0;
	refractScl = Mathf.Lerp(0.0,(2.25),refractScale);
	
	
	thisRenderMaterial.SetFloat("_RefrScale",floatRound(refractScl));
	useScale = (this.transform.localScale.x * refractScl);
	thisRenderMaterial.SetFloat("_MasterScale",floatRound(useScale));
	thisRenderMaterial.SetFloat("_WaveAmt",floatRound(useScale));
	thisRenderMaterial.SetFloat("_NormalAmt",floatRound(useScale*10.0));
	
	//Calculate Shore & Wave FX
	shoreWaveStretch = 4.5;
	shoreWaveStretch2 = 0.0;
	shoreAmt = ((1.0-shoreWaveStretch)+Mathf.Sin(Time.time*0.75)*shoreWaveStretch);
	tideAmount = ((0.3)+Mathf.Sin(Time.time*0.45)*0.2);
	thisRenderMaterial.SetFloat("_ShoreAmt",floatRound(shoreAmt));
	thisRenderMaterial.SetFloat("_TideAmount",floatRound(tideAmount));
	
	//Calculate Waves
	useWaveHt = Mathf.Lerp(0.0001,10.0,(waveHeight/10.0)*waveFac);
	thisRenderMaterial.SetFloat("_WaveHeight",floatRound(useWaveHt));
	useDetHt = Mathf.Lerp(0.0001,3.0,(detailHeight/3.0)*waveFac);
	thisRenderMaterial.SetFloat("_DetailHeight",floatRound(useDetHt));
	usewaveShoreHt = Mathf.Lerp(0.0001,1.5,(waveShoreHeight*waveFac)/20.0);
	thisRenderMaterial.SetFloat("_WaveShoreHeight",floatRound(usewaveShoreHt));

	setFlowShoreScale = Mathf.Lerp(0.1,4,waveShoreScale);
	thisRenderMaterial.SetFloat("_FlowShoreScale",floatRound(setFlowShoreScale));
	thisRenderMaterial.SetFloat("_TimeX",thisRenderMaterial.GetTextureOffset("_Surface1").x);
	thisRenderMaterial.SetFloat("_TimeY",thisRenderMaterial.GetTextureOffset("_Surface1").y);
	thisRenderMaterial.SetFloat("_DTimeX",thisRenderMaterial.GetTextureOffset("_WaveLargeTex").x);
	thisRenderMaterial.SetFloat("_DTimeY",thisRenderMaterial.GetTextureOffset("_WaveLargeTex").y);
	
	timex += Time.deltaTime * waveSpeed;
	timey += Time.deltaTime * waveSpeed;
	
	//Calculate Overall Brightness
	thisRenderMaterial.SetFloat("_OverallBright",floatRound(overallBright));
	
	//Calculate Overall Transparency
	thisRenderMaterial.SetFloat("_OverallTrans",floatRound(overallTransparency));
	
	//Calculate Light Absorption
	absorbAmt = Mathf.Lerp(0.0,50.0,lightAbsorb);
	thisRenderMaterial.SetFloat("_DepthAmt",floatRound(absorbAmt));
	
	//set shadow amount
	shadowAmt = Mathf.Lerp(0.0,1.0,shadowAmount);
	thisRenderMaterial.SetFloat("_ShadowAmt",floatRound(shadowAmt));
	
	//Calculate Refraction
	setSCL = transform.localScale.x;
	refractAmt = Mathf.Lerp(0.0,(500.0/setSCL),Mathf.Lerp(0.0,0.1,lightRefract));
	refractAmt *= (this.transform.localScale.x/10.0);
	thisRenderMaterial.SetFloat("_RefrStrength",floatRound(refractAmt)*useRefract);
	refractShft = Mathf.Lerp(0.0,0.2,refractShift);
	thisRenderMaterial.SetFloat("_RefrShift",floatRound(refractShft)*useRefract);


	//Calculate Reflections
	if (thisRenderMaterial.GetTexture("_ReflectionTex") == null){
		thisRenderMaterial.SetFloat("useReflection",0.0);
	} else {
		thisRenderMaterial.SetFloat("useReflection",1.0);
	}
	
	reflectDistAmt = Mathf.Lerp(-200,200, reflectDist);
	reflectSpreadAmt = Mathf.Lerp(0.015,0.001,reflectSpread);
	thisRenderMaterial.SetFloat("_ReflDist",floatRound(reflectDistAmt));
	thisRenderMaterial.SetFloat("_ReflBlend",floatRound(reflectSpreadAmt));
	thisRenderMaterial.SetColor("_DynReflColor",LinearTransfer(colorDynReflect));
	reflectAmt = Mathf.Lerp(0.0,100.0,reflectionOffset);
	thisRenderMaterial.SetFloat("_ReflectStrength",floatRound(reflectAmt));
	
	//Calculate Underwater Reflections
	reflectUnderDist = Mathf.Lerp(-30,0,reflectDistUnderAmt);
	reflectUnderDist = Mathf.Lerp(-10.0,0.0,reflectDistUnderAmt);
	thisRenderMaterial.SetFloat("_UnderReflDist",floatRound(reflectUnderDist));

	//Calculate Blur
	blurSprd = Mathf.Lerp(0.0,1.0,blurSpread);
	thisRenderMaterial.SetFloat("_BlurSpread",floatRound(blurSprd)*useRefract);
	
	//surface smoothness
	surfaceSmoothAmt = Mathf.Lerp(0.0,0.45,surfaceSmooth);
	thisRenderMaterial.SetFloat("_BumpStrength",floatRound(surfaceSmoothAmt));
	
	//colors
	thisRenderMaterial.SetColor("_HighColor",LinearTransfer(colorSurfHigh));
	thisRenderMaterial.SetColor("_LowColor",LinearTransfer(colorSurfLow));
	thisRenderMaterial.SetColor("_DepthColor",LinearTransfer(useDepthColor));
	thisRenderMaterial.SetColor("_DepthColorR",LinearTransfer(depthColorR));
	thisRenderMaterial.SetColor("_DepthColorG",LinearTransfer(depthColorG));
	thisRenderMaterial.SetColor("_DepthColorB",LinearTransfer(depthColorB));
	thisRenderMaterial.SetColor("_UnderColor",LinearTransfer(underwaterColor));

	useUnderFogDist = Mathf.Lerp(-0.1,0.2,underwaterFogDist);
	thisRenderMaterial.SetFloat("_UnderFogDist",floatRound(useUnderFogDist));
	
	//specular
	thisRenderMaterial.SetColor("_SpecColorH",LinearTransfer(specColorH));
	thisRenderMaterial.SetColor("_SpecColorL",LinearTransfer(specColorL));
	_SpecHotAmt = Mathf.Lerp(0.1,10.0,specScatterWidth);
	thisRenderMaterial.SetFloat("_SpecScatterWidth",floatRound(_SpecHotAmt));
	_SpecAmt = Mathf.Lerp(0.5,10.0,specScatterAmt);
	thisRenderMaterial.SetFloat("_SpecScatterAmt",floatRound(_SpecAmt));
	
	//tide
	thisRenderMaterial.SetColor("_TideColor",LinearTransfer(tideColor));
	thisRenderMaterial.SetFloat("_TideAmount",floatRound(tideAmount));
	thisRenderMaterial.SetFloat("_TideSpread",floatRound(tideSpread));

	// SET camera position handling
	if (Application.isPlaying){
		suiHeight = this.transform.position.y;
		camHeight = moduleSplashObject.setCamera.transform.position.y;
		thisRenderMaterial.SetFloat("suimonoHeight",suiHeight);
		moduleSplashObject.underwaterRefractRendererComponent.material.SetFloat("suimonoHeight",suiHeight);
		Shader.SetGlobalFloat("suimonoCameraHeight", camHeight);
		
		Shader.SetGlobalFloat("suimonoDiffHeight", camHeight-suiHeight);
	}
	

	// SET FOAM SCALING
	setFoamScale = Mathf.Lerp(0.0001,10.0,foamScale);
	useFoamScale = this.transform.localScale.x*setFoamScale;
	thisRenderMaterial.SetTextureScale("_FoamTex",Vector2(useFoamScale,useFoamScale));
	thisRenderMaterial.SetTextureScale("_FoamOverlay",Vector2(useFoamScale,useFoamScale));
	thisRenderMaterial.SetFloat("_ShallowFoamAmt",shallowFoamAmt);
	
	foamSpread = (foamAmt) + (Mathf.Sin(Time.time*1.0)*(0.05 * (1.0+foamAmt)));
	useFoamHt = Mathf.Lerp(0.0,1.0,hFoamHeight);
	thisRenderMaterial.SetFloat("_FoamHeight", floatRound(useFoamHt));
	useHFoam = Mathf.Lerp(0.0,5.0,hFoamAmt);
	thisRenderMaterial.SetFloat("_HeightFoamAmount", floatRound(useHFoam));
	useHFoamSpd = Mathf.Lerp(0.0,15.0,hFoamSpread);
	thisRenderMaterial.SetFloat("_HeightFoamSpread", floatRound(useHFoamSpd));
	
	setFoamSpread = Mathf.Lerp(0.02,1.0,foamSpread);
	thisRenderMaterial.SetFloat("_FoamSpread",floatRound(setFoamSpread));
	thisRenderMaterial.SetColor("_FoamColor",LinearTransfer(useFoamColor));
	
	useEdgeBlend = edgeBlend;
	setEdgeBlend = Mathf.Lerp(0.02,1.0*transform.localScale.x,edgeBlend);
	if (useEdgeBlend == 0.2) setEdgeBlend = 10.0;
	thisRenderMaterial.SetFloat("_EdgeBlend",floatRound(setEdgeBlend));
	thisRenderMaterial.SetColor("_EdgeColor",LinearTransfer(useEdgeColor));


	//set uv reversal
	useUVR = 0.0;
	if (moduleSplashObject.useUVReversal) useUVR = 1.0;
	Shader.SetGlobalFloat("_UVReversal",useUVR);
	
	//WAVE TEXTURE ANIMATION
	animationSpeed = 1.0;
	
	//set speed limits
	flow_dir.x = Mathf.Clamp(flow_dir.x,-1.0,1.0);
	flow_dir.y = Mathf.Clamp(flow_dir.y,-1.0,1.0);
	
	shore_dir.x = Mathf.Clamp(shore_dir.x,-1.0,1.0);
	shore_dir.y = Mathf.Clamp(shore_dir.y,-1.0,1.0);
	
	wave_dir.x = flow_dir.x;
	wave_dir.y = flow_dir.y;

	foam_dir.x = flow_dir.x;
	foam_dir.y = flow_dir.y;
	
	uvMult = floatRound(setDetScale) * 0.1;
	uvMult2 = floatRound(setWavScale) * 0.1 * 0.15;
	uvMult3 = useFoamScale * 0.1;
	uvMult4 = 0.1;	





	//####### MANAGE INFINITE SIZING #######
	setScaleX = 0.0;
	setScaleY = 0.0;
	setScale2X = 0.0;
	setScale2Y = 0.0;
	setUsePos = this.transform.position;
	if (Application.isPlaying){
		if (typeIndex == 0){
			
			this.transform.eulerAngles.y = 183.2475;
			
			upStep = 1.0;
			spacer = ((this.transform.localScale.x * 4.0)/upStep);
			spacerUV = (1.0/upStep);

			//set scale and intial position
			if (!oceanHasStarted){
				oceanHasStarted = true;
				setScale = 1.0;
				
				setScale = moduleSplashObject.setCameraComponent.farClipPlane/20.0;
					this.transform.localScale = Vector3(overallScale,1.0,overallScale);
					//suimonoScaleObject.transform.localScale = Vector3(overallScale,1.0,overallScale);
					suimonoScaleObject.transform.localScale = Vector3(setScale*0.5,1.0,setScale*0.5);
					if (moduleSplashObject.unityVersionIndex == 4 || moduleSplashObject.unityVersionIndex == 5){
						if (thisrendererComponent.enabled) thisrendererComponent.enabled = false;
					}
				this.transform.position = Vector3(moduleSplashObject.setCamera.position.x,this.transform.position.y,moduleSplashObject.setCamera.position.z);
			}

			//set scaled object size to horizon
			setScale = moduleSplashObject.setCameraComponent.farClipPlane/20.0;
			suimonoScaleObject.transform.localScale = Vector3(setScale,1.0,setScale);

			//set reflection object
			reflectionObject.transform.localScale = Vector3(setScale,1.0,setScale);

			
			//set properties from master material in dx9
				if (!scalerendererComponent.enabled) scalerendererComponent.enabled = true;
				scalerendererComponent.sharedMaterial.CopyPropertiesFromMaterial(thisRenderMaterial);
				useSc = overallScale*(setScale/overallScale);
				setSc = scaleRenderMaterial.GetTextureScale("_WaveLargeTex");
				scaleRenderMaterial.SetTextureScale("_WaveLargeTex", setSc*useSc);
				setSc = scaleRenderMaterial.GetTextureScale("_Surface1");
				scaleRenderMaterial.SetTextureScale("_Surface1", setSc*useSc);
				setSc = scaleRenderMaterial.GetTextureScale("_Surface2");
				scaleRenderMaterial.SetTextureScale("_Surface2", setSc*useSc);
				setDpth = thisRenderMaterial.GetFloat("_DepthAmt");
				scaleRenderMaterial.SetFloat("_DepthAmt", setDpth*useSc);
			//}


				
				
			//set position
			newPos = Vector3(moduleSplashObject.setCamera.position.x,this.transform.position.y,moduleSplashObject.setCamera.position.z);
			if (Mathf.Abs(this.transform.position.x - newPos.x) > spacer){
				fudgex = (this.transform.position.x - newPos.x)/spacer;
				setSpace.x = (spacerUV*fudgex)*uvMult;
				setSpace2.x = (spacerUV*fudgex)*uvMult2;
				setSpace3.x = (spacerUV*fudgex)*uvMult3;
				setSpace4.x = (spacerUV*fudgex)*uvMult4;

				setUsePos.x = newPos.x;
				setScaleX = setSpace.x;
				setScale2X = setSpace2.x;
			}
			if (Mathf.Abs(this.transform.position.z - newPos.z) > spacer){
				fudgey = (this.transform.position.z - newPos.z)/spacer;
				setSpace.y = (spacerUV*fudgey)*uvMult;
				setSpace2.y = (spacerUV*fudgey)*uvMult2;
				setSpace3.y = (spacerUV*fudgey)*uvMult3;
				setSpace4.y = (spacerUV*fudgey)*uvMult4;

				setUsePos.z = newPos.z;
				setScaleY = setSpace.y;
				setScale2Y = setSpace2.y;
			}
			
			//pos shift bug?
			offamt = detailScale*0.3;
			offamt2 = waveScale*0.005;
			if (Mathf.Abs(this.transform.position.x - newPos.x) > spacer){
				if (this.transform.position.x > newPos.x) setScaleY += offamt;
				if (this.transform.position.x < newPos.x) setScaleY -= offamt;
				
				//setScale2X *= 0.6;
				if (this.transform.position.x > newPos.x) setScale2Y += offamt2;
				if (this.transform.position.x < newPos.x) setScale2Y -= offamt2;
			}
			if (Mathf.Abs(this.transform.position.z - newPos.z) > spacer){
				if (this.transform.position.z > newPos.z) setScaleX -= offamt;
				if (this.transform.position.z < newPos.z) setScaleX += offamt;
				
				//setScale2Y *= 0.6;
				if (this.transform.position.z > newPos.z) setScale2X -= offamt2;
				if (this.transform.position.z < newPos.z) setScale2X += offamt2;
			}
			

		} else {
			oceanHasStarted = false;
			if (scalerendererComponent.enabled) scalerendererComponent.enabled = false;
			if (!thisrendererComponent.enabled) thisrendererComponent.enabled = true;
		}
	}





	//update position
	this.transform.position = setUsePos;
	
	//assign speed to shader
	thisRenderMaterial.SetTextureOffset("_FoamTex",Vector2((foam_dir.x*Time.time*animationSpeed * foamSpeed * setFoamScale)+setSpace3.x,(foam_dir.y*Time.time*animationSpeed * foamSpeed * setFoamScale)+setSpace3.y));
	thisRenderMaterial.SetTextureOffset("_FoamOverlay",Vector2((-foam_dir.x*Time.time*animationSpeed * foamSpeed *0.5)+setSpace3.x,(-foam_dir.y*Time.time*animationSpeed * foamSpeed *0.5)+setSpace3.y));
	thisRenderMaterial.SetTextureOffset("_FlowMap",Vector2(setSpace4.x,setSpace4.y));
	thisrendererComponent.sharedMaterial.SetTextureOffset("_Surface2",Vector2((shore_dir.x*Time.time*-animationSpeed*setshoreflowSpeed*0.5*(setflowSpeed*5.0))+setSpace.x,(shore_dir.y*Time.time*animationSpeed*-setshoreflowSpeed*(setflowSpeed*5.0))+setSpace.y));
	
	getRatio = (suimonoScaleObject.transform.localScale.x/thisSuimonoObject.transform.localScale.x);
	getScale = thisRenderMaterial.GetTextureScale("_FoamTex");
	scaleRenderMaterial.SetTextureOffset("_FoamTex",Vector2((foam_dir.x*Time.time*animationSpeed * foamSpeed)+setSpace3.x,(foam_dir.y*Time.time*animationSpeed * foamSpeed)+setSpace3.y));
	scaleRenderMaterial.SetTextureScale("_FoamTex",Vector2(getScale.x*getRatio,getScale.y*getRatio));
		
	//detail waves
	savePos.x += setScaleX;
	savePos.y += setScaleY;
	
	var waveFlow : Vector2;
	//var lgWaveRatio : float = (setDetScale/setWavScale)*(Mathf.Lerp(setWavScale,1.0,waveScale)*0.75);
	var lgWaveRatio : float = Mathf.Clamp((waveScale*0.12),0.01,1.0);
	var smWaveRatio : float = Mathf.Clamp((detailScale*12.0),0.01,1.0);
	waveFlow.x = (wave_dir.x*Time.time*animationSpeed) * (foamSpeed*1.0); //0.035
	waveFlow.y = (wave_dir.y*Time.time*animationSpeed) * (foamSpeed*1.0); //0.035
	//flowSpeed
	//waveSpeed
	
	_suimono_uvx = (flow_dir.x*Time.time*animationSpeed*setflowSpeed)-savePos.x + (waveFlow.x*smWaveRatio);
	_suimono_uvy = (flow_dir.y*Time.time*animationSpeed*setflowSpeed)-savePos.y + (waveFlow.y*smWaveRatio);
	_suimono_uv2x = (flow_dir.x*Time.time*animationSpeed*setflowSpeed)+savePos.x - (waveFlow.x*smWaveRatio);
	_suimono_uv2y = (flow_dir.y*Time.time*animationSpeed*setflowSpeed)+savePos.y - (waveFlow.y*smWaveRatio);
	
	thisRenderMaterial.SetFloat("_suimono_uvx",_suimono_uvx);
	thisRenderMaterial.SetFloat("_suimono_uvy",_suimono_uvy);
	thisRenderMaterial.SetFloat("_suimono_uv2x",_suimono_uv2x);
	thisRenderMaterial.SetFloat("_suimono_uv2y",_suimono_uv2y);
	scaleRenderMaterial.SetFloat("_suimono_uvx",_suimono_uvx);
	scaleRenderMaterial.SetFloat("_suimono_uvy",_suimono_uvy);
	scaleRenderMaterial.SetFloat("_suimono_uv2x",_suimono_uv2x);
	scaleRenderMaterial.SetFloat("_suimono_uv2y",_suimono_uv2y);
	
	//deep waves
	savePos2.x += setScale2X;
	savePos2.y += setScale2Y;
	
	_suimono_uv3x = (flow_dir.x*Time.time*animationSpeed*setflowSpeed)-savePos2.x + (waveFlow.x*lgWaveRatio);
	_suimono_uv3y = (flow_dir.y*Time.time*animationSpeed*setflowSpeed)-savePos2.y + (waveFlow.y*lgWaveRatio);
	_suimono_uv4x = (flow_dir.x*Time.time*animationSpeed*setflowSpeed)+savePos2.x - (waveFlow.x*lgWaveRatio);
	_suimono_uv4y = (flow_dir.y*Time.time*animationSpeed*setflowSpeed)+savePos2.y - (waveFlow.y*lgWaveRatio);
	
	thisRenderMaterial.SetFloat("_suimono_uv3x",_suimono_uv3x);
	thisRenderMaterial.SetFloat("_suimono_uv3y",_suimono_uv3y);
	thisRenderMaterial.SetFloat("_suimono_uv4x",_suimono_uv4x);
	thisRenderMaterial.SetFloat("_suimono_uv4y",_suimono_uv4y);
	scaleRenderMaterial.SetFloat("_suimono_uv3x",_suimono_uv3x);
	scaleRenderMaterial.SetFloat("_suimono_uv3y",_suimono_uv3y);
	scaleRenderMaterial.SetFloat("_suimono_uv4x",_suimono_uv4x);
	scaleRenderMaterial.SetFloat("_suimono_uv4y",_suimono_uv4y);


	//set height projection
	thisRenderMaterial.SetFloat("_suimono_HeightProjection",floatRound(projectHeight));
	scaleRenderMaterial.SetFloat("_suimono_HeightProjection",floatRound(projectHeight));
	
	//set deep wave height
	useDpWvHt = Mathf.Lerp(0.0001,15.0,(waveHeight/10.0)*waveFac);
	thisRenderMaterial.SetFloat("_suimono_DeepWaveHeight",floatRound(useDpWvHt));
	scaleRenderMaterial.SetFloat("_suimono_DeepWaveHeight",floatRound(useDpWvHt));
	
	//set detail wave height
	useDtHt = Mathf.Lerp(0.0001,3.0,(detailHeight/3.0)*waveFac);
	thisRenderMaterial.SetFloat("_suimono_DetailHeight",floatRound(useDtHt));	
	scaleRenderMaterial.SetFloat("_suimono_DetailHeight",floatRound(useDtHt));	
	
	//set detail
	setDtScale = (this.transform.localScale.x/(20.0-detailScale));
	setDtScale = detailScale * this.transform.localScale.x * 10.0;
	thisRenderMaterial.SetFloat("_suimono_detScale",floatRound(setDtScale));	
	scaleRenderMaterial.SetFloat("_suimono_detScale",floatRound(setDtScale));	

		
	//set dynamic reflection tag on shader
	setDynRef = 0.0;
	if (moduleSplashObject.enableDynamicReflections && enableDynamicReflections) setDynRef = 1.0;
	thisRenderMaterial.SetFloat("_useDynamicReflections",setDynRef);	
	scaleRenderMaterial.SetFloat("_useDynamicReflections",setDynRef);
	

}




	
// ###################################################################
// ##### START CUSTOM FUNCTIONS ######################################
// ###################################################################
function MarkAsStarted(){
	hasStarted = true;
}



function LinearTransfer( useColor : Color) : Color{
	outColor = useColor;
    if (QualitySettings.activeColorSpace == ColorSpace.Linear){
		//outColor.r = Mathf.GammaToLinearSpace(useColor.r)*2.2;
		//outColor.g = Mathf.GammaToLinearSpace(useColor.g)*2.2;
		//outColor.b = Mathf.GammaToLinearSpace(useColor.b)*2.2;
		//outColor.a = Mathf.GammaToLinearSpace(useColor.a);
		//outColor.r = Mathf.Pow(useColor.r,2.2);
		//outColor.g = Mathf.Pow(useColor.g,2.2);
		//outColor.b = Mathf.Pow(useColor.b,2.2);
		//outColor.a = Mathf.Pow(useColor.a,2.2);
	}
	return outColor;
}

function LinearVal( useValue : float) : float{
	outValue = useValue;
    //if (QualitySettings.activeColorSpace == ColorSpace.Linear){
	//	outValue = Mathf.GammaToLinearSpace(useValue);
	//}
	return outValue;
}


function StoreSurfaceHeight(){
	currentWaterLevel = moduleSplashObject.currentObjectDepth;
	currentSurfaceLevel = moduleSplashObject.currentSurfaceLevel;
}






function OnApplicationQuit(){

	#if UNITY_EDITOR
	thisrendererComponent.sharedMaterial.shader = shaderSurface;
	#endif
	
	if (reflectionObject != null){
		reflectionObject.SetActive(true);
	}
}








// ########## PUBLIC FUNCTIONS ##########
function SetPreset( useIndex : int){
	if (useIndex < presetDataArray.Length){
		presetIndex = useIndex;
	}
}

function SetPresetTransition( frmIndex : int, toIndex : int, setDuration : float){
	if (frmIndex < presetDataArray.Length && toIndex < presetDataArray.Length){
		presetTransIndexFrm = frmIndex;
		presetTransIndexTo = toIndex;
		presetTransitionTime = setDuration;
		presetStartTransition = true;
	}
}

function SetLerpTransition( frmIndex : int, toIndex : int, setLerp : float){
	if (frmIndex < presetDataArray.Length && toIndex < presetDataArray.Length){
		presetTransIndexFrm = frmIndex;
		presetTransIndexTo = toIndex;
		presetTransitionTime = setLerp;
		PresetDoTransition();
	}
}








// ########## PRESET FUNCTIONS ##########

function PresetSetFile(){
#if !UNITY_WEBPLAYER
	var showDebug : boolean = false;
	if (presetFileUseIndex != presetFileIndex){
		//presetUseIndex = 0;
		showDebug = true;
		presetFileUseIndex = presetFileIndex;
		//presetUseIndex = -1;
		presetIndex += 1;
		PresetLoad();
	}
	
	var presetFilesArr = new Array();
	var dir : String = Application.dataPath + "/" + baseDir;
	var info = new DirectoryInfo(dir);
	if (info != null){
		var fileInfo : FileInfo[] = info.GetFiles("SUIMONO_PRESET_*.txt");
		for (var f : int = 0; f < fileInfo.Length; f++){
			presetFilesArr.Add(fileInfo[f].ToString());
		}
		
		if (presetFiles.length != presetFilesArr.length) presetFiles = new String[presetFilesArr.length];
		for (var n : int = 0; n < presetFilesArr.length; n++){
			if (presetFiles[n] != null){
				presetFiles[n] = presetFilesArr[n].ToString();
				presetFiles[n] = presetFiles[n].Remove(0,dir.length);
				presetFiles[n] = presetFiles[n].Replace("SUIMONO_PRESET_","");
				presetFiles[n] = presetFiles[n].Replace(".txt","");
			}
		}
	}
	presetFile = "SUIMONO_PRESET_"+presetFiles[presetFileUseIndex]+".txt";
	if (showDebug) Debug.Log("Using Preset File: "+presetFile);
#endif
}




function PresetLoad(){
#if !UNITY_WEBPLAYER
	presetUseIndex = presetIndex;
	
	if (presetIndex < 0){
		presetUseIndex += 1;
	} else {
	//presetIndex += 1;
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetUseIndex) break;
	}
	presetUseIndex += 1;
	//presetIndex = presetUseIndex;
	 
	//set data
	var pName : String = workData.Substring(0,20);

	//set colors
	var sK : int = 21;
	depthColor = Color(float.Parse(workData.Substring((sK*1)+1,4)),float.Parse(workData.Substring((sK*1)+6,4)),float.Parse(workData.Substring((sK*1)+11,4)),float.Parse(workData.Substring((sK*1)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColor",depthColor);
	colorSurfHigh = Color(float.Parse(workData.Substring((sK*2)+1,4)),float.Parse(workData.Substring((sK*2)+6,4)),float.Parse(workData.Substring((sK*2)+11,4)),float.Parse(workData.Substring((sK*2)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_HighColor",colorSurfHigh);
	colorSurfLow = Color(float.Parse(workData.Substring((sK*3)+1,4)),float.Parse(workData.Substring((sK*3)+6,4)),float.Parse(workData.Substring((sK*3)+11,4)),float.Parse(workData.Substring((sK*3)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_LowColor",colorSurfLow);
	depthColorR = Color(float.Parse(workData.Substring((sK*4)+1,4)),float.Parse(workData.Substring((sK*4)+6,4)),float.Parse(workData.Substring((sK*4)+11,4)),float.Parse(workData.Substring((sK*4)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorR",depthColorR);
	depthColorG = Color(float.Parse(workData.Substring((sK*5)+1,4)),float.Parse(workData.Substring((sK*5)+6,4)),float.Parse(workData.Substring((sK*5)+11,4)),float.Parse(workData.Substring((sK*5)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorG",depthColorG);
	depthColorB = Color(float.Parse(workData.Substring((sK*6)+1,4)),float.Parse(workData.Substring((sK*6)+6,4)),float.Parse(workData.Substring((sK*6)+11,4)),float.Parse(workData.Substring((sK*6)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DepthColorB",depthColorB);		
	specColorH = Color(float.Parse(workData.Substring((sK*7)+1,4)),float.Parse(workData.Substring((sK*7)+6,4)),float.Parse(workData.Substring((sK*7)+11,4)),float.Parse(workData.Substring((sK*7)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorH",specColorH);
	specColorL = Color(float.Parse(workData.Substring((sK*8)+1,4)),float.Parse(workData.Substring((sK*8)+6,4)),float.Parse(workData.Substring((sK*8)+11,4)),float.Parse(workData.Substring((sK*8)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_SpecColorL",specColorL);
	colorDynReflect = Color(float.Parse(workData.Substring((sK*9)+1,4)),float.Parse(workData.Substring((sK*9)+6,4)),float.Parse(workData.Substring((sK*9)+11,4)),float.Parse(workData.Substring((sK*9)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_DynReflColor",colorDynReflect);
	foamColor = Color(float.Parse(workData.Substring((sK*10)+1,4)),float.Parse(workData.Substring((sK*10)+6,4)),float.Parse(workData.Substring((sK*10)+11,4)),float.Parse(workData.Substring((sK*10)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_FoamColor",foamColor);
	edgeColor = Color(float.Parse(workData.Substring((sK*11)+1,4)),float.Parse(workData.Substring((sK*11)+6,4)),float.Parse(workData.Substring((sK*11)+11,4)),float.Parse(workData.Substring((sK*11)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_EdgeColor",edgeColor);			
	underwaterColor = Color(float.Parse(workData.Substring((sK*12)+1,4)),float.Parse(workData.Substring((sK*12)+6,4)),float.Parse(workData.Substring((sK*12)+11,4)),float.Parse(workData.Substring((sK*12)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_UnderColor",underwaterColor);	
	tideColor = Color(float.Parse(workData.Substring((sK*13)+1,4)),float.Parse(workData.Substring((sK*13)+6,4)),float.Parse(workData.Substring((sK*13)+11,4)),float.Parse(workData.Substring((sK*13)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_TideColor",tideColor);	
	castshadowColor = Color(float.Parse(workData.Substring((sK*14)+1,4)),float.Parse(workData.Substring((sK*14)+6,4)),float.Parse(workData.Substring((sK*14)+11,4)),float.Parse(workData.Substring((sK*14)+16,4)));
	thisrendererComponent.sharedMaterial.SetColor("_castshadowColor",castshadowColor);	
	
	//set attributes
	lightAbsorb = float.Parse(workData.Substring((sK*15)+(8*1)+1,6));
	lightRefract = float.Parse(workData.Substring((sK*15)+(8*2)+1,6));
	refractShift = float.Parse(workData.Substring((sK*15)+(8*3)+1,6));

	blurSpread = float.Parse(workData.Substring((sK*15)+(8*5)+1,6));
	surfaceSmooth = float.Parse(workData.Substring((sK*15)+(8*6)+1,6));
	reflectDist = float.Parse(workData.Substring((sK*15)+(8*7)+1,6));
	reflectSpread = float.Parse(workData.Substring((sK*15)+(8*8)+1,6));
	reflectionOffset = float.Parse(workData.Substring((sK*15)+(8*9)+1,6));
	edgeBlend = float.Parse(workData.Substring((sK*15)+(8*10)+1,6));
	normalShore = float.Parse(workData.Substring((sK*15)+(8*11)+1,6));
	specScatterAmt = float.Parse(workData.Substring((sK*15)+(8*12)+1,6));
	specScatterWidth = float.Parse(workData.Substring((sK*15)+(8*13)+1,6));
	hFoamHeight = float.Parse(workData.Substring((sK*15)+(8*14)+1,6));
	hFoamAmt = float.Parse(workData.Substring((sK*15)+(8*15)+1,6));
	hFoamSpread = float.Parse(workData.Substring((sK*15)+(8*16)+1,6));
	foamAmt = float.Parse(workData.Substring((sK*15)+(8*17)+1,6));
	foamScale = float.Parse(workData.Substring((sK*15)+(8*18)+1,6));
	edgeSpread = float.Parse(workData.Substring((sK*15)+(8*19)+1,6));
	detailHeight = float.Parse(workData.Substring((sK*15)+(8*20)+1,6));
	detailScale = float.Parse(workData.Substring((sK*15)+(8*21)+1,6));
	UpdateSpeed = float.Parse(workData.Substring((sK*15)+(8*22)+1,6));
	rippleSensitivity = float.Parse(workData.Substring((sK*15)+(8*23)+1,6));
	splashSensitivity = float.Parse(workData.Substring((sK*15)+(8*24)+1,6));
	reflectDistUnderAmt = float.Parse(workData.Substring((sK*15)+(8*25)+1,6));
	underRefractionAmount = float.Parse(workData.Substring((sK*15)+(8*26)+1,6));
	underBlurAmount = float.Parse(workData.Substring((sK*15)+(8*27)+1,6));
	etherealShift = float.Parse(workData.Substring((sK*15)+(8*28)+1,6));

	underwaterFogDist = float.Parse(workData.Substring((sK*15)+(8*29)+1,6));	
	underwaterFogSpread = float.Parse(workData.Substring((sK*15)+(8*30)+1,6));

	waveHeight = float.Parse(workData.Substring((sK*15)+(8*31)+1,6));
	waveShoreHeight = float.Parse(workData.Substring((sK*15)+(8*32)+1,6));
	waveScale = float.Parse(workData.Substring((sK*15)+(8*33)+1,6));		
											
	waveShoreScale = float.Parse(workData.Substring((sK*15)+(8*34)+1,6));	
	shoreSpeed = float.Parse(workData.Substring((sK*15)+(8*35)+1,6));	

    enableUnderDebrisWrite = float.Parse(workData.Substring((sK*15)+(8*36)+1,6));	
    enableUnderDebris = false;
    if (enableUnderDebrisWrite == 1.0) enableUnderDebris = true;
    
	tideAmount = float.Parse(workData.Substring((sK*15)+(8*37)+1,6));	
    tideSpread = float.Parse(workData.Substring((sK*15)+(8*38)+1,6));	

	underRefractionScale = float.Parse(workData.Substring((sK*15)+(8*39)+1,6));
	underRefractionSpeed = float.Parse(workData.Substring((sK*15)+(8*40)+1,6));

	waveBreakAmt = float.Parse(workData.Substring((sK*15)+(8*42)+1,6));
	shallowFoamAmt = float.Parse(workData.Substring((sK*15)+(8*43)+1,6));

	overallBright = float.Parse(workData.Substring((sK*15)+(8*44)+1,6));
	overallTransparency = float.Parse(workData.Substring((sK*15)+(8*45)+1,6));

	flow_dir_degrees = float.Parse(workData.Substring((sK*15)+(8*46)+1,6))*360.0;
	flowSpeed = float.Parse(workData.Substring((sK*15)+(8*47)+1,6));

	foamSpeed = float.Parse(workData.Substring((sK*15)+(8*48)+1,6));
	
	shadowAmount = float.Parse(workData.Substring((sK*15)+(8*49)+1,6));
	
	//castshadowIsOn = float.Parse(workData.Substring((sK*15)+(8*50)+1,6));
	castshadowStrength = float.Parse(workData.Substring((sK*15)+(8*51)+1,6));
	castshadowFade = float.Parse(workData.Substring((sK*15)+(8*52)+1,6));

	
	
	}
#endif
}





function PresetGetColor( presetCheck : int, presetKey : String) : Color {
#if !UNITY_WEBPLAYER
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetCheck) break;
	}
	
	var retCol : Color = Color(0,0,0,1);
	
	//set data
	var pName : String = workData.Substring(0,20);
	
	//set colors
	var sK : int = 21;
	
	if (presetKey == "_DepthColor") retCol = Color(float.Parse(workData.Substring(sK+1,4)),float.Parse(workData.Substring(sK+6,4)),float.Parse(workData.Substring(sK+11,4)),float.Parse(workData.Substring(sK+16,4)));
	if (presetKey == "_HighColor") retCol = Color(float.Parse(workData.Substring((sK*2)+1,4)),float.Parse(workData.Substring((sK*2)+6,4)),float.Parse(workData.Substring((sK*2)+11,4)),float.Parse(workData.Substring((sK*2)+16,4)));
	if (presetKey == "_LowColor") retCol = Color(float.Parse(workData.Substring((sK*3)+1,4)),float.Parse(workData.Substring((sK*3)+6,4)),float.Parse(workData.Substring((sK*3)+11,4)),float.Parse(workData.Substring((sK*3)+16,4)));
	if (presetKey == "_DepthColorR") retCol = Color(float.Parse(workData.Substring((sK*4)+1,4)),float.Parse(workData.Substring((sK*4)+6,4)),float.Parse(workData.Substring((sK*4)+11,4)),float.Parse(workData.Substring((sK*4)+16,4)));
	if (presetKey == "_DepthColorG") retCol = Color(float.Parse(workData.Substring((sK*5)+1,4)),float.Parse(workData.Substring((sK*5)+6,4)),float.Parse(workData.Substring((sK*5)+11,4)),float.Parse(workData.Substring((sK*5)+16,4)));
	if (presetKey == "_DepthColorB") retCol = Color(float.Parse(workData.Substring((sK*6)+1,4)),float.Parse(workData.Substring((sK*6)+6,4)),float.Parse(workData.Substring((sK*6)+11,4)),float.Parse(workData.Substring((sK*6)+16,4)));
	if (presetKey == "_SpecColorH") retCol = Color(float.Parse(workData.Substring((sK*7)+1,4)),float.Parse(workData.Substring((sK*7)+6,4)),float.Parse(workData.Substring((sK*7)+11,4)),float.Parse(workData.Substring((sK*7)+16,4)));
	if (presetKey == "_SpecColorL") retCol = Color(float.Parse(workData.Substring((sK*8)+1,4)),float.Parse(workData.Substring((sK*8)+6,4)),float.Parse(workData.Substring((sK*8)+11,4)),float.Parse(workData.Substring((sK*8)+16,4)));
	if (presetKey == "_DynReflColor") retCol = Color(float.Parse(workData.Substring((sK*9)+1,4)),float.Parse(workData.Substring((sK*9)+6,4)),float.Parse(workData.Substring((sK*9)+11,4)),float.Parse(workData.Substring((sK*9)+16,4)));
	if (presetKey == "_FoamColor") retCol = Color(float.Parse(workData.Substring((sK*10)+1,4)),float.Parse(workData.Substring((sK*10)+6,4)),float.Parse(workData.Substring((sK*10)+11,4)),float.Parse(workData.Substring((sK*10)+16,4)));
	if (presetKey == "_EdgeColor") retCol = Color(float.Parse(workData.Substring((sK*11)+1,4)),float.Parse(workData.Substring((sK*11)+6,4)),float.Parse(workData.Substring((sK*11)+11,4)),float.Parse(workData.Substring((sK*11)+16,4)));
	if (presetKey == "_UnderwaterColor") retCol = Color(float.Parse(workData.Substring((sK*12)+1,4)),float.Parse(workData.Substring((sK*12)+6,4)),float.Parse(workData.Substring((sK*12)+11,4)),float.Parse(workData.Substring((sK*12)+16,4)));
	if (presetKey == "_TideColor") retCol = Color(float.Parse(workData.Substring((sK*13)+1,4)),float.Parse(workData.Substring((sK*13)+6,4)),float.Parse(workData.Substring((sK*13)+11,4)),float.Parse(workData.Substring((sK*13)+16,4)));
	if (presetKey == "_CastShadowColor") retCol = Color(float.Parse(workData.Substring((sK*53)+1,4)),float.Parse(workData.Substring((sK*53)+6,4)),float.Parse(workData.Substring((sK*53)+11,4)),float.Parse(workData.Substring((sK*53)+16,4)));

	
	return retCol;
#endif
}




function PresetGetFloat( presetCheck : int, presetKey : String) : float {
#if !UNITY_WEBPLAYER
	var workData : String;
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		if (px == presetCheck) break;
	}
	
	var retVal : float = 0.0;
	
	//set data
	var pName : String = workData.Substring(0,20);

	//set attributes
	var sK : int = 21;
	if (presetKey == "_MasterScale") retVal = float.Parse(workData.Substring((sK*15)+1,6));
	if (presetKey == "_LightAbsorb") retVal = float.Parse(workData.Substring((sK*15)+(8*1)+1,6));
	if (presetKey == "_LightRefract") retVal = float.Parse(workData.Substring((sK*15)+(8*2)+1,6));
	if (presetKey == "_RefractShift") retVal = float.Parse(workData.Substring((sK*15)+(8*3)+1,6));
	if (presetKey == "_BlurSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*5)+1,6));
	if (presetKey == "_SurfaceSmooth") retVal = float.Parse(workData.Substring((sK*15)+(8*6)+1,6));
	if (presetKey == "_ReflectDist") retVal = float.Parse(workData.Substring((sK*15)+(8*7)+1,6));
	if (presetKey == "_ReflectSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*8)+1,6));
	if (presetKey == "_ReflectionOffset") retVal = float.Parse(workData.Substring((sK*15)+(8*9)+1,6));
	if (presetKey == "_EdgeBlend") retVal = float.Parse(workData.Substring((sK*15)+(8*10)+1,6));
	if (presetKey == "_NormalShore") retVal = float.Parse(workData.Substring((sK*15)+(8*11)+1,6));
	if (presetKey == "_SpecScatterAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*12)+1,6));
	if (presetKey == "_SpecScatterWidth") retVal = float.Parse(workData.Substring((sK*15)+(8*13)+1,6));
	if (presetKey == "_HFoamHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*14)+1,6));
	if (presetKey == "_HFoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*15)+1,6));
	if (presetKey == "_HFoamSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*16)+1,6));
	if (presetKey == "_FoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*17)+1,6));
	if (presetKey == "_FoamScale") retVal = float.Parse(workData.Substring((sK*15)+(8*18)+1,6));
	if (presetKey == "_EdgeSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*19)+1,6));
	if (presetKey == "_DetailHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*20)+1,6));
	if (presetKey == "_DetailScale") retVal = float.Parse(workData.Substring((sK*15)+(8*21)+1,6));
	if (presetKey == "_UpdateSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*22)+1,6));
	if (presetKey == "_RippleSensitivity") retVal = float.Parse(workData.Substring((sK*15)+(8*23)+1,6));
	if (presetKey == "_SplashSensitivity") retVal = float.Parse(workData.Substring((sK*15)+(8*24)+1,6));
	if (presetKey == "_ReflectDistUnderAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*25)+1,6));
	if (presetKey == "_UnderRefractionAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*26)+1,6));
	if (presetKey == "_UnderBlurAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*27)+1,6));
	if (presetKey == "_EtherealShift") retVal = float.Parse(workData.Substring((sK*15)+(8*28)+1,6));
	
	if (presetKey == "_UnderwaterFogDist") retVal = float.Parse(workData.Substring((sK*15)+(8*29)+1,6));
	if (presetKey == "_UnderwaterFogSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*30)+1,6));

	if (presetKey == "_WaveHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*31)+1,6));
	if (presetKey == "_WaveShoreHeight") retVal = float.Parse(workData.Substring((sK*15)+(8*32)+1,6));
	if (presetKey == "_WaveScale") retVal = float.Parse(workData.Substring((sK*15)+(8*33)+1,6));

	if (presetKey == "_WaveShoreScale") retVal = float.Parse(workData.Substring((sK*15)+(8*34)+1,6));
	if (presetKey == "_ShoreSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*35)+1,6));

    if (presetKey == "_EnableUnderDebris") retVal = float.Parse(workData.Substring((sK*15)+(8*36)+1,6));
    
	if (presetKey == "_TideAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*37)+1,6));
	if (presetKey == "_TideSpread") retVal = float.Parse(workData.Substring((sK*15)+(8*38)+1,6));

	if (presetKey == "_UnderRefractionScale") retVal = float.Parse(workData.Substring((sK*15)+(8*39)+1,6));
	if (presetKey == "_UnderRefractionSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*40)+1,6));

	if (presetKey == "_TypeIndex") retVal = float.Parse(workData.Substring((sK*15)+(8*41)+1,6));

	if (presetKey == "_WaveBreakAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*42)+1,6));
	if (presetKey == "_ShallowFoamAmt") retVal = float.Parse(workData.Substring((sK*15)+(8*43)+1,6));

	if (presetKey == "_OverallBright") retVal = float.Parse(workData.Substring((sK*15)+(8*44)+1,6));
	if (presetKey == "_OverallTransparency") retVal = float.Parse(workData.Substring((sK*15)+(8*45)+1,6));

	if (presetKey == "_Flow_dir_degrees") retVal = float.Parse(workData.Substring((sK*15)+(8*46)+1,6));
	if (presetKey == "_FlowSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*47)+1,6));

	if (presetKey == "_FoamSpeed") retVal = float.Parse(workData.Substring((sK*15)+(8*48)+1,6));

	if (presetKey == "_ShadowAmount") retVal = float.Parse(workData.Substring((sK*15)+(8*49)+1,6));

	//if (presetKey == "_CastShadowIsOn") retVal = float.Parse(workData.Substring((sK*15)+(8*50)+1,6));
	if (presetKey == "_CastShadowStrength") retVal = float.Parse(workData.Substring((sK*15)+(8*51)+1,6));
	if (presetKey == "_CastShadowFade") retVal = float.Parse(workData.Substring((sK*15)+(8*52)+1,6));


	
	return retVal;
#endif
}


	
	

function PresetSave( useName : String ){
#if !UNITY_WEBPLAYER
	var pName : String;
	pName = useName;
	presetToggleSave = false;
	var workCol : Color;
	var pL : int = pName.Length;
	
	PresetGetData();
	
	//check name
	if (pName == "") pName = "my custom preset"+(presetDataArray.length+1);
	if (pL < 20) pName = pName.PadRight(20);
	if (pL > 20) pName = pName.Substring(0,20);

	//SET COLORS
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColor");
	var useDepthCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_HighColor");
	var useHighCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_LowColor");
	var useLowCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorR");
	var useDepthColR : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorG");
	var useDepthColG : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DepthColorB");
	var useDepthColB : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";	
	workCol = thisrendererComponent.sharedMaterial.GetColor("_SpecColorH");
	var useSpecColorH : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_SpecColorL");
	var useSpecColorL : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = thisrendererComponent.sharedMaterial.GetColor("_DynReflColor");
	var useDynRefCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	//workCol = thisrendererComponent.sharedMaterial.GetColor("_FoamColor");
	workCol = foamColor;
	var useFoamCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = edgeColor;//thisrendererComponent.sharedMaterial.GetColor("_EdgeColor");
	var useEdgeCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = underwaterColor;
	var useUnderCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = tideColor;
	var useTideCol : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";
	workCol = castshadowColor;
	var usecastshadowColor : String = "("+workCol.r.ToString("0.00")+","+workCol.g.ToString("0.00")+","+workCol.b.ToString("0.00")+","+workCol.a.ToString("0.00")+")";

	
		
			
					
	
	//SET ATTRIBUTES
	var useMScale : String = "("+overallScale.ToString("00.000")+")";
	var useAbsorb : String = "("+lightAbsorb.ToString("00.000")+")";
	var useRefractAmt : String = "("+lightRefract.ToString("00.000")+")";
	var userefractShift : String = "("+refractShift.ToString("00.000")+")";
	var useblurSpread : String = "("+blurSpread.ToString("00.000")+")";
	var usesurfaceSmooth : String = "("+surfaceSmooth.ToString("00.000")+")";
	var usereflectDist : String = "("+reflectDist.ToString("00.000")+")";
	var usereflectSpread : String = "("+reflectSpread.ToString("00.000")+")";
	var usereflectionOffset : String = "("+reflectionOffset.ToString("00.000")+")";
	var useedgeBlend : String = "("+edgeBlend.ToString("00.000")+")";
	var usenormalShore : String = "("+normalShore.ToString("00.000")+")";
	var usespecScatterAmt : String = "("+specScatterAmt.ToString("00.000")+")";
	var usespecScatterWidth : String = "("+specScatterWidth.ToString("00.000")+")";
	var usehFoamHeight : String = "("+hFoamHeight.ToString("00.000")+")";
	var usehFoamAmt : String = "("+hFoamAmt.ToString("00.000")+")";
	var usehFoamSpread : String = "("+hFoamSpread.ToString("00.000")+")";
	var usefoamAmt : String = "("+foamAmt.ToString("00.000")+")";
	var usefoamScale : String = "("+foamScale.ToString("00.000")+")";
	var useedge : String = "("+edgeSpread.ToString("00.000")+")";
	var usedetailHeight : String = "("+detailHeight.ToString("00.000")+")";
	var usedetailScale : String = "("+detailScale.ToString("00.000")+")";
	var useUpdateSpeed : String = "("+UpdateSpeed.ToString("00.000")+")";
	var userippleSensitivity : String = "("+rippleSensitivity.ToString("00.000")+")";
	var usesplashSensitivity : String = "("+splashSensitivity.ToString("00.000")+")";
	var usereflectDistUnderAmt : String = "("+reflectDistUnderAmt.ToString("00.000")+")";
	var useunderRefractionAmount : String = "("+underRefractionAmount.ToString("00.000")+")";
	var useunderBlurAmount : String = "("+underBlurAmount.ToString("00.000")+")";
	var useetherealShift : String = "("+etherealShift.ToString("00.000")+")";
	var useunderwaterFogDist : String = "("+underwaterFogDist.ToString("00.000")+")";
	var useunderwaterFogSpread : String = "("+underwaterFogSpread.ToString("00.000")+")";																																						

	var usewaveHeight : String = "("+waveHeight.ToString("00.000")+")";	
	var usewaveShoreHeight : String = "("+waveShoreHeight.ToString("00.000")+")";	
	var usewaveScale : String = "("+waveScale.ToString("00.000")+")";	

	var usewaveShoreScale : String = "("+waveShoreScale.ToString("00.000")+")";
	var useshoreSpeed : String = "("+shoreSpeed.ToString("00.000")+")";

	enableUnderDebrisWrite = 0.0;
    if (enableUnderDebris) enableUnderDebrisWrite = 1.0;
    var useenableUnderDebris : String = "("+enableUnderDebrisWrite.ToString("00.000")+")";
    
	var useTideAmount : String = "("+tideAmount.ToString("00.000")+")";
	var useTideSpread : String = "("+tideSpread.ToString("00.000")+")";

	var useUnderRefractionScale : String = "("+underRefractionScale.ToString("00.000")+")";
	var useUnderRefractionSpeed : String = "("+underRefractionSpeed.ToString("00.000")+")";

	var usetypeIndex : String = "("+typeIndex.ToString("00.000")+")";
	var useWaveBreakAmt : String = "("+waveBreakAmt.ToString("00.000")+")";
	var useshallowFoamAmt : String = "("+shallowFoamAmt.ToString("00.000")+")";

	var useoverallBright : String = "("+overallBright.ToString("00.000")+")";
	var useoverallTransparency : String = "("+overallTransparency.ToString("00.000")+")";

	var setflowdir : float = flow_dir_degrees/360.0;
	var useflow_dir_degrees : String = "("+setflowdir.ToString("00.000")+")";
	var useflowSpeed : String = "("+flowSpeed.ToString("00.000")+")";

	var usefoamSpeed : String = "("+foamSpeed.ToString("00.000")+")";

	var useshadowAmount : String = "("+shadowAmount.ToString("00.000")+")";

	//var usecastshadowIsOn : String = "("+castshadowIsOn.ToString("00.000")+")";
	var usecastshadowStrength : String = "("+castshadowStrength.ToString("00.000")+")";
	var usecastshadowFade : String = "("+castshadowFade.ToString("00.000")+")";



	//SAVE DATA																																																																																																																									
	var saveData : String = pName+" "+useDepthCol+useHighCol+useLowCol+useDepthColR+useDepthColG+useDepthColB+useSpecColorH+useSpecColorL+useDynRefCol+useFoamCol+useEdgeCol+useUnderCol+useTideCol+usecastshadowColor;
	saveData += useMScale+useAbsorb+useRefractAmt+userefractShift+"(00.000)"+useblurSpread+usesurfaceSmooth+usereflectDist+usereflectSpread+usereflectionOffset;
	saveData += useedgeBlend+usenormalShore+usespecScatterAmt+usespecScatterWidth+usehFoamHeight+usehFoamAmt+usehFoamSpread+usefoamAmt+usefoamScale+useedge;
	saveData += usedetailHeight+usedetailScale+useUpdateSpeed+userippleSensitivity+usesplashSensitivity+usereflectDistUnderAmt+useunderRefractionAmount+useunderBlurAmount;
	saveData += useetherealShift+useunderwaterFogDist+useunderwaterFogSpread+usewaveHeight+usewaveShoreHeight+usewaveScale;
	saveData += usewaveShoreScale+useshoreSpeed+useenableUnderDebris+useTideAmount+useTideSpread+useUnderRefractionScale+useUnderRefractionSpeed;
	
	//add padding for future variables
	saveData += usetypeIndex + useWaveBreakAmt + useshallowFoamAmt + useoverallBright + useoverallTransparency + useflow_dir_degrees + useflowSpeed + usefoamSpeed;
	saveData += useshadowAmount + "(00.000)" + usecastshadowStrength + usecastshadowFade;
	saveData += "(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)(00.000)";
	
	//check for already existing preset match and insert data
	var ckNme : boolean = false;
	var workData : String;
	var rName : String;
	var rL : int;
	for (var cx = 0; cx < (presetDataArray.length); cx++){
		workData = presetDataArray[cx];
		rName = workData.Substring(0,20);
		rL = rName.Length;
		if (rL < 20) rName = rName.PadRight(20);
		if (rL > 20) rName = rName.Substring(0,20);
		if (rName == pName){
			ckNme = true;
			presetDataArray[cx] = saveData;
			break;
		}
	}
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	for (var px = 0; px < (presetDataArray.length); px++){
		sw.Write(presetDataArray[px]);
		if (px != presetDataArray.length-1) sw.Write("\n");
	}
	if (ckNme == false){
		sw.Write("\n"+saveData);
	}
    sw.Close();
	Debug.Log("Preset '"+presetSaveName+"' has been saved!");
#endif
}









function PresetRename( oldName : String, newName : String ){
#if !UNITY_WEBPLAYER
	var oName : String;
	oName = oldName;
	var nName : String;
	nName = newName;

	PresetGetData();
	
	//check name
	if (oName.Length < 20) oName = oName.PadRight(20);
	if (oName.Length > 20) oName = oName.Substring(0,20);
	if (nName.Length < 20) nName = nName.PadRight(20);
	if (nName.Length > 20) nName = nName.Substring(0,20);
	
	//check for already existing preset match and insert data
	var workData : String;
	var rName : String;
	for (var cx = 0; cx < (presetDataArray.length); cx++){
		workData = presetDataArray[cx];
		rName = workData.Substring(0,20);
		if (rName == oName){
			var repString : String = presetDataArray[cx];
			repString = nName + workData.Substring(20,(workData.length-20));
			presetDataArray[cx] = repString;
		}
	}
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	for (var px = 0; px < (presetDataArray.length); px++){
		sw.Write(presetDataArray[px]);
		if (px != presetDataArray.length-1) sw.Write("\n");
	}
    sw.Close();
	Debug.Log("Preset '"+oldName+"' has been renamed to "+newName+"!");
#endif
}











function PresetDelete( preName : String ){
#if !UNITY_WEBPLAYER
	var oName : String;
	oName = preName;

	PresetGetData();
	
	//check name
	if (oName.Length < 20) oName = oName.PadRight(20);
	if (oName.Length > 20) oName = oName.Substring(0,20);
	var workData : String;
	var workData2 : String;
	var rName : String;
	var xName : String;
	
	//save to file
	var fileName = baseDir+presetFile;
	var sw = new StreamWriter(Application.dataPath + "/" + fileName);
	sw.AutoFlush = true;
	
	//remove line
	for (var px = 0; px < (presetDataArray.length); px++){
		workData = presetDataArray[px];
		rName = workData.Substring(0,20);
		if (rName != oName){
			sw.Write(presetDataArray[px]);

			if (px < presetDataArray.length-2) sw.Write("\n");
			if (px == presetDataArray.length-2){
				
				workData2 = presetDataArray[px+1];
				xName = workData2.Substring(0,20);
				
				if (xName != oName){
					sw.Write("\n");
				}
			}
		}
	}
    sw.Close();
    
    
    //reset list
    PresetGetData();

 
	Debug.Log("Preset '"+preName+"' has been deleted!");
#endif
}










function PresetDoTransition(){
#if !UNITY_WEBPLAYER
	//waterStartState = currentState;
	presetTransitionCurrent += (Time.deltaTime/presetTransitionTime);
	
	//transition
	depthColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColor"),PresetGetColor(presetTransIndexTo,"_DepthColor"),presetTransitionCurrent);
	colorSurfHigh = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_HighColor"),PresetGetColor(presetTransIndexTo,"_HighColor"),presetTransitionCurrent);
	colorSurfLow = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_LowColor"),PresetGetColor(presetTransIndexTo,"_LowColor"),presetTransitionCurrent);
	depthColorR = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorR"),PresetGetColor(presetTransIndexTo,"_DepthColorR"),presetTransitionCurrent);
	depthColorG = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorG"),PresetGetColor(presetTransIndexTo,"_DepthColorG"),presetTransitionCurrent);
	depthColorB = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DepthColorB"),PresetGetColor(presetTransIndexTo,"_DepthColorB"),presetTransitionCurrent);
	specColorH = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_SpecColorH"),PresetGetColor(presetTransIndexTo,"_SpecColorH"),presetTransitionCurrent);
	specColorL = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_SpecColorL"),PresetGetColor(presetTransIndexTo,"_SpecColorL"),presetTransitionCurrent);
	colorDynReflect = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_DynReflColor"),PresetGetColor(presetTransIndexTo,"_DynReflColor"),presetTransitionCurrent);
	foamColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_FoamColor"),PresetGetColor(presetTransIndexTo,"_FoamColor"),presetTransitionCurrent);
	edgeColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_EdgeColor"),PresetGetColor(presetTransIndexTo,"_EdgeColor"),presetTransitionCurrent);
	underwaterColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_UnderwaterColor"),PresetGetColor(presetTransIndexTo,"_UnderwaterColor"),presetTransitionCurrent);
	tideColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_TideColor"),PresetGetColor(presetTransIndexTo,"_TideColor"),presetTransitionCurrent);
	//castshadowColor = Color.Lerp(PresetGetColor(presetTransIndexFrm,"_CastShadowColor"),PresetGetColor(presetTransIndexTo,"_CastShadowColor"),presetTransitionCurrent);

	
	lightAbsorb = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_LightAbsorb"),PresetGetFloat(presetTransIndexTo,"_LightAbsorb"),presetTransitionCurrent);
	lightRefract = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_LightRefract"),PresetGetFloat(presetTransIndexTo,"_LightRefract"),presetTransitionCurrent);
	refractShift = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_RefractShift"),PresetGetFloat(presetTransIndexTo,"_RefractShift"),presetTransitionCurrent);
	blurSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_BlurSpread"),PresetGetFloat(presetTransIndexTo,"_BlurSpread"),presetTransitionCurrent);
	surfaceSmooth = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_SurfaceSmooth"),PresetGetFloat(presetTransIndexTo,"_SurfaceSmooth"),presetTransitionCurrent);
	reflectDist = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ReflectDist"),PresetGetFloat(presetTransIndexTo,"_ReflectDist"),presetTransitionCurrent);
	reflectSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ReflectSpread"),PresetGetFloat(presetTransIndexTo,"_ReflectSpread"),presetTransitionCurrent);
	reflectionOffset = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ReflectionOffset"),PresetGetFloat(presetTransIndexTo,"_ReflectionOffset"),presetTransitionCurrent);
	edgeBlend = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_EdgeBlend"),PresetGetFloat(presetTransIndexTo,"_EdgeBlend"),presetTransitionCurrent);
	normalShore = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_NormalShore"),PresetGetFloat(presetTransIndexTo,"_NormalShore"),presetTransitionCurrent);
	specScatterAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_SpecScatterAmt"),PresetGetFloat(presetTransIndexTo,"_SpecScatterAmt"),presetTransitionCurrent);
	specScatterWidth = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_SpecScatterWidth"),PresetGetFloat(presetTransIndexTo,"_SpecScatterWidth"),presetTransitionCurrent);
	hFoamHeight = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_HFoamHeight"),PresetGetFloat(presetTransIndexTo,"_HFoamHeight"),presetTransitionCurrent);
	hFoamAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_HFoamAmt"),PresetGetFloat(presetTransIndexTo,"_HFoamAmt"),presetTransitionCurrent);
	hFoamSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_HFoamSpread"),PresetGetFloat(presetTransIndexTo,"_HFoamSpread"),presetTransitionCurrent);
	foamAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_FoamAmt"),PresetGetFloat(presetTransIndexTo,"_FoamAmt"),presetTransitionCurrent);
	foamScale = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_FoamScale"),PresetGetFloat(presetTransIndexTo,"_FoamScale"),presetTransitionCurrent);
	edgeSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_EdgeSpread"),PresetGetFloat(presetTransIndexTo,"_EdgeSpread"),presetTransitionCurrent);
	detailHeight = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_DetailHeight"),PresetGetFloat(presetTransIndexTo,"_DetailHeight"),presetTransitionCurrent);
	UpdateSpeed = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UpdateSpeed"),PresetGetFloat(presetTransIndexTo,"_UpdateSpeed"),presetTransitionCurrent);
	rippleSensitivity = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_RippleSensitivity"),PresetGetFloat(presetTransIndexTo,"_RippleSensitivity"),presetTransitionCurrent);
	splashSensitivity = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_SplashSensitivity"),PresetGetFloat(presetTransIndexTo,"_SplashSensitivity"),presetTransitionCurrent);
	reflectDistUnderAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ReflectDistUnderAmt"),PresetGetFloat(presetTransIndexTo,"_ReflectDistUnderAmt"),presetTransitionCurrent);
	underRefractionAmount = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UnderRefractionAmount"),PresetGetFloat(presetTransIndexTo,"_UnderRefractionAmount"),presetTransitionCurrent);
	underBlurAmount = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UnderBlurAmount"),PresetGetFloat(presetTransIndexTo,"_UnderBlurAmount"),presetTransitionCurrent);
	etherealShift = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_EtherealShift"),PresetGetFloat(presetTransIndexTo,"_EtherealShift"),presetTransitionCurrent);
	underwaterFogDist = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UnderwaterFogDist"),PresetGetFloat(presetTransIndexTo,"_UnderwaterFogDist"),presetTransitionCurrent);
	underwaterFogSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UnderwaterFogSpread"),PresetGetFloat(presetTransIndexTo,"_UnderwaterFogSpread"),presetTransitionCurrent);

	waveHeight = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_WaveHeight"),PresetGetFloat(presetTransIndexTo,"_WaveHeight"),presetTransitionCurrent);
	waveShoreHeight = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_WaveShoreHeight"),PresetGetFloat(presetTransIndexTo,"_WaveShoreHeight"),presetTransitionCurrent);
	waveShoreScale = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_WaveShoreScale"),PresetGetFloat(presetTransIndexTo,"_WaveShoreScale"),presetTransitionCurrent);
	shoreSpeed = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ShoreSpeed"),PresetGetFloat(presetTransIndexTo,"_ShoreSpeed"),presetTransitionCurrent);

	tideAmount = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_TideAmount"),PresetGetFloat(presetTransIndexTo,"_TideAmount"),presetTransitionCurrent);
	tideSpread = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_TideSpread"),PresetGetFloat(presetTransIndexTo,"_TideSpread"),presetTransitionCurrent);
	underRefractionSpeed = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_UnderRefractionSpeed"),PresetGetFloat(presetTransIndexTo,"_UnderRefractionSpeed"),presetTransitionCurrent);
	
	waveBreakAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_WaveBreakAmt"),PresetGetFloat(presetTransIndexTo,"_WaveBreakAmt"),presetTransitionCurrent);
	shallowFoamAmt = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ShallowFoamAmt"),PresetGetFloat(presetTransIndexTo,"ShallowFoamAmt"),presetTransitionCurrent);
		

	overallBright = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_OverallBright"),PresetGetFloat(presetTransIndexTo,"_OverallBright"),presetTransitionCurrent);
	overallTransparency = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_OverallTransparency"),PresetGetFloat(presetTransIndexTo,"_OverallTransparency"),presetTransitionCurrent);
	
	//flow_dir_degrees = (Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_Flow_dir_degrees"),PresetGetFloat(presetTransIndexTo,"_Flow_dir_degrees"),presetTransitionCurrent)*360.0);
	//flowSpeed = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_FlowSpeed"),PresetGetFloat(presetTransIndexTo,"_FlowSpeed"),presetTransitionCurrent);
	
	
	//foamSpeed = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_FoamSpeed"),PresetGetFloat(presetTransIndexTo,"_FoamSpeed"),presetTransitionCurrent);
	shadowAmount = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_ShadowAmount"),PresetGetFloat(presetTransIndexTo,"_ShadowAmount"),presetTransitionCurrent);
		
	//castshadowIsOn = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_CastShadowIsOn"),PresetGetFloat(presetTransIndexTo,"_CastShadowIsOn"),presetTransitionCurrent);
	//castshadowStrength = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_CastShadowStrength"),PresetGetFloat(presetTransIndexTo,"_CastShadowStrength"),presetTransitionCurrent);
	//castshadowFade = Mathf.SmoothStep(PresetGetFloat(presetTransIndexFrm,"_CastShadowFade"),PresetGetFloat(presetTransIndexTo,"_CastShadowFade"),presetTransitionCurrent);
		


			
	//set final
	if (presetTransitionCurrent >= 1.0){
		//reset
		presetIndex = presetTransIndexTo;
		presetStartTransition = false;
		presetTransitionCurrent = 0.0;
	}	
#endif
}




function PresetGetData(){
#if !UNITY_WEBPLAYER

	var fileName = baseDir+presetFile;
	var sr = new StreamReader(Application.dataPath + "/" + fileName);
    presetDataString = sr.ReadToEnd();
    sr.Close();

    presetDataArray = presetDataString.Split("\n"[0]);
	var workOptions = presetDataString.Split("\n"[0]);
	presetOptions = workOptions;
	
	for (var ax = 0; ax < (presetOptions.length); ax++){
		presetOptions[ax] = workOptions[ax].Substring(0,20);
		presetOptions[ax] = presetOptions[ax].Trim();
	}
#endif
}




function floatRound(inFloat : float){

	retFloat = Mathf.Round(inFloat*1000.0)/1000.0;
	retFloat = LinearVal(retFloat);
	return retFloat;

}

