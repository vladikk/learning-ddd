public class LogVisit
{
    // ...

    public void Execute(Guid userId, DataTime visitedOn)
    {
        try
        {
            _db.StartTransaction();

            _db.Execute(@“UPDATE Users SET last_visit=@p1
                       WHERE user_id=@p2”,
                       visitedOn, userId);

            _db.Execute(@“INSERT INTO VisitsLog(user_id, visit_date)
                       VALUES(@p1, @p2)”,
                       userId, visitedOn);

            _db.Commit();
        } catch {
            _db.Rollback();
            throw;
        }
    }
}