function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const evento = event.target;
  const showPrice = document.getElementById('price');
  const newValue = Number(showPrice.innerHTML) - evento.id;
  showPrice.innerHTML = newValue;
  localStorage.setItem('value', newValue);
  const cart = document.querySelector('.cart__items');
  cart.removeChild(evento);
  localStorage.removeItem('carrinho', evento);
}

function adicionaLocal() {
  const secao = document.getElementById('cart__item').innerHTML;
  localStorage.setItem('carrinho', secao);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${name} | R$${salePrice}`;
  li.id = `${Math.floor(salePrice)}`;
  const img = document.createElement('img');
  img.src = sku;
  img.className = 'item_img'
  const cart = document.querySelector('.cart__items');
  cart.addEventListener('click', cartItemClickListener);
  li.appendChild(img);
  cart.appendChild(li);
  adicionaLocal();
  actPrice(salePrice);
  return li;
}

function actPrice(salePrice) {
  const showPrice = document.getElementById('price');
  console.log(salePrice)
  const newPrice = Number(showPrice.innerHTML) + Number(salePrice);
  const price = Math.floor(newPrice)
  localStorage.setItem('value', price);
  showPrice.innerHTML = `${localStorage.getItem('value')}`;
}


function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function action(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
  .then((element) => element.json())
  .then((data) => createCartItemElement({ sku: data.thumbnail, name: data.title, salePrice: data.price }));
}

function pegaBotao(p) {
  p.forEach((element) => {
    element.addEventListener('click', action);
  });
}

async function criaItens() {
 const loader = document.createElement('div');
 loader.className = 'loading';
 loader.innerText = 'loading...';
 document.querySelector('.items').appendChild(loader);
 await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computer')
 .then((element) => element.json())
 .then((element) => element.results)
 .then((element) => element.forEach((x) => {
 const retorno = { sku: x.id, name: x.title, image: x.thumbnail };
 const item = document.querySelector('.items'); 
 item.appendChild(createProductItemElement(retorno));
 const botoes = document.querySelectorAll('.item__add');
 pegaBotao(botoes);
}));
 document.querySelector('.items').removeChild(loader);
}

function puxandoDados() {
  const novo = document.getElementById('cart__item');
  if (localStorage.carrinho !== undefined) {
  novo.innerHTML = localStorage.carrinho;
  }
}

function removeLocal() {
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

function limparTudo() {
  const botaoLimpar = document.querySelector('.empty-cart');
  const showPrice = document.getElementById('price');
  localStorage.removeItem('value')
  botaoLimpar.addEventListener('click', function () {
    const carrinho = document.getElementById('cart__item');
    carrinho.innerHTML = '';
    showPrice.innerHTML = 0;
  localStorage.removeItem('carrinho');
  });
}
  
function criaStorage() {
  if(localStorage.getItem('value') !== Number) {
    const showPrice = document.getElementById('price');
    console.log(localStorage.getItem('value'))
    showPrice.innerHTML = localStorage.getItem('value') === null ? 0 : localStorage.getItem('value');
  }
}

window.onload = async () => {
 criaStorage();
 criaItens();
 puxandoDados();
 removeLocal();
 limparTudo();
};