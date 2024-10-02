const { Op } = require('sequelize');
class APIFeatures {
  constructor(query, queryString, option) {
    this.query = query;
    this.queryString = queryString;
    this.option = option;
  }

  filter() {
    let sequelizeFormattedQuery = {};
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
    const sequelizeQueryObj = JSON.parse(JSON.stringify(queryObj));

    //! This Is ONLY For Review Conrtroller
    if (this.option) {
      sequelizeFormattedQuery[Object.keys(this.option)] = this.option.tourId;
    }

    // Adjust the structure to match Sequelize's requirements in a concise manner
    for (let key in sequelizeQueryObj) {
      if (!sequelizeQueryObj[key]['gte'] && !sequelizeQueryObj[key]['lte']) {
        sequelizeFormattedQuery[key] = sequelizeQueryObj[key];
      } else {
        sequelizeFormattedQuery[key] = {};
        for (let op in sequelizeQueryObj[key]) {
          sequelizeFormattedQuery[key][Op[op]] = sequelizeQueryObj[key][op];
        }
      }
    }

    this.sequelizeFormattedQuery = sequelizeFormattedQuery;
    return this;
  }

  sort() {
    let orderClause = [['id', 'DESC']]; // Default sorting

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .map(field => field.trim());
      orderClause = sortBy.map(field => {
        const sortOrder = field.startsWith('-') ? 'DESC' : 'ASC';
        const fieldName = field.replace(/^-/, '');
        return [fieldName, sortOrder];
      });
    }

    this.orderClause = orderClause; // Store order clause
    return this;
  }
  limitFields() {
    //For Fields
    let attributesClause = {};
    if (this.queryString.fields) {
      const includeFields = [];
      const excludeFields = [];
      this.queryString.fields.split(',').forEach(field => {
        field = field.trim();
        if (field.startsWith('-')) {
          excludeFields.push(field.slice(1));
          attributesClause = { exclude: excludeFields };
        } else {
          includeFields.push(field);
          attributesClause = includeFields;
        }
      });
    }

    this.attributesClause = attributesClause;

    return this;
  }
  paginate() {
    // Pagination
    let limit = {};
    let offset = {};
    const pageNum = this.queryString.page * 1 || 1;
    limit = this.queryString.limit * 1 || 100;
    offset = (pageNum - 1) * limit;
    this.limit = limit;
    this.offset = offset;

    return this;
  }

  async execute() {
    const options = {
      where: this.sequelizeFormattedQuery,
      order: this.orderClause,
      attributes: this.attributesClause,
      limit: this.limit,
      offset: this.offset
    };
    return await this.query.findAll(options);
  }
}
module.exports = APIFeatures;
