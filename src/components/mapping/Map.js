import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css'
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import Clustering from './Clustering';

/** 
* createMarkers: function to create markers that are to be displayed on the 
* map. Filters out the nodes by the primary flag: only show if the node came back
* from the original search (not from a relationship).
* 
* @param {Map} nodes - map of nodes where each key is the ID and the value
* holds all other data related to it
* 
* @return {Array<Object>} markers - array of filtered objects to display
*  on the map
*/
const createMarkers = (nodes) => {
    const markers = []
    // Filter out the nodes not returned in the original search
    const tempResults = new Map(
        [...nodes]
        .filter(([, v]) => v['primary'] === true)
    )
    // Populate array
    tempResults.forEach((value) => {
        markers.push({
            id: value['id'],
            position: {'lon': value['lon'], 'lat': value['lat']},
            text: value['name'],
            type: value['type'],
            primary: value['primary'],
            popUpData: `
                            <b>Company</b>: ${value['name']}<br>
                            <b>Coords</b>: ${value['lat']}, ${value['lon']}<br>
                        `
        })
    })
    return markers
}
/** 
* createNetworkMarkers: function to create markers that are to be displayed on the 
* map. Filters out the nodes by the primary flag: only show if the node did not 
* come back from the original search (not from a relationship).
* 
* @param {Map} nodes - map of nodes where each key is the ID and the value
* holds all other data related to it
* @param {Array<Object>} markers - array of objects containing the markers
* created from the nodes returned in the search
* 
* @return {Array<Object>} markers - array of filtered objects to display
*  on the map
*/
const createNetworkMarkers = (nodes, markers) => {
    // Filter out nodes
    const tempResults = new Map(
        [...nodes]
        .filter(([, v]) => v['primary'] === false)
    )
    // Populate array
    tempResults.forEach((value) => {
        if (value['type'] === 'sub') {
            const includes = markers.some(ele => ele.id === value.id)
                // Populate array if node is not present already
                if (!includes) {
                    markers.push({
                    id: value['id'],
                    position: {'lon': value['lon'], 'lat': value['lat']},
                    text: value['name'],
                    type: value['type'],
                    primary: value['primary'],
                    popUpData: `
                                    <b>Company</b>: ${value['name']}<br>
                                    <b>Coords</b>: ${value['lat']}, ${value['lon']}<br>
                                `
                })
            }
        } else if (value['type'] === 'parent') {
            const includes = markers.some(ele => ele.id === value.id)
            // Populate array if node is not present already
            if (!includes) {
                markers.push({
                    id: value['id'],
                    position: {'lon': value['lon'], 'lat': value['lat']},
                    text: value['name'],
                    type: value['type'],
                    primary: value['primary'],
                    popUpData: `
                                    <b>Company</b>: ${value['name']}<br>
                                    <b>Coords</b>: ${value['lat']}, ${value['lon']}<br>
                                `
                })
            }
        }
    })
    
    return markers
}
/** 
* createPolylines: function to create lnies connecting markers displayed
* on the map.
* 
* @param {Dictionary} searchResults - dictionary holding search results. 
* "nodes" : {id: 1, ...}, "links": {source: id1, target: id2}
* @param {Array<String>} selectedDataPoints - array of strings holding the
* ids of each marker selected
* 
* @return {Array<Object>} polylines - array of objects holding the lines
* connecting all markers on the map
*/
const createPolylines = (searchResults, selectedDataPoints) => {
    
    // Return if no marker selected
    if (selectedDataPoints.length < 1) return []

    
    const nodes = searchResults['nodes']
    const links = searchResults['links']

    const polylines = []
    if (selectedDataPoints.length < 1) {
        // Dont filter, ie show all polylines
        links.forEach((link) => {
            const source = nodes.get(link['source'])
            const target = nodes.get(link['target'])
            const polyline = [
                [source['lat'], source['lon']],
                [target['lat'], target['lon']]
            ]
            polylines.push({
                'polyline': <Polyline key={source['id']+target['id']} positions={polyline}/>,
                'show': true,
                'source': source['id'],
                'target': target['id']
            })
        })
    } else {
        // Create those that are included selected companies
        links.forEach((link) => {
            const source = nodes.get(link['source'])
            const target = nodes.get(link['target'])
            const polyline = [
                [source['lat'], source['lon']],
                [target['lat'], target['lon']]
            ]
            polylines.push({
                'polyline': <Polyline key={source['id']+target['id']} positions={polyline}/>,
                // Only show if both source and target are selected
                'show': selectedDataPoints.includes(source['id']) && selectedDataPoints.includes(target['id']) ,
                'source': source['id'],
                'target': target['id']
            })
        })
    }
    
    return polylines
}

