const uuid = require('uuid');
const { Campaign }= require('../models/');


const generateCode = async () => {
    const id = uuid.v4().slice(0, 6);
    const camp = await Campaign.find({});
    const codes = camp.filter(input => input.code === id);
    if(codes.length > 0) {
        return generateCode();
    } else {
        return id;
    };
};

module.exports = generateCode;