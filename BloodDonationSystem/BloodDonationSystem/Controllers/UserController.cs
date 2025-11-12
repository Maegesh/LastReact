using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var user = await _userService.GetUserById(id);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] UserCreateDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _userService.CreateUser(userDto);
                return CreatedAtAction(nameof(GetUserById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _userService.UpdateUser(id, userDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<UserResponseDto>> DeleteUser(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var deleted = await _userService.DeleteUser(id);
                return Ok(deleted);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("{id}/upload-image")]
        public async Task<ActionResult<UserResponseDto>> UploadProfileImage(int id, IFormFile imageFile)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                if (imageFile == null || imageFile.Length == 0)
                    return BadRequest(new { message = "No image file provided" });

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(imageFile.ContentType.ToLower()))
                    return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, and GIF are allowed" });

                // Validate file size (5MB max)
                if (imageFile.Length > 5 * 1024 * 1024)
                    return BadRequest(new { message = "File size cannot exceed 5MB" });

                var updated = await _userService.UploadProfileImage(id, imageFile);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal end server error", details = ex.Message });
            }
        }

        [HttpPost("{id}/upload-image-bytes")]
        public async Task<ActionResult<UserResponseDto>> UploadProfileImageBytes(int id, [FromBody] ImageUploadDto imageData)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                if (imageData == null || imageData.ImageBytes == null || imageData.ImageBytes.Length == 0)
                    return BadRequest(new { message = "No image data provided" });

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(imageData.FileType.ToLower()))
                    return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, and GIF are allowed" });

                // Validate file size (5MB max)
                if (imageData.FileSize > 5 * 1024 * 1024)
                    return BadRequest(new { message = "File size cannot exceed 5MB" });

                var updated = await _userService.UploadProfileImageFromBytes(id, imageData);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
