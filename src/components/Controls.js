import { useEffect, useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

export const Controls = ({
  switches,
  setSwitches,
  selectedDataPoints,
  setSelectedDataPoints,
  searchResults,
}) => {
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    const tempData = [];
    searchResults["nodes"].forEach((value) => {
      tempData.push({
        id: value["id"],
        name: value["name"],
        selected: selectedDataPoints.includes(value["id"]),
      });
    });
    setSearchData(tempData);
  }, [searchResults, selectedDataPoints]);

  const handleChange = (event) => {
    setSwitches({
      ...switches,
      [event.target.name]: event.target.checked,
    });
  };
  const handleClick = (event) => {
    const dataPoint = searchResults["nodes"].get(Number(event.target.value));
    const found = selectedDataPoints.some(
      (element) => element === dataPoint.id
    );
    if (!found) {
      // if not found add to the list
      setSelectedDataPoints([...selectedDataPoints, dataPoint.id]);
    } else {
      // remove from selectedDataPointList
      setSelectedDataPoints(
        selectedDataPoints.filter((element) => element !== dataPoint.id)
      );
    }
  };
  const handlFreshButton = () => {
    setSelectedDataPoints([]);
  };

  return (
    <div style={{ flexFlow: "column nowrap" }}>
      <FormControl>
        <FormLabel component="legend">Control Markers</FormLabel>
        <FormGroup row>
          <Tooltip title="Switch to show markers with relationships">
            <FormControlLabel
              control={
                <Switch
                  checked={switches.showRelationships}
                  onChange={handleChange}
                  name="showRelationships"
                />
              }
              label="Show Relationships"
            />
          </Tooltip>
          <Tooltip title="Switch to show connections between markers">
            <FormControlLabel
              control={
                <Switch
                  checked={switches.showPolyLines}
                  onChange={handleChange}
                  name="showPolyLines"
                  disabled={!switches.showRelationships}
                />
              }
              label="Show Connections"
            />
          </Tooltip>
        </FormGroup>
      </FormControl>
      <Divider sx={{ margin: "1rem" }} />
      <Tooltip title="Click to show returned data points and reset switches">
        <Button
          variant="outlined"
          sx={{ width: "100%" }}
          onClick={handlFreshButton}
        >
          Freshen Up
        </Button>
      </Tooltip>
      <Divider sx={{ margin: "1rem" }} />
      <div style={{ flexFlow: "column nowrap" }}>
        Data points
        <Stack direction="column" justifyContent="space-evenly" spacing={2}>
          {searchData.map((value) => (
            <Button
              key={value["id"]}
              sx={{
                borderRadius: "2rem",
                border: "1px dashed blue",
                fontSize: "10px",
                backgroundColor: value["selected"]
                  ? `rgb(153, 204, 255)`
                  : null,
                color: value["selected"] ? "white" : null,
                fontWeight: value["selected"] ? "bold" : "normal",
              }}
              onClick={handleClick}
              size="small"
              variant="elevated"
              value={value["id"]}
            >
              {value["name"]}
            </Button>
          ))}
        </Stack>
      </div>
    </div>
  );
};
