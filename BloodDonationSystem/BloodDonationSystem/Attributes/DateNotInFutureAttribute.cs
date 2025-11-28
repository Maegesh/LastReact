using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Attributes
{
    public class DateNotInFutureAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null) return true; // Allow null values
            
            if (value is DateTime dateTime)
            {
                return dateTime.Date <= DateTime.Now.Date;
            }
            
            return false;
        }
    }
}