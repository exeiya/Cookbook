class InvalidFileType extends Error {
  constructor (msg) {
    super(msg);

    this.name = this.constructor.name;
    this.status = 400;
  }
}

module.exports = { InvalidFileType };