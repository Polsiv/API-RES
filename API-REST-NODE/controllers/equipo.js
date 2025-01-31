const {Equipo} = require("../models");

const obtenerEquiposGet = async (req, res = response) => {
    const {desde = 0 } = req.query;

    try {
      const [total, equipos] = await Promise.all([
        Equipo.countDocuments(),
        Equipo.find({})
          .skip(Number(desde))
          .sort({nombre:1})
      ]);
 
      res.json({ Ok: true, total: total, resp: equipos });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }
  };
  
  const crearEquipoPost = async (req, res = response) => {
    const body = req.body;
    try {
      const equipoDB = await Equipo.findOne({ nombre: body.nombre });
      if (equipoDB) {
        return res
        //.status(400)
        .json({
          Ok: false,
          msg: `El Equipo ${body.nombre}, ya existe`,
        });
      }
    
      const equipo = new Equipo(body);
      // Guardar DB
      await equipo.save();

      res
      //.status(201)
      .json({ Ok: true, msg: 'Equipo Insertado', resp: equipo});
    } catch (error) {
      //console.log("ERROR:INSERTAR",error);
      res.json({ Ok: false, msg:'Error al Insertar equipo', resp: error });
    }
  };
  
  const actualizarEquipoPut = async (req, res = response) => {
    const { id } = req.params;
    const data  = req.body;
    try {
      if (data.nombre) {
          const equipoDB = await Equipo.findOne({ nombre: data.nombre });
          if (equipoDB) {
            return res.status(400).json({
              msg: `El Equipo ${data.nombre}, ya existe en la BD`,
            });
          }
      }
     
      const equipo = await Equipo.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.json({ Ok: true, msg: 'Equipo Actualizado', resp: equipo });
    } catch (error) {
      console.log("ERROR_MODIFICAR",error);
      res.json({ Ok: false, resp: error });
    }
  };
  
const obtenerEquipoGet = async (req, res = response) => {
    const { id } = req.params;
    try {
      const equipo = await Equipo.findById(id);
      res.json({ Ok: true, resp: equipo });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }  
};

const borrarEquipoDelete = async (req, res = response) => {
  const { id } = req.params;
  try {
    const equipo = await Equipo.findById(id);
    if (!equipo){
      return res.status(400).json({
        msg: `El Equipo con ${id}, no existe en la BD`,
      });
    }

    const equipoBorrado = await Equipo.findByIdAndDelete(id);
    res.json({ Ok: true,msg:"Equipo borrado" ,resp: equipoBorrado });
  } catch (error) {
    console.log("ERROR_BORRADO",error);
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
    obtenerEquiposGet, obtenerEquipoGet,crearEquipoPost,actualizarEquipoPut, borrarEquipoDelete
}