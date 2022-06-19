var jwt = require("jsonwebtoken");
const secret = "amin1997";

const checkJwt = async (token) => {
  try {
    const verfied = jwt.verify(token, secret);
    console.log("verfied token = ", verfied);
    return true;
  } catch (error) {
    console.log(" token FALSE ");
    return false;
  }
};

module.exports = {
  checkJwt,
};
