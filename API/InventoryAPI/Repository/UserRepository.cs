using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Repository;
using Microsoft.EntityFrameworkCore;
using InventoryAPI.IRepository;

namespace InventoryAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        public User GetByUsername(string username)
        {
            return _db.Users.FirstOrDefault(u => u.Username == username);
        }


    }
}
