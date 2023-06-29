const getSessionData = (req) => {
  const sessionData = req.session.flashData;
  req.session.flashData = null;
  return sessionData;
};

const flashDataToSession = (req, data, action) => {
  req.session.flashData = data;
  req.session.save(action);
};

module.exports = {
  getSessionData,
  flashDataToSession,
};
