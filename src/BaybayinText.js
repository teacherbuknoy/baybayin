import characters from '../data/characters.js'
import vowelMarks from '../data/vowel-marks.js'

const patterns = {
  initialVowels: /(\s+[AaEeIiOoUu]|^[AaEeIiOoUu])/gm,
  nang: /\s+ng\s+/gm,
  mga: /\s+mga\s+/gm,
  ng: /\w+ng|ng\w+/gm
}

const PairType = (function () {
  let obj = {
    isP: s => s.match(/^[aeiou]$/gm),
    isK: s => s.match(/^[^aeiou]$/gm),
    isPK: s => s.match(/[aeiou]([^aeiou]|ŋ)/gm),
    isKP: s => s.match(/([^aeiou]|ŋ)[aeiou]/gm)
  }

  obj = {
    ...obj,
    check: s => {
      if (PairType.isP(s) || PairType.isK(s)) {
        return 'no-pair'
      }

      if (s.length > 2) {
        return 'exceeds-pair'
      }

      if (PairType.isPK(s)) {
        return 'PK'
      }

      if (PairType.isKP(s)) {
        return 'KP'
      }
    }
  }

  return Object.freeze(obj)
})()

class BaybayinText {
  #text
  #original

  /**
   * Creates an instance of BaybayinText.
   * @author Francis Rubio
   * @param {string} text
   * @memberof BaybayinText
   */
  constructor(text) {
    this.#original = text

    this.#text = new PreparedText(text)
      .replaceWordNg()
      .replaceMga()
      .replaceCharacterNg()
      .toArray()
      .map(s => BaybayinText.syllabify(s))
      .map(arr => {
        return arr.map(s => {
          const tl = BaybayinText.transliterate(s)
          return tl
        }).join('')
      })
    
    console.log(this.toString())

  }

  toBaybayinString() {
    return this.#text.join('')
  }

  toOriginalString() {
    return this.#original
  }

  toString() {
    return `${this.toOriginalString()}\n\n${this.toBaybayinString()}`
  }

  /**
   * @description Splits text into an array of consonant-vowel pairs
   * @author Francis Rubio
   * @static
   * @param {string} text
   * @returns {String[]}  
   * @memberof BaybayinText
   */
  static syllabify(text) {
    let units = []

    const regex = /(^[aeiou])|(([^aeiou]|ŋ)[aeiou](([^aeiou]|ŋ)(?=([^aeiou]|ŋ)))?)|(([^aeiou]|ŋ)$)|([aeiou]([^aeiou]|ŋ))/dgi

    let match
    while ((match = regex.exec(text)) != null) {
      units.push(match[0])
    }

    return units
  }

  static transliterate(text) {
    const pairType = PairType.check(text)

    if (pairType === 'no-pair') {
      return characters[text] ?? text
    } 

    if (pairType === 'KP') {
      const chars = text.split('')

      return BaybayinText.transliterate(chars[0]) + vowelMarks[chars[1]]
    }

    if (pairType === 'PK') {
      const chars = text.split('')

      return chars.map(c => BaybayinText.transliterate(c)).join('')
    }

    if (pairType === 'exceeds-pair') {
      const pairs = BaybayinText.splitToPairs(text)
      return pairs.map(p => BaybayinText.transliterate(p)).join('')
    }

    return text
  }

  static splitToPairs(text) {
    const units = []
    const pattern = /.{1,2}/g
    let match

    while ((match = pattern.exec(text)) != null) {
      units.push(match[0])      
    }

    return units
  }

}

class PreparedText {
  #text

  constructor(text) {
    this.#text = text.toLowerCase()
  }

  replaceCharacterNg() {
    const text = this.#text
    const match = text.match(/(\S+ng)|(ng\S+)/gm)
    this.#text = match ? match
      .map(match => [match, match.replaceAll('ng', 'ŋ')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)
      : this.#text

    return this
  }

  replaceWordNg() {
    const text = this.#text
    const match = text.match(/(\s+ng\s+)/gm)
    this.#text = match ? match
      .map(match => [match, match.replaceAll(/ng/gm, 'nang')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)
      : this.#text

    return this
  }

  replaceMga() {
    const text = this.#text
    const match = text.match(/(\s+mga\s+)/gm)
    this.#text = match ? match
      .map(match => [match, match.replaceAll(/mga/gm, 'manga')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)
      : this.#text

    return this
  }

  toString() {
    return this.#text
  }

  toArray() {
    const units = []
    const text = this.#text.replace(/[-']/gm, '')
    const regex = /([-,'.\s])|([A-Za-zŋ]+)/gm
    let temp

    while ((temp = regex.exec(text)) != null) {
      units.push(temp[0])
    }

    return units
  }
}

function transcribe(text) {
  return new BaybayinText(text)
    .toString()
}

export { transcribe }