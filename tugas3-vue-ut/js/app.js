// File: /js/app.js

// Daftarkan filter global untuk format mata uang sesuai permintaan soal
Vue.filter('currency', function (value) {
    if (!value) return 'Rp 0';
    return 'Rp ' + parseFloat(value).toLocaleString('id-ID');
});

// Daftarkan filter untuk satuan buah
Vue.filter('satuan', function (value) {
    return value + ' buah';
});

// Inisialisasi Root Vue
new Vue({
    el: '#app',
    data: {
        tab: 'stok', // Tab default yang aktif
        // State global untuk menampung isi dataBahanAjar.json
        state: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: []
        }
    },
    created() {
        // Panggil fungsi untuk memuat data saat aplikasi pertama kali dibuat
        this.loadData();
    },
    methods: {
        async loadData() {
            const data = await ApiService.fetchBahanAjar();
            if (data) {
                // Masukkan seluruh data JSON ke dalam state
                this.state.upbjjList = data.upbjjList;
                this.state.kategoriList = data.kategoriList;
                this.state.pengirimanList = data.pengirimanList;
                this.state.paket = data.paket;
                this.state.stok = data.stok;
                this.state.tracking = data.tracking;
                
                console.log("Data berhasil dimuat:", this.state);
            }
        },
    tampilkanModal(judul, pesan) {
        // Memanggil fungsi show() yang ada di dalam app-modal.js
        this.$refs.modalComponent.show(judul, pesan);
    },
    handleNewOrder(dataPesanan) {
        // Generate Nomor DO
        const year = new Date().getFullYear();
        let count = Object.keys(this.state.tracking).length;
        const sequence = String(count + 1).padStart(3, '0');
        const newDO = `DO${year}-${sequence}`;

        // Bungkus data pesanan dengan format yang sama seperti di JSON
        let newEntry = {};
        newEntry[newDO] = {
            nim: dataPesanan.nim,
            nama: dataPesanan.nama,
            status: 'Diproses',
            ekspedisi: dataPesanan.ekspedisi,
            tanggalKirim: dataPesanan.tanggalKirim,
            paket: dataPesanan.paket,
            total: dataPesanan.total,
            perjalanan: [
                {
                    waktu: new Date().toLocaleString('id-ID'),
                    keterangan: 'Pemesanan bahan ajar baru saja dibuat.'
                }
            ]
        };

        // Simpan ke state global agar bisa dilacak di tab Tracking DO
        this.state.tracking.push(newEntry);
    }
    }

        
});