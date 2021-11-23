public class Ticket
{
    // ...
 
    public void AddMessage(UserId from, string subject, string body)
    {
        var message = new Message(from, body);
        _messages.Append(message);
    }
 
    // ...
}