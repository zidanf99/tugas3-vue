// File: /js/components/app-modal.js

Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            isVisible: false,
            title: '',
            message: ''
        };
    },
    methods: {
        // Method untuk memunculkan modal
        show(title, message) {
            this.title = title;
            this.message = message;
            this.isVisible = true;
        },
        // Method untuk menutup modal
        close() {
            this.isVisible = false;
        }
    }
});