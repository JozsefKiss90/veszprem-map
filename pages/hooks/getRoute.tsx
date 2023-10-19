interface GetRouteProps {
    mapInstance: React.RefObject<mapboxgl.Map>;
    waypoints: React.RefObject<number[][]>;
    setRouteLength: (length: string) => void;
    access_token: string | undefined;
    routeColor: string;
    routeThickness: number;
}

const getRoute = async ({
    mapInstance,
    waypoints,
    setRouteLength,
    access_token,
    routeColor,
    routeThickness,
}: GetRouteProps): Promise<void> => {
    if (waypoints!.current!.length < 2) { 
      return
    }
  
    const waypointStr =  waypoints.current!.map((waypoint : number[])=> `${waypoint[0]},${waypoint[1]}`).join(';')
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${waypointStr}?steps=true&geometries=geojson&access_token=${access_token}`,
      { method: 'GET' }
    )
    console.log(`https://api.mapbox.com/directions/v5/mapbox/cycling/${waypointStr}?steps=true&geometries=geojson&access_token=${access_token}`,
    )
      const json = await query.json()
      const data = json.routes[0]
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: data.geometry.coordinates
        }
      }
      console.log(data)
      const distanceInKm = (data.distance / 1000).toFixed(2)
      setRouteLength(`Route Length: ${distanceInKm} km`)
  
      if (mapInstance.current!.getSource('route')) {
        mapInstance.current!.getSource('route').setData(geojson)
      } else {
        mapInstance.current!.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': routeColor,
            'line-width': routeThickness
          }
        })
      } 
    }

export default getRoute