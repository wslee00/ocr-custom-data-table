import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import { api, LightningElement, wire } from 'lwc';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoles = [];

    @wire(getOppContactRoles, { opportunityId: '$recordId' })
    processGetContactRoles({ error, data }) {
        if (data) {
            this.contactRoles = data;
        }
        if (error) {
            console.error(error);
        }
    }

    roles = [
        { label: 'Business User', value: 'Business User' },
        { label: 'Decision Maker', value: 'Decision Maker' },
        { label: 'Sponsor', value: 'Sponsor' },
    ];

    handleRoleChange(event) {
        console.log(event.detail.value);
    }
}
