import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// 商户号和通信密钥
const app_id = '1234';
const key = '5678';


// 排序后转换为字符串
const toQueryString = (obj: any) => Object.keys(obj)
  .filter(key => key !== 'sign' && obj[key] !== undefined && obj[key] !== '')
  .sort()
  .map(key => {
    if (/^http(s)?:\/\//.test(obj[key])) { return key + '=' + encodeURI(obj[key]) } 
        else { return key + '=' + obj[key] }
  })
  .join('&')

// md5
const md5 = (str: string) => crypto.createHash('md5').update(str, 'utf8').digest('hex')


// 构造请求数据
let params: any = {
  app_id: 1234,
  out_trade_no: '61ecfde5db5d236efb0d6bd7',
  description: '苹果12 Pro Max 128G',
  pay_type: 'wechat',
  amount: 1,
  attach: '支付成功',
  notify_url: 'https://huangfamily.cn/api/products/top'
}

params = toQueryString(params);
console.log(params);
params += '&key=' + key;
console.log(params);

// 计算出最终签名
const sign = md5(params).toUpperCase()

console.log(sign)

const h5zhif = async () => {
  const body = {
    app_id: 1234,
    out_trade_no: '61ecfde5db5d236efb0d6bd7',
    description: '苹果12 Pro Max 128G',
    pay_type: 'wechat',
    amount: 1,
    attach: '支付成功',
    notify_url: 'https://huangfamily.cn/api/products/top',
    sign,
  };

  const response = await fetch('https://open.h5zhifu.com/api/native', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();
  console.log(data);

  return data;
};

h5zhif();

app.listen(port, () => {
  console.log(`服务已经启动，监听端口在 ${port}.`);
});