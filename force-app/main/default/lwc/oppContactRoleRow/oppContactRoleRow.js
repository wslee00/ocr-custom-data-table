import { api, wire, LightningElement } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { MASTER_RECORD_TYPE_ID } from 'c/recordTypeConstants';
import ROLE_FIELD from '@salesforce/schema/OpportunityContactRole.Role';

export default class OppContactRoleRow extends LightningElement {
    @api contactRole;

    roleOptions = [];

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
}
