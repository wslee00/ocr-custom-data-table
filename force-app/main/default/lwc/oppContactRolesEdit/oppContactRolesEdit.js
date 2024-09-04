import { api, LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/baseUtils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOppContactRoles from '@salesforce/apex/OppContactRolesEditController.getOppContactRoles';
import saveOppContactRoles from '@salesforce/apex/OppContactRolesEditController.saveOppContactRoles';
import getContact from '@salesforce/apex/OppContactRolesEditController.getContact';

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

    handlePrimaryChange(event) {
        this.handleContactRoleChange(event);
        this._contactRoleDtos = this._contactRoleDtos.map((contactRoleDto) => {
            if (contactRoleDto.record.Id === event.detail.Id) {
                return contactRoleDto;
            }
            if (!contactRoleDto.record.IsPrimary) {
                return contactRoleDto;
            }

            return {
                record: {
                    ...contactRoleDto.record,
                    IsPrimary: false,
                },
                dbAction: contactRoleDto.dbAction === 'create' ? 'create' : 'update',
            };
        });
    }

    async handleSave() {
        this.isSaving = true;
        try {
            await this._validate();
        } catch (error) {
            this.isSaving = false;
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Saving Contact Roles',
                    message: error.message,
                    variant: 'error',
                }),
            );

            return;
        }

        const contactRolesToUpsert = this._getContactRolesToUpsert(this._contactRoleDtos);
        const contactRolesToDelete = this._getContactRolesToDelete(this._contactRoleDtos);
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

    _getContactRolesToDelete(contactRoleDtos) {
        return contactRoleDtos
            .filter((contactRoleDto) => {
                return contactRoleDto.dbAction === 'delete';
            })
            .map((contactRoleDto) => {
                return { Id: contactRoleDto.record.Id };
            });
    }

    _getContactRolesToUpsert(contactRoleDtos) {
        return contactRoleDtos
            .filter((contactRoleDto) => {
                return contactRoleDto.dbAction && contactRoleDto.dbAction !== 'delete';
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

    async _validate() {
        const contactIds = new Set();
        let dupContactId;
        for (const contactRoleDto of this._contactRoleDtos) {
            const contactId = contactRoleDto.record.ContactId;
            if (contactIds.has(contactId)) {
                dupContactId = contactId;
                break;
            }

            contactIds.add(contactId);
        }

        if (!dupContactId) {
            return;
        }

        const contact = await getContact({ contactId: dupContactId });
        throw new Error(`Contact ${contact.Name} is duplicated.`);
    }
}
