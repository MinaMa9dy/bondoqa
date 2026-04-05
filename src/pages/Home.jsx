import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <h2 className="hero-title">استمتع المكسرات الحقيقي</h2>
          <p className="hero-subtitle">جودة طبيعية، ببساطة أصيلة</p>
          <button className="btn-primary">تسوق الآن</button>
        </div>
        <div className="hero-image-wrapper">
          {/* Main Hero Banner image */}
          <div className="hero-image-placeholder">
             <img src="/images/banner/image.png" alt="بندقة استمتع المكسرات الحقيقي" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)'}} />
          </div>
        </div>
      </section>

      {/* Categories / Featured Products */}
      <section className="featured-section container">
        <h2 className="section-title">المنتجات المميزة</h2>
        <div className="product-grid slider-on-mobile">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
