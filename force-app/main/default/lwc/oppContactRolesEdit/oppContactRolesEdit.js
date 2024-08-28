import { api, LightningElement, wire } from 'lwc';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import saveOppContactRoles from '@salesforce/apex/OppContactRolesEditController.saveOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoles = [];
    roleOptions = [];

    _changed = {};

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
        const contactRoleId = event.detail.contactRoleId;
        this._changed[contactRoleId] = {
            ...this._changed[contactRoleId],
            ...event.detail,
        };
    }

    async handleSave() {
        console.log('changed: ', this._changed);
        try {
            await saveOppContactRoles({ oppContactRoles: Object.values(this._changed) });
        } catch (error) {
            console.error(error);
        }
    }
}
