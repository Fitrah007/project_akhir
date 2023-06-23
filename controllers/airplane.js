const { Airplane, Airline } = require('../db/models');

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const { page = 1, per_page = 10 } = req.query
            const offset = (page - 1) * per_page
            const airplane = await Airplane.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Airline,
                        as: 'airline',
                        attributes: { exclude: ['createdAt', 'updatedAt'] }
                    }
                ],
                limit: per_page,
                offset: offset
            });
            return res.status(200).json({
                status: true,
                massage: 'success',
                data: airplane
            });
        } catch (error) {
            next(error)
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;

            const airplane = await Airplane.findOne({
                where: { id: id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Airline,
                        as: 'airline',
                        attributes: { exclude: ['createdAt', 'updatedAt'] }
                    }
                ]
            });

            if (!airplane) {
                return res.status(400).json({
                    status: false,
                    massage: 'airplane not found',
                    data: null
                });
            }

            return res.status(200).json({
                status: true,
                massage: 'success',
                data: airplane
            });
        } catch (error) {
            next(error);
        }
    }
}