var express = require('express');
var router = express.Router();
var request = require("request");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/full-page', function(req, res, next) {
  res.render('full-page', { title: 'full-page' });
});


router.get('/thankyou', function(req, res, next) {
  res.render('thankyou');
});



var CONFIG =  {
		"CLIENT_ID" :"ATDtSDCij93X_nKgEO_L9L7lpnjGLxl7W3PBqggsHIj1GUcP39eDuEFH6oguUmiesK3EukWadZtkVNWP",
		"SECRET":"ECeLYuRNOmNndr8GPNd10G8W5afcImSmKgoJgRg7i05IGi1B9gPYM0uxfwDXLmERLpqfKFosRP6AWVeZ",
		"ACCESS_TOKEN_URL":"https://api.sandbox.paypal.com/v1/oauth2/token",
		"CREATE_PAYMENT_URL":"https://api.sandbox.paypal.com/v1/payments/payment",
		"EXECUTE_PAYMENT_URL":"https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}/execute/",
		"GET_PAYMENT_DETAILS":"https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}",
		"CANCEL_URL":"https://nativexo-cart.herokuapp.com/thankyou",
		"RETURN_URL":"https://nativexo-cart.herokuapp.com/thankyou",
		"BN_CODE":"PP-DemoPortal-EC-JSV4-python-REST"
	};



var PAYLOAD = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "transactions": [
    {
      "amount": {
        "total": "30.11",
        "currency": "USD",
        "details": {
          "subtotal": "30.00",
          "tax": "0.07",
          "shipping": "0.03",
          "handling_fee": "1.00",
          "shipping_discount": "-1.00",
          "insurance": "0.01"
        }
      },
      "description": "The payment transaction description.",
      "custom": "EBAY_EMS_90048630024435",
      "invoice_number": "48787589673",
      "payment_options": {
        "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
      },
      "soft_descriptor": "SDKTEST",
      "item_list": {
        "items": [
          {
            "name": "hat",
            "description": "Brown hat.",
            "quantity": "5",
            "price": "3",
            "tax": "0.01",
            "sku": "1",
            "currency": "USD"
          },
          {
            "name": "handbag",
            "description": "Black handbag.",
            "quantity": "1",
            "price": "15",
            "tax": "0.02",
            "sku": "product34",
            "currency": "USD"
          }
        ],
        "shipping_address": {
          "recipient_name": "Brian Robinson",
          "line1": "4th Floor",
          "line2": "Unit #34",
          "city": "San Jose",
          "country_code": "US",
          "postal_code": "95131",
          "phone": "011862212345678",
          "state": "CA"
        }
      }
    }
  ],
  "note_to_payer": "Contact us for any questions on your order.",
  "redirect_urls": {
    "return_url": "https://nativexo-cart.herokuapp.com/thankyou",
    "cancel_url": "https://nativexo-cart.herokuapp.com/thankyou"
  }
};

router.get('/execute-payments', function(req,res,next) {
	console.log(req.body);
	console.log(req.query);
	res.send({status:true});
})

router.get('/create-payment', function(req,res,next) {

	try{
		
	 	var payLoad = PAYLOAD
	 	console.log(payLoad);
	 	getAccessToken(function(data) {

			var accessToken = JSON.parse(data).access_token;
		
			var _dataToSend = {

			}
			
			var options = { 
			  method: 'POST',
			  url: CONFIG.CREATE_PAYMENT_URL,
			  headers : {
					'content-type': "application/json",
					'authorization': "Bearer "+accessToken,
					'cache-control': "no-cache",
					'PayPal-Partner-Attribution-Id' : CONFIG.BN_CODE
					
				},
				body: payLoad,
				json:true
				
			}
			
			request(options, function (error, response, body) {
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			  console.log(body);
			  	res.send(body);
			  }
			});
			
		});
	}catch(e) {
		console.log(e)
	}


})


function getAccessToken(cb) {
	
	var url = CONFIG.ACCESS_TOKEN_URL;
	console.log(CONFIG.CLIENT_ID+"======"+CONFIG.SECRET)

	var token  = CONFIG.CLIENT_ID+":"+CONFIG.SECRET,
	    encodedKey = new Buffer(token).toString('base64'),
	    payload = "grant_type=client_credentials&Content-Type=application%2Fx-www-form-urlencoded&response_type=token&return_authn_schemes=true",
	    headers = {
			'authorization': "Basic "+encodedKey,
			'accept': "application/json",
			'accept-language': "en_US",
			'cache-control': "no-cache",
			'content-type': "application/x-www-form-urlencoded",
			'PayPal-Partner-Attribution-Id' : "PP-DemoPortal-SDKTEST-JSV4-python-REST"
			}

			var options = { 
			  method: 'POST',
			  url: CONFIG.ACCESS_TOKEN_URL,
			  headers: {
							'authorization': "Basic "+encodedKey,
							'accept': "application/json",
							'accept-language': "en_US",
							'cache-control': "no-cache",
							'content-type': "application/x-www-form-urlencoded",
							'PayPal-Partner-Attribution-Id' : "PP-DemoPortal-SDKTEST-JSV4-python-REST"

						},
				body:payload
			}

			request(options, function (error, response, body) {
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			  	cb(body)
			  }
			});
		}


module.exports = router;
