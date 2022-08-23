const request = require('request');
const path = require('path');
const fs = require('fs');

const prefix = 'https://micoapi.bihetech.com:13020';
const post = (url, req) => {
  url = prefix + url;
  return new Promise(resolve => {
    request({
      url: url,
      method: "POST",
      json: true,
      secureProtocol: 'TLSv1_method',
      agentOptions: {
        key: fs.readFileSync(path.join(__dirname, '../certificates/key.pem'), {encoding: 'utf-8'}),
        cert: fs.readFileSync(path.join(__dirname, '../certificates/bihetech.pem'), {encoding: 'utf-8'})
      },
      body: req
    }, (error, response, body) => {
      resolve({
        status: 200,
        error: error,
        response: response,
        body: body
      })
    });
  });
}
const httpSvc = {}
httpSvc.login = async (req) => {
  const url = '/organizationManageService-api/account/posLogin';
  return await post(url, req);
}

httpSvc.config = async (req) => {
  const url = '/dataDictionaryService-api/posDicTerConfig/queryTeminalDic';
  return await post(url, req);
}

httpSvc.plans = async (req) => {
  const url = '/posResuorceService-api/pos/getPosPlanList';
  return await post(url, req);
}

httpSvc.memberLogin = async (req) => {
  const url = '/memberService-api/member/getMember';
  return await post(url, req);
}

httpSvc.createBlankShopCart = async (req) => {
  const url = '/orderService-api/posShopCart/createBlankShopCart';
  return await post(url, req);
}

httpSvc.createCartMember = async (req) => {
  const url = '/orderService-api/posShopCart/createCartMember';
  return await post(url, req);
}

httpSvc.getMemberCount = async (req) => {
  const url = '/memberService-api/member/getMemberCount';
  return await post(url, req);
}

httpSvc.cancellationMember = async (req) => {
  const url = '/orderService-api/posShopCart/cancellationMember';
  return await post(url, req);
}

httpSvc.getPosPlanTotalInfo = async (req) => {
  const url = '/posResuorceService-api/pos/getPosPlanTotalInfo';
  return await post(url, req);
}
module.exports = httpSvc;
