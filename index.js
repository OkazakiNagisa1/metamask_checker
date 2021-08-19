var fs = require('fs-extra');
var path = require('path');
const fsNative = require('fs');
const request = require('request');
function req(option) {
    return new Promise((resolve, reject) => {
        request(option, async function (err, res, body) {
            if (err) return reject(err);
            resolve({
                headers: res.headers,
                status: res.statusCode,
                body
            });
        });
    });
}

console.log('https://lolz.guru/metamask/');


var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {

    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            results.push();
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

/*

*/

let totalWallets = new Map;
let totalWalletsTron = new Map;
const erc20CheckAdress = async (address) => {
  let eth = await req(`https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?&key=${token}`, {json: true}).catch(err=> console.log(err));
  let bnb = await req(`https://api.covalenthq.com/v1/56/address/${address}/balances_v2/?&key=${token}`, {json: true}).catch(err=> console.log(err));
  let matic = await req(`https://api.covalenthq.com/v1/137/address/${address}/balances_v2/?&key=${token}`, {json: true}).catch(err=> console.log(err));
  let ftm = await req(`https://api.covalenthq.com/v1/250/address/${address}/balances_v2/?&key=${token}`, {json: true}).catch(err=> console.log(err));
  const balance = {address: address, eth: {balance: JSON.parse(eth.body).data.items.map(i=>x+=i.quote, x=0).reverse()[0].toFixed(2), tokensCount: JSON.parse(eth.body).data.items.length}, bnb : {balance: JSON.parse(bnb.body).data.items.map(i=>x+=i.quote, x=0).reverse()[0].toFixed(2), tokensCount: JSON.parse(bnb.body).data.items.length}, matic: {balance: JSON.parse(matic.body).data.items.map(i=>x+=i.quote, x=0).reverse()[0].toFixed(2), tokensCount: JSON.parse(matic.body).data.items.length}, ftm: {balance: JSON.parse(ftm.body).data.items.map(i=>x+=i.quote, x=0).reverse()[0].toFixed(2), tokensCount: JSON.parse(ftm.body).data.items.length}};
console.log(`<===========================>`);
console.log(`Кошель : ${address}`);
console.log(`Баланс eth сети: ${balance.eth.balance} // Токены: ${balance.eth.tokensCount}`);
console.log(`Баланс bnb сети: ${balance.bnb.balance} // Токены: ${balance.bnb.tokensCount}`);
console.log(`Баланс matic сети: ${balance.matic.balance} // Токены: ${balance.matic.tokensCount}`);
console.log(`Баланс ftm сети: ${balance.ftm.balance} // Токены: ${balance.ftm.tokensCount}`);
console.log(`<===========================>`);

  return balance;
} 

if (!fs.existsSync('./logs')){
  console.log('Папка logs пустая');
  return fs.mkdirSync('./logs');
}

if (!fs.existsSync('./apitoken.txt')){
  console.log('Посмотри в файл apitoken.txt');
  return fs.writeFileSync('./apitoken.txt', 'Нету токена от апишки, возьми токен тут https://www.covalenthq.com/, а после сотри тут весь текст и оставь только токен, в противнорм случаее софт будет выдавать ошибки');
}

let token = fs.readFileSync('./apitoken.txt', 'utf-8');
console.log('Начинаю собирать пути ожидайте.');
walk('./logs', async(err, results) => {
  if (err) throw err;
console.log(`Собрал путей : ${results.length}`);
  for ( strPath of results) {
	  try{
          if(strPath.toLowerCase().includes("autofill")) 
            continue;
      let data = fs.readFileSync(strPath, 'utf-8');
      let data2 = [...(data.matchAll(/({"cachedBalances":).*?(}})/g))].map(x=>x[0]).flat(Infinity);
         let wallets = [...new Set([...(data2.toString()
          .matchAll(/0x+[A-F,a-f,0-9]{40}/gm))].map(x=>x[0]).flat(Infinity))]; 
		        let data3 = [...(data.matchAll(/({\\"info).*?(}])/g))].map(x=>x[0]).flat(Infinity);
         let wallets2 = [...new Set([...(data3.toString()
          .matchAll(/0x+[A-F,a-f,0-9]{40}/gm))].map(x=>x[0]).flat(Infinity))];
		        let data4 = [...(data.matchAll(/(selectedAccountc{"address").*?(})/g))].map(x=>x[0]).flat(Infinity);
         let wallets3 = [...new Set([...(data4.toString()
          .matchAll(/0x+[A-F,a-f,0-9]{40}/gm))].map(x=>x[0]).flat(Infinity))];


		  for(wallet of wallets){
		  totalWallets.set(wallet, strPath);
		  console.log(wallet);
		  }
		  
		  for(wallet of wallets2){
		  totalWallets.set(wallet, strPath);
		  console.log(wallet);
		  }
		  
		  
		  for(wallet of wallets3){
		  totalWallets.set(wallet, strPath);
		  console.log(wallet);
		  }
	  


	  } catch(err) {
		  console.log(err)
	  }
  }
  console.log('https://lolz.guru/metamask/');

  for( wallet of [...totalWallets.entries()] ) {
      try{
    let walletInfo =  await erc20CheckAdress(wallet[0]);
    if(walletInfo.eth.error){
       await new Promise(resolve => setTimeout(resolve, 30000));
    }
	    if(walletInfo.bnb == "Internal server error"){
       await new Promise(resolve => setTimeout(resolve, 30000));
    }
    fsNative.appendFileSync("./result.txt", `${wallet[0]} <=> Balance [ ${walletInfo.eth.balance}$ ETH, ${walletInfo.bnb.balance}$ BNB,  ${walletInfo.matic.balance}$ MATIC, ${walletInfo.ftm.balance}$ Fantom ] | Tokens count [ ${walletInfo.eth.tokensCount} ETH, ${walletInfo.bnb.tokensCount} BNB, ${walletInfo.matic.tokensCount} MATIC, ${walletInfo.ftm.tokensCount} FTM ] => ${wallet[1]}\n`);
      } catch(e) {
		  console.log(e);
          try {
        let walletInfo =  await erc20CheckAdress(wallet[0]);
        fsNative.appendFileSync("./result.txt", `${wallet[0]} <=> Balance [ ${walletInfo.eth.balance}$ ETH, ${walletInfo.bnb.balance}$ BNB,  ${walletInfo.matic.balance}$ MATIC, ${walletInfo.ftm.balance}$ Fantom ] | Tokens count [ ${walletInfo.eth.tokensCount} ETH, ${walletInfo.bnb.tokensCount} BNB, ${walletInfo.matic.tokensCount} MATIC, ${walletInfo.ftm.tokensCount} FTM ] => ${wallet[1]}\n`);
          } catch(e) {
            fsNative.appendFileSync("./result.txt", `${wallet[0]} | ERROR => ${wallet[1]}\n`);
          }
      }
  }
  console.log('https://lolz.guru/metamask/');

});

