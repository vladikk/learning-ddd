public class LogVisit
{
    // ...

    public void Execute(Guid userId, long expectedVisits)
    {
        _db.Execute(@“UPDATE Users SET visits=visits+1
                      WHERE user_id=@p1 and visits = @p2”,
                      userId, visits);
    }
}