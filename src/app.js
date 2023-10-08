import * as THREE from 'three'
import * as setup from './setup.js'
import { getGroundTracks,getSatelliteInfo,getSatelliteName,getClassification, getLatLngObj } from "tle.js"
import * as fetchedData from './fetchTLEDat.js'
import { Sat } from './sattelite.js'
import { SpriteMaterial } from 'three'
import { selectedSpriteMat } from './res/circleForSelected.png'

const pibyoneeighty = Math.PI/180;
const raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector3();
var newsatSpriteMat = new THREE.SpriteMaterial({
    map: setup.satSpriteTexture,
    color: new THREE.Color("rgb(255,165,0)"),
    sizeAttenuation: false
})

const fps = 60;
let ProcessedRadiusFromAltitude = 0
let maxUUIDLen = 1
let alltimemax = 0
let mouseCoords = new THREE.Vector2();
let meshes = [];
var lenOfMeshArray = 0
let nameCardOfStation = document.getElementById('info');
nameCardOfStation.style.position = "absolute";
let processedTLEArray = [];
let StationArray = [];

fetchedData.fetchResultsFromddbtable("navigation").then(
    res => {
        processJsonData(res)
    }
)
fetchedData.fetchResultsFromddbtable("weatherAndEarth").then(
    res => {
        processJsonData(res)
    }
)
fetchedData.fetchResultsFromddbtable("scientific").then(
    res => {
        processJsonData(res)
    }
)
fetchedData.fetchResultsFromddbtable("communication").then(
    res => {
        processJsonData(res)
    }
)
// fetchedData.weatherandearth().then(
//     res => {
//         //console.log("weather and earth sattelites:-\n")
//         //console.log(res)
//         processJsonData(res)
//     }
// )
// fetchedData.scientificSats().then(
//     res => {
//         //console.log("weather and earth sattelites:-\n")
//         //console.log(res)
//         processJsonData(res)
//     }
// )
// fetchedData.communicationSats().then(
//     res => {
//         //console.log("weather and earth sattelites:-\n")
//         //console.log(res)
//         processJsonData(res)
//     }
// )

function drawOrbit(groundtrack) {
    console.log("inside function draw")
//     const MAX_POINTS = 50000;

// // geometry
//     const geometry = new THREE.BufferGeometry();

//     // attributes
//     const positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
//     geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

//     // drawcalls
//     drawCount = 2; // draw the first 2 points, only
//     geometry.setDrawRange( 0, drawCount );

//     // material
//     const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

//     // line
//     line = new THREE.Line( geometry,  material );
//     scene.add( line );
    const points = [];
    //console.log(groundtrack)
    // for (g in gt) {
    //     console.log("inside gt")
    //     console.log(gt[g])
    //     if (g/2 == 0) {
    //         const coorofpoint = latlonToxyz(gt[g+1],gt[g])
    //         points.push(coorofpoint)
    //     } 
    // }
    // for (let j=0;j<groundtrack.length;j++){
    //     if (j%2==0) {
    //         console.log("gt[j] = "+groundtrack[j])
    //         const coorofpoint = latlonToxyz(groundtrack[j+1],groundtrack[j])
    //         points.push(coorofpoint)
    //     }
    // }
    // const geometry = new THREE.BufferGeometry().setFromPoints( points );
    // const material = new THREE.LineBasicMaterial();
    // material.color = new THREE.Color("rgb(255,0,0)");

    // var line = new THREE.Line(geometry, material);
    // setup.mesh_earth.add(line);
}
function buildprocessedArray() {
    let processedArray = []
    let start=100,end=200;
    let processedAlt = 0.15
    while (end < 50000) {
        processedArray.push([start,end,processedAlt])
        start = start + 100
        end = end + 100
        processedAlt = processedAlt + 0.01
    }
    return processedArray
}
function determineAltitude(alt) {
    let processedArray = buildprocessedArray()
    for (let k=0;k<processedArray.length;k++) {
        if (alt >= processedArray[k][0] && alt <= processedArray[k][1] ) {
            return processedArray[k][2]
        }       
    }


}


function processJsonData(res) {
    
    for (let j=0;j<res.length;j++) {
        const sat = res[j].SingleSat
        const typeOSettelite = res[j].SatType
        const processedSat = sat.split('\n')
        if (processedSat[0] == '') processedSat.shift()
        //console.log(processedSat)
        processedTLEArray.push(processedSat)
        // const altitude = info.height
        const spriteForsat = setup.spriteForSat.clone()
        const latlonobj = getLatLngObj(processedSat)

        let type = typeOSettelite == 'navigation' ? 'Navigation' : ( 'weatherAndEarth' ? 'Weather and forecasting' : ('scientific' ? 'Scientific' : 'Communication'))
        let classification = getClassification(processedSat)
        let name = getSatelliteName(processedSat)
        let info = getSatelliteInfo(processedSat,Date.now(),34.243889,-116.911389,0)
        let altitude = info.height
        if (isNaN(altitude)){
            ProcessedRadiusFromAltitude = 0.2
        }else{
            ProcessedRadiusFromAltitude = determineAltitude(altitude)//altitude/5000 < 0.2 ? 0.2 : altitude/5000
        }
       // ProcessedRadiusFromAltitude = altitude < 400 ? 0.15 : ( altitude > 400 && altitude < 500 ? 0.2 : ( altitude > 500 && altitude < 700 ? 0.25 : (altitude > 700 && altitude < 900 ? 0.3 : (altitude > 900 && altitude < 2000 ? 0.35 : (altitude > 4000 ? 0.6 : 0.5) ) ) ) )
        //console.log("PROCESSED_ALTITUDE: "+ ProcessedRadiusFromAltitude)
        let velocity = info.velocity
        let s = new Sat(processedSat,altitude,name,classification,type,spriteForsat,velocity,false)
        StationArray.push([ProcessedRadiusFromAltitude,s])
        //console.log("NAME: "+s.name + "TYPEOFSAT: "+s.type)
        altitude = Math.floor(altitude)
        let coords = latlonToxyz(ProcessedRadiusFromAltitude,latlonobj.lat,latlonobj.lng)

        
        //console.log('coords: '+ coords.x + coords.y + coords.z)
        //console.log("Altitude: "+altitude)
        spriteForsat.uuid = name
       // spriteForsat.material = new SpriteMaterial()
        //console.log("Name: "+spriteForsat.uuid)
        spriteForsat.position.x = coords.x
        spriteForsat.position.y = coords.y
        spriteForsat.position.z = coords.z
        meshes.push( spriteForsat )
    }

    for (let k = 0;k<meshes.length;k++) {
        maxUUIDLen = meshes[k].uuid.length
        if (maxUUIDLen > alltimemax)
        {
            alltimemax = maxUUIDLen
        } 
        setup.mesh_earth.add(meshes[k])
     
    }
    console.log(alltimemax)
    lenOfMeshArray = meshes.length;
}

