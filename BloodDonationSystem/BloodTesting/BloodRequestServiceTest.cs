using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using BloodDonationSystem.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace BloodTesting
{
    public class BloodRequestServiceTest
    {
        private readonly Mock<IBloodRequest> _mockRepo;
        private readonly Mock<BloodContext> _mockContext;
        private readonly BloodRequestService _bloodRequestService;

        public BloodRequestServiceTest()
        {
            _mockRepo = new Mock<IBloodRequest>();
            var options = new DbContextOptionsBuilder<BloodContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _mockContext = new Mock<BloodContext>(options);
            _bloodRequestService = new BloodRequestService(_mockRepo.Object, _mockContext.Object);
        }

        [Fact]
        public async Task GetAllBloodRequests_ReturnsAllRequests()
        {
            var requests = new List<BloodRequest>
            {
                new BloodRequest { Id = 1, BloodGroupNeeded = "A+", Quantity = 2, Status = "Pending" },
                new BloodRequest { Id = 2, BloodGroupNeeded = "B+", Quantity = 1, Status = "Approved" }
            };
            _mockRepo.Setup(repo => repo.GetAllBloodRequests()).ReturnsAsync(requests);

            var result = await _bloodRequestService.GetAllBloodRequests();

            Assert.Equal(2, result.Count());
            Assert.Equal("A+", result.First().BloodGroupNeeded);
        }

        [Fact]
        public async Task GetBloodRequestById_ExistingId_ReturnsRequest()
        {
            var request = new BloodRequest { Id = 1, BloodGroupNeeded = "A+", Quantity = 2, Status = "Pending" };
            _mockRepo.Setup(repo => repo.GetBloodRequestById(1)).ReturnsAsync(request);

            var result = await _bloodRequestService.GetBloodRequestById(1);

            Assert.NotNull(result);
            Assert.Equal("A+", result.BloodGroupNeeded);
        }

        [Fact]
        public async Task GetPendingBloodRequests_ReturnsPendingRequests()
        {
            var pendingRequests = new List<BloodRequest>
            {
                new BloodRequest { Id = 1, BloodGroupNeeded = "A+", Quantity = 2, Status = "Pending" },
                new BloodRequest { Id = 2, BloodGroupNeeded = "O-", Quantity = 1, Status = "Pending" }
            };
            _mockRepo.Setup(repo => repo.GetPendingBloodRequests()).ReturnsAsync(pendingRequests);

            var result = await _bloodRequestService.GetPendingBloodRequests();

            Assert.Equal(2, result.Count());
            Assert.All(result, r => Assert.Equal("Pending", r.Status));
        }
    }
}