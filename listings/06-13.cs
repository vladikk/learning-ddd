public class Ticket
{
    // ...
    List<Message> _messages;
    // ...
   
    public void Execute(EvaluateAutomaticActions cmd)
    {
        if (this.IsEscalated && this.RemainingTimePercentage < 0.5 &&
            GetUnreadMessagesCount(forAgent: AssignedAgent) > 0)
        {
            _agent = AssignNewAgent();
        }
    }
    
    public int GetUnreadMessagesCount(UserId id)
    {
        return _messages.Where(x => x.To == id && !x.WasRead).Count();
    }
    
    // ...
}