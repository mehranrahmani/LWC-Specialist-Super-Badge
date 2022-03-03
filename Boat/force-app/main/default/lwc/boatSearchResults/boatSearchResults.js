import { LightningElement, wire, track, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { MessageContext, publish } from 'lightning/messageService';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {


    boatTypeId = '';
    @track selectedBoatId;
    columns = [ 
      { label: 'Name', fieldName: 'Name', editable: true },
      { label: 'Length', fieldName: 'Length__c', type: 'number'},
      { label: 'Price', fieldName: 'Price__c', type: 'currency'},
      { label: 'Description', fieldName: 'Description__c'},        
    ];
    @track 
    boats;
    @track draftValues = [];
    isLoading = false;

      @wire (getBoats, {boatTypeId: '$boatTypeId'})
      wiredBoats ({data}) {
      if(data) {
            this.boats = data;
            // alert(JSON.stringify(this.boats[0]));
        }
    }

    @wire(MessageContext)
    messageContext;

    @api
    searchBoats(boatTypeId) { 
      this.isLoading = true;
      this.notifyLoading(this.isLoading);
      this.boatTypeId = boatTypeId;
      // alert(' boat type id in result   ' +this.boatTypeId)
    }
  
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api
    async refresh() {
      this.isLoading = true;
      this.notifyLoading(this.isLoading);      
      await refreshApex(this.boats);
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
    }
    
    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) { 
      this.selectedBoatId = event.detail.boatId;
      this.sendMessageService(event.detail.boatId);
    }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) { 
      const payload = { recordId: boatId };
      publish(this.messageContext, BOATMC, payload);
      // explicitly pass boatId to the parameter recordId
    }
    
    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
      // notify loading
      this.notifyLoading(true);
      const updatedFields = event.detail.draftValues;
      // Update the records via Apex
      updateBoatList({data: updatedFields})
      .then(() => {
        this.notifyLoading(false);
        this.dispatchEvent(new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT,
        }));
        this.draftValues = [];
        this.refresh();
      })
      .catch(error => {
      this.dispatchEvent(new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.message,
        variant: ERROR_VARIANT,
      }));
      })
      .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
    if (this.isLoading === isLoading) {
      return
    }
    this.isLoading = isLoading;
    if (isLoading) {
      this.dispatchEvent(new CustomEvent('loading'));
    } 
    else {
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }


}