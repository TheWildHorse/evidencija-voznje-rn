import React from 'react';
import {Container, Content, Form, Icon} from 'native-base';
import {Text, Button, Input} from 'react-native-elements';
import {StyleSheet} from 'react-native';

const LoginComponent = props => {
  return (
    <Container>
      <Content style={styles.container}>
        <Text h3 style={styles.mainTitle}>
          Evidencija vožnje
        </Text>
        <Text h5 style={styles.secondaryTitle}>
          Prijava
        </Text>
        <Form>
          <Input
            leftIconContainerStyle={styles.inputStyle}
            placeholderTextColor={'#707AA8'}
            inputStyle={{color: '#707AA8'}}
            leftIcon={<Icon name="mail" fontSize={24} color="#707AA8" />}
            placeholder="E-mail"
            onChangeText={text => props.handleEmail(text)}
          />
          <Input
            inputStyle={{color: '#707AA8'}}
            leftIconContainerStyle={styles.inputStyle}
            placeholderTextColor={'#707AA8'}
            leftIcon={<Icon name="lock" fontSize={24} color="#707AA8" />}
            placeholder="Zaporka"
            secureTextEntry={true}
            onChangeText={text => props.handlePassword(text)}
          />
          <Button
            loading={props.loading}
            buttonStyle={{marginHorizontal: 20, marginTop: 50}}
            onPress={() => props.login()}
            title="Prijava"
          />
          <Button
            buttonStyle={{marginHorizontal: 20, marginTop: 50}}
            onPress={() => props.navigate('Register')}
            title="Registracija"
          />
        </Form>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E3246',
  },
  mainTitle: {
    color: 'white',
    textAlign: 'center',
  },
  secondaryTitle: {
    textAlign: 'center',
    color: 'white',
  },
  inputStyle: {
    paddingRight: 20,
  },
});

export default LoginComponent;
