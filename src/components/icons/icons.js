import {Icon} from 'leaflet';

import yellowCircle from '../images/circle-yellow.png';
import redCircle from '../images/circle-red.png';

export const ChildIcon = new Icon({
    iconUrl: yellowCircle,
    iconSize: [10, 10]    
})

export const ParentIcon = new Icon({
    iconUrl: redCircle,
    iconSize: [10, 10]    
})