public void CreateTicket(TicketData data)
{
    var agent = FindLeastBusyAgent();
    agent.ActiveTickets = agent.ActiveTickets + 1;
    agent.Save();
    var ticket = new Ticket();
    ticket.Id = Guid.New();
    ticket.Data = data;
    ticket.AssignedAgent = agent;
    ticket.Save();
    _alerts.Send(agent, “You have a new ticket!”);
}