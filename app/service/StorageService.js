import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

class StorageService {

	storeData = async (key, value) => {
		try {
			await AsyncStorage.setItem("@" + key, value);
		} catch (e) {
			// saving error
		}
	};

	getData = async (key) => {
		try {
			const value = await AsyncStorage.getItem("@" + key);
			if (value !== null) {
				return value;
			}
		} catch (e) {
			// error reading value
		}
	};

	removeValue = async (key) => {
		try {
		  await AsyncStorage.removeItem('@' + key)
		} catch(e) {
		  // remove error
		}
		console.log('removed')
	  }
}

export default StorageService;
