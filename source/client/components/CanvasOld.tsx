import * as React from "react";
import * as io from "socket.io-client"




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


export default class Canvas extends React.Component
{

    socket : any;

    protected canvas;
    protected ctx;

    componentDidMount()
    {

        this.socket = io();


        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext("webgl");

        this.ctx.viewport(0,0,this.ctx.drawingBufferWidth, this.ctx.drawingBufferHeight);

        this.ctx.clearColor(0.3,0.4,0.5,1.0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);


        // Create shaders
        const vertexShader = this.ctx.createShader(this.ctx.VERTEX_SHADER);
        const fragmentShader = this.ctx.createShader(this.ctx.FRAGMENT_SHADER);

        // Define shader sources
        this.ctx.shaderSource(vertexShader, verTextShaderText);
        this.ctx.shaderSource(fragmentShader, fragmenShaderText);

        // Compile shaders
        this.ctx.compileShader(vertexShader);
        this.ctx.compileShader(fragmentShader);

        // Get compile errors
        if ( ! this.ctx.getShaderParameter(vertexShader,this.ctx.COMPILE_STATUS))
        {
            throw new Error(this.ctx.getShaderInfoLog(vertexShader));
        }

        if ( ! this.ctx.getShaderParameter(fragmentShader,this.ctx.COMPILE_STATUS))
        {
            throw new Error(this.ctx.getShaderInfoLog(fragmentShader));
        }

        // Create program and attach shaders. WebGL can identify shaders.
        let program = this.ctx.createProgram();
        this.ctx.attachShader(program, vertexShader);
        this.ctx.attachShader(program, fragmentShader);

        this.ctx.linkProgram(program);

        // Get program errors
        if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
            console.error(this.ctx.getProgramInfoLog());
        }


        // Define triangle points
        const triangleVertices =
            [
                0.0,0.5,
                -0.5,-0.5,
                0.5, -0.5
            ];

        // Create buffer and asign triangle data.
        const triangleVertexBufferObject = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, triangleVertexBufferObject);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(triangleVertices), this.ctx.STATIC_DRAW);

        const positionAttributeLocation = this.ctx.getAttribLocation(program, 'vertPosition');
        this.ctx.vertexAttribPointer(
            positionAttributeLocation,
            2,
            this.ctx.FLOAT,
            this.ctx.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        this.ctx.enableVertexAttribArray(positionAttributeLocation);

        this.ctx.useProgram(program);
        this.ctx.drawArrays(this.ctx.TRIANGLES,0,3);

    }

    render()
    {

        let canvasStyle = {
            backgroundColor : "black",
            border : "1px dotted black",

        };

        // this.socket.on(
        //     "display", function (message)
        //     {
        //         console.log(message);
        //     }
        //
        //
        // );

        // this.socket.emit('display', "click");


        return(

            <div>

                <canvas style={canvasStyle} ref="canvas" width={900} height={300}  ></canvas>

            </div>

        )

    }

}

