// models/productCategoryModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Category } from './categories.js';

const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'product_categories',
  timestamps: false,
});

// models/productCategoryModel.js
ProductCategory.belongsTo(Category, { foreignKey: 'category_id' });




export { ProductCategory };
