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
import { StyleSheet } from "react-native";

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

const CreateVehicleModal = props => {
	return (
		<Overlay
			height={300}
			isVisible
			onBackdropPress={() => props.handleModal("")}
		>
			<Container style={{ height: 250 }}>
				<Text h4 style={{ textAlign: "center" }}>
					Dodaj novo vozilo
				</Text>
				{generatePicker(
					props.companies,
					props.handleSelectCompany,
					props.selectedCompany
				)}
				<Item floatingLabel>
					<Label>Naziv vozila</Label>
					<Input
						onChangeText={text =>
							props.handleVehicleNameInput(text)
						}
					/>
				</Item>
				<Item floatingLabel>
					<Label>Registarska oznaka</Label>
					<Input
						onChangeText={text => props.handleVehicleInput(text)}
					/>
				</Item>
				<Button
					style={{ marginTop: 20 }}
					block
					rounded
					primary
					onPress={() => props.handleCreateVehicle()}
				>
					<Text style={{ color: "white" }}> Pošalji </Text>
				</Button>
			</Container>
		</Overlay>
	);
};

const styles = () => StyleSheet.create({});

export default CreateVehicleModal;
