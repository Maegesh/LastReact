using System.Security.Cryptography;
using System.Text;

namespace BloodDonationSystem.Services
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            // Generate a random salt
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash password with salt
            using (var sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] saltedPassword = new byte[passwordBytes.Length + salt.Length];
                
                Array.Copy(passwordBytes, 0, saltedPassword, 0, passwordBytes.Length);
                Array.Copy(salt, 0, saltedPassword, passwordBytes.Length, salt.Length);
                
                byte[] hashedBytes = sha256.ComputeHash(saltedPassword);
                
                // Combine salt + hash for storage
                byte[] result = new byte[salt.Length + hashedBytes.Length];
                Array.Copy(salt, 0, result, 0, salt.Length);
                Array.Copy(hashedBytes, 0, result, salt.Length, hashedBytes.Length);
                
                return Convert.ToBase64String(result);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                byte[] storedBytes = Convert.FromBase64String(hashedPassword);
                
                // Extract salt (first 16 bytes)
                byte[] salt = new byte[16];
                Array.Copy(storedBytes, 0, salt, 0, 16);
                
                // Hash the input password with the same salt
                using (var sha256 = SHA256.Create())
                {
                    byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                    byte[] saltedPassword = new byte[passwordBytes.Length + salt.Length];
                    
                    Array.Copy(passwordBytes, 0, saltedPassword, 0, passwordBytes.Length);
                    Array.Copy(salt, 0, saltedPassword, passwordBytes.Length, salt.Length);
                    
                    byte[] hashedBytes = sha256.ComputeHash(saltedPassword);
                    
                    // Compare with stored hash (skip first 16 bytes which are salt)
                    for (int i = 0; i < hashedBytes.Length; i++)
                    {
                        if (hashedBytes[i] != storedBytes[i + 16])
                            return false;
                    }
                    
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}