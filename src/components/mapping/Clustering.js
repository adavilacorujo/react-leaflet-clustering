import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useMap } from "react-leaflet";
import { marker, LatLng } from "leaflet";

import { ParentIcon, ChildIcon } from "../icons/icons";
import { ParentCluster, ChildCluster } from "../icons/clusters";

/**
 * Clustering: component defined under the react-leaflet's MapContainer context
 * defining the map's interactivity
 *
 * @param {Dictionary} searchResults - adjacency list containing all data
 * @param {Dictionary} switches - dictionary holding flags to control markers displayed on the map
 * @param {()=>{}} setSwitches -state variable modifier
 * @param {Array<Number>} selectedDataPoints - array of selected ids to display/inspect on the map
 * @param {() => {}} setSelectedDataPoints - state variable modifier
 * @param {Array<Dictionary>} markers - array of markers to render on the map
 */
const Clustering = ({
  searchResults,
  switches,
  setSwitches,
  selectedDataPoints,
  setSelectedDataPoints,
  markers,
}) => {
  const map = useMap();

  const links = searchResults["links"];

  const handleMarkerClick = (id) => {
    const selectedTemp = [];
    // Verify if there exists relationship
    const filteredSources = links.filter((link) => link["source"] === id);
    const filteredTargets = links.filter((link) => link["target"] === id);

    // Select all targets related to a source
    filteredSources.forEach((value) => {
      selectedTemp.push(value["target"]);
    });
    // Select all sources related to a target
    filteredTargets.forEach((value) => {
      selectedTemp.push(value["source"]);
    });
    selectedTemp.push(id);
    setSelectedDataPoints([...selectedTemp]);
    setSwitches({
      ...switches,
      showRelationships: true,
      showPolyLines: true,
    });
  };

  useEffect(() => {
    ParentCluster.clearLayers();
    ChildCluster.clearLayers();

    const positions = [];

    if (markers !== undefined) {
      markers.forEach(({ position, id, type, popUpData }) => {
        if (selectedDataPoints.length < 1 || selectedDataPoints.includes(id)) {
          // if no points selected render all data points
          // if id selected render its marker on the map
          marker(new LatLng(position.lat, position.lon), {
            icon: type === "parent" ? ParentIcon : ChildIcon,
          })
            .addTo(type === "parent" ? ParentCluster : ChildCluster)
            // .bindPopup(popUpData).openPopup()
            .bindTooltip(popUpData)
            .addEventListener("click", () => handleMarkerClick(id));
          positions.push([position.lat, position.lon]);
        }
      });

      // add the marker cluster group to the map
      map.addLayer(ParentCluster);
      map.addLayer(ChildCluster);

      const bounds = L.latLngBounds(
        positions.length > 0
          ? positions
          : [
              [70, 104],
              [10, 104],
            ]
      );
      // Need to find a way to fit the map at different zoom levels
      map.fitBounds(bounds, { paddingBottomRight: [100, -100] });
    }
  }, [markers, map, selectedDataPoints]);

  return null;
};

export default Clustering;
