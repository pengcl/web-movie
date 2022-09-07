const express = require('express');
const bodyParser = require('body-parser');
const httpSvc = require('../../utils/service');
const router = express.Router();
const jsonParser = bodyParser.json();

router.route('/login').post(jsonParser, function (req, res, next) {
  httpSvc.login(req.body).then(result => {
    res.send(result.body);
  })
});
router.route('/config').post(jsonParser, function (req, res, next) {
  httpSvc.config(req.body).then(result => {
    res.send(result.body);
  })
});
router.route('/plans').post(jsonParser, function (req, res, next) {
  httpSvc.plans(req.body).then(result => {
    res.send(result.body);
  })
});
router.route('/memberLogin').post(jsonParser, function (req, res, next) {
  httpSvc.memberLogin(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/createBlankShopCart').post(jsonParser, function (req, res, next) {
  httpSvc.createBlankShopCart(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/createCartMember').post(jsonParser, function (req, res, next) {
  httpSvc.createCartMember(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/getMemberCount').post(jsonParser, function (req, res, next) {
  console.log('getMemberCount');
  httpSvc.getMemberCount(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/cancellationMember').post(jsonParser, function (req, res, next) {
  console.log('cancellationMember');
  httpSvc.cancellationMember(req.body).then(result => {
    res.send(result.body);
  })
});
router.route('/getPosPlanTotalInfo').post(jsonParser, function (req, res, next) {
  console.log('getPosPlanTotalInfo');
  httpSvc.getPosPlanTotalInfo(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/createCartRes').post(jsonParser, function (req, res, next) {
  console.log('createCartRes');
  httpSvc.createCartRes(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/refreshPosSeats').post(jsonParser, function (req, res, next) {
  console.log('refreshPosSeats');
  httpSvc.refreshPosSeats(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/deleteRes').post(jsonParser, function (req, res, next) {
  console.log('deleteRes');
  httpSvc.deleteRes(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/batchDeleteRes').post(jsonParser, function (req, res, next) {
  console.log('batchDeleteRes');
  httpSvc.batchDeleteRes(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/submitShopCart').post(jsonParser, function (req, res, next) {
  console.log('submitShopCart');
  httpSvc.submitShopCart(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/getPosPayModeIsSupply').post(jsonParser, function (req, res, next) {
  console.log('getPosPayModeIsSupply');
  httpSvc.getPosPayModeIsSupply(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/queryShopCartDetail').post(jsonParser, function (req, res, next) {
  console.log('queryShopCartDetail');
  httpSvc.queryShopCartDetail(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/queryShoppingCartCampaign').post(jsonParser, function (req, res, next) {
  console.log('queryShoppingCartCampaign');
  httpSvc.queryShoppingCartCampaign(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/reductionShopCart').post(jsonParser, function (req, res, next) {
  console.log('reductionShopCart');
  httpSvc.reductionShopCart(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/addMemberInfo2shopCart').post(jsonParser, function (req, res, next) {
  console.log('addMemberInfo2shopCart');
  httpSvc.addMemberInfo2shopCart(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/savePosBill').post(jsonParser, function (req, res, next) {
  console.log('savePosBill');
  httpSvc.savePosBill(req.body).then(result => {
    res.send(result.body);
  })
});

router.route('/cancelNotCompleteBill').post(jsonParser, function (req, res, next) {
  console.log('cancelNotCompleteBill');
  httpSvc.cancelNotCompleteBill(req.body).then(result => {
    res.send(result.body);
  })
});

module.exports = router;
