// Set 2 tanggal otomatis ke hari ini saat web dibuka
document.getElementById('in_tanggal1').valueAsDate = new Date();
document.getElementById('in_tanggal2').valueAsDate = new Date();

// Fungsi Format Uang Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// Fungsi Angka ke Huruf (Terbilang)
function terbilang(angka) {
    let huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let hasil = "";
    if (angka < 12) hasil = huruf[angka];
    else if (angka < 20) hasil = terbilang(angka - 10) + " Belas";
    else if (angka < 100) hasil = terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
    else if (angka < 200) hasil = "Seratus " + terbilang(angka - 100);
    else if (angka < 1000) hasil = terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
    else if (angka < 2000) hasil = "Seribu " + terbilang(angka - 1000);
    else if (angka < 1000000) hasil = terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
    else if (angka < 1000000000) hasil = terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
    return hasil.trim();
}

// Fungsi Ubah Format Tanggal (Misal: 11 Juni 2026)
function formatTanggalText(dateString) {
    const date = new Date(dateString);
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

// Fungsi Cari Nama Hari dari Tanggal
function getHari(dateString) {
    const date = new Date(dateString);
    const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return namaHari[date.getDay()];
}

// Fungsi Ejaan Tanggal Lengkap (Huruf)
function formatTanggalEjaan(dateString) {
    const date = new Date(dateString);
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const tglHuruf = terbilang(date.getDate());
    const blnHuruf = bulan[date.getMonth()];
    const thnHuruf = terbilang(date.getFullYear());

    return `Tanggal ${tglHuruf} Bulan ${blnHuruf} Tahun ${thnHuruf}`;
}

// Fungsi Tambah Baris Belanja
function tambahBaris() {
    const tbody = document.getElementById('tbodyBarang');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="form-control in_jenis" required></td>
        <td><input type="number" class="form-control in_jumlah" value="1" min="1" oninput="hitungTabel()" required></td>
        <td><input type="text" class="form-control in_satuan" required></td>
        <td><input type="number" class="form-control in_harga" value="0" min="0" oninput="hitungTabel()" required></td>
        <td><input type="text" class="form-control in_subtotal" value="0" readonly></td>
        <td><button type="button" class="btn btn-danger btn-sm" onclick="hapusBaris(this)">X</button></td>
    `;
    tbody.appendChild(tr);
    hitungTabel();
}

// Fungsi Hapus Baris Belanja
function hapusBaris(btn) {
    const row = btn.parentNode.parentNode;
    if (document.getElementById('tbodyBarang').rows.length > 1) {
        row.parentNode.removeChild(row);
        hitungTabel();
    } else {
        alert("Minimal harus ada 1 barang belanja.");
    }
}

// Fungsi Kalkulasi Sub-Total dan Grand Total
let grandTotal = 0;
function hitungTabel() {
    grandTotal = 0;
    const rows = document.querySelectorAll('#tbodyBarang tr');
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.in_jumlah').value) || 0;
        const harga = parseFloat(row.querySelector('.in_harga').value) || 0;
        const subtotal = qty * harga;
        row.querySelector('.in_subtotal').value = formatRupiah(subtotal);
        grandTotal += subtotal;
    });
    document.getElementById('teksTotalForm').innerText = formatRupiah(grandTotal);
}

// AKSI SAAT TOMBOL CETAK DITEKAN
document.getElementById('formSurat').addEventListener('submit', function (e) {
    e.preventDefault();

    // Cek Keamanan (Validasi Form Kosong)
    if (!this.checkValidity()) {
        alert('Mohon isi semua data yang kosong pada form sebelum mencetak.');
        return;
    }

    // Tarik 2 Data Tanggal
    const tgl1Ori = document.getElementById('in_tanggal1').value;
    const tgl1Text = formatTanggalText(tgl1Ori);

    const tgl2Ori = document.getElementById('in_tanggal2').value;
    const tgl2Text = formatTanggalText(tgl2Ori);
    const hariBA = getHari(tgl2Ori);

    const hurufTerbilang = terbilang(grandTotal);
    const perihalVal = document.getElementById('in_perihal').value;
    const nomorSuratVal = document.getElementById('in_nomorSurat').value;

    // Suntik Halaman 1 (Nota Ajuan)
    document.getElementById('out1_kepada').innerText = document.getElementById('in_kepada').value;
    document.getElementById('out1_dari').innerText = document.getElementById('in_dari').value;
    document.getElementById('out1_tanggal').innerText = tgl1Text;
    document.getElementById('out1_perihal').innerText = perihalVal;
    document.getElementById('out1_dinamisPerihal').innerText = perihalVal;
    document.getElementById('out1_norek').innerText = document.getElementById('in_norek').value;
    document.getElementById('out1_namaPptk').innerText = document.getElementById('in_namaPptk').value.toUpperCase();
    document.getElementById('out1_nipPptk').innerText = document.getElementById('in_nipPptk').value;
    document.getElementById('out1_terbilang').innerText = hurufTerbilang;

    // Suntik Halaman 2 (Surat Pesanan)
    document.getElementById('out2_nomor').innerText = nomorSuratVal;
    document.getElementById('out2_toko').innerText = document.getElementById('in_toko').value.toUpperCase();
    document.getElementById('out2_alamat').innerText = document.getElementById('in_alamatToko').value;
    document.getElementById('out2_tanggal').innerText = tgl1Text;
    document.getElementById('out2_namaPengadaan').innerText = document.getElementById('in_namaPengadaan').value.toUpperCase();
    document.getElementById('out2_nipPengadaan').innerText = document.getElementById('in_nipPengadaan').value;

    // Suntik Halaman 3 (Berita Acara Pengambilan)
    document.getElementById('out3_nomor').innerText = nomorSuratVal;
    document.getElementById('out3_nomorRef').innerText = nomorSuratVal;
    document.getElementById('out3_tanggalEjaan').innerText = "Pada hari ini, " + hariBA + ", " + formatTanggalEjaan(tgl2Ori);
    document.getElementById('out3_namaPengurus').innerText = document.getElementById('in_namaPengurus').value.toUpperCase();
    document.getElementById('out3_nipPengurus').innerText = document.getElementById('in_nipPengurus').value;
    document.getElementById('out3_namaPengurusTTD').innerText = document.getElementById('in_namaPengurus').value.toUpperCase();
    document.getElementById('out3_nipPengurusTTD').innerText = document.getElementById('in_nipPengurus').value;
    document.getElementById('out3_namaPpk').innerText = document.getElementById('in_namaPpk').value.toUpperCase();
    document.getElementById('out3_nipPpk').innerText = document.getElementById('in_nipPpk').value;
    document.getElementById('out3_terbilang').innerText = hurufTerbilang;
    document.getElementById('out3_tanggalToko').innerText = tgl1Text;
    document.getElementById('out3_toko').innerText = document.getElementById('in_toko').value.toUpperCase();

    // Suntik Halaman 4 (Berita Acara Serah Terima)
    document.getElementById('out4_nomor').innerText = nomorSuratVal;
    document.getElementById('out4_nomorRef').innerText = nomorSuratVal;
    document.getElementById('out4_tanggalEjaan').innerText = "Pada hari ini, " + hariBA + ", " + formatTanggalEjaan(tgl2Ori);
    document.getElementById('out4_namaPpk').innerText = document.getElementById('in_namaPpk').value.toUpperCase();
    document.getElementById('out4_nipPpk').innerText = document.getElementById('in_nipPpk').value;
    document.getElementById('out4_namaPpkTTD').innerText = document.getElementById('in_namaPpk').value.toUpperCase();
    document.getElementById('out4_nipPpkTTD').innerText = document.getElementById('in_nipPpk').value;
    document.getElementById('out4_toko').innerText = document.getElementById('in_toko').value.toUpperCase();
    document.getElementById('out4_tokoTTD').innerText = document.getElementById('in_toko').value.toUpperCase();
    document.getElementById('out4_terbilang').innerText = hurufTerbilang;
    document.getElementById('out4_tanggalToko').innerText = tgl1Text;

    // Logika Nama Perwakilan Penyedia (Ada Nama vs Titik-titik)
    let valPenyedia = document.getElementById('in_namaPenyedia').value.trim();
    let elPenyediaTTD = document.getElementById('out4_namaPenyediaTTD');
    if (valPenyedia === "") {
        elPenyediaTTD.innerText = "(......................................)";
        elPenyediaTTD.style.textDecoration = "none";
    } else {
        elPenyediaTTD.innerText = valPenyedia.toUpperCase();
        elPenyediaTTD.style.textDecoration = "underline";
    }

    // Suntik Tabel Hasil Cetak ke 4 Surat
    let tabelCetakHTML = `
        <table class="tabel-data" style="text-align:center; width:100%;">
            <tr style="background-color:#f2f2f2; font-weight:bold;">
                <td width="5%">NO</td>
                <td width="30%">JENIS BARANG</td>
                <td width="10%">JUM. BRG</td>
                <td width="15%">SATUAN</td>
                <td width="20%">HARGA</td>
                <td width="20%">JUMLAH</td>
            </tr>
    `;
    const rows = document.querySelectorAll('#tbodyBarang tr');
    let no = 1;
    rows.forEach(row => {
        const jenis = row.querySelector('.in_jenis').value;
        const jumlah = row.querySelector('.in_jumlah').value;
        const satuan = row.querySelector('.in_satuan').value;
        const harga = formatRupiah(row.querySelector('.in_harga').value);
        const subtotal = row.querySelector('.in_subtotal').value;

        tabelCetakHTML += `
            <tr>
                <td>${no++}</td>
                <td style="text-align:left;">${jenis}</td>
                <td>${jumlah}</td>
                <td>${satuan}</td>
                <td>${harga}</td>
                <td>${subtotal}</td>
            </tr>
        `;
    });
    tabelCetakHTML += `
            <tr style="font-weight:bold;">
                <td colspan="5" style="text-align:right; padding-right:10px;">TOTAL</td>
                <td>${formatRupiah(grandTotal)}</td>
            </tr>
        </table>
    `;

    document.getElementById('tabelCetak1').innerHTML = tabelCetakHTML;
    document.getElementById('tabelCetak2').innerHTML = tabelCetakHTML;
    document.getElementById('tabelCetak3').innerHTML = tabelCetakHTML;
    document.getElementById('tabelCetak4').innerHTML = tabelCetakHTML;

    // Buka Jendela Print untuk Simpan PDF
    window.print();
});