class Person
{
    public readonly PersonId Id;
    public Name Name { get; set; }
    
    public Person(PersonId id, Name name)
    {
        this.Id = id;
        this.Name = name;
    }
}