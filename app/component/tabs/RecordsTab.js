import React from "react";
import { Button } from "react-native-elements";
import {
	Container,
	Content,
	Text,
	List,
	ListItem,
	Left,
	Body,
	Right
} from "native-base";

const generateList = (records, buttonAction) => {
	if (!(typeof records === "undefined") && records.length > 0) {
		let content = records.map((a, i) => {
			return (
				<ListItem key={i}>
					<Left>
						<Text>
							{a.date} - {a.vehicle} - {a.mileage}km
						</Text>
					</Left>
					<Right>
                        <Button 
                        title="Preuzmi nalog" 
                        onPress={() => buttonAction(a.id)}
                        />
					</Right>
				</ListItem>
			);
		});

		return <List>{content}</List>;
	} else {
		return <Text>Nema zapisa</Text>;
	}
};

const RecordsTab = props => {
	return (
		<Container>
			<Content>{generateList(props.records, props.handleRecordButton)}</Content>
		</Container>
	);
};

export default RecordsTab;
