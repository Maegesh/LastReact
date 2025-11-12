using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IToken
    {
        string GenerateToken(User user);
    }
}