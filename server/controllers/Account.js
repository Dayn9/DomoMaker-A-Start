// const { identity, has } = require('underscore');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy(); // destroy the current session
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // parameter checks
  if (!username || !password) {
    return res.status(400).json({ error: 'All Fields are required' });
  }

  //
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Username or password is incorrect' });
    }

    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // parameter checks
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All Fields are required' });
  }

  // check for password mismatch
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  //
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (req, res) => {
  const csrfJson = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJson);
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  getToken,
};
