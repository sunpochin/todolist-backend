Feature: login
  I want to login todolist

  Background: As a user of todolist, I want to login.
  Given I go to '/login'
  # And the field 'email' is empty  
  # And the field 'password' is empty

  # Scenario: Error on empty fields
  # When I click on 'Enter'
  # Then field 'email' should be with error
  # And field 'password' should be with error

  Scenario: Wrong password
    When I type 'sunpochin@gmail.com' in 'email'
    And I type '123456' in 'password'
    Then I should see '401'

  # Scenario: Login successfully
  #   Given I have users:
  #     | name           | email             | password |
  #     | Vitor Batista  | sunpochin@gmail.com  | 1234567   |
  #   When I type 'sunpochin@gmail.com' in 'email'
  #   And I type '1234567' in 'password'
  #   And I click on 'enter'
  #   Then I shouldn't see 'Access your account'

