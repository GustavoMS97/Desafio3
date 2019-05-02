const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({ buyer: user, ad: purchaseAd })

    return res.json(purchase)
  }

  async accept (req, res) {
    const user = await User.findById(req.params.userId)
    const ad = await Ad.findById(req.params.adId)

    if (!user || !ad) {
      return res.send('<h1>Invalid URL to accept!<h1>')
    }

    const purchase = await Purchase.findOne({ ad })
      .populate('buyer')
      .populate('ad')

    if (!purchase) {
      return res.send('<h1>Purchase request invalid, try again!<h1>')
    }

    const adNewData = { ...ad._doc, purchasedBy: purchase._id }

    try {
      await Ad.findByIdAndUpdate(req.params.adId, adNewData, {
        new: true
      })
      return res.send('<h1>Thanks for accepting it!<h1>')
    } catch (error) {
      console.log(error)
      return res.send(`<h1>${error}<h1>`)
    }
  }
}

module.exports = new PurchaseController()
