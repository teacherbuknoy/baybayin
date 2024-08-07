import characters from '../data/characters.js'
import vowelMarks from '../data/vowel-marks.js'

const patterns = {
  initialVowels: /(\s+[AaEeIiOoUu]|^[AaEeIiOoUu])/gm,
  nang: /\s+ng\s+/gm,
  mga: /\s+mga\s+/gm,
  ng: /\w+ng|ng\w+/gm
}

class BaybayinText {
  #text

  /**
   * Creates an instance of BaybayinText.
   * @author Francis Rubio
   * @param {string} text
   * @memberof BaybayinText
   */
  constructor(text) {
    //this.#text = text

    this.#text = new PreparedText(text)
      .replaceWordNg()
      .replaceMga()
      .replaceCharacterNg()
      .toArray()
      .map(s => BaybayinText.syllabify(s))

  }

  toString() {
    return this.#text
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