const { Airport } = require('../db/models');

const generateIataCode = (name) => {
    const words = name.split(' ');

    if (words.length === 1) {
        return words[0].slice(0, 3).toUpperCase();
    } else if (words.length === 2) {
        const firstWord = words[0].slice(0, 2).toUpperCase();
        const secondWord = words[1].charAt(0).toUpperCase();
        return firstWord + secondWord;
    } else if (words.length >= 3) {
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += words[i].charAt(0).toUpperCase();
        }
        return code;
    }
};

module.exports = {
    getAll: async (req, res) => {
        try {
            const airports = await Airport.findAll();
            return res.status(200).json({
                status: true,
                message: 'Success!',
                data: airports
            });

        } catch (err) {
            throw err
        }
    },
    create: async (req, res) => {
        try {
            const { name, city, country } = req.body;

            const cekNama = await Airport.findOne({ where: { name } })
            if (cekNama) {
                return res.status(400).json({
                    status: false,
                    message: 'Airport already exist!',
                    data: null
                });
            }

            const iataCode = generateIataCode(name); // Generate IATA code

            const create = await Airport.create({
                name, city, country, iata_code: iataCode
            })
            return res.status(201).json({
                status: true,
                message: 'Airport created!',
                data: {
                    id: create.id,
                    name: create.name,
                    city: create.city,
                    country: create.country,
                    iata_code: create.iataCode
                }
            });
        } catch (err) {
            throw err
        }
    },
    getOne: async (req, res) => {
        try {
            const { airport_id } = req.params;
            const airports = await Airport.findOne({ where: { id: airport_id } });
            if (!airports) {
                return res.status(400).json({
                    status: false,
                    message: 'airports tidak ditemukan!',
                    data: null
                });

            }
            return res.status(200).json({
                status: true,
                message: 'Success!',
                data: airports
            });

        } catch (err) {
            throw err
        }
    },
}