/**
 * React component to plot dots on a map. 
 * Definitions: 
 *  - networkMarkers: markers created from relationships found in the search
 *      results
 * 
 * @param {String} mapApiUrl - url for tile server
 * @param {Dictionary} searchResults - dictionary holding all data points
 *  { 
 *      nodes: [new Map([[id, data]])],
 *      lins: [{"source": id, "target": id2}] 
 *  }
 * @param {Dictionary} switches - dictionary holding boolean flags to filter map
 *  { 
 *      showRelationships, - show all markers if true
 *      showPolyLines, - show all polylines if true
 *  }
 * @param {() => {}} setSwitches - state modifier for switches
 * @param {Array<String>} selectedDataPoints - array of ids with selected ids
 * @param {() => {}} setSelectedDataPoints - state modifier for selectedDataPoints
 */
const MapView = ({mapApiUrl, searchResults, switches, setSwitches, selectedDataPoints, setSelectedDataPoints}) => {

    const [polylines, setPolylines] = useState([])
    const [markers, setMarkers] = useState([])
    
    const { showRelationships, showPolyLines } = switches

    
    useEffect(() => {
        if (searchResults?.nodes !== undefined) {
            let tempMarkers = createMarkers(searchResults['nodes'])
            if (selectedDataPoints.length > 0) {
                // create network markers if any data point is selected
                tempMarkers = createNetworkMarkers(searchResults['nodes'], tempMarkers)
            }
            if (showPolyLines) setPolylines(createPolylines(searchResults, selectedDataPoints))
            else setPolylines([])
            
            setMarkers(tempMarkers)
        }
    }, [searchResults, selectedDataPoints, showPolyLines, showRelationships])

    useEffect(() => {
        if (showRelationships) {
            // show network markers
            const tempIdList = markers.filter(marker => 
                marker['primary'] === false
            ).map(element => element['id'])
            setSelectedDataPoints([...selectedDataPoints, ...tempIdList])
        } else {
            // only keep primary search results
            const tempIdList = markers.filter(marker => 
                marker['primary'] === true
            ).map(element => element['id'])
            setSelectedDataPoints(tempIdList)
        }
    }, [showRelationships])
    
    return (
        <>
            <MapContainer center={[50, -31]} zoom={1} 
                scrollWheelZoom={true} style={{ height: '90vh', width: '100%'}}
                zoomControl
                doubleClickZoom
                boundsOptions={{
                    padding: [500, 250]
                }}
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={mapApiUrl}
            />
            <Clustering
                searchResults={searchResults}
                switches={switches}
                setSwitches={setSwitches}
                selectedDataPoints={selectedDataPoints}
                markers={markers} 
                setSelectedDataPoints={setSelectedDataPoints}
            />
            {   
                polylines !== null
                ?
                polylines.map(el => {
                    if (el.show) return el.polyline
                    else return null
                })
                : null
            }
          </MapContainer>
      </>
    )
}

const Footer = ({children}) => {
    return (
        <Typography align="left" sx={{display: 'flex', 
                                    alignItems: 'center', fontSize: '12px'}}
                gutterBottom paragraph variant="h4" color={'text.secondary'}
                >
            {children}
        </Typography>
    )
}

MapView.defaultProps = {
    mapApiUrl: 'https://osm-{s}.gs.mil/tiles/default/{z}/{x}/{y}.png'
 }
  

MapView.Footer = Footer


export default MapView