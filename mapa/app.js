"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native"
import MapView, { Marker, Overlay } from "react-native-maps"
import * as Location from "expo-location"
import { getFloorPlan } from "./api"

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002 * ASPECT_RATIO,
}

const BUILDING_DIMENSIONS = { width: 100, height: 50 } // in meters

// Función para convertir metros a coordenadas de latitud/longitud
const metersToCoordinates = (meters, isLatitude = true) => {
  // Aproximación: 1 grado de latitud ≈ 111,000 metros
  // 1 grado de longitud varía según la latitud, pero en promedio ≈ 111,000 * cos(latitud)
  const factor = isLatitude ? 111000 : 111000 * Math.cos((INITIAL_REGION.latitude * Math.PI) / 180)
  return meters / factor
}

export default function App() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [floorPlans, setFloorPlans] = useState([])
  const [selectedFloor, setSelectedFloor] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)

      // Fetch floor plans
      const fetchedFloorPlans = await getFloorPlan()
      setFloorPlans(fetchedFloorPlans)
      setSelectedFloor(fetchedFloorPlans[0]) // Select the first floor by default
    })()
  }, [])

  let text = "Waiting.."
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  const calculateBuildingBounds = () => {
    const latOffset = metersToCoordinates(BUILDING_DIMENSIONS.height / 2, true)
    const lngOffset = metersToCoordinates(BUILDING_DIMENSIONS.width / 2, false)

    return [
      [INITIAL_REGION.latitude - latOffset, INITIAL_REGION.longitude - lngOffset],
      [INITIAL_REGION.latitude + latOffset, INITIAL_REGION.longitude + lngOffset],
    ]
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION}>
        {/* Overlay del plano del edificio */}
        <Overlay image={selectedFloor.image} bounds={calculateBuildingBounds()} zIndex={1} />
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          />
        )}
      </MapView>

      <View style={styles.floorsContainer}>
        {floorPlans.map((floor) => (
          <TouchableOpacity
            key={floor.id}
            style={[styles.floorButton, selectedFloor?.id === floor.id && styles.selectedFloorButton]}
            onPress={() => setSelectedFloor(floor)}
          >
            <Text style={styles.floorButtonText}>{floor.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Informacion />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
  floorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
  },
  floorButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedFloorButton: {
    backgroundColor: "#bbb",
  },
  floorButtonText: {
    fontSize: 16,
  },
})
