import { useState } from "react";
import "./App.css";
import ProductDetails from "./ProductDetails";

// Produtos cadastrados na loja
const products = [
  {
    id: 1,
    name: "Bastidor Floral",
    price: "R$ 89,90",
    image: "/imagens/bastidor-floral.jpeg",
    category: "bastidores",
  },
  {
    id: 2,
    name: "Coelhinho Amigurumi",
    price: "R$ 75,00",
    image: "/imagens/amigurumi-coelho.jpeg",
    category: "amigurumis",
  },
  {
    id: 3,
    name: "Bastidor Personalizado",
    price: "R$ 110,00",
    image: "/imagens/bastidor-personalizado.jpeg",
    category: "bastidores",
  },
];

// Converte o preço em texto para número
function convertPrice(price) {
  return Number(
    price.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Controla qual página será exibida
  const [currentPage, setCurrentPage] = useState("home");

  // Controla a ordenação dos produtos
  const [sortOrder, setSortOrder] = useState("default");

  // Calcula o valor total da sacola
  const cartTotal = cart.reduce((total, product) => {
    return total + convertPrice(product.price) * (product.quantity || 1);
  }, 0);

  // Adiciona um produto à sacola
  function addToCart(product) {
    setCart((currentCart) => [
      ...currentCart,
      { ...product, quantity: 1 },
    ]);

    alert(`${product.name} foi adicionado à sacola!`);
  }

  // Remove um produto da sacola
  function removeFromCart(indexToRemove) {
    setCart((currentCart) =>
      currentCart.filter((product, index) => index !== indexToRemove)
    );
  }

  // Altera a quantidade de um produto
  function updateQuantity(indexToUpdate, change) {
    setCart((currentCart) =>
      currentCart.map((product, index) => {
        if (index === indexToUpdate) {
          return {
            ...product,
            quantity: Math.max(1, (product.quantity || 1) + change),
          };
        }

        return product;
      })
    );
  }

  // Filtra os produtos pela busca e categoria
  const filteredProducts = products.filter((product) => {
    const productName = product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const searchTerm = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const matchesSearch = productName.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "todos" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Ordena os produtos conforme a opção escolhida
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "lowest") {
      return convertPrice(a.price) - convertPrice(b.price);
    }

    if (sortOrder === "highest") {
      return convertPrice(b.price) - convertPrice(a.price);
    }

    return 0;
  });

  // Abre a página de listagem com uma categoria escolhida
  function openListing(category) {
    setSelectedCategory(category);
    setCurrentPage("listing");
    setSelectedProduct(null);
    setShowCart(false);
  }

  // Volta para a página inicial
  function goHome() {
    setCurrentPage("home");
    setSelectedProduct(null);
    setSelectedCategory("todos");
    setSearch("");
    setShowCart(false);
  }

  return (
    <div className="container">

      {/* CABEÇALHO */}
      <header className="header">
        <h1 className="logo" onClick={goHome}>
          Pequenos Encantos
        </h1>

        <div className="search">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage("listing");
              setSelectedProduct(null);
            }}
          />

          <button onClick={() => openListing(selectedCategory)}>
            Buscar
          </button>
        </div>

        <div className="header-buttons">
          <button
            onClick={() =>
              alert("Área do cliente em breve! Estamos preparando novidades para você.")
            }
          >
            Minha conta
          </button>

          <button onClick={() => setShowCart(!showCart)}>
            🛍️ Sacola ({cart.length})
          </button>
        </div>
      </header>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="menu">
        <a href="#inicio" onClick={goHome}>Início</a>

        <a href="#produtos" onClick={() => openListing("bastidores")}>
          Bastidores bordados
        </a>

        <a href="#produtos" onClick={() => openListing("amigurumis")}>
          Amigurumis
        </a>

        <a href="#produtos" onClick={() => openListing("todos")}>
          Todos os produtos
        </a>
      </nav>

      {/* SACOLA DE COMPRAS */}
      {showCart && (
        <section className="cart">
          <h2>Minha sacola</h2>

          {cart.length === 0 ? (
            <p>Sua sacola está vazia.</p>
          ) : (
            cart.map((product, index) => (
              <div className="cart-item" key={`${product.id}-${index}`}>
                <img src={product.image} alt={product.name} />

                <div>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>

                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(index, -1)}>
                      −
                    </button>

                    <span>{product.quantity || 1}</span>

                    <button onClick={() => updateQuantity(index, 1)}>
                      +
                    </button>
                  </div>

                  {product.customization && (
                    <p>Personalização: {product.customization}</p>
                  )}

                  <button onClick={() => removeFromCart(index)}>
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}

          <h3 className="cart-total">
            Total: R$ {cartTotal.toFixed(2).replace(".", ",")}
          </h3>

          <button onClick={() => setShowCart(false)}>
            Continuar comprando
          </button>
        </section>
      )}

      {/* PÁGINA DE DETALHES */}
      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToBag={(productWithCustomization) =>
            addToCart(productWithCustomization)
          }
        />

      ) : currentPage === "listing" ? (

        /* PÁGINA DE LISTAGEM DE PRODUTOS */
        <main className="listing-page" id="produtos">
          <div className="section-title">
            <h2>
              {selectedCategory === "bastidores"
                ? "Bastidores bordados"
                : selectedCategory === "amigurumis"
                  ? "Amigurumis"
                  : "Todos os produtos"}
            </h2>

            <p>Encontre seu próximo encanto feito à mão!</p>
          </div>

          <div className="listing-content">

            {/* FILTROS LATERAIS */}
            <aside className="filters">
              <h3>Filtrar produtos</h3>

              <p>Categoria</p>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "todos"}
                  onChange={() => setSelectedCategory("todos")}
                />
                Todas as categorias
              </label>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "bastidores"}
                  onChange={() => setSelectedCategory("bastidores")}
                />
                Bastidores bordados
              </label>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "amigurumis"}
                  onChange={() => setSelectedCategory("amigurumis")}
                />
                Amigurumis
              </label>
            </aside>

            {/* RESULTADOS E ORDENAÇÃO */}
            <section className="listing-results">
              <div className="listing-toolbar">
                <p>{sortedProducts.length} produto(s) encontrado(s)</p>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="default">Ordenar por</option>
                  <option value="lowest">Menor preço</option>
                  <option value="highest">Maior preço</option>
                </select>
              </div>

              <div className="product-list">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                      <img src={product.image} alt={product.name} />

                      <h3>{product.name}</h3>

                      <p className="product-price">{product.price}</p>

                      <button onClick={() => setSelectedProduct(product)}>
                        Ver detalhes
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-products">
                    Nenhum produto encontrado.
                  </p>
                )}
              </div>
            </section>
          </div>
        </main>

      ) : (

        /* PÁGINA INICIAL */
        <main id="inicio">

          {/* BANNER */}
          <section className="banner">
            <img
              src="/imagens/PequenosEncantos.jpeg"
              alt="Bastidores bordados e amigurumis artesanais"
            />
          </section>

          {/* CATEGORIAS */}
          <section className="categories">
            <div className="section-title">
              <h2>Conheça nossas categorias</h2>
              <p>Encontre seu próximo encanto feito à mão!</p>
            </div>

            <div className="category-list">
              <div className="category-card">
                <img src="/imagens/bastidores.jpeg" alt="Bastidores bordados" />
                <h3>Bastidores bordados</h3>

                <button onClick={() => openListing("bastidores")}>
                  Ver produtos
                </button>
              </div>

              <div className="category-card">
                <img src="/imagens/amigurumis.jpeg" alt="Amigurumis artesanais" />
                <h3>Amigurumis</h3>

                <button onClick={() => openListing("amigurumis")}>
                  Ver produtos
                </button>
              </div>
            </div>
          </section>

          {/* PRODUTOS EM DESTAQUE */}
          <section className="featured-products">
            <div className="section-title">
              <h2>Produtos em destaque</h2>
              <p>Conheça alguns dos nossos encantos feitos à mão!</p>
            </div>

            <div className="product-list">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price}</p>

                  <button onClick={() => setSelectedProduct(product)}>
                    Ver detalhes
                  </button>
                </div>
              ))}
            </div>

            <div className="see-all">
              <button onClick={() => openListing("todos")}>
                Ver todos os produtos
              </button>
            </div>
          </section>

          {/* DIFERENCIAIS DA LOJA */}
          <section className="why-choose">
            <div className="section-title">
              <h2>Por que escolher a Pequenos Encantos?</h2>
              <p>Cada detalhe é preparado com carinho para você!</p>
            </div>

            <div className="benefits-list">
              <div className="benefit-card">
                <div className="benefit-icon">🧵</div>
                <h3>Feito à mão</h3>
                <p>
                  Produtos artesanais produzidos com dedicação e cuidado em
                  cada detalhe.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💗</div>
                <h3>Feito com carinho</h3>
                <p>
                  Cada peça é criada com amor para tornar seus momentos ainda
                  mais especiais.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">✨</div>
                <h3>Personalizado</h3>
                <p>
                  Peças especiais que podem ser personalizadas para combinar
                  com você.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* RODAPÉ */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Pequenos Encantos</h2>
            <p>Transformando carinho em arte, ponto por ponto.</p>
          </div>

          <div>
            <h3>Links úteis</h3>
            <div className="footer-links">
              <a href="#inicio" onClick={goHome}>Início</a>
              <a href="#produtos" onClick={() => openListing("todos")}>Produtos</a>
              <a href="#produtos" onClick={() => openListing("bastidores")}>Bastidores bordados</a>
              <a href="#produtos" onClick={() => openListing("amigurumis")}>Amigurumis</a>
            </div>
          </div>

          <div>
            <h3>Contato</h3>
            <div className="footer-links">
              <a href="mailto:contato@pequenosencantos.com">E-mail</a>

              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  alert("Nosso Instagram estará disponível em breve!");
                }}
              >
                Instagram
              </a>

              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  alert("Nosso Facebook estará disponível em breve!");
                }}
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Pequenos Encantos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

