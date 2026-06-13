// File: /js/components/stock-table.js

Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    // Menerima data dari root app melalui props
    props: ['items', 'upbjjList', 'kategoriList'],
    data() {
        return {
            // State untuk Filter & Sort
            filterUpbjj: '',
            filterKategori: '',
            filterReorder: false,
            sortBy: '', 
            sortAsc: true,
            kategoriTersedia: [], // Untuk dependent options
            
            // State untuk UI
            hoveredRow: null,
            
            // State untuk Form Tambah/Edit
            isEditing: false,
            form: this.getEmptyForm()
        };
    },
    computed: {
        // Menerapkan fitur Vue.js di mana filter tidak perlu recompute kembali secara manual
        filteredAndSortedItems() {
            let result = this.items;

            // 1. Filter by UPBJJ
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }

            // 2. Filter by Kategori
            if (this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }

            // 3. Filter Reorder (qty < safety atau qty == 0)
            if (this.filterReorder) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            // 4. Sortir Data
            if (this.sortBy) {
                result = result.slice().sort((a, b) => {
                    let valA = a[this.sortBy];
                    let valB = b[this.sortBy];
                    
                    if (valA < valB) return this.sortAsc ? -1 : 1;
                    if (valA > valB) return this.sortAsc ? 1 : -1;
                    return 0;
                });
            }

            return result;
        }
    },
    watch: {
        // Implementasi dependent options: Kategori muncul jika UPBJJ dipilih[cite: 1]
        filterUpbjj(newValue) {
            if (newValue) {
                // Simulasi mengisi kategori (bisa disesuaikan jika JSON memiliki relasi spesifik)
                this.kategoriTersedia = this.kategoriList; 
            } else {
                this.kategoriTersedia = [];
                this.filterKategori = ''; // Reset child filter
            }
        }
    },
    methods: {
        // Logika Status[cite: 1]
        cekStatus(qty, safety) {
            if (qty === 0) {
                return { text: 'Kosong', color: 'red', icon: '🚨' };
            } else if (qty < safety) {
                return { text: 'Menipis', color: 'orange', icon: '⚠️' };
            } else {
                return { text: 'Aman', color: 'green', icon: '✅' };
            }
        },
        // Fitur Reset Filter[cite: 1]
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorder = false;
            this.sortBy = '';
            this.sortAsc = true;
        },
        setSort(field) {
            if (this.sortBy === field) {
                this.sortAsc = !this.sortAsc; // Toggle Asc/Desc
            } else {
                this.sortBy = field;
                this.sortAsc = true;
            }
        },
        getEmptyForm() {
            return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' };
        },
        // Validasi Sederhana & Simpan (Create/Update) menggunakan Enter[cite: 1]
        submitForm() {
            if (!this.form.kode || !this.form.judul || this.form.qty === '' || this.form.harga === '') {
                alert("Mohon lengkapi field wajib (Kode, Judul, Harga, Qty)!");
                return;
            }

            // Memastikan format angka
            this.form.harga = Number(this.form.harga);
            this.form.qty = Number(this.form.qty);
            this.form.safety = Number(this.form.safety);

            if (this.isEditing) {
                // Update
                const index = this.items.findIndex(i => i.kode === this.form.kode);
                if (index !== -1) {
                    // Gunakan Vue.set untuk memicu reaktivitas
                    this.$set(this.items, index, { ...this.form });
                    alert("Data berhasil diperbaharui!");
                }
            } else {
                // Create
                this.items.push({ ...this.form });
                alert("Data bahan ajar baru ditambahkan!");
            }
            
            this.batalEdit();
        },
        editItem(item) {
            this.isEditing = true;
            this.form = { ...item }; // Copy data ke form
        },
        batalEdit() {
            this.isEditing = false;
            this.form = this.getEmptyForm();
        },
        // Konfirmasi Hapus Data[cite: 1]
        deleteItem(itemKode) {
            if (confirm("Apakah Anda yakin ingin menghapus data bahan ajar ini?")) {
                const index = this.items.findIndex(i => i.kode === itemKode);
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
            }
        }
    }
});