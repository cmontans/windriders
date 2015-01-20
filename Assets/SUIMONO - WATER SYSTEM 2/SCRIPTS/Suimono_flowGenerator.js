#pragma strict

var generateOnStart : boolean = true;
var generateMap : boolean = false;

var autoGenerateFPS : float = 0.0;

var resolutionScale : int = 50;

var shoreRange : float = 3.0;
var waveRange : float = 10.0;
var detectLayers : LayerMask;

var shoreMapTex : Texture2D;
var parentMesh : Mesh;

private var autoTimer : float = 0.0;
//private var waveObject : Suimono_waveGenerator;

private var renderObject : GameObject;
private var rendererComponent : Renderer;

//collect for GC
private var vertices : Vector3[];
private var ppos : Vector2[];
private var wcolors : float[];
private var scolors : float[];
private var bounds : Bounds;
private var sideLength :int;
private var meshWidth : int;
private var meshHeight : int;
private var ht : RaycastHit;
private var setDistance : float;
private var setDistance2 : float;	
private var i : int;
private var startPos : Vector3;
private var scaleAmtX : float;
private var scaleAmtY : float;
private var xP : int;
private var yP : int;
private var testPos : Vector3;
private var useInf : float;
private var tstpos : Vector3;
private var tstpos2 : Vector3;
private var isFXObject : boolean;
private var useWaveInfluencer : fx_waveInfluencer;
private var useOutward : boolean;
			
			


function Start () {
	
	//get parent object and mesh
	renderObject = this.transform.parent.gameObject.Find("Suimono_Object").gameObject;
	if (renderObject.gameObject.GetComponent(MeshFilter)){
		parentMesh = renderObject.gameObject.GetComponent(MeshFilter).sharedMesh;
	}
	rendererComponent = renderObject.GetComponent(Renderer);
	if (generateOnStart) Generate2();
}



function Update () {

	shoreRange = Mathf.Clamp(shoreRange,-0.0,1000.0);
	waveRange = Mathf.Clamp(waveRange,0.0,1000.0);
	
	if (autoGenerateFPS > 0.0){
		autoTimer += Time.deltaTime;
		if (autoTimer >= autoGenerateFPS){
			autoTimer = 0.0;
			generateMap = true;
		}
	}
	
	if (generateMap){
		generateMap = false;
		Generate2();
	}
	
	//set texture to renderer position
	if (rendererComponent != null){
		shoreMapTex.wrapMode = TextureWrapMode.Clamp;
		rendererComponent.sharedMaterial.SetTexture("_FlowMap",shoreMapTex);
		rendererComponent.sharedMaterial.SetTextureScale("_FlowMap",Vector2(1.0,1.0));
	}
		
}




function ReGenerate(){
	generateMap = true;
}



function Generate2(){

	if (parentMesh){
		
		vertices = parentMesh.vertices;
		if (ppos == null) ppos = new Vector2[vertices.Length];
		//if (wcolors == null) wcolors = new Color[resolutionScale*resolutionScale];
		//if (scolors == null) scolors = new float[vertices.Length];
		bounds = parentMesh.bounds;

		sideLength = Mathf.Floor(Mathf.Sqrt(vertices.Length));
		meshWidth = sideLength;
		meshHeight = sideLength;
	
		shoreMapTex = null;
		shoreMapTex = new Texture2D(resolutionScale, resolutionScale);
		
		//get pixel positions
		setDistance = 0.0;
		setDistance2 = 0.0;	
		i = 0;
		startPos.x = transform.parent.transform.position.x - (transform.parent.localScale.x*20.0);
		startPos.z = transform.parent.transform.position.z - (transform.parent.localScale.z*20.0);
		
		scaleAmtX = (transform.parent.localScale.x*40.0)/resolutionScale;
		scaleAmtY = (transform.parent.localScale.z*40.0)/resolutionScale;
			
		for (xP = 0; xP < resolutionScale; xP++){
		for (yP = 0; yP < resolutionScale; yP++){

			testPos.x = startPos.x + (xP * scaleAmtX);
			testPos.z = startPos.z + (yP * scaleAmtY);
			testPos.y = transform.parent.transform.localPosition.y;
		
			if (Physics.Raycast (testPos, -Vector3.up, ht,1000.0, detectLayers)) {
				
				setDistance = ht.distance/waveRange;
				setDistance = Mathf.Clamp(setDistance,0.0,1.0);
				setDistance = 1.0-setDistance;

				setDistance2 = ht.distance/shoreRange;
				setDistance2 = Mathf.Clamp(setDistance2,0.0,1.0);
				setDistance2 = 1.0-setDistance2;
			}
			
			shoreMapTex.SetPixel(resolutionScale-xP,resolutionScale-yP, Color(setDistance,setDistance2,0,1));
			i += 1;
			
			if (i >= 10000){
				i=0;
			}
		}
		}

		//apply all SetPixel calls
		shoreMapTex.Apply(false,false);
		
		//set texture to renderer position
		//if (rendererComponent != null){
		//	shoreMapTex.wrapMode = TextureWrapMode.Clamp;
		//	rendererComponent.sharedMaterial.SetTexture("_FlowMap",shoreMapTex);
		//	rendererComponent.sharedMaterial.SetTextureScale("_FlowMap",Vector2(1.0,1.0));
		//}
	}
	
	
}

















