@IsTest
private class OppContactRolesEditControllerTest {
    @IsTest
    static void should_get_contact_roles() {
        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today()
        );
        insert opp;

        Contact contact = new Contact(FirstName = 'Test', LastName = 'Contact');
        insert contact;

        OpportunityContactRole oppContactRole = new OpportunityContactRole(
            OpportunityId = opp.Id,
            ContactId = contact.Id,
            Role = 'Business User',
            IsPrimary = false
        );
        insert oppContactRole;

        List<OpportunityContactRole> contactRoles = OppContactRolesEditController.getOppContactRoles(
            opp.Id
        );
        System.assertEquals(1, contactRoles.size());
        OpportunityContactRole contactRole = contactRoles[0];
        System.assertEquals(contact.Id, contactRole.ContactId);
        System.assertEquals('Business User', contactRole.Role);
        System.assertEquals(false, contactRole.IsPrimary);
    }
}
