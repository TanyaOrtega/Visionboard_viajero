const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Destino = sequelize.define('Destino', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pais: {  
      type: DataTypes.STRING, 
      allowNull: false
  },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    visitado: { 
        type: DataTypes.BOOLEAN,  
        defaultValue: false
    }
}, {
    tableName: 'Destinos',
    timestamps: false
});

module.exports = Destino;
