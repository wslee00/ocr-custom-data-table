public with sharing class OppContactRolesEditController {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityContactRole> getOppContactRoles(Id opportunityId) {
        return [
            SELECT ContactId, Role, IsPrimary
            FROM OpportunityContactRole
            WHERE OpportunityId = :opportunityId
        ];
    }

    @AuraEnabled
    public static void saveOppContactRoles(
        List<OpportunityContactRole> contactRolesToUpsert,
        List<OpportunityContactRole> contactRolesToDelete
    ) {
        delete contactRolesToDelete;
        upsert contactRolesToUpsert;
    }

    @AuraEnabled
    public static Contact getContact(Id contactId) {
        return [SELECT Name FROM Contact WHERE Id = :contactId];
    }
}
