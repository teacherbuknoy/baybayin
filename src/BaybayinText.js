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
    this.#text = BaybayinText.syllabify(text)
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
    const units = []
    const preparedText = new PreparedText(text)
      .replaceWordNg()
      .replaceMga()
      .replaceCharacterNg()
      .toString()

    console.log(preparedText)

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
    this.#text = text
      .match(/(\S+ng)|(ng\S+)/gm)
      .map(match => [match, match.replaceAll('ng', 'ŋ')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)

    return this
  }

  replaceWordNg() {
    const text = this.#text
    this.#text = text
      .match(/(\s+ng\s+)/gm)
      .map(match => [match, match.replaceAll(/ng/gm, 'nang')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)

    return this
  }

  replaceMga() {
    const text = this.#text
    this.#text = text
      .match(/(\s+mga\s+)/gm)
      .map(match => [match, match.replaceAll(/mga/gm, 'manga')])
      .reduce((total, [match, replacement]) =>
        total.replaceAll(match, replacement), text)

    return this
  }

  toString() {
    return this.#text
  }
}

function transcribe(text) {
  return new BaybayinText(text)
    .toString()
}

export { transcribe }