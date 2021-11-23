public class LogVisit
{
    // ...

    public void Execute(Guid userId, DataTime visitedOn)
    {
        _db.Execute(“UPDATE Users SET last_visit=@p1 WHERE user_id=@p2”,
                   visitedOn,userId);
        _messageBus.Publish(“VISITS_TOPIC”,
                           new { UserId = userId, VisitDate = visitedOn });
    }
}