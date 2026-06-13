// File: /js/components/do-tracking.js

Vue.component('do-tracking', {
    template: '#tpl-tracking',
    // Menerima data dari root state
    props: ['dataTracking', 'paketList', 'ekspedisiList'],
    data() {
        return {
            // State untuk fitur pencarian
            searchQuery: '',
            searchResult: null, 
            searchKey: '', // Menyimpan Nomor DO yang sedang aktif
            
            // State untuk form input DO Baru
            formDO: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: this.getTodayDateInput()
            },
            
            // State untuk tambah progress pengiriman
            formProgress: {
                keterangan: ''
            }
        };
    },
    computed: {
        // Memunculkan detail isi paket setelah paket dipilih
        selectedPaketDetail() {
            if (!this.formDO.paket) return null;
            return this.paketList.find(p => p.kode === this.formDO.paket);
        }
    },

    watch: {
        searchQuery(newValue) {
            // Jika kotak pencarian dikosongkan secara manual (dihapus/backspace)
            // maka kita otomatis mereset hasil pencarian di layar.
            if (newValue === '') {
                this.searchResult = null;
                this.searchKey = '';
            }
        }
    },
    
    methods: {
        // Fitur Pencarian dengan Enter
        submitSearch() {
            if (!this.searchQuery) return;
            let foundKey = null;
            let foundData = null;
            
            // Melakukan loop pada Array of Objects data tracking
            for (let i = 0; i < this.dataTracking.length; i++) {
                let obj = this.dataTracking[i];
                let doNumber = Object.keys(obj)[0]; // Mengambil kunci (contoh: DO2025-0001)
                let doData = obj[doNumber];
                
                // Cari berdasarkan Nomor DO ATAU NIM
                if (doNumber.toLowerCase() === this.searchQuery.toLowerCase() || 
                    doData.nim === this.searchQuery) {
                    foundKey = doNumber;
                    foundData = doData;
                    break;
                }
            }
            
            if (foundData) {
                this.searchKey = foundKey;
                this.searchResult = foundData;
            } else {
                alert('Data pengiriman tidak ditemukan!');
                this.searchResult = null;
            }
        },
        // Fitur Reset Pencarian dengan Esc[cite: 1]
        resetSearch() {
            this.searchQuery = '';
            this.searchResult = null;
            this.searchKey = '';
        },
        
        // Auto-Generate No DO: DO + Tahun Berjalan + Sequence[cite: 1]
        generateDONumber() {
            const year = new Date().getFullYear();
            let count = 0;
            // Hitung ada berapa DO di tahun berjalan
            this.dataTracking.forEach(obj => {
                const key = Object.keys(obj)[0];
                if (key.startsWith(`DO${year}`)) {
                    count++;
                }
            });
            const sequence = String(count + 1).padStart(3, '0'); // Format 3 digit (001, 002, dst)
            return `DO${year}-${sequence}`;
        },
        
        // Submit DO Baru
        submitDO() {
            if (!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.paket || !this.formDO.tanggalKirim) {
                alert('Harap isi semua data Delivery Order!');
                return;
            }
            
            const newDO = this.generateDONumber();
            const totalHarga = this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
            
            const newData = {
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                status: 'Diproses',
                ekspedisi: this.formDO.ekspedisi,
                tanggalKirim: this.formDO.tanggalKirim,
                paket: this.formDO.paket,
                total: totalHarga,
                perjalanan: [
                    {
                        waktu: this.getCurrentDateTime(),
                        keterangan: 'DO dibuat dan menunggu diproses.'
                    }
                ]
            };
            
            // Format objek dinamis sesuai JSON awal: { "DO202X-00X": { data... } }
            let newEntry = {};
            newEntry[newDO] = newData;
            this.dataTracking.push(newEntry);
            
            alert(`DO Baru berhasil ditambahkan: ${newDO}`);
            
            // Reset form
            this.formDO = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: this.getTodayDateInput() };
        },
        
        // Tambah Progress Perjalanan[cite: 1]
        addProgress() {
            if (!this.formProgress.keterangan) return;
            
            if (this.searchResult) {
                // Menambahkan data baru di awal array perjalanan (terbaru di atas)
                this.searchResult.perjalanan.unshift({
                    waktu: this.getCurrentDateTime(), // Local time Date[cite: 1]
                    keterangan: this.formProgress.keterangan // Input pengguna[cite: 1]
                });
                this.searchResult.status = 'Dalam Perjalanan';
                this.formProgress.keterangan = ''; // Reset input
            }
        },

        // --- Helper Tanggal ---
        // Format tanggal untuk input type="date"
        getTodayDateInput() {
            const d = new Date();
            return d.toISOString().split('T')[0];
        },
        // Format Waktu untuk tracking "YYYY-MM-DD HH:MM:SS"[cite: 1]
        getCurrentDateTime() {
            const d = new Date();
            return d.getFullYear() + "-" + 
                   String(d.getMonth() + 1).padStart(2, '0') + "-" + 
                   String(d.getDate()).padStart(2, '0') + " " + 
                   String(d.getHours()).padStart(2, '0') + ":" + 
                   String(d.getMinutes()).padStart(2, '0') + ":" + 
                   String(d.getSeconds()).padStart(2, '0');
        },
        // Format Tanggal Tampilan (Contoh: 25 Agustus 2025)[cite: 1]
        formatDateDisplay(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
    }
});