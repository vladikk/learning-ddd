public class ClassA
{
    public int A { get; set; }
    public int B { get; set; }
    public int C { get; set; }
    public int D { get; set; }
    public int E { get; set; }
}

public class ClassB
{
    private int _a, _d;

    public int A
    {
        get => _a;
        set
        {
            _a = value;
            B = value / 2;
            C = value / 3;
        }
    }

    public int B { get; private set; }
    
    public int C { get; private set; }
    
    public int D
    {
        get => _d;
        set
        {
            _d = value;
            E = value * 2
        }
    }

    public int E { get; private set; }
}