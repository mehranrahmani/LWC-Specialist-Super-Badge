import { LightningElement, api, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { NavigationMixin } from 'lightning/navigation'

const BOAT_OBJECT = 'Boat__c'; // imports object

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    @api similarBy; // design attrubute
    currentBoat;
    relatedBoats;
    boatId;
    error;
    
    
    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(val) {
        this.setAttribute('boatId', val);        
        this.boatId = val;
    }
    
    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
    similarBoats({ error, data }) { 
        if(data) {
            this.relatedBoats = data;
        }
    }

    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                objectApiName: BOAT_OBJECT,
                actionName: 'view'
            },
        });
    }
  }
  