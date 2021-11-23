var heightMetric = Height.Metric(180);
var heightImperial = Height.Imperial(5, 3);

var string1 = heightMetric.ToString();             // "180cm"
var string2 = heightImperial.ToString();           // "5 feet 3 inches"
var string3 = height1.ToImperial().ToString();     // "5 feet 11 inches"

var firstIsHigher = heightMetric > heightImperial; // true

var phone = PhoneNumber.Parse("+359877123503");
var country = phone.Country;                        // "BG"
var phoneType = phone.PhoneType;                    // "MOBILE"
var isValid = PhoneNumber.IsValid("+972120266680"); // false

var red = Color.FromRGB(255, 0, 0);
var green = Color.Green;
var yellow = red.MixWith(green);
var yellowString = yellow.ToString();               // "#FFFF00"