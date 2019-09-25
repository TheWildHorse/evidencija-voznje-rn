import React from 'react';
import {
  Container,
  Tab,
  Tabs,
  ScrollableTab,
  Fab,
  Icon,
  Button,
} from 'native-base';
import CompaniesTab from './tabs/CompaniesTab';
import AddCompanyModal from './modals/AddCompanyModal';
import InvitationsTab from './tabs/InvitationsTab';
import SendInvitationModal from './modals/SendInvitationModal';
import VehiclesTab from './tabs/VehiclesTab';
import CreateVehicleModal from './modals/CreateVehicleModal';
import TrackingTab from './tabs/TrackingTab';
import RecordsTab from './tabs/RecordsTab';
import {StyleSheet} from 'react-native';

const HomeComponent = props => {
  return (
    <Container style={styles.container}>
      <Tabs
        renderTabBar={() => <ScrollableTab />}
        onChangeTab={ref => props.handleTabChange(ref)}>
        <Tab heading="Tvrtke">
          <CompaniesTab companies={props.companies} />
        </Tab>
        <Tab heading="Pozivnice">
          <InvitationsTab
            invitations={props.invitations}
            acceptInvitation={props.acceptInvitation}
          />
        </Tab>
        <Tab heading="Vozila">
          <VehiclesTab vehicles={props.vehicles} />
        </Tab>
        <Tab heading="Praćenje">
          <TrackingTab
            vehicles={props.vehicles}
            handleSelectTrackingVehicle={props.handleSelectTrackingVehicle.bind(
              this,
            )}
            selectedTrackingVehicle={props.selectedTrackingVehicle}
            menuTop={props.menuTop}
            region={props.region}
            coordinates={props.coordinates}
            startTrackingButton={props.startTrackingButton}
            stopTrackingButton={props.stopTrackingButton}
            stopTrackingFn={props.stopTrackingFn}
            startTrackingFn={props.startTrackingFn}
            handleInitialKilometers={props.handleInitialKilometers}
          />
        </Tab>
        <Tab heading="Evidencija">
          <RecordsTab
            records={props.records}
            handleRecordButton={props.handleRecordButton.bind(this)}
          />
        </Tab>
      </Tabs>
      <Fab
        active={props.fabActive}
        direction="up"
        containerStyle={{}}
        style={{backgroundColor: '#5067FF'}}
        position="bottomRight"
        onPress={() => props.handleFab()}>
        <Icon name="settings" />

        <Button
          style={{backgroundColor: '#DD5144'}}
          onPress={() => props.handleLogout()}>
          <Icon name="log-out" />
        </Button>

        {props.activeTab === 'Tvrtke' && (
          <Button
            style={{backgroundColor: '#34A34F'}}
            onPress={() => props.handleModal('tvrtke')}>
            <Icon name="briefcase" />
          </Button>
        )}

        {props.activeTab === 'Pozivnice' && (
          <Button
            style={{backgroundColor: '#34A34F'}}
            onPress={() => props.handleModal('pozivnice')}>
            <Icon name="mail" />
          </Button>
        )}

        {props.activeTab === 'Vozila' && (
          <Button
            style={{backgroundColor: '#34A34F'}}
            onPress={() => props.handleModal('vozila')}>
            <Icon name="car" />
          </Button>
        )}
      </Fab>

      {props.modal === 'tvrtke' && (
        <AddCompanyModal
          handleModal={props.handleModal.bind(this)}
          handleCompanyInput={props.handleCompanyInput.bind(this)}
          handleNewCompany={props.handleNewCompany}
        />
      )}

      {props.modal === 'pozivnice' && (
        <SendInvitationModal
          handleModal={props.handleModal.bind(this)}
          handleInvitationInput={props.handleInvitationInput.bind(this)}
          handleSendInvitation={props.handleSendInvitation}
          selectedUserType={props.selectedUserType}
          handleUserType={props.handleUserType.bind(this)}
          companies={props.companies}
          handleSelectCompany={props.handleSelectCompany}
          selectedCompany={props.selectedCompany}
        />
      )}

      {props.modal === 'vozila' && (
        <CreateVehicleModal
          handleModal={props.handleModal.bind(this)}
          handleVehicleInput={props.handleVehicleInput.bind(this)}
          handleCreateVehicle={props.handleCreateVehicle}
          companies={props.companies}
          handleSelectCompany={props.handleSelectCompany}
          selectedCompany={props.selectedCompany}
          handleVehicleNameInput={props.handleVehicleNameInput.bind(this)}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default HomeComponent;
