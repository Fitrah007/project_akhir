const {Bandara} = require('../db/models')
module.exports = {
    getAll: async(req, res) =>{
        try {
            const bandara = await Bandara.findAll();
            return res.status(200).json({
                status: true,
                message: 'Success!',
                data: bandara
            });

        } catch (err) {
            throw err
        }
    },
    create: async (req, res) =>{
        try {
            const {nama , kota ,negara} = req.body;

            const cekNama = await Bandara.findOne({where: {nama}})
            if (cekNama){
                return res.status(400).json({
                    status: false,
                    message: 'Bandara already exist!',
                    data: null
                });
            }
            const create = await Bandara.create({
                nama, kota , negara
            })
            return res.status(201).json({
                status: true,
                message: 'Bandara created!',
                data: {
                    id: create.id,
                    nama: create.name,
                    kota: create.kota,
                    negara: create.negara
                }
            });
        } catch (err) {
            throw err
        }
    },
    getOne: async(req, res) =>{
        try {
            const {id_bandara} = req.params;
            const bandara = await Bandara.findOne({where:{id:id_bandara}});
            if(!bandara){
                return res.status(400).json({
                    status: false,
                    message: 'bandara tidak ditemukan!',
                    data: null
                });

            }
            return res.status(200).json({
                status: true,
                message: 'Success!',
                data: bandara
            });
            
        } catch (err) {
            throw err
        }
    },
}