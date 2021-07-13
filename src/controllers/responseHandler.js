module.exports = {respondJSON : (req, res) => {
  const { status, code, message, body, location } = req.api_res;
  const res_data = {
    status,
    message,
    body,
    location
  };
  res.status(code).json(res_data);
}
}