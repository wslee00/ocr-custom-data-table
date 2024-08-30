import { api, LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/baseUtils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import saveOppContactRoles from '@salesforce/apex/OppContactRolesEditController.saveOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    contactRoleDtos = [];
    isSaving = false;
    roleOptions = [];

    @wire(getOppContactRoles, { opportunityId: '$recordId' })
    processGetContactRoles({ error, data }) {
        if (data) {
            this.contactRoleDtos = data.map((contactRole) => {
                return {
                    record: {
                        ...contactRole,
                    },
                    dbAction: null,
                };
            });
        }
        if (error) {
            console.error(error);
        }
    }

    handleAdd() {}

    handleContactRoleChange(event) {
        const contactRoleId = event.detail.Id;
        this.contactRoleDtos = this.contactRoleDtos.map((contactRoleDto) => {
            if (contactRoleDto.record.Id !== contactRoleId) {
                return contactRoleDto;
            }

            return {
                record: {
                    ...contactRoleDto.record,
                    ...event.detail,
                },
                dbAction: contactRoleDto.dbAction === 'create' ? 'create' : 'update',
            };
        });
    }

    async handleSave() {
        this.isSaving = true;
        const contactRolesToSave = this.contactRoleDtos.map(
            (contactRoleDto) => contactRoleDto.record,
        );
        try {
            await saveOppContactRoles({ oppContactRoles: contactRolesToSave });
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
    }
}
