import {
  getProfile,
  getCompletedItems,
  getUSGStatus,
  getHospitalBagItems,
  getCustomBagItems,
  getDoctorVisits,
  getDoctorQuestions,
  STORAGE_KEYS,
} from './storage';
import { formatDateID, calculateDueDate, getCurrentWeek, getTrimester } from './pregnancyCalc';

/**
 * Generate a printable HTML medical summary document and open the browser print dialog.
 */
export async function printMedicalSummary() {
  const profile = await getProfile();
  const visits = await getDoctorVisits();
  const bagItems = await getHospitalBagItems();
  const questions = await getDoctorQuestions();

  if (!profile) return;

  const currentWeek = profile.hpht ? getCurrentWeek(profile.hpht) : '-';
  const dueDate = profile.hpht ? calculateDueDate(profile.hpht) : '-';
  const trimester = profile.hpht ? getTrimester(currentWeek) : null;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap izinkan pop-up browser untuk mencetak ringkasan medis.');
    return;
  }

  const visitsRows = visits.length > 0
    ? visits
        .map(
          (v) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatDateID(v.date)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">Mg ${v.week}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${v.bloodPressure || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${v.motherWeight ? `${v.motherWeight} kg` : '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${v.babyWeight || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${v.doctorNotes || '-'}</td>
      </tr>
    `
        )
        .join('')
    : '<tr><td colspan="6" style="padding: 12px; text-align: center; color: #888;">Belum ada riwayat catatan kontrol</td></tr>';

  const questionsList = questions.length > 0
    ? questions
        .map(
          (q) => `
      <li style="margin-bottom: 6px;">
        <strong>[${q.isAnswered ? '✓ Terjawab' : 'Perlu Ditanyakan'}]</strong> ${q.text}
      </li>
    `
        )
        .join('')
    : '<p style="color: #888;">Tidak ada catatan pertanyaan.</p>';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Ringkasan Medis Kehamilan — Bumil Ceria</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #2D2926;
          padding: 24px;
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #D88EAA;
          padding-bottom: 12px;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .header h1 {
          margin: 0;
          color: #B8698A;
          font-size: 22px;
        }
        .header p {
          margin: 2px 0 0 0;
          color: #666;
          font-size: 12px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 18px;
        }
        .card {
          background: #FDF8F4;
          border: 1px solid #EDE8E3;
          border-radius: 8px;
          padding: 12px;
        }
        .card h3 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #5A8E92;
          font-size: 14px;
          border-bottom: 1px dashed #EDE8E3;
          padding-bottom: 4px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .row span { color: #666; }
        .row strong { color: #2D2926; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12px;
        }
        th {
          background: #7EAEB2;
          color: white;
          padding: 8px;
          border: 1px solid #5A8E92;
          text-align: left;
        }
        .footer {
          margin-top: 24px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          text-align: center;
          font-size: 11px;
          color: #999;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Bumil Ceria — Ringkasan Medis Kehamilan</h1>
          <p>Dokumen Portabel Pemantauan Kehamilan Calon Orang Tua</p>
        </div>
        <div style="text-align: right;">
          <p>Dicetak: ${formatDateID(new Date().toISOString().split('T')[0])}</p>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Identitas Calon Orang Tua</h3>
          <div class="row"><span>Nama Calon Mama:</span> <strong>${profile.mamaName}</strong></div>
          <div class="row"><span>Nama Calon Papa:</span> <strong>${profile.papaName}</strong></div>
          <div class="row"><span>Asuransi / Pembayaran:</span> <strong style="text-transform: uppercase;">${profile.insuranceType || 'BPJS'}</strong></div>
          <div class="row"><span>Faskes / Rumah Sakit:</span> <strong>${profile.hospitalName || 'Belum diisi'}</strong></div>
          <div class="row"><span>Dokter Kandungan / Bidan:</span> <strong>${profile.doctorName || 'Belum diisi'}</strong></div>
        </div>

        <div class="card">
          <h3>Data Gestasi & Kelahiran</h3>
          <div class="row"><span>Hari Pertama Haid Terakhir (HPHT):</span> <strong>${formatDateID(profile.hpht)}</strong></div>
          <div class="row"><span>Hari Perkiraan Lahir (HPL):</span> <strong style="color: #D88EAA; font-size: 14px;">${formatDateID(dueDate)}</strong></div>
          <div class="row"><span>Usia Kehamilan Saat Ini:</span> <strong>Minggu ke-${currentWeek}</strong></div>
          <div class="row"><span>Trimester:</span> <strong>${trimester?.label || '-'}</strong></div>
          <div class="row"><span>Barang Tas Bersalin Siap:</span> <strong>${bagItems.length} item dipacking</strong></div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #5A8E92; margin-bottom: 6px;">Riwayat Pemeriksaan & Kontrol Dokter</h3>
        <table>
          <thead>
            <tr>
              <th>Tanggal Periksa</th>
              <th style="text-align: center;">Usia</th>
              <th style="text-align: center;">Tensi (mmHg)</th>
              <th style="text-align: center;">BB Mama</th>
              <th style="text-align: center;">Janin / TFU</th>
              <th>Catatan & Resep Medis</th>
            </tr>
          </thead>
          <tbody>
            ${visitsRows}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style="color: #5A8E92; margin-bottom: 6px;">Daftar Catatan & Pertanyaan untuk Dokter</h3>
        <ul style="padding-left: 20px; font-size: 12px;">
          ${questionsList}
        </ul>
      </div>

      <div class="footer">
        Dokumen ini dihasilkan secara otomatis oleh Bumil Ceria • Aplikasi Pendamping Kehamilan Mama & Papa (Bandar Lampung)
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Export all Bumil Ceria localStorage data to a downloadable JSON file.
 */
export async function exportDataToJSON() {
  const exportData = {
    exportedAt: new Date().toISOString(),
    appVersion: 'Bumil Ceria v1.0',
    data: {},
  };

  Object.values(STORAGE_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        exportData.data[key] = JSON.parse(raw);
      } catch {
        exportData.data[key] = raw;
      }
    }
  });

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `bumpbuddy_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import and restore data from a JSON file.
 * @param {File} file
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function importDataFromJSON(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.data) {
          resolve({ success: false, message: 'Format file cadangan tidak valid.' });
          return;
        }

        Object.entries(parsed.data).forEach(([key, val]) => {
          if (typeof val === 'object') {
            localStorage.setItem(key, JSON.stringify(val));
          } else {
            localStorage.setItem(key, String(val));
          }
        });

        resolve({ success: true, message: 'Semua data berhasil dipulihkan!' });
      } catch (err) {
        resolve({ success: false, message: `Gagal membaca file: ${err.message}` });
      }
    };
    reader.onerror = () => resolve({ success: false, message: 'Gagal membuka file.' });
    reader.readAsText(file);
  });
}
