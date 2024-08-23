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

    handleRoleChange(event) {
        console.log(event.detail.value);
    }
}
