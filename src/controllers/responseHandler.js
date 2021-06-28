module.exports = respondJSON = (req, res) => {
  const { status, code, message, body } = req.api_res;
  const res_data = {
    status,
    code,
    message,
    body,
  };
  res.status(code).json(res_data);
};
