import { api, LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/baseUtils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import saveOppContactRoles from '@salesforce/apex/OppContactRolesEditController.saveOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoles = [];
    isSaving = false;
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
        const contactRoleId = event.detail.Id;
        this._changed[contactRoleId] = {
            ...this._changed[contactRoleId],
            ...event.detail,
        };
    }

    async handleSave() {
        this.isSaving = true;
        try {
            await saveOppContactRoles({ oppContactRoles: Object.values(this._changed) });
        } catch (error) {
            this.isSaving = false;
            console.error(error);
            const errors = reduceErrors(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Saving Contact Roles',
                    message: errors.join(', '),
                    variant: 'error',
                }),
            );
            return;
        }

        this.isSaving = false;
        this._changed = {};
    }
}
