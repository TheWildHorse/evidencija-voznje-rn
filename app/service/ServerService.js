import React from "react";
import {
	serverUrl,
	getCompaniesApi,
	getVehiclesApi,
	getInvitationsApi
} from "../config/Params";
import ErrorCodes from "../config/ErrorCodes";

class ServerService {
	sendRequest = async (api, body) => {
		let url = serverUrl + api;
		let response = fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: body
		})
			.then(response => {
				return response.json();
			})
			.then(responseJson => {
				if (responseJson.code !== 200) {
					this.showError(responseJson.code);
				}
				return responseJson;
			})
			.catch(error => {
				console.error(error);
			});

		return response;
	};

	showError = code => {
		if (code === 21 || code === 50) {
			return 50;
		} else {
			let _errorCodes = new ErrorCodes();
			let error = _errorCodes.getErrorMessage(code);
			alert(error);
		}
	};

	getCompanies = async token => {
		let body = JSON.stringify({
			token: token
		});
		companies = await this.sendRequest(getCompaniesApi, body);
		return companies.companies;
	};

	getVehicles = async token => {
		let body = JSON.stringify({
			token: token
		});
		vehicles = await this.sendRequest(getVehiclesApi, body);
		return vehicles.vehicles;
	};

	getInvitations = async token => {
		let body = JSON.stringify({
			token: token
		});
		invitations = await this.sendRequest(getInvitationsApi, body);
		return invitations.invitationCodes;
	};
}

export default ServerService;
