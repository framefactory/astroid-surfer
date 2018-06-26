/**
 * Template Application.
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2018 Frame Factory GmbH.
 */

import * as React from "react";
import { CSSProperties } from "react";
import * as io from "socket.io-client"
import { GeometryUtils } from "three";

////////////////////////////////////////////////////////////////////////////////

export interface ApplicationProps
{
    className?: string;
    style?: CSSProperties;
}

export default class Application extends React.Component<ApplicationProps, {}>
{

    socket : any;

    mouseDownID : number;

    prevX : number;

	frameID : number;

	color : any;


    static defaultProps: ApplicationProps = {
        className: "application"
    };

    constructor(props: ApplicationProps)
    {
        super(props);


        this.mouseDownID = 0;
	    this.onReorient = this.onReorient.bind(this);
	    this.touch = this.touch.bind(this);
	    this.touchStart = this.touchStart.bind(this);

	    this.prevX = 0;

	    this.color = {r : 49, g : 3, b : 75};

        window.addEventListener("deviceorientation", this.onReorient);
        window.addEventListener("touchmove", this.touch);
	    window.addEventListener("touchstart", this.touchStart);

    }

    componentDidMount()
    {
        this.socket = io();
        this.socket.removeAllListeners();

	    this.socket.on("DP01-SC", message => {

		    this.color.b = 75 + message.acc*(255-75);
		    this.color.r = 49 - message.acc*(49);
		    this.color.g = 3 + message.acc*(234-3);

		    console.log(message);

		    return;
	    });
    }

	touchStart(event)
	{
    	this.prevX = event.changedTouches[0].pageX;
	}

    touch(event)
    {
    	event.preventDefault();

	    const x = event.changedTouches[0].pageX;
	    const diff = (x - this.prevX) / window.innerWidth;
	    this.prevX = x;

	    const data = {
		    diff : diff
	    };

	    this.socket.emit("CT02-CS",data);

    }

    onReorient(event)
    {
	    const data = {
	        x : event.beta, y : event.gamma, z : event.alpha
        };

	    this.socket.emit("CT01-CS",data);
    }

    render()
    {
		let acc = {
			flex : "1",
			backgroundColor:
			"rgb("+ String(this.color.r)+"," +
			String(this.color.g) +"," +
			String(this.color.b) + ")"

		};

        return(
            <div className={"container"}>
	            <div className={"acc"} style = {acc}>
		            <div className={"content"}>
			            <h1 className={"text"}>
				            Accelerate!
			            </h1>
		            </div>
	            </div>
	            <div className={"fire"}>
		            <div className={"content"}>
			            <h1 className={"text"}>
				            Fire!
			            </h1>
		            </div>
	            </div>
            </div>
        );

    }
}