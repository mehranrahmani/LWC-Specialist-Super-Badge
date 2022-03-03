import { LightningElement, wire, track } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {


  selectedBoatTypeId = '';
  error = undefined;
  @track searchOptions;

  @wire(getBoatTypes) boatTypes({data}) {
    if(data) {
      this.searchOptions = [{
        label : 'All Types',
        value : '',
      }];
        for(let i = 0; i < data.length; i++ ) {
            // alert(JSON.stringify(data[i]))
            let item = {label: data[i].Name, value: data[i].Id};
            this.searchOptions.push(item);
        }
        // alert(JSON.stringify(this.searchOptions.length));
    }
}


  // }
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      this.selectedBoatTypeId = event.detail.value;
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      // searchEvent;
      this.dispatchEvent(new CustomEvent('search' ,  {
        detail: {
          boatTypeId: this.selectedBoatTypeId,
        }
      }));
    }

 



}