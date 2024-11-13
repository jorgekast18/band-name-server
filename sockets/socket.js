const { io } = require('../index');


const Bands = require('../models/bands');
const Band = require('../models/band.model');

const bands = new Bands();

bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('La Mosca'));
bands.addBand(new Band('AC/DC'));
// Sockets messages
io.on('connection', client => {
    console.log('Client connected');

    client.emit('active-bands', bands.getBands());
    client.on('disconnect', () => {
        console.log('Cliente desconnnected');
    });


    client.on('add-votes', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});