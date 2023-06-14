const { Ticket, Passenger, User, Flight, Transaction } = require('../db/models');

// Generate kode tiket
async function generateKodeTiket() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-4);
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);

  const randomString = Math.random().toString(36).substring(2, 5).toUpperCase();
  let ticketNumber = '';

  // Get the total count of tickets from the database
  const ticketCount = await Ticket.count();

  // Generate the ticket number with leading zeros
  ticketNumber = ('000' + (ticketCount + 1)).slice(-3);

  return `${year}${month}${day}${randomString}${ticketNumber}`;
}

module.exports = {
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
      const ticketCode = await generateKodeTiket();

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

  checkoutTicket: async (req, res) => {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findOne({ where: { id } });
      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: 'Ticket not found!',
          data: null
        });
      }

      const { payment_method, payer_name, number_payment } = req.body;

      const transaction = await Transaction.create({
        payment_method,
        payer_name,
        number_payment,
        payment_status: true,
        payment_date: new Date(),
        ticket_id: ticket.id
      });

      return res.status(200).json({
        status: true,
        message: 'Success!',
        data: transaction
      });
    } catch (err) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: err.message });
    }
  },

  showTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: ticket
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },

  showTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: transaction
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  }
};
