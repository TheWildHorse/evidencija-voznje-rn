import React from "react";
import { Overlay, Text } from "react-native-elements";
import {
	Container,
	Item,
	Label,
	Input,
	Button,
	Picker,
	Icon,
	Form
} from "native-base";
import { StyleSheet, ScrollView } from "react-native";

let generatePicker = (companies, handleSelectCompany, selectedCompany) => {
	if (!(typeof companies === "undefined") && companies.length > 0) {
		let content = companies.map((a, i) => {
			return <Picker.Item label={a.company} value={a.company} key={i} />;
		});

		return (
			<Form>
				<Picker
					mode="dropdown"
					iosHeader="Odaberite tvrtku"
					iosIcon={<Icon name="arrow-down" />}
					selectedValue={selectedCompany}
					onValueChange={text => handleSelectCompany(text)}
					style={{ height: 50 }}
				>
					{content}
				</Picker>
			</Form>
		);
	} else {
		return <Text>Nemate dodanih tvrtka</Text>;
	}
};

const SendInvitationModal = props => {
	return (
		<Overlay
			height={300}
			isVisible
			onBackdropPress={() => props.handleModal("")}
		>
			<ScrollView>
				<Container style={{ height: 250 }}>
					<Text h4 style={{ textAlign: "center" }}>
						Dodaj novog korisnika
					</Text>
					{generatePicker(
						props.companies,
						props.handleSelectCompany,
						props.selectedCompany
					)}
					<Form>
						<Picker
							mode="dropdown"
							iosHeader="Odaberite vrstu korisnika"
							iosIcon={<Icon name="arrow-down" />}
							selectedValue={props.selectedUserType}
							onValueChange={text => props.handleUserType(text)}
						>
							<Picker.Item label="Zaposlenik" value="employee" />
							<Picker.Item label="Poslodavac" value="employer" />
						</Picker>
					</Form>
					<Item floatingLabel>
						<Label>email</Label>
						<Input
							onChangeText={text =>
								props.handleInvitationInput(text)
							}
						/>
					</Item>
					<Button
						style={{ marginTop: 20 }}
						block
						rounded
						primary
						onPress={() => props.handleSendInvitation()}
					>
						<Text style={{ color: "white" }}> Pošalji </Text>
					</Button>
				</Container>
			</ScrollView>
		</Overlay>
	);
};

const styles = () => StyleSheet.create({});

export default SendInvitationModal;
