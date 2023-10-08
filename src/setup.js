import './styles.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import map_earth from './res/earthadvanced.png'
import map_earth_bump from './res/earthadvancednormal.png'
import map_earth_spec from './res/earthspec10k.jpg'
import circle from './res/circleforsprite.png'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

//
export const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));
export const dotMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0xff0000 });
//const dot = new THREE.Points(dotGeometry, dotMaterial);

//new sprite experiment
export const satSpriteTexture = new THREE.TextureLoader().load(circle)
export var satSpriteMat = new THREE.SpriteMaterial({
    map: satSpriteTexture,
    color: new THREE.Color("rgb(255,255,255)"),
    sizeAttenuation: false
})
export const spriteForSat = new THREE.Sprite(satSpriteMat)
spriteForSat.scale.set(0.01,0.01,1)

//end:new sprite expreriment

//
//sizes**static
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
 }
 
 // Canvas**static
 const canvas = document.querySelector('canvas.webgl')
 
 // Scene**static
 export const scene = new THREE.Scene()
 
 /*Objects*/
 //Lights**static
 const ambientLight = new THREE.AmbientLight("rgb(255,255,255)",0.5)
 const primaryLight  = new THREE.PointLight(0xffffff, 2)
 primaryLight.position.set(2,2,2)
 
 export const mat_sat = new THREE.MeshMatcapMaterial({
    color: new THREE.Color("rgb(255,0,0)"),
 })
 
 //materials**static
const mat_earth_glow = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    blending: THREE.DoubleSide,
    //side:THREE.BackSide,
    uniforms:{
        globeTexture: {
            value: new THREE.TextureLoader().load(map_earth)
        }
    }
})


 const mat_earth = new THREE.MeshPhongMaterial({
     map: new THREE.TextureLoader().load(map_earth),
     bumpMap: new THREE.TextureLoader().load(map_earth_bump),
     specularMap: new THREE.TextureLoader().load(map_earth_spec),
     flatShading: false
 })
 mat_earth.side = THREE.DoubleSide;

 const mat_orbit = new THREE.MeshStandardMaterial({
     color: new THREE.Color("rgb(255,0,0)")
 })
 
 mat_earth.bumpScale = 1.0
 export const radius_earth = 1
 
 //geometry**static
 const geo_earth = new THREE.SphereGeometry(radius_earth,64,64)
 const geo_glow = new THREE.SphereGeometry(radius_earth+0.1,64,64)
 export const geo_sat = new THREE.SphereGeometry(radius_earth/190)
 

 let instancedGeometry = new THREE.InstancedBufferGeometry().copy(geo_sat);
 let instanceCount = 10000;
 instancedGeometry.maxInstancedCount = instanceCount;
 let material = mat_sat
 export let sat_mesh = new THREE.Mesh(instancedGeometry, material);

 const itemSize = 3
 const geo_orbit = new THREE.CircleGeometry(1.2,128)
 geo_orbit.setAttribute( 'position',
         new THREE.BufferAttribute(
             geo_orbit.attributes.position.array.slice( itemSize,
                 geo_orbit.attributes.position.array.length - itemSize
                 ), itemSize
             )
     );
 geo_orbit.index = null
 
 //meshes**static
 export const mesh_earth = new THREE.Mesh(geo_earth,mat_earth)
 const mesh_atmos = new THREE.Mesh(geo_glow,mat_earth_glow)
 //mesh_earth.scale.set(1.1,1.1,1.1)
 const mesh_orbit = new THREE.LineLoop(geo_orbit,mat_orbit)
 
 // Base camera**static
 export const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
 camera.zoom = 0.2
 camera.position.x = 0
 camera.position.y = 0
 camera.position.z = 3
 camera.add(ambientLight)
 

//  const axesHelper = new THREE.AxesHelper( 5 );
//  scene.add( axesHelper );
 //mesh_earth.add(mesh_orbit)
 scene.add(camera)
 scene.add(mesh_earth)
 scene.add(mesh_atmos)
 //scene.add(dot);
 //scene.add(primaryLight)
 //scene.add(pointLight)
 //scene.add(anotherpointLight)
 
 // Controls**static
 export const controls = new OrbitControls(camera, canvas)
 controls.enableDamping = true
 controls.rotateSpeed = 0.4
 controls.enablePan = false
 controls.minDistance = 0
 controls.maxDistance = 20.0
 
 
 
 
 //Renderer **static
 export const renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     antialias: true
 })
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 
 //**static
 window.addEventListener('resize', () =>
 {
     // Update sizes
     sizes.width = window.innerWidth
     sizes.height = window.innerHeight
 
     // Update camera
     camera.aspect = sizes.width / sizes.height
     camera.updateProjectionMatrix()
 
     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(window.devicePixelRatio)
 })