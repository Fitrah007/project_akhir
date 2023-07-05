const { Ticket, Passenger, User, Flight, Transaction, Airport, Airplane, Airline } = require('../db/models');
const { sendNotif } = require('../utils/notifications');
const { sendMail, } = require('../utils/nodemailer');
const moment = require('moment');

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

function calculateTicketPrice(flightPrice, passengers, isRoundtrip) {
  let totalPassenger = 0;
  let totalPrice = 0;

  for (const passenger of passengers) {
    if (passenger.passenger_type === 'Adult' || passenger.passenger_type === 'Child') {
      totalPassenger += 1;
      totalPrice += flightPrice;
    }
  }

  totalPrice += 300000;

  if (isRoundtrip) {
    totalPrice *= 2; 
  }

  return totalPrice;
}

module.exports = {
  orderTicket: async (req, res) => {
    try {
      const { id } = req.user;
      const { total_passenger, departure_flight_id, return_flight_id, dataPassenger, is_roundtrip } = req.body;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User tidak ditemukan',
          data: null
        });
      }

      // Cek apakah flight tersedia
      const flight = await Flight.findOne({ where: { id: departure_flight_id } });

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
      console.log("ini harga : ", flight.price);

      const ticketPrice = calculateTicketPrice(flight.price, dataPassenger, is_roundtrip);

      const ticketPromises = dataPassenger.map(async (data) => {
        // Tambahkan data passenger
        const passenger = await Passenger.create({
          passenger_type: data.passenger_type,
          title: data.title,
          name: data.name,
          family_name: data.family_name,
          birth: new Date(data.birth),
          nationality: data.nationality,
          telp: data.telp,
          passpor: data.passpor,
          origin_county: data.origin_county,
          valid_until: new Date(data.valid_until)
        });

        const passenger_id = passenger.id;


        // Buat tiket baru
        const tiket = await Ticket.create({
          ticket_code: ticketCode,
          order_date: new Date(),
          total_passenger,
          total_price: ticketPrice,
          user_id: user.id,
          passenger_id: passenger_id,
          flight_id: departure_flight_id,
          return_flight_id: is_roundtrip ? return_flight_id : null,
          is_roundtrip
        });

        return tiket;
      });

      const tiket = await Promise.all(ticketPromises);

      // Set waktu pembayaran
      const paymentDueDate = moment().add(3, 'days');

      // Kirim notifikasi konfirmasi pemesanan
      const notificationMessage = `Order with Booking Code ${ticketCode} successfully placed. Payment must be completed by ${paymentDueDate.format('YYYY-MM-DD')}.`;

      sendNotif([{
        title: 'Order Confirmation',
        description: notificationMessage,
        user_id: user.id,
      }]);

      // Jadwal pengiriman notifikasi pengingat pembayaran
      setTimeout(() => {
        const paymentReminderMessage = `Reminder: Your payment for the ticket is due on ${paymentDueDate.format('YYYY-MM-DD')}.`;
        sendNotif([{
          title: 'Payment Reminder',
          description: paymentReminderMessage,
          user_id: user.id,
        }]);
      }, 3 * 24 * 60 * 60 * 1000); // 3 hari dalam milidetik

      res.status(201).json({
        status: true,
        message: 'Ticket berhasil dipesan',
        data: {
          ticket_code: tiket[0].ticket_code,
          ini_harga_penerbangan: flight.price,
          total_price: tiket[0].total_price
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },

  checkoutTicket: async (req, res) => {
    try {
      const { id } = req.user;

      const { ticket_code, payment_method, payer_name, number_payment } = req.body;

      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Belum login',
          data: null
        });
      }

      const ticket = await Ticket.findOne({ where: { ticket_code } });
      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: 'Ticket not found!',
          data: null
        });
      }

      // Cek status pembayaran tiket
      if (ticket.payment_status === "Dibayar") {
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

      const flight = await Flight.findOne({ where: { id: ticket.flight_id } });

      if (transaction) {
        // update status pembayaran di model tiket
        await Ticket.update({ payment_status: "Dibayar" }, { where: { ticket_code: transaction.ticket_code } });

        // Mengurangi available_passenger di model Flight
        if (flight) {
          const updatedAvailablePassenger = flight.available_passenger - ticket.total_passenger;
          console.log(updatedAvailablePassenger);

          await Flight.update({ available_passenger: updatedAvailablePassenger }, { where: { id: flight.id } });
        }
      }

      const airports = await Airport.findOne({ where: { id: flight.arrival_airport_id } })

      // Kirim notifikasi konfirmasi pembayaran
      const paymentConfirmationMessage = `Payment confirmed for ticket ${ticket_code}.`;

      sendNotif([{
        title: 'Payment Confirmation',
        description: paymentConfirmationMessage,
        user_id: user.id,
      }]);

      // Jadwal pengiriman notifikasi pengingat 1 hari sebelum keberangkatan penerbangan
      const departureDate = moment(flight.departure_date).subtract(1, 'day');
      const reminderMessage = `Reminder: Your flight departs on ${departureDate.format('YYYY-MM-DD')}.`;
      // Menghitung selisih waktu hingga keberangkatan
      const reminderTimeout = departureDate.valueOf() - Date.now();

      setTimeout(() => {
        sendNotif([
          {
            title: 'Flight Departure Reminder',
            description: reminderMessage,
            user_id: user.id,
          },
        ]);
      }, reminderTimeout);

      sendNotif([
        {
          title: "Checkout berhasil",
          description: "Selamat anda telah berhasil melakukan checkout",
          user_id: user.id,
          is_read: false
        },
      ]);

      const to = user.email;
      const subject = 'Checkout success';
      const html = `
        <h2>Checkout success</h2>
        <p>There is detail for your ticket</p><table>
        <tr><td>Ticket code</td><td>:</td><td><p>${transaction.ticket_code}</p></td></tr>
        <tr><td>Payment method</td><td>:</td><td><p>${transaction.payment_method}</p></td></tr>
        <tr><td>Payer name</td><td>:</td><td><p>${transaction.payer_name}</p></td></tr>
        <tr><td>Number payment</td><td>:</td><td><p>${transaction.number_payment}</p></td></tr>
        <tr><td>Payment date</td><td>:</td><td><p>${transaction.payment_date}</p></td></tr>
        </tabel>
      `;

      await sendMail(to, subject, html);

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
      const { id } = req.user;
      const tickets = await Ticket.findAll({
        where: { user_id: id },
        attributes: { exclude: ['user_id'] },
        include: [
          {
            model: Passenger,
            as: 'passengers',
            attributes: ['id', 'name', 'passenger_type']
          },
          {
            model: Flight,
            as: 'flights',
            attributes: { exclude: ['airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airport,
                as: 'departureAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airport,
                as: 'arrivalAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airplane,
                as: 'airplane',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                  {
                    model: Airline,
                    as: 'airline',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                  }
                ]
              }
            ],
          },
          {
            model: Flight,
            as: 'returnFlights',
            attributes: { exclude: ['airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airport,
                as: 'departureAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airport,
                as: 'arrivalAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airplane,
                as: 'airplane',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                  {
                    model: Airline,
                    as: 'airline',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                  }
                ]
              }
            ],
          }
        ]
      });

      const ticketMap = {};
      tickets.forEach(ticket => {
        const ticketCode = ticket.ticket_code;
        const passengerId = ticket.passengers.id;
        const passengerName = ticket.passengers.name;
        const passengerType = ticket.passengers.passenger_type;

        if (!ticketMap[ticketCode]) {
          ticketMap[ticketCode] = {
            ticket_code: ticketCode,
            order_date: ticket.order_date,
            total_passenger: ticket.total_passenger,
            passengers: [{
              passenger_id: passengerId,
              name: passengerName,
              passenger_type: passengerType
            }],
            total_price: ticket.total_price,
            payment_status: ticket.payment_status,
            is_roundtrip: ticket.is_roundtrip,
            flights: ticket.flights,
            returnFlights: ticket.returnFlights
          };
        } else {
          ticketMap[ticketCode].passengers.push({
            passenger_id: passengerId,
            name: passengerName,
            passenger_type: passengerType
          });
        }
      });

      const ticketData = Object.values(ticketMap);

      return res.status(200).json({
        status: true,
        message: 'success',
        data: ticketData
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },


  getOneTicket: async (req, res) => {
    try {
      const { id } = req.user;
      const { ticket_code } = req.params;
      const tickets = await Ticket.findAll({
        where: { 
          user_id: id,
          ticket_code
         },
        attributes: { exclude: ['user_id'] },
        include: [
          {
            model: Passenger,
            as: 'passengers',
            attributes: ['id', 'name', 'passenger_type']
          },
          {
            model: Flight,
            as: 'flights',
            attributes: { exclude: ['airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airport,
                as: 'departureAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airport,
                as: 'arrivalAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airplane,
                as: 'airplane',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                  {
                    model: Airline,
                    as: 'airline',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                  }
                ]
              }
            ],
          },
          {
            model: Flight,
            as: 'returnFlights',
            attributes: { exclude: ['airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airport,
                as: 'departureAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airport,
                as: 'arrivalAirport',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              },
              {
                model: Airplane,
                as: 'airplane',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                  {
                    model: Airline,
                    as: 'airline',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                  }
                ]
              }
            ],
          }
        ]
      });

      const ticketMap = {};
      tickets.forEach(ticket => {
        const ticketCode = ticket.ticket_code;
        const passengerId = ticket.passengers.id;
        const passengerName = ticket.passengers.name;
        const passengerType = ticket.passengers.passenger_type;

        if (!ticketMap[ticketCode]) {
          ticketMap[ticketCode] = {
            ticket_code: ticketCode,
            order_date: ticket.order_date,
            total_passenger: ticket.total_passenger,
            passengers: [{
              passenger_id: passengerId,
              name: passengerName,
              passenger_type: passengerType
            }],
            total_price: ticket.total_price,
            payment_status: ticket.payment_status,
            is_roundtrip: ticket.is_roundtrip,
            flights: ticket.flights,
            returnFlights: ticket.returnFlights
          };
        } else {
          ticketMap[ticketCode].passengers.push({
            passenger_id: passengerId,
            name: passengerName,
            passenger_type: passengerType
          });
        }
      });

      const ticketData = Object.values(ticketMap);

      return res.status(200).json({
        status: true,
        message: 'success',
        data: ticketData
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server', message: error.message });
    }
  },
};
