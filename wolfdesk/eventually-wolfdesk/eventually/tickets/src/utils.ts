import {
  client,
  CommittedEvent,
  Messages,
  PolicyFactory,
  State,
} from "@rotorsoft/eventually";

export const rescheduleCronEvent = <E extends Messages>(
  factory: PolicyFactory<Messages, E>,
  name: keyof E & string,
  delaySecs: number
) => {
  setTimeout(
    () =>
      void client().event<State, Messages, E>(factory, {
        name,
        data: {} as Readonly<E[keyof E & string]>,
      } as CommittedEvent<E>),
    delaySecs * 1000
  );
};
