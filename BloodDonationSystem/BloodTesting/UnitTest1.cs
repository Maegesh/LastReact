using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using BloodDonationSystem.Services;
using Moq;

namespace BloodTesting
{
    public class BloodBankServiceTest
    {
        private readonly Mock<IBloodBank> _mockRepo;
        private readonly BloodBankService _bloodBankService;

        public BloodBankServiceTest()
        {
            _mockRepo = new Mock<IBloodBank>();
            _bloodBankService = new BloodBankService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllBloodBanks_ReturnsAllBloodBanks()
        {
            var bloodBanks = new List<BloodBank>
            {
                new BloodBank { Id = 1, Name = "City Blood Bank", Location = "Downtown", Capacity = 1000 },
                new BloodBank { Id = 2, Name = "General Hospital", Location = "Uptown", Capacity = 500 }
            };
            _mockRepo.Setup(repo => repo.GetAllBloodBanks()).ReturnsAsync(bloodBanks);

            var result = await _bloodBankService.GetAllBloodBanks();

            Assert.Equal(2, result.Count());
            Assert.Equal("City Blood Bank", result.First().Name);
        }

        [Fact]
        public async Task GetBloodBankById_ExistingId_ReturnsBloodBank()
        {
            var bloodBank = new BloodBank { Id = 1, Name = "City Blood Bank", Location = "Downtown", Capacity = 1000 };
            _mockRepo.Setup(repo => repo.GetBloodBankById(1)).ReturnsAsync(bloodBank);

            var result = await _bloodBankService.GetBloodBankById(1);

            Assert.NotNull(result);
            Assert.Equal("City Blood Bank", result.Name);
        }
    }
}