const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const s = require('stripe')
const stripe = require('stripe')('sk_test_51DdUXLAPPMmoAsRyKhWmSZPGUuwwHvkn35pJw0uhhzaOO8i95HDO2VrOFkVCejglW0tDu5l75y4QSWl2lkabjLAW00dfkxf40e'); // Add your Secret Key Here

const app = express();
const router = express.Router()

const account = stripe.accounts.create({
    type: 'custom',
    country: 'US',
    email: 'jenny.rosen@example.com',
    capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
    },
});
account.then(sd => {
    console.log(sd)
})

// This will make our form data much more useful
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));



// Future Code Goes Here

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));


module.exports = router