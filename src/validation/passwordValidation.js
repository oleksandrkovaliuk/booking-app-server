const Passwordvalidation = (password) => {
  const regularExpression =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regularExpression.test(password);
};

module.exports = Passwordvalidation;
