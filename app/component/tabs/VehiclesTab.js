import React from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import {ListItem, Separator, Container, Content, Text, List} from 'native-base';

let generateList = vehicles => {
  if (!(typeof vehicles === 'undefined') && vehicles.length > 0) {
    let content = vehicles.map((a, i) => {
      let items = a.vehicles.map((u, k) => {
        return (
          <ListItem key={k}>
            <Text>{u}</Text>
          </ListItem>
        );
      });
      return (
        <List key={i}>
          <Separator key={i}>
            <Text>{a.company}</Text>
          </Separator>
          {items}
        </List>
      );
    });

    return content;
  } else {
    return <Text>Nemate dodanih vozila</Text>;
  }
};

const VehiclesTab = props => {
  return (
    <Container>
      <Content
        refreshControl={
          <RefreshControl
            refreshing={props.isTabRefreshing}
            onRefresh={() => props.refreshTab('vehicles')}
          />
        }>
        {generateList(props.vehicles)}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({});
export default VehiclesTab;
