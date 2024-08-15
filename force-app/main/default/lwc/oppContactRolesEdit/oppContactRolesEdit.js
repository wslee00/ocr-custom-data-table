import { LightningElement } from 'lwc';

export default class OppContactRolesEdit extends LightningElement {
    contactRoles = [
        {
            Id: '001000000000000',
            ContactId: '003O900000WaRgnIAF',
            Name: 'Malachi Corley',
            Role: 'Business User',
            IsPrimary: false,
        },
        {
            Id: '001000000000001',
            ContactId: '003O900000WaRldIAF',
            Name: 'Quinnen Williams',
            Role: 'Decision Maker',
            IsPrimary: true,
        },
        {
            Id: '001000000000002',
            ContactId: '003O900000WaRnFIAV',
            Name: 'Aaron Rodgers',
            Role: 'Sponsor',
            IsPrimary: false,
        },
    ];

    roles = [
        { label: 'Business User', value: 'Business User' },
        { label: 'Decision Maker', value: 'Decision Maker' },
        { label: 'Sponsor', value: 'Sponsor' },
    ];

    handleRoleChange(event) {
        console.log(event.detail.value);
    }
}
