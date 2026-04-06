import React from 'react';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import '../styles/Category.css';
import '../styles/Home.css'; // Reusing ProductCard styles

const Category = () => {
  return (
    <div className="category-page container">
      <div className="category-header">
        <h2 className="category-title">جميع منتجاتنا</h2>
        <h3 className="category-subtitle">Bondoqa Collection</h3>
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Category;
