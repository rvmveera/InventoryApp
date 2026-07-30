namespace InventoryAPI.Services
{
    public interface IAadhaarCrypto
    {
        string Encrypt(string aadhaar);
        string Decrypt(string encrypted);
    }
}