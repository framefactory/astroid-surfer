import * as React from "react";
import ReactDOM from 'react-dom';
import * as io from "socket.io-client"

import * as THREE from "three";
import { CSSProperties } from "react";

export interface ApplicationProps
{
    className?: string;
    style?: CSSProperties;
}
const numAsteroids = 100;

export default class ThreeScene extends React.Component<ApplicationProps, {}>
{

    socket : any;

    prevTime : number;
    deltaTime : number;

    protected canvas;
    protected ctx;

    scene : THREE.Scene;
    camera : THREE.Camera;
    renderer : THREE.WebGLRenderer;

    box : THREE.TetrahedronBufferGeometry;
    cube : THREE.Mesh;

    ship : THREE.Group;
    shipLoaded : boolean;
    
    shipVel : number;
	shipVelTarget : number;

    asteroids : THREE.Mesh[];
    asteroidsW : THREE.Mesh[];

    frameID : number;

    messageID : number;
    messageSendID : number;

	constructor(props: ApplicationProps)
	{
		super(props);

		this.prevTime = Date.now();

	}


	componentDidMount()
    {
        this.socket = io();
        this.socket.removeAllListeners();

		this.shipVel = 0;
	    this.shipVelTarget = 0;

		// 3D Scene
        this.scene = new THREE.Scene;
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0,0,0);
        this.camera.lookAt(0,10,0);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor("#0c1623");
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight("#00957d",1);
        light.position.set(1,-0.1,0);

	    const light2 = new THREE.DirectionalLight("#8398b5");
	    light2.position.set(-1,1,3);

	    const light3 = new THREE.DirectionalLight("#0017b5");
	    light3.position.set(-1,1,3);

	    const light4 = new THREE.PointLight("#ff1c00");
	    light4.position.set(0,0,5);
	    light4.distance = 30;
	    light4.decay = 1;


        this.box = new THREE.TetrahedronBufferGeometry();
        this.box.scale(2,1,0.5);
	    const mat = new THREE.MeshPhongMaterial( {color : "white"} );
	    const mat2 = new THREE.MeshBasicMaterial( {color : "blue", wireframe: true} );
	    const mat3 = new THREE.MeshPhongMaterial( {color : "#ed3510"} );
        this.cube = new THREE.Mesh(this.box, mat3);
        this.scene.fog = new THREE.Fog(0x0c1623, 0.0025, 40);
        //this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(light2);
	    this.scene.add(light3);
	    this.scene.add(light4);

	    const manager = new THREE.LoadingManager();
	    manager.onProgress = function ( item, loaded, total ) {

		    console.log( item, loaded, total );

	    };

	    this.shipLoaded = false;

	    const loader = new THREE.OBJLoader( manager );
	    loader.load(
		    // resource URL
		    "static/models/spaceship.obj",
		    // called when resource is loaded
		    object => {
					this.ship = object;
					this.ship.scale.set(0.0035,0.0035,0.0035);
					this.ship.translateY(5);
				    this.scene.add(object);
				    this.shipLoaded = true;

		    },
		    // called when loading is in progresses
		    function ( xhr ) {

			    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		    },
		    // called when loading has errors
		    function ( error ) {

			    console.log( 'An error happened' );

		    }
	    );

        this.asteroids = [];

        for ( let i = 0; i < numAsteroids; ++i) {
        	const asteroid = new THREE.DodecahedronBufferGeometry(1+Math.random()*3,0);
        	this.asteroids[i] = new THREE.Mesh(asteroid, mat);
        	const randX = (Math.random()-0.5)*80;
	        const randY = (Math.random()-0.5)*35+50;
	        const randZ = (Math.random()-0.5)*80;

        	this.asteroids[i].translateX(randX);
	        this.asteroids[i].translateY(randY);
	        this.asteroids[i].translateZ(randZ);

	        this.asteroids[i].rotation.set(
	        	Math.random()*2*Math.PI,
	        	Math.random()*2*Math.PI,
	        	Math.random()*2*Math.PI,
	        );

        	this.scene.add(this.asteroids[i]);
        }

	    this.start = this.start.bind(this);
        this.animate = this.animate.bind(this);
	    this.onResize = this.onResize.bind(this);

	    window.addEventListener("resize", this.onResize);

        this.start();

	    this.socket.on("CT01-SC", message => {

		    this.ship.rotation.set(
			    Math.PI * 0.5 + message.x * 0.0174533,
			    Math.PI + message.z * 0.0174533,
			    message.y * 0.0174533
		    );

		    return;
	    });

	    this.socket.on("CT02-SC", message => {

		    this.shipVelTarget += message.diff;

		    if (this.shipVelTarget > 1) {
			    this.shipVelTarget = 1;
		    }
		    if (this.shipVelTarget < 0) {
			    this.shipVelTarget = 0;
		    }

		    return;
	    });

    }

    onResize() {
        this.renderer.setSize(window.innerWidth,window.innerHeight)
    }

    start() {
        if (!this.frameID) {
            this.frameID = requestAnimationFrame(this.animate)
        }
    }

    animate(){

		this.deltaTime = (Date.now() - this.prevTime)/1000;
    	this.prevTime = Date.now();

	    this.shipVel += 0.03*(this.shipVelTarget - this.shipVel);

	    const data = {
		    acc : this.shipVel,
	    };

	    this.socket.emit("DP01-CS", data);

	    for ( let i = 0; i < numAsteroids; ++i) {
			if (this.asteroids[i].position.y < 0) {
				this.asteroids[i].position.y = 40;


				const randX = (Math.random()-0.5)*80;
				const randZ = (Math.random()-0.5)*80;
				this.asteroids[i].position.x = randX;
				this.asteroids[i].position.z = randZ;

			}
			if (this.shipLoaded) {
				this.asteroids[i].position.y -= (this.shipVel+0.3)*this.deltaTime*30;

				this.asteroids[i].position.x -= this.ship.rotation.z*(this.shipVel+0.3)*this.deltaTime*24;

				this.asteroids[i].position.z -= (this.ship.rotation.x-Math.PI * 0.5)*(this.shipVel+0.3)*this.deltaTime*24;

			}
			else {
				this.asteroids[i].position.y -= this.asteroids[i].scale.y*0.1;

			}

	    }

        this.renderer.render(this.scene, this.camera);
        this.frameID = window.requestAnimationFrame(this.animate);

    }

    render()
    {
        return(
            <div>
            </div>
        )
    }

}

