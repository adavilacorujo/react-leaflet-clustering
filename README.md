# Getting Started with Map App

This project uses react-leaflet to create a map with clustering capabilities.

### Data

The data displayed is described as:
{
"nodes": Map(id: int, {
id: int,
lon: float,
lat: float,
type: string,
primary: boolean,
name: string
}),
"links": [
{"source": int, "target": int}
]
}

The app contains two main components:

1. Controls - UI for controlling the markers rendered on the map
2. MapView - Map to render markers

Assuming the data provided was yielded from a database search, the data returned from
that search is called _first order_. All other data points related to those returned
are called _second order_.

Example: Given a list of data points where each one is an object with a sub/parent key
containing a list of datapoints...
{
id: 1,
type: 'parent',
sub: [{
id: 11,
type: 'sub'
}]
}...the keys with the additional datapoints are referred as _second order_ while the original is _first order_. In the example above, the object with id 1 would be _first order_ while the object with id 11 would be _second order_.

### Controls

Using the switches on the top-left, the user can select whether he/she wants to
see the second order markers returned from the search and/or show the connections
from first to second order markers.

The additional list of data points as buttons allows the user to select which data point
to see on the map. If no data point is selected, only the first order markers are shown.

### Interactivity

The Clustering component defines a handler for clicking each marker. If a marker is clicked the map will focus on that point and display its second order relationships with a line tracking the connection. This is useful in the event a user selects a single second order data point, only to see and select its first order data point which will display all second data points related. Think of it like going up the chain.

This is not a perfect implementation but most things aren't in their first iteration :).
