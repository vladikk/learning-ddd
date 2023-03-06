# Business Domain

**WolfDesk provides a help desk tickets management system as a service**. If your startup company needs to provide support to your customers, with WolfDesk's solution you can get up and running in no time

## Requirements

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

## Core Subdomains

1. Ticket lifecycle management algorithm that is intended to close tickets and thus encourage users to open new ones (R2a)
2. Fraud detection system to prevent abuse of its business model (R2b)
3. Support autopilot that both eases the tenants' support agents' work and further reduces the tickets' lifespan (R3)

## Generic Subdomains

1. "Industry Standard" ways of authenticating and authorizing users (R4a)
2. Using external providers for authentication and authorization (SSO) (R4b)
3. The serverless compute infrastructure the company leverages to ensure elastic scalability and minimize the compute costs of onboarding new tenants (R7)

## Supporting Subdomains

1. Tenant onboarding
2. Billing (R1)
3. Management of a tenant's ticket categories (R5a)
4. Management of tenant's products, regarding which the customers can open support tickets (R5b)
5. Entry of a tenant's support agent's work schedules (R6)

## Ubiquitous Language  

- Customers are the external actors creating new tickets, and are associated to tenants
- Agents are external actors acting on created tickets, and are associated to tenants
- Tenants are the "internal" customers of the system, and manage their own agents and customers
- There is an onboarding process for tenants
- There is an administration interface for system administrators and tenants
- Charging model based on the number of tickets opened during a charging period
- The ticket lifecycle management algorithm ensures that inactive tickets are automatically closed
- The fraud detection algorithm prevents tenants from abusing the business model
- The support autopilot functionality tries to find solutions for new tickets automatically
- A ticket belongs to a support category and it associated with a product for which the tenant provides support
- A support agent can only process tickets during their work time, which is defines by their shift schedules

## Other Considerations

- Ticket escalation can only be requested by the customer owning the ticket (when the SLA has been violated)
- Customers and agents can add messages to the ticket
- Messages can optionally have a list of attachments - attachments cannot be added independently
- Customers and agents can acknowledge messages entered by the other side of the conversation
- Customers and agents can mark the ticket resolved
- Tenants can have a "very large" number of products to support - influence in aggregate boundary around products
- Tenants can have a "very large" number of agents - influence in aggregate boundary around agents
- Other tenant properties like categories, name, website, etc can be updated as a whole
