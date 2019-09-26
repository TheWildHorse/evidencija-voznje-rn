import React from 'react';
import {Overlay, Text} from 'react-native-elements';
import {Container, Item, Label, Input, Button} from 'native-base';
import {StyleSheet, ScrollView} from 'react-native';

const AddCompanyModal = props => {
  return (
    <Overlay
      isVisible
      onBackdropPress={() => props.handleModal('')}
      height={300}>
      <ScrollView>
        <Container
          style={{
            height: 250,
          }}>
          <Text h4 style={{textAlign: 'center'}}>
            Unos nove tvrtke
          </Text>
          <Item floatingLabel>
            <Label>Naziv tvrtke</Label>
            <Input onChangeText={text => props.handleCompanyInput(text)} />
          </Item>
          <Item floatingLabel>
            <Label>Adresa tvrtke</Label>
            <Input
              onChangeText={text => props.handleCompanyAddressInput(text)}
            />
          </Item>
          <Item floatingLabel>
            <Label>OIB tvrtke</Label>
            <Input onChangeText={text => props.handleCompanyOibInput(text)} />
          </Item>
          <Button
            style={{marginTop: 20}}
            block
            rounded
            primary
            onPress={() => props.handleNewCompany()}>
            <Text style={{color: 'white'}}> Kreiraj </Text>
          </Button>
        </Container>
      </ScrollView>
    </Overlay>
  );
};

const styles = () => StyleSheet.create({});

export default AddCompanyModal;
