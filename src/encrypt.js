function randoms(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function getRandomValues(buf) {
  var min = 0,
    max = 255
  if (buf.length > 65536) {
    var e = new Error()
    e.code = 22
    e.message =
      "Failed to execute 'getRandomValues' : The " +
      "ArrayBufferView's byte length (" +
      buf.length +
      ') exceeds the ' +
      'number of bytes of entropy available via this API (65536).'
    e.name = 'QuotaExceededError'
    throw e
  }
  if (buf instanceof Uint16Array) {
    max = 65535
  } else if (buf instanceof Uint32Array) {
    max = 4294967295
  }
  for (var element in buf) {
    buf[element] = randoms(min, max)
  }
  return buf
}

var navigator = {}
var window = { crypto: { getRandomValues } }

var dbits,
  canary = 0xdeadbeefcafe,
  j_lm = 15715070 == (16777215 & canary)
function BigInteger(t, r, i) {
  null != t &&
    ('number' == typeof t
      ? this.fromNumber(t, r, i)
      : null == r && 'string' != typeof t
      ? this.fromString(t, 256)
      : this.fromString(t, r))
}
function nbi() {
  return new BigInteger(null)
}
function am1(t, r, i, n, o, e) {
  for (; 0 <= --e; ) {
    var s = r * this[t++] + i[n] + o
    ;(o = Math.floor(s / 67108864)), (i[n++] = 67108863 & s)
  }
  return o
}
function am2(t, r, i, n, o, e) {
  for (var s = 32767 & r, h = r >> 15; 0 <= --e; ) {
    var p = 32767 & this[t],
      g = this[t++] >> 15,
      u = h * p + g * s
    ;(o =
      ((p = s * p + ((32767 & u) << 15) + i[n] + (1073741823 & o)) >>> 30) +
      (u >>> 15) +
      h * g +
      (o >>> 30)),
      (i[n++] = 1073741823 & p)
  }
  return o
}
function am3(t, r, i, n, o, e) {
  for (var s = 16383 & r, h = r >> 14; 0 <= --e; ) {
    var p = 16383 & this[t],
      g = this[t++] >> 14,
      u = h * p + g * s
    ;(o =
      ((p = s * p + ((16383 & u) << 14) + i[n] + o) >> 28) + (u >> 14) + h * g),
      (i[n++] = 268435455 & p)
  }
  return o
}
;(dbits =
  j_lm && 'Microsoft Internet Explorer' == navigator.appName
    ? ((BigInteger.prototype.am = am2), 30)
    : j_lm && 'Netscape' != navigator.appName
    ? ((BigInteger.prototype.am = am1), 26)
    : ((BigInteger.prototype.am = am3), 28)),
  (BigInteger.prototype.DB = dbits),
  (BigInteger.prototype.DM = (1 << dbits) - 1),
  (BigInteger.prototype.DV = 1 << dbits)
var BI_FP = 52
;(BigInteger.prototype.FV = Math.pow(2, BI_FP)),
  (BigInteger.prototype.F1 = BI_FP - dbits),
  (BigInteger.prototype.F2 = 2 * dbits - BI_FP)
var rr,
  vv,
  BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz',
  BI_RC = new Array()
for (rr = '0'.charCodeAt(0), vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv
for (rr = 'a'.charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv
for (rr = 'A'.charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv
function int2char(t) {
  return BI_RM.charAt(t)
}
function intAt(t, r) {
  var i = BI_RC[t.charCodeAt(r)]
  return null == i ? -1 : i
}
function bnpCopyTo(t) {
  for (var r = this.t - 1; 0 <= r; --r) t[r] = this[r]
  ;(t.t = this.t), (t.s = this.s)
}
function bnpFromInt(t) {
  ;(this.t = 1),
    (this.s = t < 0 ? -1 : 0),
    0 < t ? (this[0] = t) : t < -1 ? (this[0] = t + this.DV) : (this.t = 0)
}
function nbv(t) {
  var r = nbi()
  return r.fromInt(t), r
}
function bnpFromString(t, r) {
  var i
  if (16 == r) i = 4
  else if (8 == r) i = 3
  else if (256 == r) i = 8
  else if (2 == r) i = 1
  else if (32 == r) i = 5
  else {
    if (4 != r) return void this.fromRadix(t, r)
    i = 2
  }
  ;(this.t = 0), (this.s = 0)
  for (var n = t.length, o = !1, e = 0; 0 <= --n; ) {
    var s = 8 == i ? 255 & t[n] : intAt(t, n)
    s < 0
      ? '-' == t.charAt(n) && (o = !0)
      : ((o = !1),
        0 == e
          ? (this[this.t++] = s)
          : e + i > this.DB
          ? ((this[this.t - 1] |= (s & ((1 << (this.DB - e)) - 1)) << e),
            (this[this.t++] = s >> (this.DB - e)))
          : (this[this.t - 1] |= s << e),
        (e += i) >= this.DB && (e -= this.DB))
  }
  8 == i &&
    0 != (128 & t[0]) &&
    ((this.s = -1),
    0 < e && (this[this.t - 1] |= ((1 << (this.DB - e)) - 1) << e)),
    this.clamp(),
    o && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
  for (var t = this.s & this.DM; 0 < this.t && this[this.t - 1] == t; ) --this.t
}
function bnToString(t) {
  if (this.s < 0) return '-' + this.negate().toString(t)
  var r
  if (16 == t) r = 4
  else if (8 == t) r = 3
  else if (2 == t) r = 1
  else if (32 == t) r = 5
  else {
    if (4 != t) return this.toRadix(t)
    r = 2
  }
  var i,
    n = (1 << r) - 1,
    o = !1,
    e = '',
    s = this.t,
    h = this.DB - ((s * this.DB) % r)
  if (0 < s--)
    for (
      h < this.DB && 0 < (i = this[s] >> h) && ((o = !0), (e = int2char(i)));
      0 <= s;

    )
      h < r
        ? ((i = (this[s] & ((1 << h) - 1)) << (r - h)),
          (i |= this[--s] >> (h += this.DB - r)))
        : ((i = (this[s] >> (h -= r)) & n), h <= 0 && ((h += this.DB), --s)),
        0 < i && (o = !0),
        o && (e += int2char(i))
  return o ? e : '0'
}
function bnNegate() {
  var t = nbi()
  return BigInteger.ZERO.subTo(this, t), t
}
function bnAbs() {
  return this.s < 0 ? this.negate() : this
}
function bnCompareTo(t) {
  var r = this.s - t.s
  if (0 != r) return r
  var i = this.t
  if (0 != (r = i - t.t)) return this.s < 0 ? -r : r
  for (; 0 <= --i; ) if (0 != (r = this[i] - t[i])) return r
  return 0
}
function nbits(t) {
  var r,
    i = 1
  return (
    0 != (r = t >>> 16) && ((t = r), (i += 16)),
    0 != (r = t >> 8) && ((t = r), (i += 8)),
    0 != (r = t >> 4) && ((t = r), (i += 4)),
    0 != (r = t >> 2) && ((t = r), (i += 2)),
    0 != (r = t >> 1) && ((t = r), (i += 1)),
    i
  )
}
function bnBitLength() {
  return this.t <= 0
    ? 0
    : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}
function bnpDLShiftTo(t, r) {
  var i
  for (i = this.t - 1; 0 <= i; --i) r[i + t] = this[i]
  for (i = t - 1; 0 <= i; --i) r[i] = 0
  ;(r.t = this.t + t), (r.s = this.s)
}
function bnpDRShiftTo(t, r) {
  for (var i = t; i < this.t; ++i) r[i - t] = this[i]
  ;(r.t = Math.max(this.t - t, 0)), (r.s = this.s)
}
function bnpLShiftTo(t, r) {
  var i,
    n = t % this.DB,
    o = this.DB - n,
    e = (1 << o) - 1,
    s = Math.floor(t / this.DB),
    h = (this.s << n) & this.DM
  for (i = this.t - 1; 0 <= i; --i)
    (r[i + s + 1] = (this[i] >> o) | h), (h = (this[i] & e) << n)
  for (i = s - 1; 0 <= i; --i) r[i] = 0
  ;(r[s] = h), (r.t = this.t + s + 1), (r.s = this.s), r.clamp()
}
function bnpRShiftTo(t, r) {
  r.s = this.s
  var i = Math.floor(t / this.DB)
  if (i >= this.t) r.t = 0
  else {
    var n = t % this.DB,
      o = this.DB - n,
      e = (1 << n) - 1
    r[0] = this[i] >> n
    for (var s = i + 1; s < this.t; ++s)
      (r[s - i - 1] |= (this[s] & e) << o), (r[s - i] = this[s] >> n)
    0 < n && (r[this.t - i - 1] |= (this.s & e) << o),
      (r.t = this.t - i),
      r.clamp()
  }
}
function bnpSubTo(t, r) {
  for (var i = 0, n = 0, o = Math.min(t.t, this.t); i < o; )
    (n += this[i] - t[i]), (r[i++] = n & this.DM), (n >>= this.DB)
  if (t.t < this.t) {
    for (n -= t.s; i < this.t; )
      (n += this[i]), (r[i++] = n & this.DM), (n >>= this.DB)
    n += this.s
  } else {
    for (n += this.s; i < t.t; )
      (n -= t[i]), (r[i++] = n & this.DM), (n >>= this.DB)
    n -= t.s
  }
  ;(r.s = n < 0 ? -1 : 0),
    n < -1 ? (r[i++] = this.DV + n) : 0 < n && (r[i++] = n),
    (r.t = i),
    r.clamp()
}
function bnpMultiplyTo(t, r) {
  var i = this.abs(),
    n = t.abs(),
    o = i.t
  for (r.t = o + n.t; 0 <= --o; ) r[o] = 0
  for (o = 0; o < n.t; ++o) r[o + i.t] = i.am(0, n[o], r, o, 0, i.t)
  ;(r.s = 0), r.clamp(), this.s != t.s && BigInteger.ZERO.subTo(r, r)
}
function bnpSquareTo(t) {
  for (var r = this.abs(), i = (t.t = 2 * r.t); 0 <= --i; ) t[i] = 0
  for (i = 0; i < r.t - 1; ++i) {
    var n = r.am(i, r[i], t, 2 * i, 0, 1)
    ;(t[i + r.t] += r.am(i + 1, 2 * r[i], t, 2 * i + 1, n, r.t - i - 1)) >=
      r.DV && ((t[i + r.t] -= r.DV), (t[i + r.t + 1] = 1))
  }
  0 < t.t && (t[t.t - 1] += r.am(i, r[i], t, 2 * i, 0, 1)), (t.s = 0), t.clamp()
}
function bnpDivRemTo(t, r, i) {
  var n = t.abs()
  if (!(n.t <= 0)) {
    var o = this.abs()
    if (o.t < n.t)
      return null != r && r.fromInt(0), void (null != i && this.copyTo(i))
    null == i && (i = nbi())
    var e = nbi(),
      s = this.s,
      h = t.s,
      p = this.DB - nbits(n[n.t - 1])
    0 < p ? (n.lShiftTo(p, e), o.lShiftTo(p, i)) : (n.copyTo(e), o.copyTo(i))
    var g = e.t,
      u = e[g - 1]
    if (0 != u) {
      var a = u * (1 << this.F1) + (1 < g ? e[g - 2] >> this.F2 : 0),
        f = this.FV / a,
        l = (1 << this.F1) / a,
        c = 1 << this.F2,
        m = i.t,
        v = m - g,
        b = null == r ? nbi() : r
      for (
        e.dlShiftTo(v, b),
          0 <= i.compareTo(b) && ((i[i.t++] = 1), i.subTo(b, i)),
          BigInteger.ONE.dlShiftTo(g, b),
          b.subTo(e, e);
        e.t < g;

      )
        e[e.t++] = 0
      for (; 0 <= --v; ) {
        var y =
          i[--m] == u ? this.DM : Math.floor(i[m] * f + (i[m - 1] + c) * l)
        if ((i[m] += e.am(0, y, i, v, 0, g)) < y)
          for (e.dlShiftTo(v, b), i.subTo(b, i); i[m] < --y; ) i.subTo(b, i)
      }
      null != r && (i.drShiftTo(g, r), s != h && BigInteger.ZERO.subTo(r, r)),
        (i.t = g),
        i.clamp(),
        0 < p && i.rShiftTo(p, i),
        s < 0 && BigInteger.ZERO.subTo(i, i)
    }
  }
}
function bnMod(t) {
  var r = nbi()
  return (
    this.abs().divRemTo(t, null, r),
    this.s < 0 && 0 < r.compareTo(BigInteger.ZERO) && t.subTo(r, r),
    r
  )
}
function Classic(t) {
  this.m = t
}
function cConvert(t) {
  return t.s < 0 || 0 <= t.compareTo(this.m) ? t.mod(this.m) : t
}
function cRevert(t) {
  return t
}
function cReduce(t) {
  t.divRemTo(this.m, null, t)
}
function cMulTo(t, r, i) {
  t.multiplyTo(r, i), this.reduce(i)
}
function cSqrTo(t, r) {
  t.squareTo(r), this.reduce(r)
}
function bnpInvDigit() {
  if (this.t < 1) return 0
  var t = this[0]
  if (0 == (1 & t)) return 0
  var r = 3 & t
  return 0 <
    (r =
      ((r =
        ((r =
          ((r = (r * (2 - (15 & t) * r)) & 15) * (2 - (255 & t) * r)) & 255) *
          (2 - (((65535 & t) * r) & 65535))) &
        65535) *
        (2 - ((t * r) % this.DV))) %
      this.DV)
    ? this.DV - r
    : -r
}
function Montgomery(t) {
  ;(this.m = t),
    (this.mp = t.invDigit()),
    (this.mpl = 32767 & this.mp),
    (this.mph = this.mp >> 15),
    (this.um = (1 << (t.DB - 15)) - 1),
    (this.mt2 = 2 * t.t)
}
function montConvert(t) {
  var r = nbi()
  return (
    t.abs().dlShiftTo(this.m.t, r),
    r.divRemTo(this.m, null, r),
    t.s < 0 && 0 < r.compareTo(BigInteger.ZERO) && this.m.subTo(r, r),
    r
  )
}
function montRevert(t) {
  var r = nbi()
  return t.copyTo(r), this.reduce(r), r
}
function montReduce(t) {
  for (; t.t <= this.mt2; ) t[t.t++] = 0
  for (var r = 0; r < this.m.t; ++r) {
    var i = 32767 & t[r],
      n =
        (i * this.mpl +
          (((i * this.mph + (t[r] >> 15) * this.mpl) & this.um) << 15)) &
        t.DM
    for (
      t[(i = r + this.m.t)] += this.m.am(0, n, t, r, 0, this.m.t);
      t[i] >= t.DV;

    )
      (t[i] -= t.DV), t[++i]++
  }
  t.clamp(),
    t.drShiftTo(this.m.t, t),
    0 <= t.compareTo(this.m) && t.subTo(this.m, t)
}
function montSqrTo(t, r) {
  t.squareTo(r), this.reduce(r)
}
function montMulTo(t, r, i) {
  t.multiplyTo(r, i), this.reduce(i)
}
function bnpIsEven() {
  return 0 == (0 < this.t ? 1 & this[0] : this.s)
}
function bnpExp(t, r) {
  if (4294967295 < t || t < 1) return BigInteger.ONE
  var i = nbi(),
    n = nbi(),
    o = r.convert(this),
    e = nbits(t) - 1
  for (o.copyTo(i); 0 <= --e; )
    if ((r.sqrTo(i, n), 0 < (t & (1 << e)))) r.mulTo(n, o, i)
    else {
      var s = i
      ;(i = n), (n = s)
    }
  return r.revert(i)
}
function bnModPowInt(t, r) {
  var i
  return (
    (i = t < 256 || r.isEven() ? new Classic(r) : new Montgomery(r)),
    this.exp(t, i)
  )
}
function Arcfour() {
  ;(this.i = 0), (this.j = 0), (this.S = new Array())
}
function ARC4init(t) {
  var r, i, n
  for (r = 0; r < 256; ++r) this.S[r] = r
  for (r = i = 0; r < 256; ++r)
    (i = (i + this.S[r] + t[r % t.length]) & 255),
      (n = this.S[r]),
      (this.S[r] = this.S[i]),
      (this.S[i] = n)
  ;(this.i = 0), (this.j = 0)
}
function ARC4next() {
  var t
  return (
    (this.i = (this.i + 1) & 255),
    (this.j = (this.j + this.S[this.i]) & 255),
    (t = this.S[this.i]),
    (this.S[this.i] = this.S[this.j]),
    (this.S[this.j] = t),
    this.S[(t + this.S[this.i]) & 255]
  )
}
function prng_newstate() {
  return new Arcfour()
}
;(Classic.prototype.convert = cConvert),
  (Classic.prototype.revert = cRevert),
  (Classic.prototype.reduce = cReduce),
  (Classic.prototype.mulTo = cMulTo),
  (Classic.prototype.sqrTo = cSqrTo),
  (Montgomery.prototype.convert = montConvert),
  (Montgomery.prototype.revert = montRevert),
  (Montgomery.prototype.reduce = montReduce),
  (Montgomery.prototype.mulTo = montMulTo),
  (Montgomery.prototype.sqrTo = montSqrTo),
  (BigInteger.prototype.copyTo = bnpCopyTo),
  (BigInteger.prototype.fromInt = bnpFromInt),
  (BigInteger.prototype.fromString = bnpFromString),
  (BigInteger.prototype.clamp = bnpClamp),
  (BigInteger.prototype.dlShiftTo = bnpDLShiftTo),
  (BigInteger.prototype.drShiftTo = bnpDRShiftTo),
  (BigInteger.prototype.lShiftTo = bnpLShiftTo),
  (BigInteger.prototype.rShiftTo = bnpRShiftTo),
  (BigInteger.prototype.subTo = bnpSubTo),
  (BigInteger.prototype.multiplyTo = bnpMultiplyTo),
  (BigInteger.prototype.squareTo = bnpSquareTo),
  (BigInteger.prototype.divRemTo = bnpDivRemTo),
  (BigInteger.prototype.invDigit = bnpInvDigit),
  (BigInteger.prototype.isEven = bnpIsEven),
  (BigInteger.prototype.exp = bnpExp),
  (BigInteger.prototype.toString = bnToString),
  (BigInteger.prototype.negate = bnNegate),
  (BigInteger.prototype.abs = bnAbs),
  (BigInteger.prototype.compareTo = bnCompareTo),
  (BigInteger.prototype.bitLength = bnBitLength),
  (BigInteger.prototype.mod = bnMod),
  (BigInteger.prototype.modPowInt = bnModPowInt),
  (BigInteger.ZERO = nbv(0)),
  (BigInteger.ONE = nbv(1)),
  (Arcfour.prototype.init = ARC4init),
  (Arcfour.prototype.next = ARC4next)
var rng_state,
  rng_pool,
  rng_pptr,
  rng_psize = 256
function rng_seed_int(t) {
  ;(rng_pool[rng_pptr++] ^= 255 & t),
    (rng_pool[rng_pptr++] ^= (t >> 8) & 255),
    (rng_pool[rng_pptr++] ^= (t >> 16) & 255),
    (rng_pool[rng_pptr++] ^= (t >> 24) & 255),
    rng_psize <= rng_pptr && (rng_pptr -= rng_psize)
}
function rng_seed_time() {
  rng_seed_int(new Date().getTime())
}
if (null == rng_pool) {
  var t
  if (
    ((rng_pool = new Array()),
    (rng_pptr = 0),
    window.crypto && window.crypto.getRandomValues)
  ) {
    var ua = new Uint8Array(32)
    for (window.crypto.getRandomValues(ua), t = 0; t < 32; ++t)
      rng_pool[rng_pptr++] = ua[t]
  }
  if (
    'Netscape' == navigator.appName &&
    navigator.appVersion < '5' &&
    window.crypto
  ) {
    var z = window.crypto.random(32)
    for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = 255 & z.charCodeAt(t)
  }
  for (; rng_pptr < rng_psize; )
    (t = Math.floor(65536 * Math.random())),
      (rng_pool[rng_pptr++] = t >>> 8),
      (rng_pool[rng_pptr++] = 255 & t)
  ;(rng_pptr = 0), rng_seed_time()
}
function rng_get_byte() {
  if (null == rng_state) {
    for (
      rng_seed_time(),
        (rng_state = prng_newstate()).init(rng_pool),
        rng_pptr = 0;
      rng_pptr < rng_pool.length;
      ++rng_pptr
    )
      rng_pool[rng_pptr] = 0
    rng_pptr = 0
  }
  return rng_state.next()
}
function rng_get_bytes(t) {
  var r
  for (r = 0; r < t.length; ++r) t[r] = rng_get_byte()
}
function SecureRandom() {}
function parseBigInt(t, r) {
  return new BigInteger(t, r)
}
function linebrk(t, r) {
  for (var i = '', n = 0; n + r < t.length; )
    (i += t.substring(n, n + r) + '\n'), (n += r)
  return i + t.substring(n, t.length)
}
function byte2Hex(t) {
  return t < 16 ? '0' + t.toString(16) : t.toString(16)
}
function pkcs1pad2(t, r) {
  if (r < t.length + 11)
    return (
      console && console.error && console.error('Message too long for RSA'),
      null
    )
  for (var i = new Array(), n = t.length - 1; 0 <= n && 0 < r; ) {
    var o = t.charCodeAt(n--)
    o < 128
      ? (i[--r] = o)
      : 127 < o && o < 2048
      ? ((i[--r] = (63 & o) | 128), (i[--r] = (o >> 6) | 192))
      : ((i[--r] = (63 & o) | 128),
        (i[--r] = ((o >> 6) & 63) | 128),
        (i[--r] = (o >> 12) | 224))
  }
  i[--r] = 0
  for (var e = new SecureRandom(), s = new Array(); 2 < r; ) {
    for (s[0] = 0; 0 == s[0]; ) e.nextBytes(s)
    i[--r] = s[0]
  }
  return (i[--r] = 2), (i[--r] = 0), new BigInteger(i)
}
function RSAKey() {
  ;(this.n = null),
    (this.e = 0),
    (this.d = null),
    (this.p = null),
    (this.q = null),
    (this.dmp1 = null),
    (this.dmq1 = null),
    (this.coeff = null)
}
function RSASetPublic(t, r) {
  null != t && null != r && 0 < t.length && 0 < r.length
    ? ((this.n = parseBigInt(t, 16)), (this.e = parseInt(r, 16)))
    : alert('Invalid RSA public key')
}
function RSADoPublic(t) {
  return t.modPowInt(this.e, this.n)
}
function RSAEncrypt(t) {
  var r = pkcs1pad2(t, (this.n.bitLength() + 7) >> 3)
  if (null == r) return null
  var i = this.doPublic(r)
  return null == i ? null : FixEncryptLength(i.toString(16))
}
function FixEncryptLength(t) {
  var r,
    i,
    n,
    o = t.length,
    e = [128, 256, 512, 1024, 2048, 4096]
  for (i = 0; i < e.length; i++) {
    if (o === (r = e[i])) return t
    if (o < r) {
      var s = r - o,
        h = ''
      for (n = 0; n < s; n++) h += '0'
      return h + t
    }
  }
  return t
}
;(SecureRandom.prototype.nextBytes = rng_get_bytes),
  (RSAKey.prototype.doPublic = RSADoPublic),
  (RSAKey.prototype.setPublic = RSASetPublic),
  (RSAKey.prototype.encrypt = RSAEncrypt)

export default RSAKey
