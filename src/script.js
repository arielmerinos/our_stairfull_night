import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'


// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Fonts
const loader = new FontLoader();

let guiComponents = {
     matcapNumber : 2,
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

let matcapTexture = textureLoader.load(`/textures/matcaps/${guiComponents.matcapNumber}.png`)
matcapTexture.colorSpace = THREE.SRGBColorSpace




const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture  })
const materialWireframe = new THREE.MeshMatcapMaterial({ matcap: matcapTexture  })
materialWireframe.wireframe = true


loader.load( 'fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry( 
        'Jesus & Ariel',
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 32,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 32,
        }
    )

    const text = new THREE.Mesh( textGeometry, material )
    textGeometry.center()
    scene.add( text )
})


/**
 * light
 * 
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)



const axisHelper = new THREE.AxesHelper( );

scene.add( axisHelper );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Donuts
 * 
 * */

const donuts = []
console.time('donuts')
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)


for(let i = 0; i < 10000; i++){
    const donut = new THREE.Mesh(donutGeometry, materialWireframe)

    donut.position.x = (Math.random() - 0.5) * 70
    donut.position.y = (Math.random() - 0.5) * 70
    donut.position.z = (Math.random() - 0.5) * 70
    donuts.push(donut)
    donut.scale.x = donut.scale.y = donut.scale.z = Math.random() * 2.5
    scene.add(donut)
}
console.timeEnd('donuts')

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100000, 100000),
    new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.30


scene.add(plane)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    donuts.forEach(donut => {
        donut.rotation.x += 0.0013
        
    });
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()