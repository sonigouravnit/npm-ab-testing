# npm-ab-testing

npm-ab-testing
==========

[![Latest Stable Version]](https://www.npmjs.com/package/npm-ab-testing)

A/B testing made easy.

## Install

	npm install npm-ab-testing

## Initialize

```
var ABTesting = require('npm-ab-testing');

```

## Set Configuration

```
ABTesting.setABConfig({
    cookieName: <cookieName-which-you-want-to-give>,
    weightage: {
        'traffic-for-blue-button': .1,
        'traffic -for-bold-text' : .05
    },
    expireTimeInHours: 24
});

* "cookieName" will be set on customer browser
* weightage represents percent of traffic you want to display ab-testing of a component.

ex :  for a button color chnage you want to consider 24% of your customers then weightage section would look like

weightage: {
        'traffic-for-button': .24,
    }

* expireTimeInHours ex: 24 , for 24 hours this user will be shown your a/b test cases.

```
## USE in express.js / route.js

```
    app.use(cookieParser());
	
	app.use('/',function(req,res,next){
		var array-of-cookie-names=ABTesting.getABTestCases(req,res,next);
        next();
	});

for button change cookie was set with name of "traffic-for-button"

if(array-of-cookie-names.indexOf("traffic-for-button")>=0){
    // display your new button
    //or
    // route to new url
}else{
    // display old button 
    //or
    // use old page url.
}

```