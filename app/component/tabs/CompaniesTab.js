import React from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import {ListItem, Separator, Container, Content, Text, List} from 'native-base';

let generateList = companies => {
  if (!(typeof companies === 'undefined') && companies.length > 0) {
    let content = companies.map((a, i) => {
      let items = a.users.map((u, k) => {
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
    return <Text>Nemate dodanih tvrtka</Text>;
  }
};

const CompaniesTab = props => {
  let content = (
    <Content
      refreshControl={
        <RefreshControl
          refreshing={props.isTabRefreshing}
          onRefresh={() => props.refreshTab('companies')}
        />
      }>
      {generateList(props.companies)}
    </Content>
  );
  return <Container>{content}</Container>;
};

const styles = StyleSheet.create({});
export default CompaniesTab;
