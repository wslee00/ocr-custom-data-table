import { api, LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/baseUtils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import saveOppContactRoles from '@salesforce/apex/OppContactRolesEditController.saveOppContactRoles';

export default class OppContactRolesEdit extends LightningElement {
    @api recordId;

    isSaving = false;
    roleOptions = [];

    _contactRoleDtos = [];

    @wire(getOppContactRoles, { opportunityId: '$recordId' })
    processGetContactRoles({ error, data }) {
        if (data) {
            this._contactRoleDtos = data.map((contactRole) => {
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

    get contactRoles() {
        if (!this._contactRoleDtos) {
            return [];
        }
        return this._contactRoleDtos
            .filter((contactRoleDto) => {
                return contactRoleDto.dbAction !== 'delete';
            })
            .map((contactRoleDto) => {
                return contactRoleDto.record;
            });
    }

    handleAdd() {
        this._contactRoleDtos = [
            ...this._contactRoleDtos,
            {
                record: {
                    Id: crypto.randomUUID(),
                    OpportunityId: this.recordId,
                },
                dbAction: 'create',
            },
        ];
    }

    handleContactRoleDelete(event) {
        const contactRoleId = event.detail;
        this._contactRoleDtos = this._contactRoleDtos.map((contactRoleDto) => {
            if (contactRoleDto.record.Id !== contactRoleId) {
                return contactRoleDto;
            }

            return {
                ...contactRoleDto,
                dbAction: 'delete',
            };
        });
    }

    handleContactRoleChange(event) {
        const contactRoleId = event.detail.Id;
        this._contactRoleDtos = this._contactRoleDtos.map((contactRoleDto) => {
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
        const contactRolesToUpsert = this._contactRoleDtos
            .filter((contactRoleDto) => {
                return contactRoleDto.dbAction !== 'delete';
            })
            .map((contactRoleDto) => {
                if (contactRoleDto.dbAction === 'create') {
                    return {
                        ...contactRoleDto.record,
                        Id: null,
                    };
                }

                return contactRoleDto.record;
            });

        const contactRolesToDelete = this._contactRoleDtos
            .filter((contactRoleDto) => {
                return contactRoleDto.dbAction === 'delete';
            })
            .map((contactRoleDto) => {
                return { Id: contactRoleDto.record.Id };
            });
        try {
            await saveOppContactRoles({ contactRolesToUpsert, contactRolesToDelete });
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
        this._resetDbActions();
    }

    _resetDbActions() {
        this._contactRoleDtos = this._contactRoleDtos
            .filter((contactRoleDto) => contactRoleDto.dbAction !== 'delete')
            .map((contactRoleDto) => {
                return {
                    ...contactRoleDto,
                    dbAction: null,
                };
            });
    }
}
