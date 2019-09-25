import React from "react";
import { Overlay, Text } from "react-native-elements";
import { Container, Item, Label, Input, Button } from "native-base";
import { StyleSheet, ScrollView } from "react-native";

const AddCompanyModal = props => {
	return (
		<Overlay
			isVisible
			onBackdropPress={() => props.handleModal("")}
			height={200}
		>
			<ScrollView>
				<Container style={{ 
					height: 150,					 
					}}>
					<Text h4 style={{textAlign: 'center'}}>Unos nove tvrtke</Text>
					<Item floatingLabel>
						<Label>Naziv tvrtke</Label>
						<Input
							onChangeText={text =>
								props.handleCompanyInput(text)
							}
						/>
					</Item>
					<Button
						style={{ marginTop: 20 }}
						block
						rounded
						primary
						onPress={() => props.handleNewCompany()}
					>
						<Text style={{color: "white"}}> Kreiraj </Text>
					</Button>
				</Container>
			</ScrollView>
		</Overlay>
	);
};

const styles = () => StyleSheet.create({});

export default AddCompanyModal;
