Scenario: Notify agents about new support cases
    Given Vincent Jules submits a new support case saying:
    """
    I need help configuring AWS Infinidash.
    """
    When the ticket is assigned to Mr. Wolf
    Then Mr. Wolf receives a notification about the new support case