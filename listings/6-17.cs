public class Ticket
{
    // ...
    private List<DomainEvent> _domainEvents;
    // ...
  
    public void Execute(RequestEscalation cmd)
    {
        if (!this.IsEscalated && this.RemainingTimePercentage <= 0)
        {
            this.IsEscalated = true;
            var escalatedEvent = new TicketEscalated(_id);
            _domainEvents.Append(escalatedEvent);
        }
    }
 
    // ...
}