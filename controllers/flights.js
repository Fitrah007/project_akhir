const { Flight, Airport, Airplane, Airline, Schedule } = require('../db/models');
// const Validator = require('fastest-validator');
// const v = new Validator();

module.exports = {
  // Fungsi pencarian penerbangan satu arah
  oneWay: async (req, res) => {
    try {
      const originAirportId = req.body.origin_airport;
      const destinationAirportId = req.body.destination_airport;
      const flightDate = req.body.flight_date;
      const flightClass = req.body.class;
      const totalPassenger = req.body.total_passenger;

      const { page = 1, per_page = 10 } = req.query;
      const offset = (page - 1) * per_page;

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
        flight_date: flightDate
      };

      // Jika diberikan jenis kelas penerbangan, tambahkan filternya
      if (flightClass) {
        departureFlightFilter.class = flightClass;
      }

      const flights = await Flight.findAll({
        where: departureFlightFilter,
        attributes: { exclude: ['id', 'airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Airport,
            as: 'departureAirport',
            attributes: { exclude: ['id','createdAt', 'updatedAt'] }
          },
          {
            model: Airport,
            as: 'arrivalAirport',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          },
          {
            model: Airplane,
            as: 'airplane',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airline,
                as: 'airline',
                attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
              }
            ]
          }
        ],
        order: [
          ['price', req.body.sort === 'desc' ? 'DESC' : 'ASC']
        ],
        limit: per_page,
        offset: offset
      });

      // Filter flights berdasarkan available_passenger
      const filteredFlights = flights.filter(flight => flight.available_passenger >= totalPassenger);

      if (filteredFlights.length === 0) {
        return res.status(404).json({
          status: true,
          message: 'Flight schedule not found!',
          data: null
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
      const totalPassenger = req.body.total_passenger;

      const { page = 1, per_page = 10 } = req.query;
      const offset = (page - 1) * per_page;

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
        attributes: { exclude: ['id', 'airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Airport,
            as: 'departureAirport',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          },
          {
            model: Airport,
            as: 'arrivalAirport',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          },
          {
            model: Airplane,
            as: 'airplane',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airline,
                as: 'airline',
                attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
              }
            ]
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
        attributes: { exclude: ['id', 'airplane_id', 'airline_id', 'departure_airport_id', 'arrival_airport_id', 'departure_timestamp', 'arrival_timestamp', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: Airport,
            as: 'departureAirport',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          },
          {
            model: Airport,
            as: 'arrivalAirport',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          },
          {
            model: Airplane,
            as: 'airplane',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: Airline,
                as: 'airline',
                attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
              }
            ]
          },
        ],
        order: [
          ['price', req.body.sort === 'desc' ? 'DESC' : 'ASC']
        ],
        limit: per_page,
        offset: offset
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

      // Filter flights berdasarkan available_passenger
      const filteredDepartureFlights = departureFlights.filter(flight => flight.available_passenger >= totalPassenger);
      const filteredReturnFlights = returnFlights.filter(flight => flight.available_passenger >= totalPassenger);

      if (filteredDepartureFlights.length === 0 || filteredReturnFlights.length === 0) {
        return res.status(404).json({
          status: true,
          message: 'Flight schedule not found!',
          data: null
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
      const { page = 1, per_page = 10, region, sort } = req.query;
      const offset = (page - 1) * per_page;

      const filterOptions = {};

      if (region) {
        const airports = await Airport.findAll({
          where: { region },
          attributes: ['id']
        });

        const airportIds = airports.map((airport) => airport.id);
        filterOptions.departure_airport_id = airportIds;
      }

      const orderOptions = [['id', 'ASC']]; // Default order by ID

      if (sort && sort === 'price') {
        orderOptions.unshift(['price', 'ASC']); // Prepend price sorting option
      }

      const penerbangan = await Flight.findAll({
        where: filterOptions,
        attributes: {
          exclude: [
            'id',
            'airplane_id',
            'airline_id',
            'departure_airport_id',
            'arrival_airport_id',
            'departure_timestamp',
            'arrival_timestamp',
            'createdAt',
            'updatedAt'
          ]
        },
        include: [
          {
            model: Airport,
            as: 'departureAirport',
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Airport,
            as: 'arrivalAirport',
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Airplane,
            as: 'airplane',
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt']
            },
            include: [
              {
                model: Airline,
                as: 'airline',
                attributes: {
                  exclude: ['id', 'createdAt', 'updatedAt']
                }
              }
            ]
          }
        ],
        order: orderOptions,
        limit: per_page,
        offset: offset
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
