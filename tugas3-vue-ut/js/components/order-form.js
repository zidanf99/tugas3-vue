// File: /js/components/order-form.js

Vue.component('order-form', {
    template: '#tpl-order',
    props: ['paketList', 'ekspedisiList'],
    data() {
        return {
            form: {
                nim: '',
                nama: '',
                paket: '',
                ekspedisi: '',
                tanggalKirim: this.getTodayDate()
            }
        };
    },
    computed: {
        paketTerpilih() {
            if (!this.form.paket) return null;
            return this.paketList.find(p => p.kode === this.form.paket);
        }
    },
    methods: {
        getTodayDate() {
            return new Date().toISOString().split('T')[0];
        },
        submitOrder() {
            // Validasi Input Sederhana
            if (!this.form.nim || !this.form.nama || !this.form.paket || !this.form.ekspedisi) {
                // Memancarkan event ke Root untuk memunculkan modal error
                this.$emit('show-modal', 'Peringatan Validasi', 'Mohon lengkapi semua data pemesanan sebelum menyimpan!');
                return;
            }

            const totalHarga = this.paketTerpilih ? this.paketTerpilih.harga : 0;
            const dataPesanan = {
                ...this.form,
                total: totalHarga
            };

            // Mengirim data ke root (app.js) untuk disimpan di state global
            this.$emit('order-created', dataPesanan);
            
            // Memancarkan event sukses
            this.$emit('show-modal', 'Pesanan Berhasil', `Pesanan untuk NIM ${this.form.nim} berhasil dibuat dan diteruskan ke DO.`);

            // Reset form setelah simpan
            this.form = { nim: '', nama: '', paket: '', ekspedisi: '', tanggalKirim: this.getTodayDate() };
        }
    }
});