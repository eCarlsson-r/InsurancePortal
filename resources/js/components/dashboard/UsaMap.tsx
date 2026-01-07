import React from 'react';
import Usa from "@svg-maps/usa";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";

const UsaMap = () => {
    return (
        <SVGMap 
            map={Usa}  
            className={'svg-map'}
        />
    );
};

export default UsaMap;
