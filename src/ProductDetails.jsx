import { useState } from "react";

function ProductDetails({ product, onBack, onAddToBag }) {
  const [customization, setCustomization] = useState("");

  if (!product) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <section className="product-details">
      <button onClick={onBack}>
        ← Voltar para os produtos
      </button>

      <div className="product-details-content">
        <img src={product.image} alt={product.name} />

        <div className="product-details-info">
          <h1>{product.name}</h1>

          <p className="product-price">{product.price}</p>

          <p>
            Uma peça artesanal feita à mão, com carinho
            e atenção a cada detalhe.
          </p>

          <label htmlFor="customization">
            Deseja alguma personalização?
          </label>

          <textarea
            id="customization"
            value={customization}
            onChange={(event) => setCustomization(event.target.value)}
            placeholder="Descreva como gostaria de personalizar..."
          />

          <button
            onClick={() =>
              onAddToBag({
                ...product,
                customization: customization.trim(),
              })
            }
          >
            Adicionar à sacola
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
