const TicketError = "TicketError";

export class TicketIsNotOpenError extends Error {
  constructor(public ticketId: string) {
    super("Ticket is not open");
    this.name = TicketError;
  }
}

export class TicketIsClosedError extends Error {
  constructor(public ticketId: string) {
    super("Ticket is closed");
    this.name = TicketError;
  }
}

export class TicketCannotOpenTwiceError extends Error {
  constructor(public ticketId: string) {
    super("Cannot open twice");
    this.name = TicketError;
  }
}

export class TicketCannotCloseTwiceError extends Error {
  constructor(public ticketId: string) {
    super("Cannot close twice");
    this.name = TicketError;
  }
}

export class MessageNotFoundError extends Error {
  constructor(public messageId: string) {
    super("Message not found");
    this.name = TicketError;
  }
}
