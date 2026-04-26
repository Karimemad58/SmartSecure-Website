const express = require('express');
const db = require('./db/connection');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.get('/', (req, res) => {
  res.send("Server is running");
});

 userRoutes = require('./Modules/user/user.services');
app.use('/Modules/user',userRoutes);
 subplRoutes = require('./Modules/subscription_plan/subscription_plan.services');
app.use('/Modules/subscription_plan',subplRoutes);
subRoutes = require('./Modules/subscription/subscription.services');
app.use('/Modules/subscription',subRoutes);
 locationRoutes = require('./Modules/location/location.services');
app.use('/Modules/location',locationRoutes);
 smartdevRoutes = require('./Modules/smart_device/smart_device.services');
app.use('/Modules/smart_device',smartdevRoutes);
lockerRoutes = require('./Modules/locker/locker.services');
app.use('/Modules/locker',lockerRoutes);
reportRoutes = require('./Modules/report/report.services');
app.use('/Modules/report',reportRoutes);
reservationRoutes = require('./Modules/reservation/reservation.services');
app.use('/Modules/reservation',reservationRoutes);
paymentRoutes = require('./Modules/payment/payment.services');
app.use('/Modules/payment',paymentRoutes);
notificationRoutes = require('./Modules/notification/notification.services');
app.use('/Modules/notification',notificationRoutes);
app.listen(PORT, () => {
  console.log('Server started on http://localhost:'+ PORT);
});