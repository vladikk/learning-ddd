public class TicketState
{
    public TicketId Id { get; private set; }
    public int Version { get; private set; }
    public bool IsEscalated { get; private set; }
    // ...
    public void Apply(TicketInitialized @event)
    {
        Id = @event.Id;
        Version = 0;
        IsEscalated = false;
        // ....
    }
 
    public void Apply(TicketEscalated @event)
    {
        IsEscalated = true;
        Version += 1;
    }
 
    // ...
}