function Generate(){

	if (parentMesh){
		
		vertices = parentMesh.vertices;
		if (ppos == null) ppos = new Vector2[vertices.Length];
		if (wcolors == null) wcolors = new float[vertices.Length];
		if (scolors == null) scolors = new float[vertices.Length];
		bounds = parentMesh.bounds;

		sideLength = Mathf.Floor(Mathf.Sqrt(vertices.Length));
		meshWidth = sideLength;
		meshHeight = sideLength;
	
		shoreMapTex = null;
		shoreMapTex = new Texture2D(meshWidth,meshHeight);
		
		//get pixel positions
		setDistance = 0.0;
		setDistance2 = 0.0;	
		
		for (i = 0; i < vertices.Length; i++){
			ppos[i] = Vector2 (vertices[i].x*0.98,vertices[i].z*0.98);
			
			//get heights
			tstpos = transform.parent.transform.TransformPoint(Vector3(ppos[i].x,0.0,ppos[i].y));
			tstpos2 = transform.parent.transform.TransformPoint(Vector3(ppos[i].x,(0.0-(transform.parent.transform.position.y*2.0)),ppos[i].y));
			
			setDistance = 1.0;
			setDistance2 = 1.0;
			isFXObject = false;
			useWaveInfluencer = null;
			useOutward = false;
			
			if (Physics.Raycast (tstpos, -Vector3.up, ht,1000.0, detectLayers)) {
				
				setDistance = ht.distance/waveRange;
				setDistance = Mathf.Clamp(setDistance,0.0,1.0);
				setDistance = 1.0-setDistance;
				setDistance2 = ht.distance/shoreRange;
				setDistance2 = Mathf.Clamp(setDistance,0.0,1.0);
				setDistance2 = 1.0-setDistance2;
				
				if (ht.transform.gameObject.GetComponent(fx_waveInfluencer) != null) useWaveInfluencer = ht.transform.gameObject.GetComponent(fx_waveInfluencer);
				if (useWaveInfluencer != null) isFXObject = true;
			}


			//assign colors
			if (!isFXObject){
			
				wcolors[i] = setDistance;

			} else {

				useInf = Mathf.Lerp(0.0,1.0,(setDistance*3.0));
				if (useWaveInfluencer.FlowType == Suimono_FX_FlowType.outward) useOutward = true;
				if (useOutward){
					scolors[i] = (1.0-setDistance) * useInf;
				} else {
					scolors[i] = setDistance;
				}
				

			}

			wcolors[i] = Mathf.Clamp(wcolors[i],0.0,1.0);
			scolors[i] = Mathf.Clamp(scolors[i],0.0,1.0);
			
			shoreMapTex.SetPixel((sideLength*0.5)-ppos[i].x*1.3, (sideLength*0.5)-ppos[i].y*1.3, Color(wcolors[i],scolors[i],0,1));

		}

		
		//apply all SetPixel calls
		shoreMapTex.Apply(false,false);
		
		//resize texture
		//--no code here yet --
		//
		
		//set texture to renderer position
		if (rendererComponent){
			shoreMapTex.wrapMode = TextureWrapMode.Clamp;
			rendererComponent.sharedMaterial.SetTexture("_FlowMap",shoreMapTex);
			rendererComponent.sharedMaterial.SetTextureScale("_FlowMap",Vector2(1.0,1.0));
		}
	}
}




function UnloadTex(){
	//unloads unused textures to conserve memory
	//EditorUtility.UnloadUnusedAssetsIgnoreManagedReferences();
}