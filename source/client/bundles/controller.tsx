/**
 * Template Application.
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2018 Frame Factory GmbH.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import "./application.scss";
import Controller from "../components/Controller"

ReactDOM.render(
    <Controller/>,
    document.getElementById("main")
);