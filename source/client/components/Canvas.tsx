import * as React from "react";
import ReactDOM from 'react-dom';
import * as io from "socket.io-client"

import * as THREE from "three";
import { CSSProperties } from "react";


let verTextShaderText = '' +
    'precision mediump float;' +
    'attribute vec2 vertPosition;' +
    '' +
    'void main()' +
    '{' +
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);' +
    '}'
;

let fragmenShaderText = '' +
    'precision mediump float;' +
    '' +
    'void main()' +
    '{' +
    '   gl_FragColor = vec4(1.0,0,0,1.0);' +
    '}'
;


export interface ApplicationProps
{
    className?: string;
    style?: CSSProperties;
}

export default class Application extends React.Component<ApplicationProps, {}>
{

    constructor(props: ApplicationProps)
    {
        super(props);

    }

    socket : any;

    protected canvas;
    protected ctx;

    scene : THREE.Scene;
    camera : THREE.Camera;
    renderer : THREE.WebGLRenderer;

    box : THREE.BoxBufferGeometry;

    componentDidMount()
    {
        this.socket = io();

        this.scene = new THREE.Scene;
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.box = new THREE.BoxBufferGeometry(1,1,1);
        const mat = new THREE.MeshBasicMaterial( {color : "red"} );
        const cube = new THREE.Mesh(this.box, mat);
        this.scene.add(cube);

        this.animate();

    }

    animate(){


            this.box.rotateX(Math.random());

            this.renderer.render(this.scene, this.camera);

            this.socket.on("display", function (message) {
                console.log(message);
            });

            console.log(this.scene);

            let frameID = requestAnimationFrame(this.animate);

    }

    render()
    {

        return(

            <div>

            </div>

        )

    }

}

