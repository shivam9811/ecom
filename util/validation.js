const isEmpty = (value) => {
  return !value || value.trim() === "";
};

const emailAndPasswordAreValid = (email, password) => {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
};

const userDetailsAreValid = (
  email,
  password,
  fullname,
  address,
  postal,
  city
) => {
  return (
    emailAndPasswordAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(address) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
};

const loginDetailsAreValid = (email, password) => {
  return emailAndPasswordAreValid(email, password);
};

module.exports = { userDetailsAreValid, loginDetailsAreValid };
