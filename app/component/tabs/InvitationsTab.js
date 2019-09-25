import React from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import {
  Card,
  CardItem,
  Container,
  Content,
  Right,
  Icon,
  Text,
} from 'native-base';

let generateList = (invitations, acceptInvitation) => {
  if (typeof invitations !== 'undefined' && invitations.length > 0) {
    let content = invitations.map((a, i) => {
      return (
        <CardItem
          key={i}
          header
          button
          onPress={() => acceptInvitation(a.code)}>
          <Text>{a.companyName}</Text>
          <Right>
            <Icon name="checkmark" />
          </Right>
        </CardItem>
      );
    });

    return <Card>{content}</Card>;
  } else {
    return <Text>Nemate pozivnica</Text>;
  }
};

const InvitationsTab = props => {
  return (
    <Container>
      <Content
        refreshControl={
          <RefreshControl
            refreshing={props.isTabRefreshing}
            onRefresh={() => props.refreshTab('invitations')}
          />
        }>
        {generateList(props.invitations, props.acceptInvitation)}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({});
export default InvitationsTab;