function latlonToxyz(addRadius,lat,lon) {

    var phi = (90-lat)*pibyoneeighty,
    theta = (lon+180)*pibyoneeighty,
    x = -((setup.radius_earth+addRadius) * Math.sin(phi)*Math.cos(theta)),
    z = ((setup.radius_earth+addRadius) * Math.sin(phi)*Math.sin(theta)),
    y = ((setup.radius_earth+addRadius) * Math.cos(phi));
    return new THREE.Vector3(x,y,z);

}


function updateAllStations() {
    
    while(--lenOfMeshArray>=0){
        const latlonobj = getLatLngObj(processedTLEArray[lenOfMeshArray])
        const coords = latlonToxyz(StationArray[lenOfMeshArray][0],latlonobj.lat,latlonobj.lng)
        meshes[lenOfMeshArray].position.x = coords.x
        meshes[lenOfMeshArray].position.y = coords.y
        meshes[lenOfMeshArray].position.z = coords.z
    }
    lenOfMeshArray = meshes.length
}

function _onPointerMove( event ) {
    pointer.x = ( event.pageX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.pageY / window.innerHeight ) * 2 + 1;
    mouseCoords.x = event.pageX;
    mouseCoords.y = event.pageY;
}
function _handleWindowResize() {
  
}
function searchForSatAndProcess(settelite){
    for (let i=0; i<StationArray.length; i++){
        if (StationArray[i][1].name == settelite.uuid){
            if ( StationArray[i][1].selectedOrNot == false ){
                settelite.material = newsatSpriteMat
                StationArray[i][1].selectedOrNot = true
            }else{
                settelite.material = setup.satSpriteMat
                StationArray[i][1].selectedOrNot = false
            }
            break;
        }
    }
}

function _onClick( event ) {
    raycaster.setFromCamera( pointer, setup.camera );
    const intersects = raycaster.intersectObjects( setup.scene.children,true );
    if( intersects && intersects.length > 0) {
        const picked = intersects[0].object;
        console.log("PICKEDID: "+picked.uuid)
        if (picked.uuid.length <= alltimemax){
            //document.getElementById('maincanvas').style.cursor = "pointer"
            // pointLightForGlowOnSelection.position.x = picked.position.x
            // pointLightForGlowOnSelection.position.y = picked.position.y
            // pointLightForGlowOnSelection.position.z = picked.position.z
            searchForSatAndProcess(picked)
            setup.controls.update()
            setup.renderer.render(setup.scene, setup.camera)
            //console.log("X: "+mouseCoords.x+"Y: "+mouseCoords.y)
            // nameCardOfStation.innerText = picked.uuid;
            // nameCardOfStation.style.marginLeft = mouseCoords.x+'px';
            // nameCardOfStation.style.marginTop = mouseCoords.y+25+'px';
            // nameCardOfStation.style.visibility = 'visible'
        }else{
            // document.getElementById('maincanvas').style.cursor = "default"
            // nameCardOfStation.style.visibility = 'hidden'
        }   
    }else{
        // document.getElementById('maincanvas').style.cursor = "default"
        // nameCardOfStation.style.visibility = 'hidden'
    }
}

//Animate
const clock = new THREE.Clock()
const tick = () => {
    updateAllStations()


    raycaster.setFromCamera( pointer, setup.camera );
    const intersects = raycaster.intersectObjects( setup.scene.children,true );
    if( intersects && intersects.length > 0) {
        const picked = intersects[0].object;
        //console.log("PICKEDID: "+picked.uuid + "EARTHID: "+setup.mesh_earth.uuid)
        if (picked.uuid.length <= alltimemax){
            document.getElementById('maincanvas').style.cursor = "pointer"
            nameCardOfStation.innerText = picked.uuid;
            nameCardOfStation.style.marginLeft = mouseCoords.x+'px';
            nameCardOfStation.style.marginTop = mouseCoords.y+25+'px';
            nameCardOfStation.style.visibility = 'visible'
        }else{
            document.getElementById('maincanvas').style.cursor = "default"
            nameCardOfStation.style.visibility = 'hidden'
        }   
    }else{
        document.getElementById('maincanvas').style.cursor = "default"
        nameCardOfStation.style.visibility = 'hidden'
    }

    setup.controls.update()
    setup.renderer.render(setup.scene, setup.camera)


    setTimeout(() => {
        window.requestAnimationFrame(tick);
    },  1000 / fps);
}

window.addEventListener('pointermove',_onPointerMove);
window.addEventListener('resize',_handleWindowResize);
window.addEventListener('click',_onClick);

tick()

