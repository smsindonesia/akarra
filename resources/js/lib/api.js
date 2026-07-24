import axios from 'axios';

/**
 * Klien AJAX untuk endpoint yang sengaja tetap JSON, bukan kunjungan Inertia:
 * unggah gambar (dipanggil dari dalam editor Trix) dan status/pencarian Tavily.
 *
 * Same-origin, jadi axios otomatis mengirim header X-XSRF-TOKEN dari cookie
 * yang disetel Laravel — tidak perlu withCredentials seperti dulu saat
 * frontend dan backend beda origin.
 */
const api = axios.create({
    headers: {
        Accept: 'application/json',
    },
});

export default api;
