using InventoryAPI.Models;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.IRepository;

namespace InventoryAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly JwtService _jwtService;

        public AuthController(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1️⃣ Find user
            var user = _userRepository.GetByUsername(request.Username);
            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            // 2️⃣ Verify password
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid username or password" });

            // 3️⃣ Generate JWT
            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful",
                userId = user.Id,
                username = user.Username,
                token
            });
        }
    }
}
