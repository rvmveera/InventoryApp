using InventoryAPI.Models;

namespace InventoryAPI.IRepository
{
    public interface IUserRepository
    {
        User GetByUsername(string username);
    }
}


