function ExportButton({ contacts }) {
  function exportCSV() {
    // First row of the CSV file
    let csv = "Name,Address\n";

    // Add each contact to the CSV
    contacts.forEach((contact) => {
      let name = contact.name.replaceAll('"', '""');
      let address = contact.address.replaceAll('"', '""');

      // Prevent Excel from interpreting text as a formula
      if (["=", "+", "-", "@"].includes(name.trimStart()[0])) {
        name = "'" + name;
      }

      if (["=", "+", "-", "@"].includes(address.trimStart()[0])) {
        address = "'" + address;
      }

      csv += `"${name}","${address}"\n`;
    });

    // Create the CSV file
    const file = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    // Download the file
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "contacts.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button className="btn btn-outline-primary" onClick={exportCSV}>
      Export CSV
    </button>
  );
}

export default ExportButton;
