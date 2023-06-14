const { Flight, Airport, Airplane, Airline, Schedule } = require('../db/models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = {
  oneWay: async (req, res) => {
    try {
      const originAirportId = req.body.origin_airport;
      const destinationAirportId = req.body.destination_airport;
      const flightDate = req.body.flight_date;

      const originAirport = await Airport.findOne({ where: { id: originAirportId } });
      if (!originAirport) {
        return res.status(404).json({
          status: true,
          message: 'Origin airport not found',
          data: null
        });
      }

      const destinationAirport = await Airport.findOne({ where: { id: destinationAirportId } });
      if (!destinationAirport) {
        return res.status(404).json({
          status: true,
          message: 'Destination airport not found',
          data: null
        });
      }

      const flights = await Flight.findAll({
        where: {
          departure_airport_id: originAirport.id,
          arrival_airport_id: destinationAirport.id,
          flight_date: flightDate
        },
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
