/**
 * Template Application.
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2018 Frame Factory GmbH.
 */

import * as React from "react";
import { CSSProperties } from "react";
import Canvas from "../components/Canvas";

////////////////////////////////////////////////////////////////////////////////

export interface ApplicationProps
{
    className?: string;
    style?: CSSProperties;
}

export default class Application extends React.Component<ApplicationProps, {}>
{
    static defaultProps: ApplicationProps = {
        className: "application"
    };

    constructor(props: ApplicationProps)
    {
        super(props);

    }

    render()
    {
        const {
            className,
            style,
            children
        } = this.props;


        const buttonStyle = {
            backgroundColor : "black",
            color : "white",
            border : 0,
            padding : "5px",
            margin : "5px",
        };

        return (
            <div
            className={className}
            style={style}>
            <h1>Welcome!</h1>

            <a href={"/controller"}>
                <button style={buttonStyle} >
                    Controller
                </button>
            </a>

            <a href={"/display"}>
                <button style={buttonStyle} >
                    Display
                </button>
            </a>

            {children}
        </div>);
    }
}