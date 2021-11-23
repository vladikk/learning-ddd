public class LogVisit
{
    // ...
    
    public void Execute(Guid userId, long visits)
    {
        _db.Execute(“UPDATE Users SET visits = @p1 WHERE user_id=@p2”,
                   visits, userId);
    }
}