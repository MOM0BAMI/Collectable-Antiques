// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// JavaScript for vertical image slider functionality
document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('main-img');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    const nextArrow = document.querySelector('.arrow.down');
    const prevArrow = document.querySelector('.arrow.up');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainImg.src = thumbnail.dataset.large;
        });
    });

    let scrollAmount = 0;
    const scrollStep = 100;
    const scrollDuration = 300;
    
    function scrollThumbnails(direction) {
        const containerHeight = thumbnailsContainer.clientHeight;
        const totalHeight = thumbnailsContainer.scrollHeight;
        const maxScroll = totalHeight - containerHeight;

        if (direction === 'up') {
            scrollAmount -= scrollStep;
            if (scrollAmount < 0) scrollAmount = 0;
        } else {
            scrollAmount += scrollStep;
            if (scrollAmount > maxScroll) scrollAmount = maxScroll;
        }

        thumbnailsContainer.scrollTo({
            top: scrollAmount,
            behavior: 'smooth'
        });
    }

    nextArrow.addEventListener('click', () => scrollThumbnails('down'));
    prevArrow.addEventListener('click', () => scrollThumbnails('up'));
});

window.onload = function() {
    let images = document.querySelectorAll('.item img');
    images.forEach(img => {
        img.style.width = img.parentElement.offsetWidth + 'px';
        img.style.height = img.parentElement.offsetHeight + 'px';
    });
};

const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'T-shirt',
                },
                unit_amount: 2000,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://yourdomain.com/success',
        cancel_url: 'https://yourdomain.com/cancel',
    });
    res.json({ id: session.id });
});

document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodSelect = document.getElementById('payment-method');
    const stripeButtonContainer = document.getElementById('stripe-button-container');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    
    // Show the appropriate payment button based on selection
    paymentMethodSelect.addEventListener('change', (event) => {
        if (event.target.value === 'paypal') {
            stripeButtonContainer.style.display = 'none';
            paypalButtonContainer.style.display = 'block';
        } else {
            paypalButtonContainer.style.display = 'none';
            stripeButtonContainer.style.display = 'block';
        }
    });

    // PayPal Button
    paypal.Buttons({
        createOrder: function(data, actions) {
            return fetch('/create-order', {
                method: 'post'
            }).then(function(res) {
                return res.json();
            }).then(function(orderData) {
                return orderData.id;
            });
        },
        onApprove: function(data, actions) {
            return fetch('/execute-payment', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentID: data.paymentID,
                    payerID: data.payerID
                })
            }).then(function(res) {
                return res.json();
            }).then(function(paymentData) {
                if (paymentData.state === 'approved') {
                    window.location.href = '/thank-you.html';
                }
            });
        }
    }).render('#paypal-button-container');

    // Stripe Button
    const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
    const paymentForm = document.getElementById('payment-form');
    const stripeButton = document.getElementById('stripe-button');

    stripeButton.addEventListener('click', async () => {
        const {error, paymentIntent} = await fetch('/create-payment-intent', {
            method: 'POST'
        }).then((res) => res.json());

        if (error) {
            console.error(error);
            return;
        }

        const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                card: {
                    number: '4242424242424242',
                    exp_month: 12,
                    exp_year: 2024,
                    cvc: '123'
                }
            }
        });

        if (result.error) {
            console.error(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
            window.location.href = '/thank-you.html';
        }
    });
});
