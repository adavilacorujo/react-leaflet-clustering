import {DivIcon, Point} from 'leaflet';
import L from "leaflet";


export const ChildCluster = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        const c = 'marker-cluster-medium'
        const childCount = cluster.getChildCount()
        return new DivIcon({
            html: '<div style="display: flex; justify-content: center; align-items: center; background-color: #EDF039; border-radius: 25px; height: 40px; width: 40px; color: black">' + childCount + '</div>',
            className: 'marker-cluster'+c,
            iconSize: new Point(30,30)
        })
    },
    animate: true,
    showCoverageOnHover: false,
    maxClusterRadius: 40,
})


export const ParentCluster = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        const c = 'marker-cluster-large'
        const childCount = cluster.getChildCount()
        return new DivIcon({
            html: '<div style="display: flex; justify-content: center; align-items: center; background-color: rgba(250, 10, 10, 0.6); border-radius: 25px; height: 40px; width: 40px; color: black">' + childCount + '</div>',
            className: 'marker-cluster'+c,
            iconSize: new Point(30,30),
        })
    },
    animate: true,
    showCoverageOnHover: false,
    maxClusterRadius: 40
})