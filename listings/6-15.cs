public class Ticket
{
   // ...
   List<Message> _messages;
   // ...
 
   public void Execute(AcknowledgeMessage cmd)
   {
      var message = _messages.Where(x => x.Id == cmd.id).First();
      message.WasRead = true;
   }
   // ...
}