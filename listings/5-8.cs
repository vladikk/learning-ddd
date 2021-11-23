public class CreateUser
{
    // ...

    public void Execute(userDetails)
    {
        try
        {
            _db.StartTransaction();

            var user = new User();
            user.Name = userDetails.Name;
            user.Email = userDetails.Email;
            user.Save();

            _db.Commit();
        } catch {
            _db.Rollback();
            throw;
        }
    }
}