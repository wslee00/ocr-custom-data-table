public with sharing class OppContactRolesEditController {
    @AuraEnabled
    public static List<OpportunityContactRole> getOppContactRoles(Id opportunityId) {
        return [
            SELECT ContactId, Role, IsPrimary
            FROM OpportunityContactRole
            WHERE OpportunityId = :opportunityId
        ];
    }
}
