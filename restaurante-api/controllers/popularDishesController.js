// controllers/popularDishesController.js
const Orden = require('../models/Orden');
const ArticuloMenu = require('../models/ArticuloMenu');

exports.getPopularDishes = async (req, res) => {
  try {
    // 1) ¿Cuántos pedidos hay?
    const totalOrders = await Orden.countDocuments();
    console.log('🛠 Debug – totalOrders (ordenes):', totalOrders);

    // 2) Muestra un pedido de ejemplo para ver su estructura
    const sampleOrder = await Orden.findOne().lean();
    console.log('🛠 Debug – sampleOrder:', sampleOrder);

    // 3) Agrupación para los 3 más pedidos
    const popular = await Orden.aggregate([
      { $unwind: '$articulos' },
      { 
        $group: {
          _id: '$articulos.menuItemId',
          totalOrdered: { $sum: '$articulos.cantidad' }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'articulos_menu',
          localField: '_id',
          foreignField: '_id',
          as: 'dish'
        }
      },
      { $unwind: '$dish' },
      {
        $project: {
          id:           '$_id',
          nombre:       '$dish.nombre',
          descripcion:  '$dish.descripcion',
          precio:       '$dish.precio',
          imagen:       '$dish.imagen',
          totalOrdered: 1
        }
      }
    ]);

    console.log('🛠 Debug – aggregation popular:', popular);
    return res.json(popular);
  } catch (error) {
    console.error('Error en getPopularDishes:', error);
    return res.status(500).json({ msg: 'No se pudieron obtener los platos populares' });
  }
};
