using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using BloodDonationSystem.Services;
using Moq;

namespace BloodTesting
{
    public class DonorProfileServiceTest
    {
        private readonly Mock<IDonorProfile> _mockRepo;
        private readonly DonorProfileService _donorService;

        public DonorProfileServiceTest()
        {
            _mockRepo = new Mock<IDonorProfile>();
            _donorService = new DonorProfileService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllDonors_ReturnsAllDonors()
        {
            var donors = new List<DonorProfile>
            {
                new DonorProfile { Id = 1, BloodGroup = "A+", Age = 25, Gender = "Male", EligibilityStatus = true },
                new DonorProfile { Id = 2, BloodGroup = "B+", Age = 30, Gender = "Female", EligibilityStatus = true }
            };
            _mockRepo.Setup(repo => repo.GetAllDonors()).ReturnsAsync(donors);

            var result = await _donorService.GetAllDonors();

            Assert.Equal(2, result.Count);
            Assert.Equal("A+", result.First().BloodGroup);
        }

        [Fact]
        public async Task GetDonorById_ExistingId_ReturnsDonor()
        {
            var donor = new DonorProfile { Id = 1, BloodGroup = "A+", Age = 25, Gender = "Male", EligibilityStatus = true };
            _mockRepo.Setup(repo => repo.GetDonorById(1)).ReturnsAsync(donor);

            var result = await _donorService.GetDonorById(1);

            Assert.NotNull(result);
            Assert.Equal("A+", result.BloodGroup);
        }

        [Fact]
        public async Task GetDonorById_NonExistingId_ThrowsException()
        {
            _mockRepo.Setup(repo => repo.GetDonorById(999)).ReturnsAsync((DonorProfile)null);

            var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() => _donorService.GetDonorById(999));
            Assert.Equal("Donor with Id 999 not found", ex.Message);
        }

        [Fact]
        public async Task CreateDonor_ValidDonor_ReturnsDonor()
        {
            var donorDto = new DonorProfileCreateDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                ContactNumber = "1234567890",
                Password = "password123",
                BloodGroup = "A+",
                Age = 25,
                Gender = "Male"
            };

            var user = new User { Id = 1, FirstName = "John", LastName = "Doe" };
            var donor = new DonorProfile { Id = 1, UserId = 1, BloodGroup = "A+", Age = 25, Gender = "Male", EligibilityStatus = true };

            _mockRepo.Setup(repo => repo.CreateUser(It.IsAny<User>())).ReturnsAsync(user);
            _mockRepo.Setup(repo => repo.CreateDonor(It.IsAny<DonorProfile>())).ReturnsAsync(donor);

            var result = await _donorService.CreateDonor(donorDto);

            Assert.NotNull(result);
            Assert.Equal("A+", result.BloodGroup);
        }
    }
}