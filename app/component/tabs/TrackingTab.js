import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Picker,
  Text,
  Icon,
  Form,
  Segment,
  Button,
  Input,
} from 'native-base';
import MapView, {Polyline} from 'react-native-maps';
import {Col, Grid, Row} from 'react-native-easy-grid';

let _map = null;

let generateVehiclePicker = (
  vehicles,
  handleSelectTrackingVehicle,
  selectedTrackingVehicle,
  enabled,
) => {
  if (
    typeof vehicles !== 'undefined' &&
    vehicles.length > 0 &&
    vehicles[0].vehicles.length > 0
  ) {
    let vehiclesArr = vehicles[0].vehicles;
    let content = vehiclesArr.map((a, i) => {
      return <Picker.Item label={a} value={a} key={i} />;
    });

    return (
      <Form>
        <Picker
          enabled={enabled}
          mode="dropdown"
          iosHeader="Odaberite tvrtku"
          iosIcon={<Icon name="arrow-down" />}
          selectedValue={selectedTrackingVehicle}
          onValueChange={text => handleSelectTrackingVehicle(text)}>
          {content}
        </Picker>
      </Form>
    );
  } else {
    return <Text>Nemate dodanih tvrtka</Text>;
  }
};

const animateToUserLocation = props => {
  if (props.latitude) {
    let center = {
      latitude: props.latitude,
      longitude: props.longitude,
    };
    _map.animateCamera({
      heading: 0,
      center: center,
      pitch: 0,
    });
  }
};

const TrackingTab = props => {
  return (
    <Container>
      <Grid>
        <Row size={10}>
          <Col>
            {generateVehiclePicker(
              props.vehicles,
              props.handleSelectTrackingVehicle,
              props.selectedTrackingVehicle,
              props.stopTrackingButton,
            )}
          </Col>
          <Col>
            <Segment>
              <Button
                first
                active={props.stopTrackingButton}
                onPress={() => props.stopTrackingFn()}>
                <Text>Stop</Text>
              </Button>
              <Button
                last
                active={props.startTrackingButton}
                onPress={() => props.startTrackingFn()}>
                <Text>Start</Text>
              </Button>
            </Segment>
          </Col>
        </Row>
        <Row size={10}>
          <Col>
            <Input
              placeholder={'Stanje brojila'}
              onChangeText={txt => props.handleInitialKilometers(txt)}
            />
          </Col>
        </Row>
        <Row size={80}>
          <MapView
            ref={component => (_map = component)}
            style={styles(props).map}
            initialRegion={props.region}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            onUserLocationChange={coordinates =>
              animateToUserLocation(coordinates)
            }
            onMapReady={() => animateToUserLocation(props)}>
            <Polyline
              coordinates={props.coordinates}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={['#7F0000']}
              strokeWidth={6}
            />
          </MapView>
        </Row>
      </Grid>
    </Container>
  );
};

const styles = props =>
  StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
export default TrackingTab;
