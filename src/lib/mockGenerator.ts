import * as XLSX from "xlsx";

export const generateMockData = () => {
  const randomId = Math.floor(Math.random() * 10000);
  const fileName = `Mock-Teste_${randomId}.xlsx`;
  
  // Generate 10-20 random studies
  const studyCount = Math.floor(Math.random() * 11) + 10;
  const mockData = [];
  
  for (let i = 1; i <= studyCount; i++) {
    // Generate realistic medical test data
    const tp = Math.floor(Math.random() * 50) + 10; // True positives: 10-59
    const fn = Math.floor(Math.random() * 20) + 1;  // False negatives: 1-20
    const tn = Math.floor(Math.random() * 80) + 20; // True negatives: 20-99
    const fp = Math.floor(Math.random() * 15) + 1;  // False positives: 1-15
    
    mockData.push({
      id: `study_${i}`,
      tp,
      fp,
      tn,
      fn
    });
  }
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(mockData);
  XLSX.utils.book_append_sheet(wb, ws, "Studies");
  
  // Generate and download file
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};