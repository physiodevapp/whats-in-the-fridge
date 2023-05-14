import React, { useEffect, useState } from 'react'

import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';

import pantryService from '../services/pantry'

const containerStyle = {
  width: '100vw',
  height: 'calc(100% + 1rem)',
  position: 'relative',
  margin: '-1rem 0 0 -1rem'
};

function PantryGrocersNearPage() {
  const { pantryId } = useParams()
  const [zoom, setZoom] = useState(75)

  const { isLoaded } = useJsApiLoader({ id: 'google-map-script' })
  const [center, setCenter] = useState(null)
  const [refreshPantryMarker, setRefreshPantryMarker] = useState()
  const [markers, setMarkers] = useState([])
  const [activeMarker, setActiveMarker] = useState(null)

  useEffect(() => {
    // console.log('useffect 1')
    pantryService.detail(pantryId)
      .then(({ location: { coordinates } }) => {
        setCenter(() => {
          return {
            lat: coordinates[1],
            lng: coordinates[0]
          }
        })
        // console.log('useffect 1 center ', center)
        if (center) {
          // console.log('refresh markers')
          setRefreshPantryMarker(!refreshPantryMarker)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    // console.log('useffect 2')
    async function getPantryDetail() {
      try {
        const pantry = await pantryService.detail(pantryId)

        const initialZoom = parseInt(10 + parseInt(75 / 15))
        const currentZoom = parseInt(10 + parseInt(zoom / 15))
        const initialDistanceAtInitialZoom = 0.82
        const newDistance = (Math.pow(2, initialZoom - currentZoom) * initialDistanceAtInitialZoom)
        // console.log('newDistance is ', newDistance) // in km

        const groceries = await pantryService.showNear(pantryId, newDistance)

        setMarkers((prevMarkers) => {
          const { location: { coordinates }, location: { address }, name } = pantry
          const pantryMarker = {
            name,
            address,
            coordinates: {
              lat: coordinates[1],
              lng: coordinates[0]
            },
            role: 'fridge',
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
          // console.log(pantryMarker)

          let groceryMarkers = []
          if (groceries.length) {
            groceryMarkers = groceries.map((grocery) => {
              return {
                address: grocery.address,
                distance: grocery.distance,
                name: grocery.name,
                coordinates: {
                  lat: grocery.location.coordinates[1],
                  lng: grocery.location.coordinates[0]
                },
                role: 'grocery',
                icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              }
            })
            //  console.log('map groceries ', groceryMarkers)
          }
          // console.log([
          //   ...groceryMarkers, pantryMarker
          // ])
          return [...groceryMarkers, pantryMarker]
        })
      } catch (error) {
        console.error(error)
      }
    }

    getPantryDetail()
  }, [refreshPantryMarker, zoom])

  const handleRangeChange = (event) => {
    const newZoom = event.target.value
    // console.log('newZoom is ', event.target.value)
    // console.log('zoom is ', zoom)
    setZoom(() => newZoom)

  }

  const myMapStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]

  // return

  return (isLoaded && center && markers?.length > 0) ? (
    <>
      {/* {console.log('isLoaded ', center)} */}
      {/* <label for="customRange3" class="form-label">Example range</label> */}
      <input type="range" className="form-range p-3" min="0" max="150" step="15" id="mapZoomRange" value={zoom} onChange={handleRangeChange}></input>

      <GoogleMap
        options={
          {
            fullscreenControl: false,
            minZoom: 10,
            maxZoom: 20,
            zoomControl: false,
            draggable: true,
            mapTypeControl: false,
            scaleControl: false,
            styles: myMapStyles
          }
        }
        mapContainerStyle={containerStyle}
        center={center}
        zoom={parseInt(10 + parseInt(zoom / 15))}
        onClick={() => {
          setActiveMarker(null)
        }}
      >
        { /* Child components, such as markers, info windows, etc. */}

        {markers.length > 0 ?
          markers.map((marker, index) => {
            {/* console.log('markers ', marker) */ }
            {/* console.log('markers', markers)
            console.log('map >> ', marker) */}
            return <div key={index}>
              <MarkerF
                position={marker.coordinates}
                onClick={() => {
                  // console.log('center >> ', center)
                  // setSelectedCenter(center)
                  setActiveMarker(marker)
                }}
                // title='hi'
                icon={marker.icon}
              />
            </div>
          }) :
          markers.map((marker, index) => {
            {/* console.log('markers ', marker) */ }
            {/* console.log('markers', markers)
            console.log('map >> ', marker) */}
            return <div key={index}>
              <MarkerF
                position={marker.coordinates}
                onClick={() => {
                  // console.log('center >> ', center)
                  // setSelectedCenter(center)
                  setActiveMarker(marker)
                }}
                // title='hi'
                icon={"https://maps.google.com/mapfiles/ms/icons/red-dot.png"}
              />
            </div>
          })

        }

        {activeMarker && (
          <InfoWindowF
            position={activeMarker.coordinates}
            options={
              {
                pixelOffset: new window.google.maps.Size(0, -50),
                buttons: { close: { visible: false } }
              }
            }
            onCloseClick={() => {
              setActiveMarker(null)
            }}
          >
            <>
              <div className='d-flex container flex-column mb-3'>
                <div className='row'>
                  <h3 className={`${activeMarker.role === 'grocery' && 'mb-3'}`} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{activeMarker.name}</h3>
                  {activeMarker.distance && <p>{`Grocery is approximately ${activeMarker.distance.toFixed(2)} km away`}</p>}
                </div>
                {activeMarker.role === 'grocery' && <div className='row'>
                  <div className='col-4 d-grid'>
                    <button className='btn btn-dark' onClick={() => {
                      const fridge = markers.find(marker => marker.role === 'fridge')

                      window.open(`https://www.google.es/maps/dir/?api=1&origin=${fridge.coordinates.lat},${fridge.coordinates.lng}&destination=${activeMarker.coordinates.lat},${activeMarker.coordinates.lng}&travelmode=walking`)
                    }}> <i className="fa fa-male" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className='col-4 d-grid'>
                    <button className='btn btn-dark' onClick={() => {
                      const fridge = markers.find(marker => marker.role === 'fridge')

                      window.open(`https://www.google.es/maps/dir/?api=1&origin=${fridge.coordinates.lat},${fridge.coordinates.lng}&destination=${activeMarker.coordinates.lat},${activeMarker.coordinates.lng}&travelmode=bicycling`)
                    }}> <i className="fa fa-bicycle" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className='col-4 d-grid'>
                    <button className='btn btn-dark' onClick={() => {
                      const fridge = markers.find(marker => marker.role === 'fridge')

                      window.open(`https://www.google.es/maps/dir/?api=1&origin=${fridge.coordinates.lat},${fridge.coordinates.lng}&destination=${activeMarker.coordinates.lat},${activeMarker.coordinates.lng}&travelmode=driving`)
                    }}> <i className="fa fa-car" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>}
              </div>

            </>
          </InfoWindowF>
        )

        }
      </GoogleMap>
    </>

  ) : <>Loading...</>


}

export default PantryGrocersNearPage