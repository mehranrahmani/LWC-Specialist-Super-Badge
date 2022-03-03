import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    @track isLoading = false;
    // Handles loading event
    handleLoading() { 
        // alert('loading');
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        // alert('Done loading');

        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        // alert(event.detail.boatTypeId)
        let boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(boatTypeId);
        this.handleDoneLoading();
        // alert('boat type id in search   ' + boatTypeId);
    }
    
    createNewBoat() { 
        // alert('create');
         this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });

        // alert('hit')
    }
}
  