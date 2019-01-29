const utils = require('ethereumjs-util')
const BN = utils.BN
const pow32 = new BN('010000000000000000000000000000000000000000000000000000000000000000', 16)
const pow31 = new BN('0100000000000000000000000000000000000000000000000000000000000000', 16)
const pow30 = new BN('01000000000000000000000000000000000000000000000000000000000000', 16)
const pow29 = new BN('010000000000000000000000000000000000000000000000000000000000', 16)
const pow28 = new BN('0100000000000000000000000000000000000000000000000000000000', 16)
const pow27 = new BN('01000000000000000000000000000000000000000000000000000000', 16)
const pow26 = new BN('010000000000000000000000000000000000000000000000000000', 16)
const pow25 = new BN('0100000000000000000000000000000000000000000000000000', 16)
const pow24 = new BN('01000000000000000000000000000000000000000000000000', 16)
const pow23 = new BN('010000000000000000000000000000000000000000000000', 16)
const pow22 = new BN('0100000000000000000000000000000000000000000000', 16)
const pow21 = new BN('01000000000000000000000000000000000000000000', 16)
const pow20 = new BN('010000000000000000000000000000000000000000', 16)
const pow19 = new BN('0100000000000000000000000000000000000000', 16)
const pow18 = new BN('01000000000000000000000000000000000000', 16)
const pow17 = new BN('010000000000000000000000000000000000', 16)
const pow16 = new BN('0100000000000000000000000000000000', 16)
const pow15 = new BN('01000000000000000000000000000000', 16)
const pow14 = new BN('010000000000000000000000000000', 16)
const pow13 = new BN('0100000000000000000000000000', 16)
const pow12 = new BN('01000000000000000000000000', 16)
const pow11 = new BN('010000000000000000000000', 16)
const pow10 = new BN('0100000000000000000000', 16)
const pow9 = new BN('01000000000000000000', 16)
const pow8 = new BN('010000000000000000', 16)
const pow7 = new BN('0100000000000000', 16)
const pow6 = new BN('01000000000000', 16)
const pow5 = new BN('010000000000', 16)
const pow4 = new BN('0100000000', 16)
const pow3 = new BN('01000000', 16)
const pow2 = new BN('010000', 16)
const pow1 = new BN('0100', 16)

module.exports = function (a) {
  if (a.cmp(pow1) === -1) {
    return 0
  } else if (a.cmp(pow2) === -1) {
    return 1
  } else if (a.cmp(pow3) === -1) {
    return 2
  } else if (a.cmp(pow4) === -1) {
    return 3
  } else if (a.cmp(pow5) === -1) {
    return 4
  } else if (a.cmp(pow6) === -1) {
    return 5
  } else if (a.cmp(pow7) === -1) {
    return 6
  } else if (a.cmp(pow8) === -1) {
    return 7
  } else if (a.cmp(pow9) === -1) {
    return 8
  } else if (a.cmp(pow10) === -1) {
    return 9
  } else if (a.cmp(pow11) === -1) {
    return 10
  } else if (a.cmp(pow12) === -1) {
    return 11
  } else if (a.cmp(pow13) === -1) {
    return 12
  } else if (a.cmp(pow14) === -1) {
    return 13
  } else if (a.cmp(pow15) === -1) {
    return 14
  } else if (a.cmp(pow16) === -1) {
    return 15
  } else if (a.cmp(pow17) === -1) {
    return 16
  } else if (a.cmp(pow18) === -1) {
    return 17
  } else if (a.cmp(pow19) === -1) {
    return 18
  } else if (a.cmp(pow20) === -1) {
    return 19
  } else if (a.cmp(pow21) === -1) {
    return 20
  } else if (a.cmp(pow22) === -1) {
    return 21
  } else if (a.cmp(pow23) === -1) {
    return 22
  } else if (a.cmp(pow24) === -1) {
    return 23
  } else if (a.cmp(pow25) === -1) {
    return 24
  } else if (a.cmp(pow26) === -1) {
    return 25
  } else if (a.cmp(pow27) === -1) {
    return 26
  } else if (a.cmp(pow28) === -1) {
    return 27
  } else if (a.cmp(pow29) === -1) {
    return 28
  } else if (a.cmp(pow30) === -1) {
    return 29
  } else if (a.cmp(pow31) === -1) {
    return 30
  } else if (a.cmp(pow32) === -1) {
    return 31
  } else {
    return 32
  }
}
