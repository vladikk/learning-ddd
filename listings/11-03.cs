public class Player
{
    public Guid Id { get; private set; }
    public int Points { get; private set; }

    public void ApplyBonus(int percentage)
    {
        this.Points *= 1 + percentage/100.0;
    }
}

public class ApplyBonus
{
    // ...

    public void Execute(Guid playerId, int percentage)
    {
        var player = _repository.Load(playerId);
        player.ApplyBonus(percentage);
        _repository.Save(player);
    }
}