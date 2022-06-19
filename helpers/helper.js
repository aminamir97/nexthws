var jwt = require("jsonwebtoken");
const secret = "amin1997";

const checkJwt = async (token) => {
  try {
    const verfied = jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  checkJwt,
};
