const TicketError = "TicketError";

export class TicketCannotOpenTwiceError extends Error {
  constructor(public ticketId: string) {
    super("Cannot open twice");
    this.name = TicketError;
  }
}

export class MessageNotFoundError extends Error {
  constructor(public messageId: string) {
    super("Message not found");
    this.name = TicketError;
  }
}

export class UnauthorizedError extends Error {
  constructor(public ticketId: string, public userId: string) {
    super("User unauthorized");
    this.name = TicketError;
  }
}

export class TicketEscalationError extends Error {
  constructor(public ticketId: string, public requestedById: string) {
    super("Cannot escalate before due date");
    this.name = TicketError;
  }
}
