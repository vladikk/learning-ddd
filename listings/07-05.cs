public class TicketAPI
{
    private ITicketsRepository _ticketsRepository;
    // ...
  
    public void RequestEscalation(TicketId id)
    {
        var events = _ticketsRepository.LoadEvents(id);
        var ticket = new Ticket(events);
        var originalVersion = ticket.Version;
        var cmd = new RequestEscalation();
        ticket.Execute(cmd);
        _ticketsRepository.CommitChanges(ticket, originalVersion);
    }
 
    // ...
}