const { Ticket, Passenger, User, Flight } = require('../db/models');

// Generate kode tiket
function generateKodeTiket() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ticketCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    ticketCode += characters[randomIndex];
  }

  return ticketCode;
}

// Pesan tiket
module.exports = {
  // Pesan tiket
  orderTicket: async (req, res) => {
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

      const { total_passenger, flight_id, dataPassenger } = req.body;

      // Cek apakah flight tersedia
      const flight = await Flight.findOne({ where: { id: flight_id } });

      if (!flight) {
        return res.status(404).json({ error: 'Flight tidak ditemukan.' });
      }

      // Generate kode tiket
      const ticketCode = generateKodeTiket();

      const ticketPromises = dataPassenger.map(async (data) => {
        // Tambahkan data passenger
        const passenger = await Passenger.create({
          title: data.title,
          name: data.name,
          family_name: data.family_name,
          birth: new Date(data.birth),
          nationality: data.nationality,
          ktp: data.ktp,
          passpor: data.passpor,
          origin_county: data.origin_county,
          valid_until: new Date(data.valid_until)
        });

        const passenger_id = passenger.id; // Simpan ID passenger

        // Hitung total price tiket
        const ticketPrice = total_passenger * flight.price;

        // Buat tiket baru
        const tiket = await Ticket.create({
          ticket_code: ticketCode,
          order_date: new Date(),
          total_passenger,
          total_price: ticketPrice,
          user_id: user.id,
          passenger_id: passenger_id,
          flight_id
        });

        return tiket;
      });

      const tiket = await Promise.all(ticketPromises);

      res.status(201).json({
        status: true,
        message: 'Ticket berhasil dipesan',
        data: tiket
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },

  showTicket: async (req, res) => {
    try {
      const penerbangan = await Ticket.findAll();

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
