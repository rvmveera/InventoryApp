import React, { useEffect, useState } from "react";
import "../css/vendorgrid.css";

function VendorGrid({ refreshTrigger }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null); // ✅ track vendor for popup
const [groupTypes, setGroupTypes] = useState([]);     
const [newGroupType, setNewGroupType] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:5001/api/Vendors");
        if (response.ok) {
          const data = await response.json();
          setVendors(data);
        } else {
          console.error("Failed to fetch vendors");
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (refreshTrigger) {
      fetchVendors();
    }
  }, [refreshTrigger]);

  const handleEdit = (vendor) => {
    alert(`Edit vendor: ${vendor.vendorName}`);
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await fetch(`https://localhost:5001/api/Vendors/${vendorId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVendors(vendors.filter((v) => v.vendorId !== vendorId));
        alert("Vendor deleted successfully!");
      } else {
        alert("Failed to delete vendor.");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleDetails = (vendor) => {
    setSelectedVendor(vendor); // ✅ open popup with vendor details
  };

  const closePopup = () => {
    setSelectedVendor(null);
  };

   const handleAddGroupType = () => {
    if (!newGroupType.trim()) return;
    setGroupTypes([...groupTypes, newGroupType]);
    setNewGroupType("");
  };


  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className="vendor-grid">
      <h2>Vendor List</h2>
      <table>
<tr>
  <td valign="top" width="50%">

<table>
    
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Address 1</th>
            <th>Contact No 1</th>
            <th>Contact No 2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendorId}>
              <td>{v.vendorName}</td>
              <td>{v.address1}</td>
              <td>{v.contactNo1}</td>
              <td>{v.contactNo2}</td>
              <td>
                <button onClick={() => handleEdit(v)}>Edit</button>
                <button onClick={() => handleDelete(v.vendorId)}>Delete</button>
                <button onClick={() => handleDetails(v)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
  </td>

<td>

  <table valign="top">

<tr>
<td width="50%" valign="top">
{/* ✅ Popup Modal */}
      {selectedVendor && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Vendor Details</h3>
            <p><strong>Name:</strong> {selectedVendor.vendorName}</p>
            <p><strong>Address 1:</strong> {selectedVendor.address1}</p>
            <p><strong>Address 2:</strong> {selectedVendor.address2}</p>
            <p><strong>Address 3:</strong> {selectedVendor.address3}</p>
            <p><strong>GST Number:</strong> {selectedVendor.gstNumber}</p>
            <p><strong>Contact No 1:</strong> {selectedVendor.contactNo1}</p>
            <p><strong>Contact No 2:</strong> {selectedVendor.contactNo2}</p>
            {/* Add more fields if needed */}
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

</td>
<td valign="top">
 {/* ✅ Group Type Section */}
            <div className="group-type">
              <h3>Group Type</h3>
              <input
                type="text"
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value)}
                placeholder="Enter group type"
              />
              <button onClick={handleAddGroupType}>Add</button>

              <ul>
                {groupTypes.map((gt, index) => (
                  <li key={index}>{gt}</li>
                ))}
              </ul>
            </div>


</td>
</tr>
  </table>

 

</td>

</tr>
</table>

     
    </div>
  );
}

export default VendorGrid;