const express = require('express');
const bodyParser = require('body-parser');
const httpSvc = require('../../utils/service');
const router = express.Router();
const jsonParser = bodyParser.json();

router.route('/login').post(jsonParser, function (req, res, next) {
  httpSvc.login(req.body).then(result => {
    console.log(result);
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
module.exports = router;
