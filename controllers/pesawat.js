const { Pesawat, Maskapai } = require('../db/models');
const validator = require('fastest-validator');
const pesawat = require('../db/models/pesawat');
const v = new validator

module.exports = {
    index: async (req, res, next) => {
        try {
            //const meskapai = req.params
            const pesawat = await Pesawat.findAll({
                include: [{
                    model: Maskapai,
                    as: 'maskapai',
                    attibutes: ['id', 'nama', 'negara']
                }]
            });

            return res.status(200).json({
                status: true,
                massage: 'success',
                data: pesawat
            });
        } catch (error) {
            next(error)
        }
    },

    show: async (req, res, next) => {
        try {
            const { id } = req.params;

            const pesawat = await Pesawat.findOne({where: {id:id}});
            if(!pesawat) {
                return res.status(400).json({
                    status: false,
                    massage: 'pesawat tidak ketemu',
                    data: null
                });
            }

            const maskapai = await Maskapai.findOne({where: {id: pesawat.id_maskapai}});
            return res.status(200).json({
                status: true,
                massage: 'success',
                data: {
                    id: pesawat.id,
                    nama: pesawat.nama,
                    nomor_pesawat: pesawat.nomor_pesawat,
                    kapasitas: pesawat.kapasitas,
                    id_maskapai: pesawat.id_maskapai
                }
            });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const { nama, nomor_pesawat, kapasitas, id_maskapai} = req.body;
            
            const cekPesawat = await Pesawat.findOne({where: {nama}})
            if(cekPesawat) {
                return res.status(400).json({
                    status: false,
                    massage: 'data already exist',
                    data: null
                });
            }
            
            const pesawat = await Pesawat.create({
                nama, nomor_pesawat, kapasitas, id_maskapai
            });

            return res.status(201).json({
                status: false,
                massage: 'success',
                data: {
                    nama: pesawat.nama,
                    nomor_pesawat: pesawat.nomor_pesawat,
                    kapasitas: pesawat.kapasitas,
                    id_maskapai: pesawat.id_maskapai
                }
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id, nama, nomor_pesawat, kapasitas, id_maskapai} = req.body;

            const updatePesawat = await Pesawat.findOne({where: {id: id}});
            if(!updatePesawat){
                return res.status(400).json({
                    status: false,
                    massage: 'pesawat not found'
                });
            }

            const pesawat = await Pesawat.update({
                nama, nomor_pesawat, kapasitas, id_maskapai
            },{where: {id}});

            return res.status(201).json({
                status: false,
                massage: 'success',
                data: pesawat
            });
        } catch (error) {
            next(error)
        }
    },

    delete: async(req, res, next) => {
        try {
            const { id } = req.body;

            const pesawat = await Pesawat.destroy({where: {id}});

            return res.status(201).json({
                massage:'delete success'
            });
        } catch (error) {
            next(error)
        }
    }
}