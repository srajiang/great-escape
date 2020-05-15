Feature: Croissant Escape Landing Page Contents

  Scenario: View landing page contents
    When I load the Croissant Escape page
    Then I should see title "Great Croissant Escape"
    Then I should see user instructions "Press and hold spacebar to jump farther"
    Then Volume off icon should not be displayed