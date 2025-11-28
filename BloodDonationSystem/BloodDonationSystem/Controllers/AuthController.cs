using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using BloodDonationSystem.Services;
using BloodDonationSystem.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BloodContext _context;
        private readonly IToken _tokenService;
        private readonly DonorProfileService _donorService;
        private readonly RecipientProfileService _recipientService;

        public AuthController(BloodContext context, IToken tokenService, DonorProfileService donorService, RecipientProfileService recipientService)
        {
            _context = context;
            _tokenService = tokenService;
            _donorService = donorService;
            _recipientService = recipientService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Invalid input data." });

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null)
                return Ok(new { Success = false, Message = "Invalid email or password." });

            // Try both hashed and plain text password verification
            bool isValidPassword = false;
            
            // Try hashed password verification
            try
            {
                isValidPassword = PasswordHasher.VerifyPassword(login.Password, user.PasswordHash);
            }
            catch { }
            
            // If hashed verification failed, try plain text comparison
            if (!isValidPassword)
            {
                isValidPassword = (login.Password == user.PasswordHash);
            }

            if (!isValidPassword)
                return Ok(new { Success = false, Message = "Invalid email or password." });

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                Success = true,
                Token = token,
                User = new { 
                    user.Id, 
                    user.Email, 
                    user.Role, 
                    user.FirstName, 
                    user.LastName,
                    user.Username,
                    user.Phone,
                    user.ProfileImageUrl
                }
            });
        }

        [HttpPost("signup/donor")]
        public async Task<IActionResult> SignupDonor([FromBody] DonorProfileCreateDto donorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email == donorDto.Email))
                    return BadRequest("User with this email already exists");

                // Create donor profile (this will create both User and DonorProfile)
                var donorResponse = await _donorService.CreateDonor(donorDto);

                return Ok(new
                {
                    Message = "Donor registered successfully. Please login to continue.",
                    DonorId = donorResponse.Id,
                    Email = donorDto.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("signup/recipient")]
        public async Task<IActionResult> SignupRecipient([FromBody] RecipientSignupDto recipientDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email == recipientDto.Email))
                    return BadRequest("User with this email already exists");

                // Create recipient profile (this will create both User and RecipientProfile)
                var recipientResponse = await _recipientService.SignupRecipient(recipientDto);

                return Ok(new
                {
                    Message = "Recipient registered successfully. Please login to continue.",
                    RecipientId = recipientResponse.Id,
                    Email = recipientDto.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

}
