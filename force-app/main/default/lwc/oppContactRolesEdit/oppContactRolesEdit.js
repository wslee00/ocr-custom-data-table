import { api, LightningElement, wire } from 'lwc';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoles = [];
    roleOptions = [];

    _changed = [];

    @wire(getOppContactRoles, { opportunityId: '$recordId' })
    processGetContactRoles({ error, data }) {
        if (data) {
            this.contactRoles = data;
        }
        if (error) {
            console.error(error);
        }
    }

    handleContactRoleChange(event) {
        const index = this._changed.findIndex(
            (item) => item.contactRoleId === event.detail.contactRoleId,
        );
        if (index === -1) {
            this._changed.push(event.detail);
        } else {
            this._changed[index] = {
                ...this._changed[index],
                ...event.detail,
            };
        }

        console.log(this._changed);
    }
}
