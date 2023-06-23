const { Airport } = require('../db/models');

module.exports = {
    getAll: async (req, res) => {
        try {
            const { page = 1, per_page = 10 } = req.query
            const offset = (page - 1) * per_page;
            const airports = await Airport.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                limit: per_page,
                offset: offset
            });
            return res.status(200).json({
                status: true,
                message: 'Success!',
                data: airports
            });

        } catch (err) {
            throw err
        }
    },
    getOne: async (req, res) => {
        try {
            const { airport_id } = req.params;
            const airports = await Airport.findOne({ where: { id: airport_id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
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