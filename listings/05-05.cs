public class LogVisit
{
    // ...
 
    public void Execute(Guid userId)
    {
        _db.Execute(“UPDATE Users SET visits=visits+1 WHERE user_id=@p1”,
                    userId);
    }
}