const uuid = require("uuid");

const generateCode = () => {
  const id = uuid.v4().slice(0, 10);
  return id ;
};

module.exports = generateCode;
