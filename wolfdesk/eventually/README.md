# Context

Here we will be using a **TypeScript/NodeJS** framework (under development since 2022) to implement the `Ticket Lifecycle Bounded Context` as a service, following the Event Storming Model below... _Still a WIP as we evolve the ideas in Miro_

## Eventually Framework

- [Monorepo](https://github.com/Rotorsoft/eventually-monorepo)
- [Eventually Library](https://github.com/Rotorsoft/eventually-monorepo/blob/master/libs/eventually/README.md)

Help is welcome ;-)

## Model

We used Event Storming to model the system following the [requirements](../README.md) in the main repo.

### Process Model

![Process Model](./assets/process-model.png)

### Software Design

![Software Design](./assets/software-design.png)

## Unit Testing

`yarn test --coverage`

## OpenAPI Spec

Run the service with `yarn start:dev` and navigate to [http://localhost:3000](http://localhost:3000)

If everything is properly configured, you will see the home page of the service, including the model and OpenAPI specification of the public endpoints.
