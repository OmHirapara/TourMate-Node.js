const sequelize = require('../sequelize.js');
const { DataTypes, Op, where } = require('sequelize');
const slugify = require('slugify');

const Tour = sequelize.define(
  'tours',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'A tour must have a unique name'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a name'
        },
        len: {
          args: [10, 40],
          msg: 'A tour name must have between 10 and 40 characters'
        }
      },
      set(value) {
        console.log('Setter invoked with value:', value);
        this.setDataValue('name', value.trim());
      }
    },
    slug: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER, // Use INTEGER for numeric values
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a duration'
        }
      }
    },
    maxgroup_size: {
      type: DataTypes.INTEGER,
      default: 10,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a group size'
        }
      }
    },
    difficulty: {
      type: DataTypes.ENUM,
      values: ['easy', 'medium', 'difficult'],
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a difficulty'
        },
        isIn: {
          args: [['easy', 'medium', 'difficult']],
          msg: 'Difficulty is either: easy, medium, difficult'
        }
      }
    },
    ratings_average: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
      validate: {
        min: {
          args: [1],
          msg: 'Rating must be above 1.0'
        },
        max: {
          args: [5],
          msg: 'Rating must be below 5.0'
        }
      }
    },
    ratings_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a price'
        }
      }
    },
    price_discount: {
      type: DataTypes.FLOAT,
      validate: {
        isValidDiscount(value) {
          if (value >= this.price) {
            throw new Error('Discount price should be below regular price');
          }
        }
      }
    },
    summary: {
      type: DataTypes.STRING,
      set(value) {
        // Custom setter to trim whitespace from the beginning and end
        this.setDataValue('summary', value.trim());
      },
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a summary'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      set(value) {
        console.log('Setter invoked with value:', value);
        this.setDataValue('description', value.trim());
      }
    },
    image_cover: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A tour must have a cover image'
        }
      }
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
      allowNull: false,
      select: false
    },
    start_dates: {
      type: DataTypes.ARRAY(DataTypes.DATE)
    },
    secret_tour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    start_location: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        address: '',
        description: ''
      }
    },
    start_location_geo: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false
    },
    locations: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [
        {
          type: 'Point',
          coordinates: [0, 0],
          description: '',
          day: 0
        }
      ],
      validate: {
        isGeoJSONArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Locations must be an array');
          }
          value.forEach(location => {
            if (
              !location ||
              location.type !== 'Point' ||
              !Array.isArray(location.coordinates) ||
              typeof location.day !== 'number'
            ) {
              throw new Error('Invalid GeoJSON Point in locations array');
            }
          });
        }
      }
    },
    guide_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A Tour Must have a LeadGuide'
        }
      }
    }
  },
  {
    tableName: 'tours',
    defaultScope: {
      where: {
        secret_tour: false
      },
      attributes: { exclude: ['createdAt'] }
    },
    indexes: [
      {
        name: 'price_ratings_average_index',
        fields: ['price', { attribute: 'ratings_average', order: 'DESC' }]
      },
      {
        name: 'slug_index',
        fields: ['slug']
      }
    ] 
  }
);
// For Week Hook
Tour.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  values.duration_weeks = this.duration / 7;
  return values;
};

// Hooks Before Save OR Create
Tour.addHook('beforeSave', async (tour, options) => {
  if (tour.name) {
    tour.slug = slugify(tour.name, { lower: true });
  }
});

async function syncTourModel() {
  try {
    await Tour.sync({ alter: true });
    console.log('Tour Model synced');
  } catch (error) {
    console.error('Error syncing Tour Model:', error);
  }
}

// Call the function to execute the sync
syncTourModel();

module.exports = Tour;
