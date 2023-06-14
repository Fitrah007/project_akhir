const { Flight, Airport, Airplane, Airline, Schedule } = require('../db/models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = {
  // Fungsi pencarian penerbangan satu arah
  oneWay: async (req, res) => {
    try {
      const originAirportId = req.body.origin_airport;
      const destinationAirportId = req.body.destination_airport;
      const flightDate = req.body.flight_date;
      const flightClass = req.body.class;

      // Mengecek apakah bandara asal ditemukan
      const originAirport = await Airport.findOne({ where: { id: originAirportId } });
      if (!originAirport) {
        return res.status(404).json({
          status: true,
          message: 'Origin airport not found',
          data: null
        });
      }

      // Mengecek apakah bandara tujuan ditemukan
      const destinationAirport = await Airport.findOne({ where: { id: destinationAirportId } });
      if (!destinationAirport) {
        return res.status(404).json({
          status: true,
          message: 'Destination airport not found',
          data: null
        });
      }

      // Membuat objek filter untuk jadwal penerbangan keberangkatan
      const departureFlightFilter = {
        departure_airport_id: originAirport.id,
        arrival_airport_id: destinationAirport.id,
        flight_date: flightDate,
        is_available: true
      };

      // Jika diberikan jenis kelas penerbangan, tambahkan filternya
      if (flightClass) {
        departureFlightFilter.class = flightClass;
      }

      const flights = await Flight.findAll({
        where: departureFlightFilter,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          { model: Airport,
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
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      });

      if (flights.length === 0) {
        return res.status(404).json({
          status: true,
          message: 'Flight schedule not found!',
          data: flights
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: flights
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        data: null
      });
    }
  },

  // Fungsi pencarian penerbangan pulang pergi
  twoWay: async (req, res) => {
    try {
      const originAirportId = req.body.origin_airport;
      const destinationAirportId = req.body.destination_airport;
      const departureDate = req.body.departure_date;
      const returnDate = req.body.return_date;
      const flightClass = req.body.class;

      // Mengecek apakah bandara asal ditemukan
      const originAirport = await Airport.findOne({ where: { id: originAirportId } });
      if (!originAirport) {
        return res.status(404).json({
          status: true,
          message: 'Origin airport not found',
          data: null
        });
      }

      // Mengecek apakah bandara tujuan ditemukan
      const destinationAirport = await Airport.findOne({ where: { id: destinationAirportId } });
      if (!destinationAirport) {
        return res.status(404).json({
          status: true,
          message: 'Destination airport not found',
          data: null
        });
      }

      // Membuat objek filter untuk jadwal penerbangan keberangkatan
      const departureFlightFilter = {
        departure_airport_id: originAirport.id,
        arrival_airport_id: destinationAirport.id,
        flight_date: departureDate
      };

      // Jika diberikan jenis kelas penerbangan, tambahkan filternya
      if (flightClass) {
        departureFlightFilter.class = flightClass;
      }

      // Mencari jadwal penerbangan keberangkatan
      const departureFlights = await Flight.findAll({
        where: departureFlightFilter,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      });

      // Membuat objek filter untuk jadwal penerbangan kepulangan
      const returnFlightFilter = {
        departure_airport_id: destinationAirport.id,
        arrival_airport_id: originAirport.id,
        flight_date: returnDate
      };

      // Jika diberikan jenis kelas penerbangan, tambahkan filternya
      if (flightClass) {
        returnFlightFilter.class = flightClass;
      }

      // Mencari jadwal penerbangan kepulangan
      const returnFlights = await Flight.findAll({
        where: returnFlightFilter,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
          },
          {
            model: Schedule,
            as: 'schedules',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      });

      // Jika tidak ada jadwal penerbangan keberangkatan
      if (departureFlights.length === 0) {
        return res.status(404).json({
          status: true,
          message: 'Departure flight schedule not found!',
          data: departureFlights
        });
      }

      // Jika tidak ada jadwal penerbangan kepulangan
      if (returnFlights.length === 0) {
        return res.status(404).json({
          status: true,
          message: 'Return flight schedule not found!',
          data: returnFlights
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: {
          departureFlights,
          returnFlights
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        data: null
      });
    }
  },

  show: async (req, res) => {
    try {
      const penerbangan = await Flight.findAll();

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
