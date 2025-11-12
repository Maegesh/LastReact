using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class UserService
    {
        private readonly IUser _userRepo;

        public UserService(IUser userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsers()
        {
            var users = await _userRepo.GetAllUsers();
            return users.Select(MapToResponseDto);
        }

        public async Task<UserResponseDto> GetUserById(int id)
        {
            var user = await _userRepo.GetUserById(id);
            if (user == null)
                throw new KeyNotFoundException($"User with Id {id} not found");
            
            return MapToResponseDto(user);
        }

        public async Task<UserResponseDto> CreateUser(UserCreateDto userDto)
        {
            // Check if user already exists
            if (await _userRepo.UserExists(userDto.Email, userDto.Username))
                throw new InvalidOperationException("User with this email or username already exists");

            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Username = userDto.Username,
                Email = userDto.Email,
                Phone = userDto.Phone,
                PasswordHash = PasswordHasher.HashPassword(userDto.Password),
                Role = userDto.Role,
                CreatedAt = DateTime.Now
            };

            var created = await _userRepo.CreateUser(user);
            return MapToResponseDto(created);
        }

        public async Task<UserResponseDto> UpdateUser(int id, UserUpdateDto userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Phone = userDto.Phone,
                ProfileImageUrl = userDto.ProfileImageUrl
            };

            var updated = await _userRepo.UpdateUser(id, user);
            return MapToResponseDto(updated);
        }

        public async Task<UserResponseDto> DeleteUser(int id)
        {
            var deleted = await _userRepo.DeleteUser(id);
            return MapToResponseDto(deleted);
        }

        private UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                ProfileImageUrl = user.ProfileImageUrl,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDto> UploadProfileImage(int id, IFormFile imageFile)
        {
            // Generate unique filename
            var fileName = $"user_{id}_{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
            
          
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);
            var imageUrl = $"/uploads/profiles/{fileName}";

            // Save file to server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // Update user's ProfileImageUrl
            var updateDto = new UserUpdateDto { ProfileImageUrl = imageUrl };
            return await UpdateUser(id, updateDto);
        }

        public async Task<UserResponseDto> UploadProfileImageFromBytes(int id, ImageUploadDto imageData)
        {
            // Get file extension from original filename or file type
            var extension = Path.GetExtension(imageData.FileName);
            if (string.IsNullOrEmpty(extension))
            {
                extension = imageData.FileType switch
                {
                    "image/jpeg" => ".jpg",
                    "image/jpg" => ".jpg", 
                    "image/png" => ".png",
                    "image/gif" => ".gif",
                    _ => ".jpg"
                };
            }

            // Generate unique filename
            var fileName = $"user_{id}_{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);
            var imageUrl = $"/uploads/profiles/{fileName}";

            // Save byte array to file
            await File.WriteAllBytesAsync(filePath, imageData.ImageBytes);

            // Update user's ProfileImageUrl in database
            var updateDto = new UserUpdateDto { ProfileImageUrl = imageUrl };
            return await UpdateUser(id, updateDto);
        }


    }
}