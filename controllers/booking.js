const { Tiket, Penerbangan, Penumpang, User, Bandara, Pesawat, Maskapai } = require('../db/models');

// Generate kode tiket
function generateKodeTiket() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let kodeTiket = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    kodeTiket += characters[randomIndex];
  }

  return kodeTiket;
}

// Pesan tiket
module.exports = {
  pesanTiket: async (req, res) => {
    try {
      const { id } = req.user;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User tidak ditemukan',
          data: null
        });
      }

      const { jmlh_penumpang, id_penerbangan, dataPenumpang } = req.body;

      // Cek apakah penerbangan tersedia
      const penerbangan = await Penerbangan.findOne({ where: { id: id_penerbangan } });

      if (!penerbangan) {
        return res.status(404).json({ error: 'Penerbangan tidak ditemukan.' });
      }

      const tiketPromises = dataPenumpang.map(async (data) => {
        // Tambahkan data penumpang
        const penumpang = await Penumpang.create({
          title: data.title,
          nama: data.nama,
          nama_keluarga: data.nama_keluarga,
          tgl_lahir: new Date(data.tgl_lahir),
          kewarganegaraan: data.kewarganegaraan,
          ktp: data.ktp,
          passpor: data.passpor,
          negara_asal: data.negara_asal,
          berlaku_sampai: new Date(data.berlaku_sampai)
        });

        const id_penumpang = penumpang.id; // Simpan ID penumpang

        // Hitung total harga tiket
        const hargaTiket = jmlh_penumpang * penerbangan.harga;

        // Buat tiket baru
        const tiket = await Tiket.create({
          kode_tiket: generateKodeTiket(),
          tgl_pesan: new Date(),
          jmlh_penumpang,
          total_harga: hargaTiket,
          id_user: user.id,
          id_penumpang: id_penumpang, // Tambahkan ID penumpang
          id_penerbangan
        });

        return tiket;
      });

      const tiket = await Promise.all(tiketPromises);

      res.status(201).json({
        status: true,
        message: 'Tiket berhasil dipesan',
        data: tiket
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },

  getPenerbangan: async (req, res) => {
    try {
      const penerbangan = await Penerbangan.findAll({
        include: [
          { model: Bandara, as: 'bandara_asal' },
          { model: Bandara, as: 'bandara_tujuan' },
          { model: Pesawat, as: 'pesawat', include: [{ model: Maskapai, as: 'maskapai' }] }
        ]
      });

      return res.status(200).json({
        status: true,
        message: 'success',
        data: penerbangan
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  }
};
