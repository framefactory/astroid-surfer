/**
 * Template Application.
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2018 Frame Factory GmbH.
 */

import * as React from "react";
import { CSSProperties } from "react";
import * as io from "socket.io-client"
import Canvas from "../components/Canvas";

////////////////////////////////////////////////////////////////////////////////

export interface ApplicationProps
{
    className?: string;
    style?: CSSProperties;
}

export default class Application extends React.Component<ApplicationProps, {}>
{

    socket : any;

    static defaultProps: ApplicationProps = {
        className: "application"
    };

    constructor(props: ApplicationProps)
    {
        super(props);

        this.onClick = this.onClick.bind(this);

    }

    componentDidMount() {
        this.socket = io();
    }

    onClick(){
        console.log("Click!");
        this.socket.emit('controller', "click");

    }


    render()
    {

        const buttonStyle = {
            backgroundColor : "black",
            color : "white",
            border : 0,
            padding : "5px",
            margin : "5px",
        };


        return(

            <div>

                <h1>Play!</h1>

                <button style={buttonStyle} onClick={this.onClick} >
                    Interact!
                </button>


            </div>

        );

    }
}