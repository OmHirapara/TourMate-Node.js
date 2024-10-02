const sequelize = require('../sequelize.js');
const { DataTypes, Op, where } = require('sequelize');
const bcrypt = require('bcrypt');

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const msg =
  'Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number, and one special character';

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Please tell us your name!'
        },
        set(value) {
          this.setDataValue('name', value.trim());
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'A tour must have a unique email'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Please provide your email'
        },
        isEmail: {
          args: true,
          msg: 'Please provide a valid email'
        }
      },
      set(value) {
        if (value) {
          this.setDataValue('email', value.toLowerCase().trim());
        }
      }
    },

    photo: {
      type: DataTypes.STRING,
      defaultValue: 'default.jpg'
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'guide', 'lead-guide', 'admin'],
      defaultValue: 'user'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a password'
        },
        is: {
          args: passwordRegEx,
          msg
        }
      }
    },
    password_confirm: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please confirm your password'
        },
        isEqual(value) {
          if (value !== this.password) {
            throw new Error('Passwords are not the same!');
          }
        }
      }
    },
    password_changed_at: {
      type: DataTypes.DATE
    },
    password_reset_token: {
      type: DataTypes.STRING
    },
    password_reset_expires: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    blocked_until: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password', 'active'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      }
    },
    indexes: [
      {
        name: 'tour_user_id', // Optional, but helpful for identifying the index
        unique: true,
        fields: ['id']
      },
      {
        name: 'tour_user_name',
        fields: ['name']
      }
    ]
  }
);

User.addHook('beforeSave', async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.addHook('afterValidate', async (user, options) => {
  if (user.changed('password')) {
    user.password_confirm = 'NULL';
  }
});

User.addHook('beforeSave', async (user, options) => {
  if (user.changed('password') && !user.isNewRecord) {
    user.password_changed_at = new Date(Date.now() - 1000);
  }
});
// Add the beforeFind hook
User.addHook('beforeFind', options => {
  if (!options.where) {
    options.where = {};
  }
  options.where.active = {
    [Op.ne]: false
  };
});

async function syncUserModel() {
  try {
    await User.sync({ alter: true });
    console.log('User Model synced');
  } catch (error) {
    console.error('Error syncing User Model:', error);
  }
}

// Call the function to execute the sync
syncUserModel();

module.exports = User;
