import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkPromoted = async (req, res, next) => {
  try {
    const promotedRestaurant = await Restaurant.findOne(
      {
        where: { userId: req.user.id, promoted: true }
      })
    if (promotedRestaurant === null || req.params.id === promotedRestaurant) {
      return next()
    }
    return res.status(422).send('User already has promoted restaurant.')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkPromoted }
