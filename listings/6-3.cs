class Person
{
    private PersonId     _id;
    private Name         _name;
    private PhoneNumber  _landline;
    private PhoneNumber  _mobile;
    private EmailAddress _email;
    private Height       _height;
    private CountryCode  _country;

    public Person(...) { ... }
}

static void Main(string[] args)
{
    var dave = new Person(
        id:       new PersonId(30217),
        name:     new Name("Dave", "Ancelovici"),
        landline: PhoneNumber.Parse("023745001"),
        mobile:   PhoneNumber.Parse("0873712503"),
        email:    Email.Parse("dave@learning-ddd.com"),
        height:   Height.FromMetric(180),
        country:  CountryCode.Parse("BG"));
}