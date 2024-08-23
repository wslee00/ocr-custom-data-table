import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { api, LightningElement, wire } from 'lwc';
import { MASTER_RECORD_TYPE_ID } from 'c/recordTypeConstants';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import ROLE_FIELD from '@salesforce/schema/OpportunityContactRole.Role';

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

    @wire(getPicklistValues, {
        recordTypeId: MASTER_RECORD_TYPE_ID,
        fieldApiName: ROLE_FIELD,
    })
    processGetPicklistValues({ error, data }) {
        if (data) {
            this.roleOptions = data.values.map((rolePicklistValue) => {
                return { label: rolePicklistValue.label, value: rolePicklistValue.value };
            });
        }
        if (error) {
            console.error(error);
        }
    }

    handleRoleChange(event) {
        console.log(event.detail.value);
    }
}
