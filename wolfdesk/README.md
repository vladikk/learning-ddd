# WolfDesk

Here, you'll find community-generated implementations of the imaginary company, WolfDesk, that is used for illustrating key concepts in "Learning Domain-Driven Design."

## Get Involved

1. **Contribute your expertise**: If your favorite technology stack is missing, I'd love for you to join the challenge and submit your own implementation of WolfDesk. Your contribution will help enrich the collective learning experience.

2. **Collaborate and improve**: As a community-driven project, you are welcome to review the existing codebases and offer your insights for improvement.

## Business Domain

**WolfDesk provides a help desk tickets management system as a service**. If your startup company needs to provide support to your customers, with WolfDesk's solution you can get up and running in no time

### Requirements

1. WolfDesk uses a different payment model than its competitors
  
    a. Instead of charging a fee per user, it allows the tenants to set up as many users as needed

    b. Tenants are charged for the number of support tickets opened per charging period

    c. There is no minimum fee

    d. There are automatic volume discounts for certain thresholds of monthly tickets

        i. 10% for opening more than 500 tickets

        ii. 20% for opening more than 750 tickets

        iii. 30% for opening more than 1000 tickets

2. To prevent tenants from abusing the business model, WolfDesk's ticket lifecycle algorithm ensures that

    a. Inactive tickets are closed automatically, encouraging customers to open new tickets when further support is needed

    b. WolfDesk implements a fraud detection system that analyzes messages and detects cases of unrelated topics being discussed in the same ticket

3. To help its tenants streamline the support-related work, WolfDesk has implemented a "support autopilot" feature

    a. The autopilot analyzes new tickets and tries to automatically find a matching solution from the tenant's ticket history

    b. The functionality allows for further reducing the ticket's lifespans, encouraging customers to open new tickets for further questions

4. WolfDesk incorporates

    a. All the security standards and measures to authenticate and authorize its tenants' users

    b. It also allows to configure a single sign-on (SSO) with their existing user management systems

5. The administration interface allows tenants to configure

    a. The possible values for the tickets' categories

    b. A list of the tenants' products that it supports

6. To be able to route new tickets to the tenant's support agents only during their working hours, WolfDesk allows the entry of each agent's shift schedule

7. Since WolfDesk provides its service with no minimal fee

    a. It has to optimize its infrastructure in a way that minimizes the costs of onboarding a new tenant

    b. It has to leverage serverless computing, which allows it to elastically scale its compute resources based on the operations on active tickets

### Core Subdomains

1. Ticket lifecycle management algorithm that is intended to close tickets and thus encourage users to open new ones
2. Fraud detection system to prevent abuse of its business model
3. Support autopilot that both eases the tenants' support agents' work and further reduces the tickets' lifespan

### Generic Subdomains

1. "Industry Standard" ways of authenticating and authorizing users
2. Using external providers for authentication and authorization (SSO)
3. The serverless compute infrastructure the company leverages to ensure elastic scalability and minimize the compute costs of onboarding new tenants

### Supporting Subdomains

1. Tenant onboarding
2. Billing
3. Management of a tenant's ticket categories
4. Management of tenant's products, regarding which the customers can open support tickets
5. Entry of a tenant's support agent's work schedules