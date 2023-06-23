const { Ticket, Passenger, User, Flight, Transaction, Notification } = require('../db/models');

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
      const { total_passenger, flight_id, return_flight_id, dataPassenger, is_roundtrip } = req.body;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User tidak ditemukan',
          data: null
        });
      }

      // Cek apakah flight tersedia
      const flight = await Flight.findOne({ where: { id: flight_id } });

      if (!flight) {
        return res.status(404).json({ error: 'Flight tidak ditemukan.' });
      }

      // Cek apakah return flight tersedia jika is_roundtrip bernilai true
      let returnFlight;
      if (is_roundtrip) {
        returnFlight = await Flight.findOne({ where: { id: return_flight_id } });

        if (!returnFlight) {
          return res.status(404).json({ error: 'Return flight tidak ditemukan.' });
        }
      }

      // Generate kode tiket
      const ticketCode = await generateKodeTiket();

      const existingTicket = await Ticket.findOne({ where: { ticket_code: ticketCode } });
      if (existingTicket) {
        // Jika tiket sudah ada, tampilkan respon yang sesuai
        return res.status(409).json({
          status: false,
          message: 'Tiket dengan kode tersebut sudah ada',
          data: existingTicket
        });
      }

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
        let ticketPrice = total_passenger * flight.price;
        if (is_roundtrip) {
          ticketPrice += total_passenger * returnFlight.price;
        }

        // Buat tiket baru
        const tiket = await Ticket.create({
          ticket_code: ticketCode,
          order_date: new Date(),
          total_passenger,
          total_price: ticketPrice,
          user_id: user.id,
          passenger_id: passenger_id,
          flight_id,
          return_flight_id: is_roundtrip ? return_flight_id : null,
          is_roundtrip
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
    const {id} = req.user;
    const { ticket_code, payment_method, payer_name, number_payment } = req.body;

    try {
      const user = await User.findOne({where:{id}})
      const ticket = await Ticket.findOne({ where: { ticket_code } });
      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: 'Ticket not found!',
          data: null
        });
      }

      // Cek status pembayaran tiket
      if (ticket.payment_status) {
        return res.status(400).json({
          status: false,
          message: 'Ticket has already been paid!',
          data: null
        });
      }

      const transaction = await Transaction.create({
        ticket_code,
        payment_method,
        payer_name,
        number_payment,
        payment_date: new Date()
      });

      if (transaction) {
        // update status pembayaran di model tiket
        await Ticket.update({ payment_status: true }, { where: { ticket_code: transaction.ticket_code } });

        // Mengurangi available_passenger di model Flight
        const flight = await Flight.findOne({ where: { id: ticket.flight_id } });
        if (flight) {
          const updatedAvailablePassenger = flight.available_passenger - ticket.total_passenger;
          console.log(updatedAvailablePassenger);

          await Flight.update({ available_passenger: updatedAvailablePassenger }, { where: { id: flight.id } });
        }
      }

      // const notification = await Notification.create({
      //   title:"Checkout berhasil",
      //   description:"Selamat anda telah berhasil melakukan checkout",
      //   user_id: user.id,
      //   is_read: false
      // })

      // const to = user.email;
      // const subject = 'Checkout success';
      // const html = `
      //   <h2>Checkout success</h2>
      //   <p>Your Ticket code is: ${ticket_code}</p>
      // `;

      // await sendMail(to, subject, html);

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
