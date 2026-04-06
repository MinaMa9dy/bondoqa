import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-content">
            <h2 className="hero-title">استمتع بالمكسرات الحقيقية</h2>
            <p className="hero-subtitle">جودة طبيعية، ببساطة أصيلة</p>
            <button className="btn-primary">تسوق الآن</button>
          </div>
          <div className="hero-image-wrapper">
             <picture className="hero-main-img">
               <source type="image/webp" srcSet="/images/banner/image-320.webp 320w, /images/banner/image-640.webp 640w, /images/banner/image-1024.webp 1024w" sizes="(max-width: 768px) 100vw, 650px" />
               <img src="/images/banner/image.png" alt="بندقة استمتع بالمكسرات الحقيقية" className="hero-main-img" fetchpriority="high" />
             </picture>
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
