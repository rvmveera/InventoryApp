import React, { useEffect, useState } from "react";
import "../css/vendorgrid.css";

function VendorGrid() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
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

    fetchVendors();
  }, []);

  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className="vendor-grid">
      <h2>Vendor List</h2>
      <table>
        <thead>
          <tr>
            
            <th>Vendor Name</th>
            <th>Address 1</th>
            <th>Address 2</th>
            <th>Address 3</th>
            <th>GST Number</th>
            <th>Contact No 1</th>
            <th>Contact No 2</th>
            
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendorId}>
              
              <td>{v.vendorName}</td>
              <td>{v.address1}</td>
              <td>{v.address2}</td>
              <td>{v.address3}</td>
              <td>{v.gstNumber}</td>
              <td>{v.contactNo1}</td>
              <td>{v.contactNo2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorGrid;