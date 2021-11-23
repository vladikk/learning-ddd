public class Campaign
{
    // ...
    List<DomainEvent> _events;
    IMessageBus _messageBus;
    // ...
  
    public void Deactivate(string reason)
    {
        for (l in _locations.Values())
        {
            l.Deactivate();
        }
   
        IsActive = false;
  
        var newEvent = new CampaignDeactivated(_id, reason);
        _events.Append(newEvent);
        _messageBus.Publish(newEvent);
    }
}