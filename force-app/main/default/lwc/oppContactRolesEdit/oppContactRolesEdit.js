import { api, LightningElement, wire } from 'lwc';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoles = [];
    roleOptions = [];

    @wire(getOppContactRoles, { opportunityId: '$recordId' })
    processGetContactRoles({ error, data }) {
        if (data) {
            this.contactRoles = data;
        }
        if (error) {
            console.error(error);
        }
    }

    handleContactChange(event) {
        console.log('parent handleContactChange', event.detail);
    }

    handlePrimaryChange(event) {
        console.log('parent handlePrimaryChange', event.detail);
    }

    handleRoleChange(event) {
        console.log('parent handleRoleChange', event.detail);
    }
}
