import React from "react";
import { StyleSheet } from "react-native";
import {
	ListItem,
	Separator,
	Container,
	Content,
	Text,
	List
} from "native-base";

let generateList = vehicles => {
	if (!(typeof vehicles === "undefined") && vehicles.length > 0) {
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

		return <Content>{content}</Content>;
	} else {
		return <Text>Nemate dodanih vozila</Text>;
	}
};

const VehiclesTab = props => {
	return <Container>{generateList(props.vehicles)}</Container>;
};

const styles = StyleSheet.create({});
export default VehiclesTab;
