const keytar = require("keytar");

keytar.setPassword("amica", "mbuke", "mbukeprince784");

const secret = keytar.getPassword("amica", "mbuke");
secret.then((key) => {
  console.log(key);
});
