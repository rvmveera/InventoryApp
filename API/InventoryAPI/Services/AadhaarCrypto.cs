using InventoryAPI.Services;
using System.Security.Cryptography;
using System.Text;

public class AadhaarCrypto : IAadhaarCrypto
{
    private readonly byte[] _key;

    public AadhaarCrypto(IConfiguration config)
    {
        // Ensure your key string is exactly 32 characters for AES-256
        var keyString = config["Crypto:AadhaarKey"]!;
        var keyBytes = Encoding.UTF8.GetBytes(keyString);

        if (keyBytes.Length != 16 && keyBytes.Length != 24 && keyBytes.Length != 32)
            throw new ArgumentException("Key must be 16, 24, or 32 bytes long.");

        _key = keyBytes;
    }

    public string Encrypt(string aadhaar)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        var plainBytes = Encoding.UTF8.GetBytes(aadhaar);
        var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        // Store IV + ciphertext together
        var combined = aes.IV.Concat(cipherBytes).ToArray();
        return Convert.ToBase64String(combined);
    }

    public string Decrypt(string encrypted)
    {
        var fullCipher = Convert.FromBase64String(encrypted);
        var iv = fullCipher.Take(16).ToArray();
        var cipher = fullCipher.Skip(16).ToArray();

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        var decryptedBytes = decryptor.TransformFinalBlock(cipher, 0, cipher.Length);

        return Encoding.UTF8.GetString(decryptedBytes);
    }
}